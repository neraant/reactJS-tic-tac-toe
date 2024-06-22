import Square from "../Square/Square";
import { useState, useEffect } from "react";

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isNextX, setIsNextX] = useState(true);

  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);

  const [tie, setTie] = useState(false);

  let isWinner = false;
  let winner = null;
  let info = `Next - ${isNextX ? "x" : "o"}`;

  useEffect(() => {
    const xDataScore = window.localStorage.getItem("XSCORE");
    const oDataScore = window.localStorage.getItem("OSCORE");

    if (xDataScore || oDataScore) {
      setXScore(JSON.parse(xDataScore));
      setOScore(JSON.parse(oDataScore));
    }
  }, []);

  useEffect(() => {
    const newWinner = checkWinner();

    if (newWinner) {
      if (newWinner === "x") {
        setXScore(xScore + 1);
        window.localStorage.setItem("XSCORE", xScore + 1);
      } else if (newWinner === "o") {
        setOScore(oScore + 1);
        window.localStorage.setItem("OSCORE", oScore + 1);
      }
    } else if (isBoardFull()) {
      setTie(!tie);
    }
  }, [squares]);

  const isBoardFull = () => {
    return squares.every((square) => square !== null);
  };

  let checkWinner = () => {
    const winnerCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winnerCombinations) {
      let [a, b, c] = combination;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[b] === squares[c]
      ) {
        isWinner = true;

        return squares[a];
      }
    }
    return null;
  };

  const setSquareValue = (i) => {
    if (squares[i]) {
      return;
    }

    if (isWinner) {
      return;
    }

    let newSquares = squares.slice();
    newSquares[i] = isNextX ? "x" : "o";
    setIsNextX(!isNextX);
    setSquares(newSquares);
  };

  const handleRestartButtonClick = () => {
    setSquares(Array(9).fill(null));
    setIsNextX(true);
    setTie(false);
  };

  const refreshButtonClick = () => {
    const xScore = window.localStorage.setItem("XSCORE", 0);
    const oScore = window.localStorage.setItem("OSCORE", 0);

    window.location.reload();

    return;
  };

  winner = checkWinner();
  if (winner) info = `Winner - ${winner}`;
  if (tie) info = `Tie`;

  return (
    <div className="board-container">
      <h1>{info}</h1>
      <div className="board">
        {squares.map((square, index) => {
          return (
            <span key={index}>
              <Square
                value={square}
                setSquareValue={() => setSquareValue(index)}
              />
              {index == 2 || index == 5 ? <br /> : null}
            </span>
          );
        })}
      </div>

      <div className="score" onClick={refreshButtonClick}>
        <div className="wins-container">
          <div className="x-wins-container">
            <span className="x-wins-count">{xScore}</span>
            <p>X player</p>
          </div>
          <div className="o-wins-container">
            <span className="o-wins-count">{oScore}</span>
            <p>O player</p>
          </div>
        </div>
        <p className="refresh-text">Click to refresh</p>
      </div>

      <button
        onClick={handleRestartButtonClick}
        className={`restart-button ${isWinner || tie ? "show" : ""}`}
      >
        Restart
      </button>
    </div>
  );
}
