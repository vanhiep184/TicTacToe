import React from 'react';
import Square from "../Square";

function Board({ squares, lineWinner, onClick }) {
    const size = 3;
    let squaresInBoard = Array(size).fill(Array(size).fill(null));
    const renderSquare = (i) => {
        return (
        <Square
            key={i}
            value={squares[i]}
            onClick={() => onClick(i)}
            highlight={lineWinner && lineWinner.includes(i)}
        />
        );
    }
    squaresInBoard = squaresInBoard.map((square, index) => {
      square = square.map((sq, iSq) => renderSquare(index * size + iSq));
      return (
        <div key={index} className="board-row">
          {" "}
          {square}{" "}
        </div>
      );
    });
    return <div>{squaresInBoard}</div>;
}

export default Board