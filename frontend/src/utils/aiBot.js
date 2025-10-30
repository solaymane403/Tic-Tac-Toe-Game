// AI Bot for Tic Tac Toe with different difficulty levels

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

// Check if someone won
const checkWinner = (board) => {
  for (let combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

// Get available positions
const getAvailablePositions = (board) => {
  return board.map((cell, index) => cell === null ? index : null).filter(i => i !== null);
};

// Minimax algorithm for hard difficulty
const minimax = (board, isMaximizing, aiSymbol, playerSymbol) => {
  const winner = checkWinner(board);
  
  if (winner === aiSymbol) return 10;
  if (winner === playerSymbol) return -10;
  if (getAvailablePositions(board).length === 0) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = aiSymbol;
        const score = minimax(board, false, aiSymbol, playerSymbol);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = playerSymbol;
        const score = minimax(board, true, aiSymbol, playerSymbol);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

// Easy: Random move
const getEasyMove = (board) => {
  const available = getAvailablePositions(board);
  return available[Math.floor(Math.random() * available.length)];
};

// Medium: Block player wins, random otherwise
const getMediumMove = (board, aiSymbol, playerSymbol) => {
  const available = getAvailablePositions(board);
  
  // Check if AI can win
  for (let pos of available) {
    board[pos] = aiSymbol;
    if (checkWinner(board) === aiSymbol) {
      board[pos] = null;
      return pos;
    }
    board[pos] = null;
  }
  
  // Check if need to block player
  for (let pos of available) {
    board[pos] = playerSymbol;
    if (checkWinner(board) === playerSymbol) {
      board[pos] = null;
      return pos;
    }
    board[pos] = null;
  }
  
  // Otherwise random
  return getEasyMove(board);
};

// Hard: Perfect play using minimax
const getHardMove = (board, aiSymbol, playerSymbol) => {
  let bestScore = -Infinity;
  let bestMove = null;
  
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = aiSymbol;
      const score = minimax(board, false, aiSymbol, playerSymbol);
      board[i] = null;
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  
  return bestMove;
};

// Main AI function
export const getAIMove = (board, difficulty = 'medium', aiSymbol = 'O', playerSymbol = 'X') => {
  const boardCopy = [...board];
  
  switch (difficulty) {
    case 'easy':
      return getEasyMove(boardCopy);
    case 'medium':
      return getMediumMove(boardCopy, aiSymbol, playerSymbol);
    case 'hard':
      return getHardMove(boardCopy, aiSymbol, playerSymbol);
    default:
      return getMediumMove(boardCopy, aiSymbol, playerSymbol);
  }
};

export const calculateWinner = checkWinner;
