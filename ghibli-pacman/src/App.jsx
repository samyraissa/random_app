import React, { useState, useEffect, useCallback } from 'react';
import Player from './components/Player';
import Board from './components/Board';
import Ghost from './components/Ghost';
import GameInfo from './components/GameInfo';
import './App.css';
import { getInitialBoard, TILE_SIZE, PATH, DOT, POWER_FRUIT, WALL } from './gameLogic/boardLayout';

const POINTS_DOT = 10;
const POINTS_POWER_FRUIT = 50;
const POINTS_EAT_GHOST = 200;
const POWER_UP_DURATION = 5000; // 5 seconds

const initialPlayerPosition = { x: 1, y: 1 };

const initialGhostSetup = [
  { id: 'blinky', spawnPoint: { x: 3, y: 1 }, color: 'red' },
  { id: 'pinky', spawnPoint: { x: 1, y: 3 }, color: 'pink' },
];

function App() {
  const [boardData, setBoardData] = useState(getInitialBoard());
  const [playerPosition, setPlayerPosition] = useState(initialPlayerPosition);
  const [playerLives, setPlayerLives] = useState(5);
  const [score, setScore] = useState(0);
  const [ghostsData, setGhostsData] = useState(
    initialGhostSetup.map(g => ({
      ...g,
      position: { ...g.spawnPoint },
      isVulnerable: false,
      vulnerableTimer: 0,
    }))
  );
  const [gameState, setGameState] = useState('playing'); // 'playing', 'gameOver', 'won'

  // Effect for managing ghost vulnerability timers
  useEffect(() => {
    if (gameState !== 'playing') return; // Stop timers if game is not active

    const interval = setInterval(() => {
      setGhostsData(prevGhosts =>
        prevGhosts.map(ghost => {
          if (ghost.isVulnerable && ghost.vulnerableTimer > 0) {
            const newTimer = ghost.vulnerableTimer - 1000;
            if (newTimer <= 0) {
              return { ...ghost, isVulnerable: false, vulnerableTimer: 0 };
            }
            return { ...ghost, vulnerableTimer: newTimer };
          }
          return ghost;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]); // Rerun if gameState changes

  const checkWinCondition = useCallback((currentBoardData) => {
    for (let r = 0; r < currentBoardData.length; r++) {
      for (let c = 0; c < currentBoardData[r].length; c++) {
        if (currentBoardData[r][c] === DOT || currentBoardData[r][c] === POWER_FRUIT) {
          return false; // Found a collectible, game not won yet
        }
      }
    }
    return true; // No collectibles found
  }, []);

  const activatePowerUp = useCallback(() => {
    if (gameState !== 'playing') return;
    setGhostsData(prevGhosts =>
      prevGhosts.map(ghost => ({
        ...ghost,
        isVulnerable: true,
        vulnerableTimer: POWER_UP_DURATION,
      }))
    );
  }, [gameState]);

  const handlePlayerGhostCollision = useCallback((collidedGhost) => {
    if (gameState !== 'playing') return;

    if (collidedGhost.isVulnerable) {
      setScore(prevScore => prevScore + POINTS_EAT_GHOST);
      setGhostsData(prevGhosts =>
        prevGhosts.map(g =>
          g.id === collidedGhost.id
            ? { ...g, position: { ...g.spawnPoint }, isVulnerable: false, vulnerableTimer: 0 }
            : g
        )
      );
    } else {
      const newLives = playerLives - 1;
      setPlayerLives(newLives);
      if (newLives <= 0) {
        setGameState('gameOver');
      } else {
        setPlayerPosition(initialPlayerPosition);
        setGhostsData(
          initialGhostSetup.map(g => ({
            ...g,
            position: { ...g.spawnPoint },
            isVulnerable: false,
            vulnerableTimer: 0,
          }))
        );
      }
    }
  }, [gameState, playerLives]);

  const handlePlayerMove = useCallback((newPlayerPosition) => {
    if (gameState !== 'playing') return;

    const { x: newX, y: newY } = newPlayerPosition;
    if (!boardData[newY] || boardData[newY][newX] === undefined) return;

    const tile = boardData[newY][newX];
    let newScore = score;
    let collectedItem = false;
    let newBoardData = boardData;

    if (tile === DOT) {
      newScore += POINTS_DOT;
      collectedItem = true;
    } else if (tile === POWER_FRUIT) {
      newScore += POINTS_POWER_FRUIT;
      activatePowerUp();
      collectedItem = true;
    }

    if (collectedItem) {
      newBoardData = boardData.map(row => [...row]); // Create a mutable copy
      newBoardData[newY][newX] = PATH;
      setBoardData(newBoardData);
      setScore(newScore);
      if (checkWinCondition(newBoardData)) {
        setGameState('won');
      }
    }
    
    setPlayerPosition(newPlayerPosition);

    ghostsData.forEach(ghost => {
      if (ghost.position.x === newPlayerPosition.x && ghost.position.y === newPlayerPosition.y) {
        handlePlayerGhostCollision(ghost);
      }
    });

  }, [gameState, boardData, score, ghostsData, activatePowerUp, handlePlayerGhostCollision, checkWinCondition]);

  return (
    <div className="app-container">
      <GameInfo lives={playerLives} score={score} />
      <h1>Ghibli Pac-Man</h1>
      {gameState === 'gameOver' && <div className="game-message game-over">Game Over!</div>}
      {gameState === 'won' && <div className="game-message you-win">You Win!</div>}
      <div className="game-area">
        <Board currentBoard={boardData} />
        <Player
          initialPosition={playerPosition}
          tileSize={TILE_SIZE}
          onMove={handlePlayerMove}
          boardLayout={boardData}
          isGameActive={gameState === 'playing'} // To disable movement
        />
        {ghostsData.map(ghost => (
          <Ghost
            key={ghost.id}
            id={ghost.id}
            position={ghost.position}
            color={ghost.color}
            isVulnerable={ghost.isVulnerable}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
