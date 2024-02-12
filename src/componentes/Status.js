import React, { useEffect, useState } from 'react';
import './Board.css';

const Status = ({ cpuBoard, playerBoard, currentPlayer, lastShotHit }) => {
  const [winner, setWinner] = useState(null);

  const calculateLife = (board) => {
    return board.flat().filter(cell => cell === 1).length;
  };

  useEffect(() => {
    const cpuLife = calculateLife(cpuBoard);
    const playerLife = calculateLife(playerBoard);
    if (cpuLife === 0) {
      setWinner('Player');
    } else if (playerLife === 0) {
      setWinner('CPU');
    }
  }, [cpuBoard, playerBoard]);


  return (
    <div>
      <div className="life-container">
        <span className='text-warning fw-bold'>Flota CPU: {calculateLife(cpuBoard)}</span>
      </div>
      <div className="life-container">
        <span className='text-warning fw-bold'>Flota Jugador: {calculateLife(playerBoard)}</span>
      </div>
      {winner && <div className="winner-message">{winner === 'Player' ? 'Jugador gana!' : 'CPU gana!'}</div>}
    </div>
  );
};

export default Status;
