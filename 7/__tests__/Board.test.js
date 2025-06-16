import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { Board } from '../src/Board.js';

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board(10);
  });

  describe('constructor', () => {
    test('should create a board with default size 10', () => {
      const defaultBoard = new Board();
      expect(defaultBoard.size).toBe(10);
      expect(defaultBoard.grid).toHaveLength(10);
      expect(defaultBoard.grid[0]).toHaveLength(10);
    });

    test('should create a board with custom size', () => {
      const customBoard = new Board(5);
      expect(customBoard.size).toBe(5);
      expect(customBoard.grid).toHaveLength(5);
      expect(customBoard.grid[0]).toHaveLength(5);
    });

    test('should initialize grid with water (~)', () => {
      expect(board.grid[0][0]).toBe('~');
      expect(board.grid[9][9]).toBe('~');
    });

    test('should initialize with empty ships array', () => {
      expect(board.ships).toEqual([]);
    });
  });

  describe('createEmptyGrid', () => {
    test('should create grid filled with water', () => {
      const grid = board.createEmptyGrid();
      expect(grid).toHaveLength(10);
      expect(grid[0]).toHaveLength(10);
      expect(grid[5][5]).toBe('~');
    });
  });

  describe('isValidCoordinate', () => {
    test('should return true for valid coordinates', () => {
      expect(board.isValidCoordinate(0, 0)).toBe(true);
      expect(board.isValidCoordinate(5, 5)).toBe(true);
      expect(board.isValidCoordinate(9, 9)).toBe(true);
    });

    test('should return false for invalid coordinates', () => {
      expect(board.isValidCoordinate(-1, 0)).toBe(false);
      expect(board.isValidCoordinate(0, -1)).toBe(false);
      expect(board.isValidCoordinate(10, 0)).toBe(false);
      expect(board.isValidCoordinate(0, 10)).toBe(false);
    });
  });

  describe('parseLocation', () => {
    test('should parse valid location strings', () => {
      expect(board.parseLocation('34')).toEqual({ row: 3, col: 4 });
      expect(board.parseLocation('00')).toEqual({ row: 0, col: 0 });
      expect(board.parseLocation('99')).toEqual({ row: 9, col: 9 });
    });

    test('should return null for invalid location strings', () => {
      expect(board.parseLocation('')).toBeNull();
      expect(board.parseLocation('1')).toBeNull();
      expect(board.parseLocation('123')).toBeNull();
      expect(board.parseLocation('aa')).toBeNull();
      
      // Test with smaller board to verify out of bounds checking
      const smallBoard = new Board(5);
      expect(smallBoard.parseLocation('99')).toBeNull(); // Out of bounds for 5x5 board
    });
  });

  describe('formatLocation', () => {
    test('should format coordinates to location string', () => {
      expect(board.formatLocation(3, 4)).toBe('34');
      expect(board.formatLocation(0, 0)).toBe('00');
      expect(board.formatLocation(9, 9)).toBe('99');
    });
  });

  describe('placeShipRandomly', () => {
    test('should place a ship successfully', () => {
      const ship = board.placeShipRandomly(3, false);
      expect(ship).toBeTruthy();
      expect(ship.locations).toHaveLength(3);
      expect(board.ships).toHaveLength(1);
    });

    test('should mark ship on grid when showOnGrid is true', () => {
      // Mock generateShipLocations to return predictable locations
      const mockLocations = ['01', '02', '03'];
      jest.spyOn(board, 'generateShipLocations').mockReturnValue(mockLocations);
      
      const ship = board.placeShipRandomly(3, true);
      expect(ship).toBeTruthy();
      expect(board.grid[0][1]).toBe('S');
      expect(board.grid[0][2]).toBe('S');
      expect(board.grid[0][3]).toBe('S');
    });

    test('should return null if placement fails after max attempts', () => {
      // Fill the board to make placement impossible
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          board.grid[i][j] = 'S';
        }
      }
      
      const ship = board.placeShipRandomly(3, false);
      expect(ship).toBeNull();
    });
  });

  describe('generateShipLocations', () => {
    test('should generate horizontal ship locations', () => {
      const locations = board.generateShipLocations(3, 'horizontal');
      expect(locations).toHaveLength(3);
      
      // Check that locations are consecutive horizontally
      const coords = locations.map(loc => board.parseLocation(loc));
      expect(coords[0].row).toBe(coords[1].row);
      expect(coords[1].row).toBe(coords[2].row);
      expect(coords[1].col).toBe(coords[0].col + 1);
      expect(coords[2].col).toBe(coords[1].col + 1);
    });

    test('should generate vertical ship locations', () => {
      const locations = board.generateShipLocations(3, 'vertical');
      expect(locations).toHaveLength(3);
      
      // Check that locations are consecutive vertically
      const coords = locations.map(loc => board.parseLocation(loc));
      expect(coords[0].col).toBe(coords[1].col);
      expect(coords[1].col).toBe(coords[2].col);
      expect(coords[1].row).toBe(coords[0].row + 1);
      expect(coords[2].row).toBe(coords[1].row + 1);
    });
  });

  describe('canPlaceShip', () => {
    test('should return true for valid placement', () => {
      const locations = ['01', '02', '03'];
      expect(board.canPlaceShip(locations)).toBe(true);
    });

    test('should return false for occupied locations', () => {
      board.grid[0][1] = 'S';
      const locations = ['01', '02', '03'];
      expect(board.canPlaceShip(locations)).toBe(false);
    });

    test('should return false for existing ship locations', () => {
      board.placeShipRandomly(3, false);
      const existingShip = board.ships[0];
      expect(board.canPlaceShip(existingShip.locations)).toBe(false);
    });
  });

  describe('processAttack', () => {
    beforeEach(() => {
      // Place a ship at known locations for testing
      const mockLocations = ['34', '35', '36'];
      jest.spyOn(board, 'generateShipLocations').mockReturnValue(mockLocations);
      board.placeShipRandomly(3, false);
    });

    test('should return invalid for bad coordinates', () => {
      const result = board.processAttack('aa');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Invalid coordinates');
    });

    test('should return invalid for already attacked location', () => {
      board.grid[3][4] = 'X'; // Mark as already hit
      const result = board.processAttack('34');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Already attacked');
    });

    test('should process hit successfully', () => {
      const result = board.processAttack('34');
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(false);
      expect(board.grid[3][4]).toBe('X');
    });

    test('should process miss successfully', () => {
      const result = board.processAttack('00');
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(false);
      expect(result.sunk).toBe(false);
      expect(board.grid[0][0]).toBe('O');
    });

    test('should detect sunk ship', () => {
      board.processAttack('34');
      board.processAttack('35');
      const result = board.processAttack('36');
      
      expect(result.valid).toBe(true);
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(true);
    });
  });

  describe('getCellState', () => {
    test('should return cell state', () => {
      expect(board.getCellState('00')).toBe('~');
      
      board.grid[3][4] = 'X';
      expect(board.getCellState('34')).toBe('X');
    });

    test('should return ~ for invalid location', () => {
      expect(board.getCellState('aa')).toBe('~');
    });
  });

  describe('getRemainingShipsCount', () => {
    test('should return 0 for empty board', () => {
      expect(board.getRemainingShipsCount()).toBe(0);
    });

    test('should return correct count of unsunk ships', () => {
      // Place two ships
      board.placeShipRandomly(3, false);
      board.placeShipRandomly(3, false);
      expect(board.getRemainingShipsCount()).toBe(2);
      
      // Sink one ship
      const firstShip = board.ships[0];
      firstShip.locations.forEach(loc => firstShip.hit(loc));
      expect(board.getRemainingShipsCount()).toBe(1);
    });
  });

  describe('getAllShipLocations', () => {
    test('should return all ship locations', () => {
      const mockLocations1 = ['34', '35', '36'];
      const mockLocations2 = ['01', '02', '03'];
      
      jest.spyOn(board, 'generateShipLocations')
        .mockReturnValueOnce(mockLocations1)
        .mockReturnValueOnce(mockLocations2);
      
      board.placeShipRandomly(3, false);
      board.placeShipRandomly(3, false);
      
      const allLocations = board.getAllShipLocations();
      expect(allLocations).toEqual(['34', '35', '36', '01', '02', '03']);
    });
  });

  describe('getGridCopy', () => {
    test('should return a copy of the grid', () => {
      const gridCopy = board.getGridCopy();
      expect(gridCopy).toEqual(board.grid);
      expect(gridCopy).not.toBe(board.grid); // Should be a different object
      
      // Modifying copy shouldn't affect original
      gridCopy[0][0] = 'X';
      expect(board.grid[0][0]).toBe('~');
    });
  });
}); 