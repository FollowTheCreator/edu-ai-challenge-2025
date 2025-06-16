#!/usr/bin/env node

import { Game } from './Game.js';

/**
 * Main entry point for the Sea Battle game
 */
async function main() {
  const game = new Game({
    boardSize: 10,
    numShips: 3,
    shipLength: 3
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n👋 Thanks for playing Sea Battle! Goodbye!');
    game.cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    game.cleanup();
    process.exit(0);
  });

  // Start the game
  try {
    await game.start();
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    game.cleanup();
    process.exit(1);
  }
}

// Run the game if this file is executed directly
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
}); 