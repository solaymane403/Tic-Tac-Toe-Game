import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Sparkles, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import websocketService from '../services/websocket';
import { getAIMove, calculateWinner } from '../utils/aiBot';

const GameBoard = ({ gameMode = 'bot', difficulty = 'medium' }) => {
  const { user, isAuthenticated } = useAuth();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [draws, setDraws] = useState(0);
  const [gameId] = useState(`game-${Date.now()}`);
  const [playerSymbol] = useState('X');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  // ✅ Wrap handleGameUpdate in useCallback
  const handleGameUpdate = useCallback((update) => {
    console.log('Game update received:', update);
    if (update.board) setBoard(update.board);
    if (update.winner) setWinner(update.winner);
    setIsXNext(update.nextPlayer === playerSymbol);
  }, [playerSymbol]);

  // Multiplayer WebSocket setup
  useEffect(() => {
    if (gameMode === 'multiplayer' && isAuthenticated()) {
      websocketService.connect(
        () => {
          console.log('WebSocket connected');
          websocketService.subscribeToGame(gameId, handleGameUpdate);
        },
        (error) => console.error('WebSocket connection failed:', error)
      );

      return () => websocketService.disconnect();
    }
  }, [gameMode, gameId, handleGameUpdate, isAuthenticated]);

  // AI Bot logic
  useEffect(() => {
    if (gameMode === 'bot' && !isXNext && !winner && !board.every(cell => cell !== null)) {
      setIsAIThinking(true);
      
      // Add delay for more natural feel
      const thinkingDelay = difficulty === 'easy' ? 500 : difficulty === 'medium' ? 800 : 1200;
      
      setTimeout(() => {
        const aiMove = getAIMove(board, difficulty, 'O', 'X');
        if (aiMove !== null && aiMove !== undefined) {
          makeMove(aiMove, 'O');
        }
        setIsAIThinking(false);
      }, thinkingDelay);
    }
  }, [isXNext, board, winner, gameMode, difficulty]);

  const checkWinnerWithLine = (squares) => {
    for (let combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinningLine(combo);
        return squares[a];
      }
    }
    return null;
  };

  const makeMove = (index, symbol) => {
    const newBoard = [...board];
    newBoard[index] = symbol;
    setBoard(newBoard);
    setLastMove(index);

    const gameWinner = checkWinnerWithLine(newBoard);
    const isDraw = !gameWinner && newBoard.every(cell => cell !== null);

    if (gameWinner) {
      setWinner(gameWinner);
      
      if (gameMode === 'bot') {
        if (gameWinner === 'X') {
          setWins(wins + 1);
          setScore(score + (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50));
        } else {
          setLosses(losses + 1);
        }
      } else if (isAuthenticated()) {
        const newScore = gameWinner === playerSymbol ? score + 100 : score;
        setScore(newScore);
        
        api.submitScore(user.userId, newScore).catch(error => {
          console.error('Failed to submit score:', error);
        });
      }
    } else if (isDraw) {
      setWinner('draw');
      setDraws(draws + 1);
    }

    setIsXNext(!isXNext);
  };

  const handleClick = async (index) => {
    if (board[index] || winner || isAIThinking) return;
    if (gameMode === 'bot' && !isXNext) return; // AI's turn in bot mode
    if (gameMode === 'multiplayer') {
      if (!isXNext && playerSymbol === 'X') return;
      if (isXNext && playerSymbol === 'O') return;
    }

    makeMove(index, isXNext ? 'X' : 'O');

    // Send move to server in multiplayer mode
    if (gameMode === 'multiplayer' && isAuthenticated()) {
      const newBoard = [...board];
      newBoard[index] = isXNext ? 'X' : 'O';
      
      websocketService.sendMove(gameId, {
        position: index,
        player: playerSymbol,
        board: newBoard
      });
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
    setLastMove(null);
  };

  const getCellClassName = (index) => {
    let classes = "w-full aspect-square bg-gray-700 hover:bg-gray-600 rounded-lg text-5xl font-bold transition-all transform ";
    
    if (winner && winningLine && winningLine.includes(index)) {
      classes += "bg-green-600 scale-105 animate-pulse ";
    } else if (lastMove === index) {
      classes += "ring-4 ring-purple-400 ";
    }
    
    if (!winner && !board[index] && !isAIThinking) {
      classes += "hover:scale-105 cursor-pointer ";
    } else {
      classes += "cursor-not-allowed ";
    }

    const cell = board[index];
    if (cell === 'X') classes += "text-blue-400 ";
    else if (cell === 'O') classes += "text-pink-400 ";
    else classes += "text-gray-500 ";

    return classes;
  };

  return (
    <div className="bg-gray-800 bg-opacity-80 rounded-2xl p-8 border border-purple-500 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Tic Tac Toe</h2>
        {gameMode === 'bot' && (
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-purple-900 px-3 py-1 rounded-full text-purple-300">
              {difficulty.toUpperCase()} AI
            </span>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-green-900 bg-opacity-40 p-3 rounded-lg text-center border border-green-600">
          <div className="text-green-400 text-2xl font-bold">{wins}</div>
          <div className="text-green-300 text-xs">Wins</div>
        </div>
        <div className="bg-gray-700 bg-opacity-40 p-3 rounded-lg text-center border border-gray-600">
          <div className="text-gray-400 text-2xl font-bold">{draws}</div>
          <div className="text-gray-300 text-xs">Draws</div>
        </div>
        <div className="bg-red-900 bg-opacity-40 p-3 rounded-lg text-center border border-red-600">
          <div className="text-red-400 text-2xl font-bold">{losses}</div>
          <div className="text-red-300 text-xs">Losses</div>
        </div>
      </div>

      <div className="mb-6 text-center">
        <div className="text-xl text-gray-300 mb-2">
          {winner ? (
            winner === 'draw' ? (
              <span className="text-gray-400 font-bold flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" />
                It's a Draw!
                <Sparkles className="w-6 h-6" />
              </span>
            ) : (
              <span className={`font-bold flex items-center justify-center gap-2 ${
                (gameMode === 'bot' && winner === 'X') || (gameMode === 'multiplayer' && winner === playerSymbol)
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}>
                <Trophy className="w-6 h-6" />
                {(gameMode === 'bot' && winner === 'X') || (gameMode === 'multiplayer' && winner === playerSymbol)
                  ? 'You Won! 🎉'
                  : gameMode === 'bot'
                  ? 'AI Won! 🤖'
                  : 'Opponent Won! 😢'}
              </span>
            )
          ) : isAIThinking ? (
            <span className="text-purple-400 font-bold animate-pulse">
              🤖 AI is thinking...
            </span>
          ) : (
            <span>
              Current Turn: <span className="text-purple-400 font-bold">{isXNext ? 'X' : 'O'}</span>
              {gameMode === 'bot' && (
                <span className={isXNext ? "text-green-400" : "text-pink-400"}>
                  {isXNext ? ' (You)' : ' (AI)'}
                </span>
              )}
              {gameMode === 'multiplayer' && ((isXNext && playerSymbol === 'X') || (!isXNext && playerSymbol === 'O')) && (
                <span className="text-green-400"> (Your Turn)</span>
              )}
            </span>
          )}
        </div>
        <div className="text-lg text-gray-400">
          Score: <span className="text-yellow-400 font-bold">{score}</span>
        </div>
        {gameMode === 'multiplayer' && (
          <div className="text-sm text-gray-500 mt-2">
            You are: <span className="text-purple-400 font-bold">{playerSymbol}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!!winner || !!cell || isAIThinking}
            className={getCellClassName(index)}
          >
            {cell}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-5 h-5" />
        New Game
      </button>

      {!isAuthenticated() && gameMode === 'bot' && (
        <div className="mt-4 bg-yellow-900 bg-opacity-30 border border-yellow-600 text-yellow-200 px-4 py-3 rounded-lg text-sm text-center">
          💡 Login to save your scores and compete on the leaderboard!
        </div>
      )}
    </div>
  );
};

export default GameBoard;
