import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { CPUPlayer } from '../src/CPUPlayer.js';

describe('CPUPlayer', () => {
  let cpu;

  beforeEach(() => {
    cpu = new CPUPlayer('TestCPU', 10);
  });

  describe('constructor', () => {
    test('should create CPU player with given name and board size', () => {
      expect(cpu.name).toBe('TestCPU');
      expect(cpu.boardSize).toBe(10);
    });

    test('should create CPU player with default values', () => {
      const defaultCPU = new CPUPlayer();
      expect(defaultCPU.name).toBe('CPU');
      expect(defaultCPU.boardSize).toBe(10);
    });

    test('should initialize in hunt mode', () => {
      expect(cpu.mode).toBe('hunt');
      expect(cpu.targetQueue).toEqual([]);
      expect(cpu.guesses.size).toBe(0);
    });
  });

  describe('makeGuess', () => {
    test('should make a valid guess in hunt mode', () => {
      const guess = cpu.makeGuess();
      expect(guess).toMatch(/^\d\d$/);
      expect(cpu.guesses.has(guess)).toBe(true);
    });

    test('should not repeat guesses', () => {
      const guess1 = cpu.makeGuess();
      const guess2 = cpu.makeGuess();
      expect(guess1).not.toBe(guess2);
      expect(cpu.guesses.size).toBe(2);
    });

    test('should target from queue when in target mode', () => {
      cpu.mode = 'target';
      cpu.targetQueue = ['34', '35'];
      
      const guess = cpu.makeGuess();
      expect(guess).toBe('34');
      expect(cpu.targetQueue).toEqual(['35']);
    });

    test('should fall back to hunt mode when target queue is empty', () => {
      cpu.mode = 'target';
      cpu.targetQueue = [];
      
      const guess = cpu.makeGuess();
      expect(guess).toMatch(/^\d\d$/);
      expect(cpu.mode).toBe('hunt');
    });
  });

  describe('processResult', () => {
    test('should handle invalid results gracefully', () => {
      const result = { valid: false };
      cpu.processResult(result);
      expect(cpu.mode).toBe('hunt');
    });

    test('should enter target mode on hit', () => {
      const result = { valid: true, hit: true, sunk: false, location: '34' };
      cpu.processResult(result);
      
      expect(cpu.mode).toBe('target');
      expect(cpu.lastHit).toBe('34');
      expect(cpu.targetQueue.length).toBeGreaterThan(0);
    });

    test('should return to hunt mode when ship is sunk', () => {
      cpu.mode = 'target';
      cpu.targetQueue = ['35', '36'];
      
      const result = { valid: true, hit: true, sunk: true, location: '34' };
      cpu.processResult(result);
      
      expect(cpu.mode).toBe('hunt');
      expect(cpu.targetQueue).toEqual([]);
    });

    test('should stay in hunt mode on miss in hunt mode', () => {
      const result = { valid: true, hit: false, sunk: false, location: '34' };
      cpu.processResult(result);
      
      expect(cpu.mode).toBe('hunt');
    });

    test('should return to hunt mode on miss when target queue is empty', () => {
      cpu.mode = 'target';
      cpu.targetQueue = [];
      
      const result = { valid: true, hit: false, sunk: false, location: '34' };
      cpu.processResult(result);
      
      expect(cpu.mode).toBe('hunt');
    });
  });

  describe('addAdjacentTargets', () => {
    test('should add adjacent locations to target queue', () => {
      cpu.addAdjacentTargets('34');
      
      const expectedTargets = ['24', '44', '33', '35'];
      expectedTargets.forEach(target => {
        expect(cpu.targetQueue).toContain(target);
      });
    });

    test('should not add invalid coordinates', () => {
      cpu.addAdjacentTargets('00');
      
      // Should only have valid adjacent targets (not negative coordinates)
      const validTargets = cpu.targetQueue.filter(target => {
        const coords = cpu.parseLocation(target);
        return coords && cpu.isValidCoordinate(coords.row, coords.col);
      });
      
      expect(validTargets.length).toBe(cpu.targetQueue.length);
    });

    test('should not add already guessed locations', () => {
      cpu.guesses.add('24');
      cpu.guesses.add('44');
      
      cpu.addAdjacentTargets('34');
      
      expect(cpu.targetQueue).not.toContain('24');
      expect(cpu.targetQueue).not.toContain('44');
    });

    test('should not add duplicates to target queue', () => {
      cpu.targetQueue = ['33'];
      cpu.addAdjacentTargets('34');
      
      // Count occurrences of '33'
      const count33 = cpu.targetQueue.filter(target => target === '33').length;
      expect(count33).toBe(1);
    });

    test('should handle edge coordinates correctly', () => {
      cpu.addAdjacentTargets('99'); // Bottom-right corner
      
      const validTargets = ['89', '98']; // Only these should be valid
      expect(cpu.targetQueue).toEqual(expect.arrayContaining(validTargets));
      expect(cpu.targetQueue.length).toBe(2);
    });
  });

  describe('isValidCoordinate', () => {
    test('should validate coordinates within bounds', () => {
      expect(cpu.isValidCoordinate(0, 0)).toBe(true);
      expect(cpu.isValidCoordinate(5, 5)).toBe(true);
      expect(cpu.isValidCoordinate(9, 9)).toBe(true);
    });

    test('should reject coordinates outside bounds', () => {
      expect(cpu.isValidCoordinate(-1, 0)).toBe(false);
      expect(cpu.isValidCoordinate(0, -1)).toBe(false);
      expect(cpu.isValidCoordinate(10, 0)).toBe(false);
      expect(cpu.isValidCoordinate(0, 10)).toBe(false);
    });
  });

  describe('formatLocation', () => {
    test('should format coordinates correctly', () => {
      expect(cpu.formatLocation(3, 4)).toBe('34');
      expect(cpu.formatLocation(0, 0)).toBe('00');
      expect(cpu.formatLocation(9, 9)).toBe('99');
    });
  });

  describe('parseLocation', () => {
    test('should parse valid location strings', () => {
      expect(cpu.parseLocation('34')).toEqual({ row: 3, col: 4 });
      expect(cpu.parseLocation('00')).toEqual({ row: 0, col: 0 });
      expect(cpu.parseLocation('99')).toEqual({ row: 9, col: 9 });
    });

    test('should return null for invalid locations', () => {
      expect(cpu.parseLocation('')).toBeNull();
      expect(cpu.parseLocation('1')).toBeNull();
      expect(cpu.parseLocation('123')).toBeNull();
      expect(cpu.parseLocation('aa')).toBeNull();
    });
  });

  describe('findFirstUnguessed', () => {
    test('should find first unguessed location', () => {
      // Fill some locations
      cpu.guesses.add('00');
      cpu.guesses.add('01');
      
      const location = cpu.findFirstUnguessed();
      expect(location).toBe('02');
    });

    test('should return 00 as ultimate fallback', () => {
      // Fill entire board except one spot to test fallback
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          cpu.guesses.add(cpu.formatLocation(row, col));
        }
      }
      
      const location = cpu.findFirstUnguessed();
      expect(location).toBe('00');
    });
  });

  describe('targetFromQueue', () => {
    test('should return next target from queue', () => {
      cpu.targetQueue = ['34', '35', '36'];
      const target = cpu.targetFromQueue();
      expect(target).toBe('34');
      expect(cpu.targetQueue).toEqual(['35', '36']);
    });

    test('should filter out already guessed locations', () => {
      cpu.guesses.add('34');
      cpu.targetQueue = ['34', '35', '36'];
      
      const target = cpu.targetFromQueue();
      expect(target).toBe('35');
      expect(cpu.targetQueue).toEqual(['36']);
    });

    test('should fall back to hunt when queue is empty', () => {
      cpu.targetQueue = [];
      jest.spyOn(cpu, 'huntRandomly').mockReturnValue('12');
      
      const target = cpu.targetFromQueue();
      expect(target).toBe('12');
      expect(cpu.huntRandomly).toHaveBeenCalled();
    });
  });

  describe('huntRandomly', () => {
    test('should return valid unguessed location', () => {
      const location = cpu.huntRandomly();
      expect(location).toMatch(/^\d\d$/);
      
      const coords = cpu.parseLocation(location);
      expect(cpu.isValidCoordinate(coords.row, coords.col)).toBe(true);
    });

    test('should not return already guessed location', () => {
      cpu.guesses.add('34');
      
      const location = cpu.huntRandomly();
      expect(location).not.toBe('34');
    });
  });

  describe('utility methods', () => {
    test('hasGuessed should work correctly', () => {
      cpu.guesses.add('34');
      expect(cpu.hasGuessed('34')).toBe(true);
      expect(cpu.hasGuessed('35')).toBe(false);
    });

    test('getAllGuesses should return array of guesses', () => {
      cpu.guesses.add('34');
      cpu.guesses.add('35');
      
      const guesses = cpu.getAllGuesses();
      expect(guesses).toHaveLength(2);
      expect(guesses).toContain('34');
      expect(guesses).toContain('35');
    });

    test('getGuessCount should return correct count', () => {
      expect(cpu.getGuessCount()).toBe(0);
      
      cpu.guesses.add('34');
      expect(cpu.getGuessCount()).toBe(1);
    });

    test('getCurrentMode should return current mode', () => {
      expect(cpu.getCurrentMode()).toBe('hunt');
      
      cpu.mode = 'target';
      expect(cpu.getCurrentMode()).toBe('target');
    });

    test('getTargetQueueSize should return queue size', () => {
      expect(cpu.getTargetQueueSize()).toBe(0);
      
      cpu.targetQueue = ['34', '35'];
      expect(cpu.getTargetQueueSize()).toBe(2);
    });
  });

  describe('reset', () => {
    test('should reset all state', () => {
      cpu.guesses.add('34');
      cpu.mode = 'target';
      cpu.targetQueue = ['35', '36'];
      cpu.lastHit = '34';
      
      cpu.reset();
      
      expect(cpu.guesses.size).toBe(0);
      expect(cpu.mode).toBe('hunt');
      expect(cpu.targetQueue).toEqual([]);
      expect(cpu.lastHit).toBeNull();
    });
  });

  describe('AI behavior integration', () => {
    test('should demonstrate complete hunt-target cycle', () => {
      // Start in hunt mode
      expect(cpu.getCurrentMode()).toBe('hunt');
      
      // Process a hit
      cpu.processResult({ valid: true, hit: true, sunk: false, location: '34' });
      expect(cpu.getCurrentMode()).toBe('target');
      expect(cpu.getTargetQueueSize()).toBeGreaterThan(0);
      
      // Make a target guess - verify guess is valid
      const initialQueueSize = cpu.getTargetQueueSize();
      const targetGuess = cpu.makeGuess();
      expect(targetGuess).toMatch(/^\d\d$/);
      
      // Either queue decreased or mode switched to hunt (both valid behaviors)
      const queueDecreased = cpu.getTargetQueueSize() < initialQueueSize;
      const modeSwitched = cpu.getCurrentMode() === 'hunt';
      expect(queueDecreased || modeSwitched).toBe(true);
      
      // Process ship sunk
      cpu.processResult({ valid: true, hit: true, sunk: true, location: targetGuess });
      expect(cpu.getCurrentMode()).toBe('hunt');
      expect(cpu.getTargetQueueSize()).toBe(0);
    });

    test('should handle miss in target mode correctly', () => {
      cpu.mode = 'target';
      cpu.targetQueue = ['35'];
      
      // Miss shouldn't change mode if queue has targets
      cpu.processResult({ valid: true, hit: false, sunk: false, location: '34' });
      expect(cpu.getCurrentMode()).toBe('target');
      
      // Clear queue and miss should return to hunt
      cpu.targetQueue = [];
      cpu.processResult({ valid: true, hit: false, sunk: false, location: '36' });
      expect(cpu.getCurrentMode()).toBe('hunt');
    });
  });
}); 