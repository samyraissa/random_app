// src/gameLogic/boardLayout.js
export const WALL = 1;
export const PATH = 0;
export const DOT = 2;
export const POWER_FRUIT = 3;
export const TILE_SIZE = 30; // Size of each tile in pixels

// Updated board layout with collectibles
// Original 5x5 board, expanded slightly to 5x7 for more space
export const boardLayout = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, DOT, DOT, POWER_FRUIT, DOT, DOT, 1],
  [1, DOT, 1, DOT, 1, DOT, 1], // Added a wall in the middle path
  [1, DOT, DOT, DOT, DOT, DOT, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

// Helper to get initial board state if needed elsewhere, ensuring a deep copy
export const getInitialBoard = () => boardLayout.map(row => [...row]);
