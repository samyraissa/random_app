import React from 'react';
import { TILE_SIZE } from '../gameLogic/boardLayout';
import './Ghost.css'; // Import the CSS file

const Ghost = ({ id, position, color = 'red', isVulnerable = false }) => {
  // Dynamic styles that depend on props/state
  const ghostDynamicStyle = {
    top: `${position.y * TILE_SIZE}px`,
    left: `${position.x * TILE_SIZE}px`,
    width: `${TILE_SIZE * 0.8}px`,
    height: `${TILE_SIZE * 0.8}px`,
    backgroundColor: color, // Base color, overridden by CSS for vulnerability
    margin: `${TILE_SIZE * 0.1}px`,
  };

  // CSS class for vulnerable state
  const ghostClasses = `ghost ${isVulnerable ? 'vulnerable' : ''}`;

  return (
    <div className={ghostClasses} style={ghostDynamicStyle} data-testid={`ghost-${id}`}>
      <div className="ghost-eyes-container">
        <div className="ghost-eye">
          <div className="pupil"></div>
        </div>
        <div className="ghost-eye">
          <div className="pupil"></div>
        </div>
      </div>
      {/* Optional: add mouth or other details here */}
    </div>
  );
};

export default Ghost;
