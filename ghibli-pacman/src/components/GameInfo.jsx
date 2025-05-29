import React from 'react';
import './GameInfo.css'; // Import the CSS file

const GameInfo = ({ lives, score }) => {
  return (
    <div className="game-info" data-testid="game-info">
      <div className="info-item" data-testid="lives-display">Lives: {lives}</div>
      <div className="info-item" data-testid="score-display">Score: {score}</div>
    </div>
  );
};

export default GameInfo;
