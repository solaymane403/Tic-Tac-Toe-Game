import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
  }

  connect(onConnected, onError) {
    // Change this to your backend WebSocket URL
    const socket = new SockJS('http://localhost:8080/game-websocket');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect(
      {},
      (frame) => {
        console.log('Connected: ' + frame);
        this.connected = true;
        if (onConnected) onConnected();
      },
      (error) => {
        console.error('WebSocket connection error:', error);
        this.connected = false;
        if (onError) onError(error);
      }
    );
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.disconnect();
      this.connected = false;
      console.log('Disconnected');
    }
  }

  // Subscribe to game updates
  subscribeToGame(gameId, onMessageReceived) {
    if (this.stompClient && this.connected) {
      return this.stompClient.subscribe(`/topic/game/${gameId}`, (message) => {
        const gameUpdate = JSON.parse(message.body);
        onMessageReceived(gameUpdate);
      });
    }
  }

  // Send game move
  sendMove(gameId, move) {
    if (this.stompClient && this.connected) {
      this.stompClient.send(
        `/app/game/${gameId}/move`,
        {},
        JSON.stringify(move)
      );
    }
  }

  // Subscribe to leaderboard updates
  subscribeToLeaderboard(onMessageReceived) {
    if (this.stompClient && this.connected) {
      return this.stompClient.subscribe('/topic/leaderboard', (message) => {
        const leaderboardUpdate = JSON.parse(message.body);
        onMessageReceived(leaderboardUpdate);
      });
    }
  }

  isConnected() {
    return this.connected;
  }
}

// Export singleton instance
const websocketService = new WebSocketService();
export default websocketService;