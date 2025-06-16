import { Board } from './Board.js';
import { Player } from './Player.js';
import { CPUPlayer } from './CPUPlayer.js';
import { GameRenderer } from './GameRenderer.js';
import { createInterface } from 'readline';

/**
 * Main game controller for Sea Battle
 */
export class Game {
  constructor(options = {}) {
    // Game configuration
    this.boardSize = options.boardSize || 10;
    this.numShips = options.numShips || 3;
    this.shipLength = options.shipLength || 3;
    
    // Game components
    this.playerBoard = new Board(this.boardSize);
    this.cpuBoard = new Board(this.boardSize);
    this.player = new Player('Player');
    this.cpu = new CPUPlayer('CPU', this.boardSize);
    this.renderer = new GameRenderer(this.boardSize);
    
    // Game state
    this.gameOver = false;
    this.winner = null;
    
    // Readline interface for user input
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Initializes and starts the game
   */
  async start() {
    try {
      this.renderer.printWelcome(this.numShips);
      await this.initializeGame();
      await this.gameLoop();
    } catch (error) {
      this.renderer.printError(`Game error: ${error.message}`);
    } finally {
      this.rl.close();
    }
  }

  /**
   * Initializes the game by placing ships on both boards
   */
  async initializeGame() {
    this.renderer.printSetupMessage('Setting up the battlefield...');
    
    // Place player ships
    for (let i = 0; i < this.numShips; i++) {
      const ship = this.playerBoard.placeShipRandomly(this.shipLength, true);
      if (!ship) {
        throw new Error('Failed to place player ships');
      }
    }
    this.renderer.printSetupMessage(`Your ${this.numShips} ships have been deployed!`);
    
    // Place CPU ships (hidden)
    for (let i = 0; i < this.numShips; i++) {
      const ship = this.cpuBoard.placeShipRandomly(this.shipLength, false);
      if (!ship) {
        throw new Error('Failed to place CPU ships');
      }
    }
    this.renderer.printSetupMessage(`Enemy ${this.numShips} ships are in position!`);
    
    this.renderer.printInfo('Battlefield ready!');
  }

  /**
   * Main game loop handling turns
   */
  async gameLoop() {
    while (!this.gameOver) {
      // Display current state
      this.renderer.printBoards(this.cpuBoard, this.playerBoard);
      
      // Player turn
      const playerMadeMove = await this.handlePlayerTurn();
      
      if (this.gameOver) break;
      
      if (playerMadeMove) {
        // Check win condition after player turn
        if (this.cpuBoard.getRemainingShipsCount() === 0) {
          this.endGame(true);
          break;
        }
        
        // CPU turn
        await this.handleCPUTurn();
        
        // Check win condition after CPU turn
        if (this.playerBoard.getRemainingShipsCount() === 0) {
          this.endGame(false);
          break;
        }
      }
    }
  }

  /**
   * Handles the player's turn
   * @returns {Promise<boolean>} - True if player made a valid move
   */
  async handlePlayerTurn() {
    return new Promise((resolve) => {
      const promptUser = () => {
        this.rl.question(this.renderer.getInputPrompt(), (answer) => {
          const validation = this.player.validateGuess(answer);
          
          if (!validation.valid) {
            this.renderer.printError(validation.message);
            promptUser(); // Ask again
            return;
          }
          
          // Record the guess
          this.player.recordGuess(validation.location);
          
          // Process the attack
          const result = this.cpuBoard.processAttack(validation.location);
          result.location = validation.location; // Add location to result
          
          this.renderer.printAttackResult(result, this.player.name);
          
          resolve(true);
        });
      };
      
      promptUser();
    });
  }

  /**
   * Handles the CPU's turn
   */
  async handleCPUTurn() {
    // Small delay for better UX
    await this.delay(1000);
    
    const guess = this.cpu.makeGuess();
    this.renderer.printCPUTurn(guess, this.cpu.getCurrentMode());
    
    const result = this.playerBoard.processAttack(guess);
    result.location = guess; // Add location to result
    
    // Let CPU process the result for its AI
    this.cpu.processResult(result);
    
    this.renderer.printAttackResult(result, this.cpu.name);
    
    // Another small delay
    await this.delay(500);
  }

  /**
   * Ends the game and displays results
   * @param {boolean} playerWon - True if player won
   */
  endGame(playerWon) {
    this.gameOver = true;
    this.winner = playerWon ? this.player : this.cpu;
    
    // Show final board state
    this.renderer.printBoards(this.cpuBoard, this.playerBoard);
    
    // Show game over message
    this.renderer.printGameOver(
      playerWon,
      this.playerBoard.getRemainingShipsCount(),
      this.cpuBoard.getRemainingShipsCount()
    );
    
    // Show final statistics
    this.printFinalStats();
  }

  /**
   * Prints final game statistics
   */
  printFinalStats() {
    const playerHits = this.calculateHits(this.player.getAllGuesses(), this.cpuBoard);
    const cpuHits = this.calculateHits(this.cpu.getAllGuesses(), this.playerBoard);
    
    const stats = {
      playerGuesses: this.player.getGuessCount(),
      cpuGuesses: this.cpu.getGuessCount(),
      playerHits,
      cpuHits,
      playerShipsRemaining: this.playerBoard.getRemainingShipsCount(),
      cpuShipsRemaining: this.cpuBoard.getRemainingShipsCount()
    };
    
    this.renderer.printStats(stats);
  }

  /**
   * Calculates the number of hits from a list of guesses
   * @param {Array<string>} guesses - List of guesses
   * @param {Board} targetBoard - Board to check against
   * @returns {number} - Number of hits
   */
  calculateHits(guesses, targetBoard) {
    return guesses.filter(guess => {
      const cellState = targetBoard.getCellState(guess);
      return cellState === 'X';
    }).length;
  }

  /**
   * Creates a delay for better UX
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} - Promise that resolves after delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Gets current game state for testing
   * @returns {Object} - Current game state
   */
  getGameState() {
    return {
      gameOver: this.gameOver,
      winner: this.winner?.name || null,
      playerShipsRemaining: this.playerBoard.getRemainingShipsCount(),
      cpuShipsRemaining: this.cpuBoard.getRemainingShipsCount(),
      playerGuesses: this.player.getGuessCount(),
      cpuGuesses: this.cpu.getGuessCount(),
      cpuMode: this.cpu.getCurrentMode()
    };
  }

  /**
   * Resets the game to initial state
   */
  reset() {
    this.playerBoard = new Board(this.boardSize);
    this.cpuBoard = new Board(this.boardSize);
    this.player.reset();
    this.cpu.reset();
    this.gameOver = false;
    this.winner = null;
  }

  /**
   * Cleans up resources
   */
  cleanup() {
    if (this.rl) {
      this.rl.close();
    }
  }
} 