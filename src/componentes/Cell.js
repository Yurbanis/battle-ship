import React from 'react';
import './Cell.css';

const Cell = ({ cellState, onClick }) => {
  const cellClassName = `cell ${cellState === 1 ? 'has-ship' : cellState === 2 ? 'hit' : cellState === 3 ? 'miss' : ''}`;

  return (
    <div className={cellClassName} onClick={onClick}></div>
  );
};

export default Cell;
