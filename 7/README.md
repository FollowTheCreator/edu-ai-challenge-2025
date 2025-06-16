# 🚢 Sea Battle (Battleship) - Modernized Edition

A modernized, fully-tested command-line implementation of the classic Sea Battle (Battleship) game, refactored from legacy ES5 JavaScript to modern ES6+ standards with comprehensive unit testing.

## 🎯 Overview

This project is a complete modernization of a classic Sea Battle game, transforming a 333-line monolithic ES5 file into a well-architected, thoroughly tested, and maintainable modern JavaScript application.

### ✨ Key Features

- **🎮 Classic Gameplay**: Traditional 10x10 grid Battleship with 3 ships
- **🤖 Smart AI**: Intelligent CPU opponent with hunt and target strategies  
- **💻 Modern Codebase**: ES6+ classes, modules, async/await, and modern JavaScript features
- **🧪 Comprehensive Testing**: 133 test cases with 83.39% code coverage
- **📱 Cross-Platform**: Runs on Windows, macOS, and Linux
- **🎨 Enhanced UI**: Colorful console interface with emojis and clear feedback

## 🏗️ Architecture

The game has been completely restructured into focused, testable modules:

```
src/
├── Ship.js         # Ship entity with hit detection and status tracking
├── Board.js        # Game board with ship placement and attack processing
├── Player.js       # Human player input validation and guess tracking
├── CPUPlayer.js    # AI opponent with intelligent targeting algorithms
├── Game.js         # Main game controller and flow management
├── GameRenderer.js # Display and user interface rendering
└── index.js        # Application entry point with error handling

__tests__/
├── Ship.test.js      # 24 test cases for Ship class
├── Board.test.js     # 31 test cases for Board class  
├── Player.test.js    # 25 test cases for Player class
├── CPUPlayer.test.js # 31 test cases for CPUPlayer class
└── Game.test.js      # 22 test cases for Game class
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 14.0.0 or higher
- **npm** 6.0.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <folder>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start playing!**
   ```bash
   npm start
   ```

## 🎮 How to Play

1. **Game Setup**: Ships are automatically placed randomly on both boards
2. **Your Turn**: Enter coordinates as two digits (e.g., `34` for row 3, column 4)
3. **Feedback**: See immediate results with `X` for hits, `O` for misses
4. **Win Condition**: Sink all 3 enemy ships before the CPU sinks yours!

### Game Board Legend
- `~` = Water (unexplored)
- `S` = Your ship
- `X` = Hit (yours or enemy)
- `O` = Miss (yours or enemy)

### Example Gameplay
```
--- OPPONENT BOARD ---      --- YOUR BOARD ---
  0 1 2 3 4 5 6 7 8 9       0 1 2 3 4 5 6 7 8 9
0 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~     0 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
1 ~ ~ ~ X ~ ~ ~ ~ ~ ~     1 ~ ~ S S S ~ ~ ~ ~ ~
2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~     2 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
3 ~ ~ ~ ~ O ~ ~ ~ ~ ~     3 ~ ~ ~ ~ ~ ~ ~ X ~ ~
4 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~     4 S S S ~ ~ ~ ~ ~ ~ ~

🎯 Enter your attack coordinates (e.g., 34): 
```

## 📦 Available Commands

```bash
# Game Commands
npm start              # Start the Sea Battle game
npm run start          # Alternative start command

# Testing Commands  
npm test               # Run all unit tests
npm run test:coverage  # Generate detailed coverage report
npm run test:watch     # Run tests in watch mode for development

# Development Commands
npm run lint           # Run code linting (if configured)
npm run format         # Format code (if configured)
```

## 🧪 Testing

The project includes comprehensive unit tests covering all game functionality:

### Test Statistics
- **Total Tests**: 133 test cases
- **Test Suites**: 5 comprehensive test files
- **Coverage**: 83.39% overall code coverage
- **Success Rate**: 100% (all tests passing)

### Coverage by Module
| Module | Statements | Branches | Functions | Lines |
|--------|------------|----------|-----------|-------|
| Ship.js | 100% | 100% | 100% | 100% |
| Board.js | 97.46% | 88.46% | 100% | 98.59% |
| CPUPlayer.js | 97.33% | 97.67% | 100% | 97.14% |
| Player.js | 94.44% | 94.11% | 100% | 94.44% |
| Game.js | 53.93% | 62.96% | 61.11% | 52.94% |

### Running Tests
```bash
# Run all tests
npm test

# Run tests with detailed coverage report
npm run test:coverage

