/**
 * Represents a ship in the Sea Battle game
 */
export class Ship {
  constructor(locations, length = 3) {
    this.locations = [...locations]; // Create a copy to avoid mutation
    this.hits = new Array(locations.length).fill(false);
    this.length = length;
  }

  /**
   * Records a hit at the specified location
   * @param {string} location - The location string (e.g., "34")
   * @returns {boolean} - True if hit was successful, false if already hit or invalid location
   */
  hit(location) {
    const index = this.locations.indexOf(location);
    if (index === -1) {
      return false; // Location not part of this ship
    }
    
    if (this.hits[index]) {
      return false; // Already hit
    }
    
    this.hits[index] = true;
    return true;
  }

  /**
   * Checks if the ship has been sunk (all locations hit)
   * @returns {boolean} - True if ship is sunk
   */
  isSunk() {
    return this.hits.every(hit => hit === true);
  }

  /**
   * Checks if a location is part of this ship
   * @param {string} location - The location to check
   * @returns {boolean} - True if location is part of ship
   */
  hasLocation(location) {
    return this.locations.includes(location);
  }

  /**
   * Checks if a location has been hit on this ship
   * @param {string} location - The location to check
   * @returns {boolean} - True if location has been hit
   */
  isHit(location) {
    const index = this.locations.indexOf(location);
    return index !== -1 && this.hits[index];
  }

  /**
   * Gets the ship's status for serialization or debugging
   * @returns {Object} - Ship status object
   */
  getStatus() {
    return {
      locations: [...this.locations],
      hits: [...this.hits],
      isSunk: this.isSunk(),
      length: this.length
    };
  }
} 