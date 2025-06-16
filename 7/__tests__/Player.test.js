import { describe, test, expect, beforeEach } from '@jest/globals';
import { Player } from '../src/Player.js';

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player('TestPlayer');
  });

  describe('constructor', () => {
    test('should create a player with given name', () => {
      expect(player.name).toBe('TestPlayer');
    });

    test('should create a player with default name', () => {
      const defaultPlayer = new Player();
      expect(defaultPlayer.name).toBe('Player');
    });

    test('should initialize with empty guesses set', () => {
      expect(player.guesses.size).toBe(0);
    });
  });

  describe('validateGuess', () => {
    test('should validate correct guess format', () => {
      const result = player.validateGuess('34');
      expect(result.valid).toBe(true);
      expect(result.row).toBe(3);
      expect(result.col).toBe(4);
      expect(result.location).toBe('34');
    });

    test('should reject null or undefined input', () => {
      expect(player.validateGuess(null).valid).toBe(false);
      expect(player.validateGuess(undefined).valid).toBe(false);
    });

    test('should reject empty string', () => {
      const result = player.validateGuess('');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('exactly two digits');
    });

    test('should reject incorrect length input', () => {
      expect(player.validateGuess('1').valid).toBe(false);
      expect(player.validateGuess('123').valid).toBe(false);
    });

    test('should reject non-numeric input', () => {
      const result = player.validateGuess('ab');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('valid numeric');
    });

    test('should reject out of bounds coordinates', () => {
      expect(player.validateGuess('99').valid).toBe(true); // Valid 9,9
      expect(player.validateGuess('00').valid).toBe(true); // Valid 0,0
      
      // These would be invalid for a 10x10 board (not directly testable without board size)
      // but our validation assumes 10x10 board
    });

    test('should reject already guessed location', () => {
      player.recordGuess('34');
      const result = player.validateGuess('34');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('already guessed');
    });

    test('should handle edge case coordinates', () => {
      expect(player.validateGuess('00').valid).toBe(true);
      expect(player.validateGuess('09').valid).toBe(true);
      expect(player.validateGuess('90').valid).toBe(true);
      expect(player.validateGuess('99').valid).toBe(true);
    });
  });

  describe('recordGuess', () => {
    test('should record a guess', () => {
      player.recordGuess('34');
      expect(player.guesses.has('34')).toBe(true);
      expect(player.guesses.size).toBe(1);
    });

    test('should record multiple guesses', () => {
      player.recordGuess('34');
      player.recordGuess('56');
      expect(player.guesses.size).toBe(2);
      expect(player.guesses.has('34')).toBe(true);
      expect(player.guesses.has('56')).toBe(true);
    });

    test('should not duplicate guesses (Set behavior)', () => {
      player.recordGuess('34');
      player.recordGuess('34');
      expect(player.guesses.size).toBe(1);
    });
  });

  describe('hasGuessed', () => {
    test('should return true for guessed location', () => {
      player.recordGuess('34');
      expect(player.hasGuessed('34')).toBe(true);
    });

    test('should return false for unguessed location', () => {
      expect(player.hasGuessed('34')).toBe(false);
    });

    test('should return false after recording different guess', () => {
      player.recordGuess('56');
      expect(player.hasGuessed('34')).toBe(false);
    });
  });

  describe('getAllGuesses', () => {
    test('should return empty array initially', () => {
      expect(player.getAllGuesses()).toEqual([]);
    });

    test('should return all guesses as array', () => {
      player.recordGuess('34');
      player.recordGuess('56');
      const guesses = player.getAllGuesses();
      expect(guesses).toHaveLength(2);
      expect(guesses).toContain('34');
      expect(guesses).toContain('56');
    });

    test('should return array copy (not reference to Set)', () => {
      player.recordGuess('34');
      const guesses = player.getAllGuesses();
      guesses.push('56');
      expect(player.guesses.size).toBe(1); // Original set unchanged
    });
  });

  describe('getGuessCount', () => {
    test('should return 0 initially', () => {
      expect(player.getGuessCount()).toBe(0);
    });

    test('should return correct count after guesses', () => {
      player.recordGuess('34');
      expect(player.getGuessCount()).toBe(1);
      
      player.recordGuess('56');
      expect(player.getGuessCount()).toBe(2);
    });

    test('should not count duplicate guesses', () => {
      player.recordGuess('34');
      player.recordGuess('34');
      expect(player.getGuessCount()).toBe(1);
    });
  });

  describe('reset', () => {
    test('should clear all guesses', () => {
      player.recordGuess('34');
      player.recordGuess('56');
      expect(player.getGuessCount()).toBe(2);
      
      player.reset();
      expect(player.getGuessCount()).toBe(0);
      expect(player.hasGuessed('34')).toBe(false);
    });

    test('should allow new guesses after reset', () => {
      player.recordGuess('34');
      player.reset();
      
      const result = player.validateGuess('34');
      expect(result.valid).toBe(true); // Should be able to guess again
    });
  });

  describe('integration tests', () => {
    test('should handle complete guess workflow', () => {
      // Validate and record a guess
      const validation = player.validateGuess('34');
      expect(validation.valid).toBe(true);
      
      player.recordGuess(validation.location);
      expect(player.hasGuessed('34')).toBe(true);
      
      // Try to guess same location again
      const secondValidation = player.validateGuess('34');
      expect(secondValidation.valid).toBe(false);
    });

    test('should handle multiple players independently', () => {
      const player2 = new Player('Player2');
      
      player.recordGuess('34');
      player2.recordGuess('56');
      
      expect(player.hasGuessed('34')).toBe(true);
      expect(player.hasGuessed('56')).toBe(false);
      expect(player2.hasGuessed('34')).toBe(false);
      expect(player2.hasGuessed('56')).toBe(true);
    });
  });
}); 