# Run tests in watch mode (useful for development)
npm run test:watch
```

## 🔧 Technical Details

### Modern JavaScript Features Used
- ✅ **ES6 Modules**: Clean import/export system
- ✅ **ES6 Classes**: Object-oriented design with proper encapsulation
- ✅ **Arrow Functions**: Concise function syntax
- ✅ **Template Literals**: String interpolation and multi-line strings
- ✅ **Destructuring**: Clean object and array unpacking
- ✅ **Set/Map**: Efficient data structures for O(1) operations
- ✅ **Async/Await**: Modern asynchronous programming
- ✅ **Default Parameters**: Function parameter defaults
- ✅ **Spread Operator**: Array and object spreading

### Architecture Patterns
- **Single Responsibility Principle**: Each class has one clear purpose
- **Separation of Concerns**: Game logic, UI, and data management separated
- **Dependency Injection**: Clean module boundaries and testability
- **Strategy Pattern**: AI behavior switching between hunt and target modes
- **Observer Pattern**: Event-driven state updates

### Performance Optimizations
- **O(1) Lookups**: Using Set for player guess tracking
- **Efficient AI**: Smart targeting algorithms for CPU opponent
- **Memory Management**: Proper cleanup and resource management
- **Immutable Operations**: Reduced side effects and bugs

## 🎯 Game Mechanics

### Core Rules
- **Board Size**: 10x10 grid (rows 0-9, columns 0-9)
- **Ships**: 3 ships, each 3 cells long
- **Placement**: Random ship placement with no overlaps
- **Input Format**: Two-digit coordinates (e.g., "34" = row 3, col 4)
- **Turn-Based**: Player moves first, then CPU responds

### AI Behavior
The CPU opponent uses an intelligent strategy:
1. **Hunt Mode**: Random targeting to find ships
2. **Target Mode**: After hitting a ship, targets adjacent cells
3. **Return to Hunt**: After sinking a ship, returns to random targeting

## 🐛 Troubleshooting

### Common Issues

**Q: Game won't start**
- Ensure Node.js 14+ is installed: `node --version`
- Check dependencies are installed: `npm install`
- Try clearing npm cache: `npm cache clean --force`

**Q: Tests failing**
- Ensure you're in the project directory
- Run `npm install` to ensure all dev dependencies are installed
- Check Node.js version compatibility

**Q: Permission errors**
- On Unix systems, you might need to make the script executable
- Try running with `node src/index.js` directly

### System Requirements
- **Node.js**: 14.0.0 or higher
- **Memory**: Minimum 512MB RAM
- **Disk Space**: ~50MB for project and dependencies
- **Terminal**: Any command-line interface with Unicode support

## 📝 Development

### Project Structure
```
sea-battle-modernized/
├── src/                 # Source code
├── __tests__/           # Unit tests
├── node_modules/        # Dependencies (auto-generated)
├── package.json         # Project configuration
├── package-lock.json    # Dependency lock file
├── .gitignore          # Git ignore rules
├── refactoring.md      # Detailed refactoring documentation
├── test_report.txt     # Test coverage report
└── README.md           # This file
```

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with tests
4. Ensure all tests pass: `npm test`
5. Submit a pull request

### Code Style
- Use ES6+ modern JavaScript features
- Follow consistent naming conventions (camelCase)
- Write comprehensive JSDoc comments
- Maintain test coverage above 80%
- Use meaningful variable and function names

## 📚 Documentation

- **[refactoring.md](refactoring.md)**: Detailed documentation of the modernization process
- **[test_report.txt](test_report.txt)**: Comprehensive test coverage analysis
- **Source Code**: All classes are well-documented with JSDoc comments

## 🏆 Achievements

### Before vs After Refactoring
| Metric | Original | Modernized | Improvement |
|--------|----------|------------|-------------|
| Files | 1 monolithic | 7 modular | +600% organization |
| Lines of Code | 333 | ~420 (source) | +26% better structure |
| Test Coverage | 0% | 83.39% | +∞% reliability |
| ES6+ Features | None | Comprehensive | Modern standards |
| Maintainability | Low | High | Significant improvement |

### What Was Preserved
- ✅ Identical gameplay mechanics
- ✅ Same 10x10 grid and 3-ship configuration
- ✅ Original coordinate input system
- ✅ CPU hunt/target AI strategy
- ✅ All win/lose conditions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Original Sea Battle game concept
- Modern JavaScript community for best practices
- Jest testing framework for comprehensive testing capabilities
- Node.js ecosystem for excellent tooling

---

**Ready to play?** Run `npm start` and enjoy the modernized Sea Battle experience! 🎮⚓ 