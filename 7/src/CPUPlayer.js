/**
 * Represents a CPU opponent with intelligent targeting
 */
export class CPUPlayer {
  constructor(name = 'CPU', boardSize = 10) {
    this.name = name;
    this.boardSize = boardSize;
    this.guesses = new Set();
    this.mode = 'hunt'; // 'hunt' or 'target'
    this.targetQueue = []; // Queue of locations to target after a hit
    this.lastHit = null; // Last successful hit location
  }

  /**
   * Makes an intelligent guess based on current mode
   * @returns {string} - Location string to attack
   */
  makeGuess() {
    let guess;
    
    if (this.mode === 'target' && this.targetQueue.length > 0) {
      guess = this.targetFromQueue();
    } else {
      guess = this.huntRandomly();
      this.mode = 'hunt';
    }
    
    this.guesses.add(guess);
    return guess;
  }

  /**
   * Processes the result of the CPU's guess
   * @param {Object} result - Attack result from the board
   */
  processResult(result) {
    if (!result.valid) {
      return; // Invalid guess, shouldn't happen with proper AI
    }

    const { hit, sunk, location } = result;
    
    if (hit) {
      this.lastHit = location;
      
      if (sunk) {
        // Ship is sunk, return to hunt mode
        this.mode = 'hunt';
        this.targetQueue = [];
      } else {
        // Hit but not sunk, switch to target mode
        this.mode = 'target';
        this.addAdjacentTargets(location);
      }
    } else {
      // Miss - if we were targeting, continue with queue
      if (this.mode === 'target' && this.targetQueue.length === 0) {
        this.mode = 'hunt';
      }
    }
  }

  /**
   * Targets the next location from the target queue
   * @returns {string} - Location string to target
   */
  targetFromQueue() {
    // Remove already guessed locations from queue
    this.targetQueue = this.targetQueue.filter(loc => !this.guesses.has(loc));
    
    if (this.targetQueue.length === 0) {
      return this.huntRandomly();
    }
    
    return this.targetQueue.shift();
  }

  /**
   * Makes a random guess in hunt mode
   * @returns {string} - Random valid location string
   */
  huntRandomly() {
    const maxAttempts = 200;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const row = Math.floor(Math.random() * this.boardSize);
      const col = Math.floor(Math.random() * this.boardSize);
      const location = this.formatLocation(row, col);
      
      if (!this.guesses.has(location)) {
        return location;
      }
      
      attempts++;
    }
    
    // Fallback: find first unguessed location (shouldn't happen normally)
    return this.findFirstUnguessed();
  }

  /**
   * Adds adjacent locations to the target queue after a hit
   * @param {string} location - The hit location
   */
  addAdjacentTargets(location) {
    const coords = this.parseLocation(location);
    if (!coords) return;
    
    const { row, col } = coords;
    const adjacentLocations = [
      { row: row - 1, col }, // North
      { row: row + 1, col }, // South
      { row, col: col - 1 }, // West
      { row, col: col + 1 }  // East
    ];
    
    adjacentLocations.forEach(({ row: r, col: c }) => {
      if (this.isValidCoordinate(r, c)) {
        const adjLocation = this.formatLocation(r, c);
        
        // Only add if not already guessed and not already in queue
        if (!this.guesses.has(adjLocation) && !this.targetQueue.includes(adjLocation)) {
          this.targetQueue.push(adjLocation);
        }
      }
    });
  }

  /**
   * Validates if coordinates are within board bounds
   * @param {number} row - Row coordinate
   * @param {number} col - Column coordinate
   * @returns {boolean} - True if coordinates are valid
   */
  isValidCoordinate(row, col) {
    return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
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
   * Parses location string to coordinates
   * @param {string} location - Location string
   * @returns {Object|null} - {row, col} or null if invalid
   */
  parseLocation(location) {
    if (!location || location.length !== 2) return null;
    
    const row = parseInt(location[0], 10);
    const col = parseInt(location[1], 10);
    
    if (isNaN(row) || isNaN(col) || !this.isValidCoordinate(row, col)) {
      return null;
    }
    
    return { row, col };
  }

  /**
   * Finds the first unguessed location (fallback method)
   * @returns {string} - First available location
   */
  findFirstUnguessed() {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        const location = this.formatLocation(row, col);
        if (!this.guesses.has(location)) {
          return location;
        }
      }
    }
    return '00'; // Ultimate fallback
  }

  /**
   * Checks if a location has been guessed
   * @param {string} location - Location to check
   * @returns {boolean} - True if location has been guessed
   */
  hasGuessed(location) {
    return this.guesses.has(location);
  }

  /**
   * Gets all guesses made by the CPU
   * @returns {Array<string>} - Array of all guesses
   */
  getAllGuesses() {
    return Array.from(this.guesses);
  }

  /**
   * Gets the number of guesses made
   * @returns {number} - Number of guesses
   */
  getGuessCount() {
    return this.guesses.size;
  }

  /**
   * Gets current AI mode
   * @returns {string} - Current mode ('hunt' or 'target')
   */
  getCurrentMode() {
    return this.mode;
  }

  /**
   * Gets current target queue size
   * @returns {number} - Number of targets in queue
   */
  getTargetQueueSize() {
    return this.targetQueue.length;
  }

  /**
   * Resets the CPU player state
   */
  reset() {
    this.guesses.clear();
    this.mode = 'hunt';
    this.targetQueue = [];
    this.lastHit = null;
  }
} 