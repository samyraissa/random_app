import React from 'react';
import { TILE_SIZE, WALL, PATH, DOT, POWER_FRUIT } from '../gameLogic/boardLayout';
import './Board.css'; // Import the CSS file

const Board = ({ currentBoard }) => {
  const boardDynamicStyle = {
    width: `${currentBoard[0].length * TILE_SIZE}px`,
    height: `${currentBoard.length * TILE_SIZE}px`,
  };

  const renderTileContent = (tileType) => {
    if (tileType === DOT) {
      return <div className="dot-collectible"></div>;
    } else if (tileType === POWER_FRUIT) {
      return <div className="power-fruit-collectible"></div>;
    }
    return null; // Path tiles are empty, Wall tiles styled by their own class
  };

  return (
    <div className="game-board" style={boardDynamicStyle} data-testid="game-board">
      {currentBoard.map((row, rowIndex) =>
        row.map((tileType, colIndex) => {
          const tileClasses = `tile ${tileType === WALL ? 'wall' : 'path'}`;
          const tileStyle = {
            width: `${TILE_SIZE}px`,
            height: `${TILE_SIZE}px`,
            top: `${rowIndex * TILE_SIZE}px`,
            left: `${colIndex * TILE_SIZE}px`,
          };
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={tileClasses}
              style={tileStyle}
              data-testid={`tile-${rowIndex}-${colIndex}`}
            >
              {renderTileContent(tileType)}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Board;
