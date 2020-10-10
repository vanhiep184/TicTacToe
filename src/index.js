import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square({ value, onClick, highlight }) {
  const className = 'square' + (highlight ? ' winner' : '');
  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={this.props.lineWinner && this.props.lineWinner.includes(i)}
      />
    );
  }

  render() {
    const size = 3;
    let squares = Array(size).fill(Array(size).fill(null));
       squares = squares.map((square, index) => {
      square = square.map((sq, iSq) => this.renderSquare(index * size + iSq) )
      return (<div key={index} className="board-row"> {square} </div>);
    })
    return (
      <div>{squares}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isDescending: false
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).square || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: i
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  handleSort() {
    this.setState({
      isDescending: !this.state.isDescending,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  location(i) {
    const index = i
    return `(${1 + i % 3}, ${1 + Math.floor(i/3)})`
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const squaresWinner = winner.square
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #"+move +" - location: " + this.location(step.location) : "Go to game start";
      return (
        <li key={move}>
          <button className={move === this.state.stepNumber ? 'current-move ' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    if (squaresWinner) {
      status = "Winner: " + squaresWinner;
    } else if(winner.isDraw) {
      status = "Draw!!"
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    const isDescending = this.state.isDescending
    if (isDescending) {
      moves.reverse();
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            lineWinner={winner.line}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleSort()}>{this.state.isDescending ? 'Ascending' : 'Descending'}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
        isDraw: false
      };
    }
  }
  // Check isDraw 
  let isDraw = true;
  squares.forEach(square => {
    if (square === null) {
      isDraw = false;
    }
  })
  return {
    square: null,
    isDraw: isDraw
  };
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
