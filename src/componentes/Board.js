import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import Cell from './Cell';
import './Board.css';
import Status from './Status';

const Board = () => {
  const [cpuShips, setCpuShips] = useState([]);
  const [playerShips, setPlayerShips] = useState([]);
  const [cpuBoard, setCpuBoard] = useState(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null))
  );
  const [playerBoard, setPlayerBoard] = useState(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null))
  );
  const [currentPlayer, setCurrentPlayer] = useState('Player');
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);

  const isCellOccupied = (row, col, occupiedCells) => {
    return occupiedCells.some(cell => cell[0] === row && cell[1] === col);
  };

  const calculateLife = (board) => {
    return board.flat().filter(cell => cell === 1).length;
  };

  const generateRandomShips = () => {
    const newShips = [];
    const shipSizes = [5, 4, 3, 3, 2];

    for (const size of shipSizes) {
      let ship;
      let isValid;
      do {
        isValid = true;
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * (direction === 'vertical' ? 10 - size : 9));
        const col = Math.floor(Math.random() * (direction === 'horizontal' ? 10 - size : 9));
        ship = [];

        for (let i = 0; i < size; i++) {
          const newRow = direction === 'vertical' ? row + i : row;
          const newCol = direction === 'horizontal' ? col + i : col;

          if (
            isCellOccupied(newRow, newCol, newShips.flat()) ||
            isCellOccupied(newRow - 1, newCol, newShips.flat()) ||
            isCellOccupied(newRow + 1, newCol, newShips.flat()) ||
            isCellOccupied(newRow, newCol - 1, newShips.flat()) ||
            isCellOccupied(newRow, newCol + 1, newShips.flat())
          ) {
            isValid = false;
            break;
          }
          ship.push([newRow, newCol]);
        }

        if (isValid) {
          newShips.push(ship);
        }

      } while (!isValid);
    }
    return newShips;
  };

  const handleRandomizePlayerShips = () => {
    setGameStarted(true);
    setWinner(null);  // Resetear el ganador
    setCurrentPlayer('Player');  // Resetear el jugador actual

    const newCpuShips = generateRandomShips();
    setCpuShips(newCpuShips);

    // Restablecer completamente cpuBoard y playerBoard
    const emptyBoard = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null));

    const newCpuBoard = emptyBoard.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) =>
        newCpuShips.flat().some(shipCell => shipCell[0] === rowIndex && shipCell[1] === colIndex)
          ? 1
          : null
      )
    );
    setCpuBoard(newCpuBoard);

    const newPlayerShips = generateRandomShips();
    setPlayerShips(newPlayerShips);

    const newPlayerBoard = emptyBoard.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) =>
        newPlayerShips.flat().some(shipCell => shipCell[0] === rowIndex && shipCell[1] === colIndex)
          ? 1
          : null
      )
    );
    setPlayerBoard(newPlayerBoard);
  };


  const handleCellClick = (row, col) => {
    if (!gameStarted || currentPlayer !== 'Player' || winner) return;

    // Verificar si la celda ya ha sido disparada
    if (cpuBoard[row][col] === 2 || cpuBoard[row][col] === 3) return;

    const newCpuBoard = cpuBoard.map((r, rowIndex) =>
      r.map((c, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return c === 1 ? 2 : 3;
        }
        return c;
      })
    );

    setCpuBoard(newCpuBoard);

    const cpuLife = calculateLife(newCpuBoard);
    
    if (cpuLife === 0) {
      setWinner('Player');
    } else {
      setCurrentPlayer('CPU');
    }
  };


  useEffect(() => {
    if (currentPlayer === 'CPU' && !winner) {
      setTimeout(() => {
        let row, col;
        do {
          row = Math.floor(Math.random() * 9);
          col = Math.floor(Math.random() * 9);
        } while (playerBoard[row][col] !== null && playerBoard[row][col] !== 1);

        const newPlayerBoard = playerBoard.map((r, rowIndex) =>
          r.map((c, colIndex) => {
            if (rowIndex === row && colIndex === col) {
              return c === 1 ? 2 : 3;
            }
            return c;
          })
        );

        setPlayerBoard(newPlayerBoard);

        const playerLife = calculateLife(newPlayerBoard);
        if (playerLife === 0) {
          setWinner('CPU');
        } else {
          setCurrentPlayer('Player');
        }
      }, 1000);
    }
  }, [currentPlayer, winner]);

  return (
    <Container className="text-center">

<Row>
  <h1 className='text-center text-danger p-2'>Juego de Barcos</h1>
      {gameStarted && (
        <Status
          cpuBoard={cpuBoard}
          playerBoard={playerBoard}
          currentPlayer={currentPlayer}
          lastShotHit={true}
        />
      )}
     <div className="button-container">
        <Button color="primary" onClick={handleRandomizePlayerShips}>
          Colocar barcos
        </Button>
      </div>
    </Row>
    
    <Row>
    <Col md="1">
    </Col>
      <Col md="4">
        <div className="board">
          <h2 className='text-danger text-center'>CPU</h2>
          {Array.from({ length: 9 }).map((_, rowIndex) => (
            <div key={rowIndex} className="row">
              {Array.from({ length: 9 }).map((_, columnIndex) => (
                <Cell
                  key={columnIndex}
                  cellState={cpuBoard[rowIndex][columnIndex] === 1 ? null : cpuBoard[rowIndex][columnIndex]}
                  onClick={() => handleCellClick(rowIndex, columnIndex)}
                />
              ))}
            </div>
          ))}
        </div>
      </Col>
    
      <Col md="3">
    </Col>
      <Col md="4">
        <div className="board">
          <h2 className='text-danger text-center'>Jugador</h2>
          {Array.from({ length: 9 }).map((_, rowIndex) => (
            <div key={rowIndex} className="row">
              {Array.from({ length: 9 }).map((_, columnIndex) => (
                <Cell
                  key={columnIndex}
                  cellState={playerBoard[rowIndex][columnIndex]}
                  isPlayer={true}
                />
              ))}
            </div>
          ))}
        </div>
      </Col>
    </Row>
  </Container>
  );
};

export default Board;
