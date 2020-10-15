import React, { useState } from "react";
import Board from "../Board";

function Game() {
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
    },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [isDescending, setIsDescending] = useState(false);
  const location = (i) => {
    return `(${1 + (i % 3)}, ${1 + Math.floor(i / 3)})`;
  };
  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };
  const handleSort = () => {
    setIsDescending(!isDescending);
  };

  const handleClick = (i) => {
    const handleHistory = history.slice(0, stepNumber + 1);
    const current = handleHistory[handleHistory.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).square || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    setHistory(
      handleHistory.concat([
        {
          squares: squares,
          location: i,
        },
      ])
    );
    setStepNumber(handleHistory.length);
    setXIsNext(!xIsNext);
  };
  const newHistory = history;
  const current = newHistory[stepNumber];
  const winner = calculateWinner(current.squares);
  const squaresWinner = winner.square;
  const moves = newHistory.map((step, move) => {
    const desc = move
      ? "Go to move #" + move + " - location: " + location(step.location)
      : "Go to game start";
    return (
      <li key={move}>
        <button
          className={move === stepNumber ? "current-move " : ""}
          onClick={() => jumpTo(move)}
        >
          {desc}
        </button>
      </li>
    );
  });
  let status;
  if (squaresWinner) {
    status = "Winner: " + squaresWinner;
  } else if (winner.isDraw) {
    status = "Draw!!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  if (isDescending) {
    moves.reverse();
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) => handleClick(i)}
          lineWinner={winner.line}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button onClick={() => handleSort()}>
          {isDescending ? "Ascending" : "Descending"}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        line: lines[i],
        square: squares[a],
        isDraw: false,
      };
    }
  }
  // Check isDraw
  let isDraw = true;
  squares.forEach((square) => {
    if (square === null) {
      isDraw = false;
    }
  });
  return {
    square: null,
    isDraw: isDraw,
  };
}
export default Game;
