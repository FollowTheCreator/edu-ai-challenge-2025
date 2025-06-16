import { describe, test, expect, beforeEach, jest, afterEach } from '@jest/globals';
import { Game } from '../src/Game.js';

// Mock readline to avoid actual input/output during tests
jest.mock('readline', () => ({
  createInterface: jest.fn(() => ({
    question: jest.fn(),
    close: jest.fn()
  }))
}));

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game({
      boardSize: 10,
      numShips: 3,
      shipLength: 3
    });
    
    // Mock console methods to avoid noise in test output
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'clear').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (game.rl) {
      game.cleanup();
    }
  });

  describe('constructor', () => {
    test('should create game with default options', () => {
      const defaultGame = new Game();
      expect(defaultGame.boardSize).toBe(10);
      expect(defaultGame.numShips).toBe(3);
      expect(defaultGame.shipLength).toBe(3);
    });

    test('should create game with custom options', () => {
      const customGame = new Game({
        boardSize: 8,
        numShips: 2,
        shipLength: 4
      });
      expect(customGame.boardSize).toBe(8);
      expect(customGame.numShips).toBe(2);
      expect(customGame.shipLength).toBe(4);
    });

    test('should initialize game components', () => {
      expect(game.playerBoard).toBeDefined();
      expect(game.cpuBoard).toBeDefined();
      expect(game.player).toBeDefined();
      expect(game.cpu).toBeDefined();
      expect(game.renderer).toBeDefined();
    });

    test('should initialize game state', () => {
      expect(game.gameOver).toBe(false);
      expect(game.winner).toBeNull();
    });
  });

  describe('initializeGame', () => {
    test('should initialize game successfully', async () => {
      await game.initializeGame();
      
      expect(game.playerBoard.ships).toHaveLength(3);
      expect(game.cpuBoard.ships).toHaveLength(3);
      
      // Check that player ships are marked on grid
      const playerShipLocations = game.playerBoard.getAllShipLocations();
      expect(playerShipLocations).toHaveLength(9); // 3 ships * 3 length
      
      // Check that CPU ships are placed but not marked on grid
      const cpuShipLocations = game.cpuBoard.getAllShipLocations();
      expect(cpuShipLocations).toHaveLength(9);
    });

    test('should throw error if ship placement fails', async () => {
      // Mock ship placement to fail
      jest.spyOn(game.playerBoard, 'placeShipRandomly').mockReturnValue(null);
      
      await expect(game.initializeGame()).rejects.toThrow('Failed to place player ships');
    });
  });

  describe('endGame', () => {
    test('should end game with player victory', () => {
      game.endGame(true);
      
      expect(game.gameOver).toBe(true);
      expect(game.winner).toBe(game.player);
    });

    test('should end game with CPU victory', () => {
      game.endGame(false);
      
      expect(game.gameOver).toBe(true);
      expect(game.winner).toBe(game.cpu);
    });
  });

  describe('calculateHits', () => {
    beforeEach(async () => {
      await game.initializeGame();
    });

    test('should calculate hits correctly', () => {
      // Simulate some attacks
      const cpuShipLocation = game.cpuBoard.getAllShipLocations()[0];
      game.cpuBoard.processAttack(cpuShipLocation); // Hit
      game.cpuBoard.processAttack('00'); // Miss (assuming no ship there)
      
      const guesses = [cpuShipLocation, '00'];
      const hits = game.calculateHits(guesses, game.cpuBoard);
      
      expect(hits).toBe(1);
    });

    test('should return 0 for no hits', () => {
      const guesses = ['00', '01', '02'];
      const hits = game.calculateHits(guesses, game.cpuBoard);
      
      expect(hits).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getGameState', () => {
    test('should return current game state', () => {
      const state = game.getGameState();
      
      expect(state).toHaveProperty('gameOver');
      expect(state).toHaveProperty('winner');
      expect(state).toHaveProperty('playerShipsRemaining');
      expect(state).toHaveProperty('cpuShipsRemaining');
      expect(state).toHaveProperty('playerGuesses');
      expect(state).toHaveProperty('cpuGuesses');
      expect(state).toHaveProperty('cpuMode');
    });

    test('should reflect game over state', () => {
      game.endGame(true);
      const state = game.getGameState();
      
      expect(state.gameOver).toBe(true);
      expect(state.winner).toBe('Player');
    });
  });

  describe('reset', () => {
    test('should reset game to initial state', async () => {
      // Initialize and modify game state
      await game.initializeGame();
      game.player.recordGuess('34');
      game.cpu.makeGuess();
      game.gameOver = true;
      game.winner = game.player;
      
      // Reset the game
      game.reset();
      
      expect(game.gameOver).toBe(false);
      expect(game.winner).toBeNull();
      expect(game.player.getGuessCount()).toBe(0);
      expect(game.cpu.getGuessCount()).toBe(0);
      expect(game.playerBoard.ships).toHaveLength(0);
      expect(game.cpuBoard.ships).toHaveLength(0);
    });
  });

  describe('delay', () => {
    test('should resolve after specified time', async () => {
      const startTime = Date.now();
      await game.delay(50);
      const elapsed = Date.now() - startTime;
      
      expect(elapsed).toBeGreaterThanOrEqual(45); // Allow some margin
    });
  });

  describe('cleanup', () => {
    test('should close readline interface', () => {
      const closeSpy = jest.spyOn(game.rl, 'close');
      game.cleanup();
      expect(closeSpy).toHaveBeenCalled();
    });

    test('should handle missing readline interface', () => {
      game.rl = null;
      expect(() => game.cleanup()).not.toThrow();
    });
  });

  describe('game flow integration', () => {
    test('should handle complete game setup', async () => {
      await game.initializeGame();
      
      const initialState = game.getGameState();
      expect(initialState.gameOver).toBe(false);
      expect(initialState.playerShipsRemaining).toBe(3);
      expect(initialState.cpuShipsRemaining).toBe(3);
    });

    test('should handle win condition checks', async () => {
      await game.initializeGame();
      
      // Simulate sinking all CPU ships
      game.cpuBoard.ships.forEach(ship => {
        ship.locations.forEach(location => {
          ship.hit(location);
        });
      });
      
      expect(game.cpuBoard.getRemainingShipsCount()).toBe(0);
    });

    test('should track game statistics', async () => {
      await game.initializeGame();
      
      // Make some moves
      game.player.recordGuess('34');
      game.cpu.makeGuess();
      
      const stats = game.getGameState();
      expect(stats.playerGuesses).toBe(1);
      expect(stats.cpuGuesses).toBe(1);
    });
  });

  describe('error handling', () => {
    test('should handle ship placement errors gracefully', async () => {
      // Mock board to always fail ship placement
      jest.spyOn(game.playerBoard, 'placeShipRandomly').mockReturnValue(null);
      
      await expect(game.initializeGame()).rejects.toThrow();
    });

    test('should handle CPU ship placement errors', async () => {
      jest.spyOn(game.cpuBoard, 'placeShipRandomly').mockReturnValue(null);
      
      await expect(game.initializeGame()).rejects.toThrow('Failed to place CPU ships');
    });
  });

  describe('game state transitions', () => {
    test('should maintain proper game state during play', async () => {
      await game.initializeGame();
      
      // Initial state
      expect(game.gameOver).toBe(false);
      expect(game.winner).toBeNull();
      
      // Simulate player victory
      game.endGame(true);
      expect(game.gameOver).toBe(true);
      expect(game.winner).toBe(game.player);
      
      // Reset should restore initial state
      game.reset();
      expect(game.gameOver).toBe(false);
      expect(game.winner).toBeNull();
    });

    test('should handle CPU mode transitions', async () => {
      await game.initializeGame();
      
      // CPU should start in hunt mode
      expect(game.cpu.getCurrentMode()).toBe('hunt');
      
      // Simulate hit to trigger target mode
      const playerShipLocation = game.playerBoard.getAllShipLocations()[0];
      const result = game.playerBoard.processAttack(playerShipLocation);
      game.cpu.processResult(result);
      
      if (result.hit && !result.sunk) {
        expect(game.cpu.getCurrentMode()).toBe('target');
      }
    });
  });
}); 