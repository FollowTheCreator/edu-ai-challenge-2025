import { Ship } from './Ship.js';

/**
 * Represents a game board for Sea Battle
 */
export class Board {
  constructor(size = 10) {
    this.size = size;
    this.grid = this.createEmptyGrid();
    this.ships = [];
  }

  /**
   * Creates an empty grid filled with water ('~')
   * @returns {Array<Array<string>>} - 2D array representing the board
   */
  createEmptyGrid() {
    return Array(this.size).fill(null).map(() => 
      Array(this.size).fill('~')
    );
  }

  /**
   * Validates if coordinates are within board bounds
   * @param {number} row - Row coordinate
   * @param {number} col - Column coordinate
   * @returns {boolean} - True if coordinates are valid
   */
  isValidCoordinate(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * Converts coordinate string to row/col numbers
   * @param {string} location - Location string (e.g., "34")
   * @returns {Object} - {row, col} object or null if invalid
   */
  parseLocation(location) {
    if (!location || location.length !== 2) {
      return null;
    }
    
    const row = parseInt(location[0], 10);
    const col = parseInt(location[1], 10);
    
    if (isNaN(row) || isNaN(col) || !this.isValidCoordinate(row, col)) {
      return null;
    }
    
    return { row, col };
  }

  /**
   * Converts row/col to location string
   * @param {number} row - Row coordinate
   * @param {number} col - Column coordinate
   * @returns {string} - Location string
   */
  formatLocation(row, col) {
    return `${row}${col}`;
  }

  /**
   * Places a ship randomly on the board
   * @param {number} shipLength - Length of the ship to place
   * @param {boolean} showOnGrid - Whether to mark ship positions on grid
   * @returns {Ship|null} - Placed ship or null if placement failed
   */
  placeShipRandomly(shipLength = 3, showOnGrid = false) {
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const locations = this.generateShipLocations(shipLength, orientation);
      
      if (locations && this.canPlaceShip(locations)) {
        const ship = new Ship(locations, shipLength);
        this.ships.push(ship);
        
        if (showOnGrid) {
          this.markShipOnGrid(locations);
        }
        
        return ship;
      }
      
      attempts++;
    }
    
    return null; // Failed to place ship after max attempts
  }

  /**
   * Generates potential ship locations based on orientation
   * @param {number} shipLength - Length of the ship
   * @param {string} orientation - 'horizontal' or 'vertical'
   * @returns {Array<string>|null} - Array of location strings or null if invalid
   */
  generateShipLocations(shipLength, orientation) {
    let startRow, startCol;
    
    if (orientation === 'horizontal') {
      startRow = Math.floor(Math.random() * this.size);
      startCol = Math.floor(Math.random() * (this.size - shipLength + 1));
    } else {
      startRow = Math.floor(Math.random() * (this.size - shipLength + 1));
      startCol = Math.floor(Math.random() * this.size);
    }

    const locations = [];
    for (let i = 0; i < shipLength; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;
      
      if (!this.isValidCoordinate(row, col)) {
        return null;
      }
      
      locations.push(this.formatLocation(row, col));
    }
    
    return locations;
  }

  /**
   * Checks if a ship can be placed at the given locations
   * @param {Array<string>} locations - Array of location strings
   * @returns {boolean} - True if ship can be placed
   */
  canPlaceShip(locations) {
    return locations.every(location => {
      const coords = this.parseLocation(location);
      if (!coords) return false;
      
      // Check if location is empty
      if (this.grid[coords.row][coords.col] !== '~') {
        return false;
      }
      
      // Check if any existing ship occupies this location
      return !this.ships.some(ship => ship.hasLocation(location));
    });
  }

  /**
   * Marks ship positions on the grid
   * @param {Array<string>} locations - Array of location strings
   */
  markShipOnGrid(locations) {
    locations.forEach(location => {
      const coords = this.parseLocation(location);
      if (coords) {
        this.grid[coords.row][coords.col] = 'S';
      }
    });
  }

  /**
   * Processes a guess/attack on the board
   * @param {string} location - Location string to attack
   * @returns {Object} - Result object with hit, sunk, and ship information
   */
  processAttack(location) {
    const coords = this.parseLocation(location);
    if (!coords) {
      return { valid: false, message: 'Invalid coordinates' };
    }

    const { row, col } = coords;
    
    // Check if already attacked
    if (this.grid[row][col] === 'X' || this.grid[row][col] === 'O') {
      return { valid: false, message: 'Already attacked this location' };
    }

    // Find ship at this location
    const targetShip = this.ships.find(ship => ship.hasLocation(location));
    
    if (targetShip) {
      const hitSuccess = targetShip.hit(location);
      if (hitSuccess) {
        this.grid[row][col] = 'X'; // Hit marker
        const sunk = targetShip.isSunk();
        return {
          valid: true,
          hit: true,
          sunk,
          ship: targetShip,
          message: sunk ? 'Ship sunk!' : 'Hit!'
        };
      }
    }
    
    // Miss
    this.grid[row][col] = 'O'; // Miss marker
    return {
      valid: true,
      hit: false,
      sunk: false,
      message: 'Miss!'
    };
  }

  /**
   * Gets the current state of a cell
   * @param {string} location - Location string
   * @returns {string} - Cell content
   */
  getCellState(location) {
    const coords = this.parseLocation(location);
    if (!coords) return '~';
    return this.grid[coords.row][coords.col];
  }

  /**
   * Counts remaining ships (not sunk)
   * @returns {number} - Number of ships still afloat
   */
  getRemainingShipsCount() {
    return this.ships.filter(ship => !ship.isSunk()).length;
  }

  /**
   * Gets all ship locations for debugging
   * @returns {Array<string>} - All ship locations
   */
  getAllShipLocations() {
    return this.ships.flatMap(ship => ship.locations);
  }

  /**
   * Clones the board for display purposes
   * @returns {Array<Array<string>>} - Copy of the grid
   */
  getGridCopy() {
    return this.grid.map(row => [...row]);
  }
} 