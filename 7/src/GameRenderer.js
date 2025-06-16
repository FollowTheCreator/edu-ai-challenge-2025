/**
 * Handles rendering and display of the Sea Battle game
 */
export class GameRenderer {
  constructor(boardSize = 10) {
    this.boardSize = boardSize;
  }

  /**
   * Prints both boards side by side (opponent board and player board)
   * @param {Board} opponentBoard - The opponent's board (attacks view)
   * @param {Board} playerBoard - The player's board (their ships)
   */
  printBoards(opponentBoard, playerBoard) {
    console.log('\n--- OPPONENT BOARD ---   --- YOUR BOARD ---');
    
    // Print header with column numbers
    const header = this.createHeader();
    console.log(`${header} ${header}`);

    // Print each row
    for (let i = 0; i < this.boardSize; i++) {
      const opponentRow = this.formatBoardRow(i, opponentBoard.getGridCopy());
      const playerRow = this.formatBoardRow(i, playerBoard.getGridCopy());
      console.log(`${opponentRow} ${playerRow}`);
    }
    
    console.log('');
  }

  /**
   * Creates the header row with column numbers
   * @returns {string} - Formatted header string
   */
  createHeader() {
    let header = '  ';
    for (let i = 0; i < this.boardSize; i++) {
      header += `${i} `;
    }
    return header;
  }

  /**
   * Formats a single board row for display
   * @param {number} rowIndex - The row index
   * @param {Array<Array<string>>} grid - The board grid
   * @returns {string} - Formatted row string
   */
  formatBoardRow(rowIndex, grid) {
    let rowStr = `${rowIndex} `;
    
    for (let j = 0; j < this.boardSize; j++) {
      rowStr += `${grid[rowIndex][j]} `;
    }
    
    return rowStr;
  }

  /**
   * Prints a welcome message and game instructions
   * @param {number} numShips - Number of ships per player
   */
  printWelcome(numShips) {
    console.log('\n='.repeat(50));
    console.log('       🚢 WELCOME TO SEA BATTLE! 🚢');
    console.log('='.repeat(50));
    console.log(`\nGame Rules:`);
    console.log(`• Each player has ${numShips} ships`);
    console.log(`• Enter coordinates as two digits (e.g., 34 for row 3, column 4)`);
    console.log(`• 'X' marks a hit, 'O' marks a miss`);
    console.log(`• Sink all enemy ships to win!`);
    console.log(`\nBoard Legend:`);
    console.log(`• ~ = Water`);
    console.log(`• S = Your ship`);
    console.log(`• X = Hit`);
    console.log(`• O = Miss`);
    console.log('\nLet the battle begin!\n');
  }

  /**
   * Prints game initialization messages
   * @param {string} message - Message to display
   */
  printSetupMessage(message) {
    console.log(`⚓ ${message}`);
  }

  /**
   * Prints player action results
   * @param {Object} result - Attack result object
   * @param {string} playerName - Name of the attacking player
   */
  printAttackResult(result, playerName) {
    const { hit, sunk, message } = result;
    
    if (hit) {
      if (sunk) {
        console.log(`💥 ${playerName.toUpperCase()} SUNK A SHIP! ${message}`);
      } else {
        console.log(`🎯 ${playerName.toUpperCase()} HIT! ${message}`);
      }
    } else {
      console.log(`🌊 ${playerName.toUpperCase()} MISS. ${message}`);
    }
  }

  /**
   * Prints CPU turn information
   * @param {string} guess - The CPU's guess
   * @param {string} mode - CPU's current mode
   */
  printCPUTurn(guess, mode) {
    console.log(`\n--- CPU's Turn ---`);
    console.log(`🤖 CPU ${mode === 'target' ? 'targets' : 'hunts at'}: ${guess}`);
  }

  /**
   * Prints game over message
   * @param {boolean} playerWon - True if player won, false if CPU won
   * @param {number} playerShips - Remaining player ships
   * @param {number} cpuShips - Remaining CPU ships
   */
  printGameOver(playerWon, playerShips, cpuShips) {
    console.log('\n' + '='.repeat(50));
    
    if (playerWon) {
      console.log('🎉 CONGRATULATIONS! YOU WON! 🎉');
      console.log('You successfully sunk all enemy battleships!');
    } else {
      console.log('💀 GAME OVER! CPU WINS! 💀');
      console.log('The CPU sunk all your battleships!');
    }
    
    console.log(`\nFinal Score:`);
    console.log(`• Your remaining ships: ${playerShips}`);
    console.log(`• CPU remaining ships: ${cpuShips}`);
    console.log('='.repeat(50));
  }

  /**
   * Prints error messages
   * @param {string} message - Error message to display
   */
  printError(message) {
    console.log(`❌ ${message}`);
  }

  /**
   * Prints information messages
   * @param {string} message - Info message to display
   */
  printInfo(message) {
    console.log(`ℹ️  ${message}`);
  }

  /**
   * Prints game statistics
   * @param {Object} stats - Game statistics object
   */
  printStats(stats) {
    const { 
      playerGuesses, 
      cpuGuesses, 
      playerHits, 
      cpuHits,
      playerShipsRemaining,
      cpuShipsRemaining 
    } = stats;

    console.log('\n--- Game Statistics ---');
    console.log(`Player: ${playerGuesses} guesses, ${playerHits} hits, ${playerShipsRemaining} ships remaining`);
    console.log(`CPU: ${cpuGuesses} guesses, ${cpuHits} hits, ${cpuShipsRemaining} ships remaining`);
  }

  /**
   * Prints a prompt for player input
   * @returns {string} - The prompt message
   */
  getInputPrompt() {
    return '🎯 Enter your attack coordinates (e.g., 34): ';
  }

  /**
   * Clears the console (cross-platform)
   */
  clearScreen() {
    console.clear();
  }

  /**
   * Prints a separator line
   * @param {string} char - Character to use for separator
   * @param {number} length - Length of separator
   */
  printSeparator(char = '-', length = 40) {
    console.log(char.repeat(length));
  }
} 