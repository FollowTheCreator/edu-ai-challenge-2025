import { describe, test, expect, beforeEach } from '@jest/globals';
import { Ship } from '../src/Ship.js';

describe('Ship', () => {
  let ship;
  const testLocations = ['34', '35', '36'];

  beforeEach(() => {
    ship = new Ship(testLocations);
  });

  describe('constructor', () => {
    test('should create a ship with given locations', () => {
      expect(ship.locations).toEqual(testLocations);
      expect(ship.length).toBe(3);
      expect(ship.hits).toEqual([false, false, false]);
    });

    test('should create a copy of locations array to avoid mutation', () => {
      const originalLocations = ['12', '13'];
      const ship = new Ship(originalLocations);
      originalLocations.push('14');
      expect(ship.locations).toEqual(['12', '13']);
    });

    test('should accept custom length parameter', () => {
      const ship = new Ship(['01', '02'], 2);
      expect(ship.length).toBe(2);
    });
  });

  describe('hit', () => {
    test('should successfully hit a valid location', () => {
      const result = ship.hit('34');
      expect(result).toBe(true);
      expect(ship.hits[0]).toBe(true);
    });

    test('should return false for invalid location', () => {
      const result = ship.hit('99');
      expect(result).toBe(false);
      expect(ship.hits).toEqual([false, false, false]);
    });

    test('should return false for already hit location', () => {
      ship.hit('34');
      const result = ship.hit('34');
      expect(result).toBe(false);
      expect(ship.hits[0]).toBe(true);
    });

    test('should hit multiple different locations', () => {
      ship.hit('34');
      ship.hit('36');
      expect(ship.hits).toEqual([true, false, true]);
    });
  });

  describe('isSunk', () => {
    test('should return false when no hits', () => {
      expect(ship.isSunk()).toBe(false);
    });

    test('should return false when partially hit', () => {
      ship.hit('34');
      ship.hit('35');
      expect(ship.isSunk()).toBe(false);
    });

    test('should return true when all locations hit', () => {
      ship.hit('34');
      ship.hit('35');
      ship.hit('36');
      expect(ship.isSunk()).toBe(true);
    });
  });

  describe('hasLocation', () => {
    test('should return true for valid location', () => {
      expect(ship.hasLocation('35')).toBe(true);
    });

    test('should return false for invalid location', () => {
      expect(ship.hasLocation('99')).toBe(false);
    });
  });

  describe('isHit', () => {
    test('should return false for unhit location', () => {
      expect(ship.isHit('34')).toBe(false);
    });

    test('should return true for hit location', () => {
      ship.hit('34');
      expect(ship.isHit('34')).toBe(true);
    });

    test('should return false for invalid location', () => {
      expect(ship.isHit('99')).toBe(false);
    });
  });

  describe('getStatus', () => {
    test('should return complete ship status', () => {
      ship.hit('34');
      const status = ship.getStatus();
      
      expect(status).toEqual({
        locations: ['34', '35', '36'],
        hits: [true, false, false],
        isSunk: false,
        length: 3
      });
    });

    test('should return sunk status when ship is sunk', () => {
      ship.hit('34');
      ship.hit('35');
      ship.hit('36');
      
      const status = ship.getStatus();
      expect(status.isSunk).toBe(true);
    });
  });
}); 