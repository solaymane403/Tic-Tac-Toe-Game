# GameHub - Tic Tac Toe Multiplayer Game 🎮

A modern, feature-rich Tic Tac Toe game with AI opponents, multiplayer capabilities, and a comprehensive ranking system.

## ✨ Features

### 🎯 Game Modes
- **Guest Play**: Play immediately against AI without creating an account
- **AI Bot Mode**: Challenge the AI with 3 difficulty levels
  - **Easy**: Random moves - perfect for beginners
  - **Medium**: Blocks wins and creates opportunities
  - **Hard**: Unbeatable AI using minimax algorithm
- **Multiplayer Mode**: Real-time gameplay against other players (requires login)

### 🔐 Authentication
- **Optional Login**: Start playing immediately as a guest
- **User Accounts**: Register to unlock full features
  - Save your progress
  - Compete on the global leaderboard
  - Track your stats and achievements
  - Play multiplayer matches

### 🎨 User Interface
- **Beautiful Design**: Modern gradient backgrounds with smooth animations
- **Responsive**: Works on desktop and mobile devices
- **Visual Feedback**: 
  - Highlighted winning combinations
  - Last move indicators
  - AI thinking animation
  - Smooth transitions and hover effects

### 📊 Stats & Progress
- **Win/Loss/Draw Tracking**: Keep track of your performance
- **Score System**: 
  - Easy AI: 10 points per win
  - Medium AI: 25 points per win
  - Hard AI: 50 points per win
  - Multiplayer: 100 points per win
- **Real-time Stats**: See your wins, losses, and draws during gameplay

### 🏆 Features (Logged-in Users)
- Global leaderboard rankings
- Profile with detailed statistics
- Match history
- Achievement system (coming soon)
- Ranking tiers (coming soon)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gamehub-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser to `http://localhost:3000`

## 🎮 How to Play

### Guest Mode (No Login Required)
1. Open the app
2. Click "Play as Guest" on the welcome screen
3. Choose "vs AI Bot" mode
4. Select your difficulty level
5. Start playing!

### Multiplayer Mode
1. Click "Login / Register"
2. Create an account or login
3. Go to the game page
4. Select "Multiplayer" mode
5. Wait for matchmaking
6. Play against real opponents!

## 🎯 Game Rules
- Players alternate turns placing X or O
- Get 3 in a row (horizontal, vertical, or diagonal) to win
- If all 9 squares are filled with no winner, it's a draw

## 🛠️ Tech Stack

### Frontend
- **React**: UI framework
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Axios**: HTTP requests

### Real-time Features
- **STOMP over WebSocket**: Real-time multiplayer
- **SockJS**: WebSocket fallback

### AI Implementation
- **Minimax Algorithm**: Unbeatable hard mode AI
- **Strategic AI**: Medium difficulty with blocking logic
- **Random AI**: Easy difficulty for beginners

## 📁 Project Structure

```
src/
├── components/
│   ├── GameBoard.js       # Main game board with AI logic
│   ├── Navbar.js          # Navigation bar
│   └── Leaderboard.js     # Leaderboard display
├── pages/
│   ├── Dashboard.js       # Welcome & mode selection
│   ├── GamePage.js        # Game mode chooser
│   ├── LoginPage.js       # User login
│   ├── RegisterPage.js    # User registration
│   ├── LeaderboardPage.js # Rankings page
│   └── ProfilePage.js     # User profile
├── context/
│   └── AuthContext.js     # Authentication state
├── services/
│   ├── api.js             # API calls
│   └── websocket.js       # WebSocket connection
├── utils/
│   └── aiBot.js           # AI bot logic
├── animations.css         # Custom animations
└── App.js                 # Main app component
```

## 🎨 Customization

### Changing AI Difficulty
The AI difficulty affects the point rewards:
- Modify the score calculation in `GameBoard.js`:
```javascript
difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50
```

### Styling
- All colors and themes can be customized in `tailwind.config.js`
- Custom animations are in `src/animations.css`

## 🔧 Configuration

### API Endpoints
Update the base URL in `src/services/api.js`:
```javascript
const BASE_URL = 'YOUR_BACKEND_URL/api';
```

### WebSocket URL
Update the WebSocket connection in `src/services/websocket.js`:
```javascript
const socket = new SockJS('YOUR_BACKEND_URL/game-websocket');
```

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Windows PowerShell
cmd /c "set PORT=3001 && npm start"
```

### Tailwind CSS not working
Make sure `@tailwind` directives are at the top of `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### PowerShell execution policy error
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📝 Future Enhancements

- [ ] Sound effects and music
- [ ] Achievements and badges system
- [ ] Ranking tiers (Bronze, Silver, Gold, Platinum)
- [ ] Tournament mode
- [ ] Friend system and challenges
- [ ] Chat functionality
- [ ] Game replays
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🎉 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspired by modern gaming platforms
- AI implementation based on minimax algorithm

---

**Enjoy playing! 🎮**
