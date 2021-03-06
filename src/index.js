import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {

    return (
      <button onClick={props.onClick} 
      className={"square " + (props.highlight ? 'highlight' : '')}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {


  renderSquare(i, highlight) {
    return <Square highlight={highlight} value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)} />;
  }

  render() {


    const grid = Array(3).fill(null);
    for (var r = 0; r < 3; r++) {
      const row = Array(3).fill(null);
      for (var i = 0; i < 3; i++) {
        var pos = (r * 3) + i;

        if (this.props.winning && (this.props.winning[0] === pos || this.props.winning[1] === pos || this.props.winning[2] === pos)) {
          row[i] = this.renderSquare(pos, true);
        } else {
          row[i] = this.renderSquare(pos, false);
        }
      }
      
      grid[r] = <div className="board-row">{row}</div>;
    }

    return (
      <div>
        {grid}
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: {col: null, row: null}
      }],
      stepNumber: 0,
      xIsNext: true,
      sorted: 'asc'
    }
  }

  render() {

    const history = this.state.history;
    var current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    var moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

      const move_info = 'Pos (' + (move % 2 === 0 ? 'O' : 'X') + '): ' + history[move].move.col + ',' + history[move].move.row;

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{ this.state.stepNumber === move ? <b>{desc} - {move_info}</b> : desc + ' - ' + move_info }</button>
        </li>
      );
    });

    if (this.state.sorted === 'desc') {
      moves.reverse();
    }

    let status;
    current.winning = Array(3).fill(null);

    if (winner) {
      const tiles = getWinningTiles(current.squares)
      current.winning = tiles;

      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (

      <div className="game">
        <div className="game-board">
          <Board winning={current.winning} squares={current.squares}
          onClick={(i) => {this.handleClick(i)}}/>
        </div>
        <div className="game-info">

          <div>{status}</div>

          <div className="toggle">
            Sort: {(this.state.sorted === 'asc' ? 'Ascending' : 'Descending')}
            <button onClick={() => {this.toggleSort()}}>Sort</button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  toggleSort() {
    this.setState({
      sorted: (this.state.sorted === 'asc' ? 'desc' : 'asc')
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = (this.state.xIsNext ? 'X' : 'O');

    var [col, row] = convertToPos(i);

    this.setState({
      history: history.concat([{
        squares: squares,
        move: {col: col, row: row}
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });

  }

}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return squares[a];
    }
  }
  return null;
}

function getWinningTiles(squares) {
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
      return lines[i];
    }
  }
}

function convertToPos(i) {
  var col, row = 0;
  if (i % 3 === 0 || i === 0) {
    col = 1;
    row = (i / 3) + 1;
  } else if (i === 1 || i === 4 || i === 7) {
    col = 2;
    // eslint-disable-next-line default-case
    switch (i) {
      case 1:
        row = 1;
        break;
        case 4:
          row = 2;
          break;
          case 7:
            row = 3;
            break;
    }
  } else {
    col = 3;
    // eslint-disable-next-line default-case
    switch (i) {
      case 2:
        row = 1;
        break;
        case 5:
          row = 2;
          break;
          case 8:
            row = 3;
            break;
    }
  }

  return [col, row];
}