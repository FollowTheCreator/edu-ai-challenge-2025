/**
 * Represents a human player in the Sea Battle game
 */
export class Player {
  constructor(name = 'Player') {
    this.name = name;
    this.guesses = new Set(); // Use Set for O(1) lookup
  }

  /**
   * Validates and processes a player's guess
   * @param {string} guess - The guess input (e.g., "34")
   * @returns {Object} - Validation result
   */
  validateGuess(guess) {
    // Check if input is exactly 2 characters
    if (!guess || guess.length !== 2) {
      return {
        valid: false,
        message: 'Input must be exactly two digits (e.g., 00, 34, 98).'
      };
    }

    // Parse row and column
    const row = parseInt(guess[0], 10);
    const col = parseInt(guess[1], 10);

    // Validate numeric input
    if (isNaN(row) || isNaN(col)) {
      return {
        valid: false,
        message: 'Please enter valid numeric coordinates.'
      };
    }

    // Check bounds (assuming 10x10 board)
    if (row < 0 || row >= 10 || col < 0 || col >= 10) {
      return {
        valid: false,
        message: 'Please enter coordinates between 0 and 9.'
      };
    }

    // Check if already guessed
    if (this.guesses.has(guess)) {
      return {
        valid: false,
        message: 'You already guessed that location!'
      };
    }

    return {
      valid: true,
      row,
      col,
      location: guess
    };
  }

  /**
   * Records a guess made by the player
   * @param {string} guess - The guess to record
   */
  recordGuess(guess) {
    this.guesses.add(guess);
  }

  /**
   * Checks if a location has been guessed
   * @param {string} location - The location to check
   * @returns {boolean} - True if location has been guessed
   */
  hasGuessed(location) {
    return this.guesses.has(location);
  }

  /**
   * Gets all guesses made by the player
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
   * Resets the player's guess history
   */
  reset() {
    this.guesses.clear();
  }
} 