import React from 'react';
import './App.css'; 
import Board from './componentes/Board';

const App = () => {
  return (
    <div className="app">
      <h1>Juego de Barco</h1>
      <Board />
    </div>
  );
};

export default App;
