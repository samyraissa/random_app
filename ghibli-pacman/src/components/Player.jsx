import React, { useState, useEffect } from 'react';
import { WALL } from '../gameLogic/boardLayout';
import './Player.css'; // Import the CSS file

const Player = ({ initialPosition, tileSize, onMove, boardLayout, isGameActive }) => {
  const [gridPosition, setGridPosition] = useState(initialPosition);

  useEffect(() => {
    setGridPosition(initialPosition);
  }, [initialPosition]);

  // Dynamic styles that depend on props/state
  const playerDynamicStyle = {
    top: `${gridPosition.y * tileSize}px`,
    left: `${gridPosition.x * tileSize}px`,
    width: `${tileSize * 0.9}px`,
    height: `${tileSize * 0.9}px`,
    margin: `${tileSize * 0.05}px`,
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isGameActive) return;

      setGridPosition((prevGridPos) => {
        let newGridPos = { ...prevGridPos };
        switch (e.key) {
          case 'ArrowUp': newGridPos.y -= 1; break;
          case 'ArrowDown': newGridPos.y += 1; break;
          case 'ArrowLeft': newGridPos.x -= 1; break;
          case 'ArrowRight': newGridPos.x += 1; break;
          default: return prevGridPos;
        }

        if (
          newGridPos.y >= 0 && newGridPos.y < boardLayout.length &&
          newGridPos.x >= 0 && newGridPos.x < boardLayout[0].length &&
          boardLayout[newGridPos.y][newGridPos.x] !== WALL
        ) {
          if (onMove) {
            onMove(newGridPos);
          }
          return newGridPos;
        } else {
          return prevGridPos;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onMove, boardLayout, tileSize, isGameActive]);

  return (
    <div className="player" style={playerDynamicStyle} data-testid="player">
      <div className="player-eye"></div>
    </div>
  );
};

export default Player;
