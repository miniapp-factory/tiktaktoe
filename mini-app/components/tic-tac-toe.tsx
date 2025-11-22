"use client";

import { useEffect, useState } from "react";

const WIN_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function TicTacToe() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [playerTurn, setPlayerTurn] = useState<boolean>(true); // true = player (X), false = AI (O)
  const [winner, setWinner] = useState<string | null>(null);
  const [moves, setMoves] = useState<number>(0);

  const checkWinner = (newBoard: string[]) => {
    for (const combo of WIN_COMBINATIONS) {
      const [a, b, c] = combo;
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return newBoard[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || !playerTurn) return;
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setMoves(moves + 1);
    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      return;
    }
    setPlayerTurn(false);
  };

  useEffect(() => {
    if (!playerTurn && !winner && moves < 9) {
      const timer = setTimeout(() => {
        const emptyIndices = board
          .map((v, i) => (v === "" ? i : null))
          .filter((v): v is number => v !== null);
        if (emptyIndices.length === 0) return;
        const randomIndex =
          emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const newBoard = [...board];
        newBoard[randomIndex] = "O";
        setBoard(newBoard);
        setMoves(moves + 1);
        const win = checkWinner(newBoard);
        if (win) {
          setWinner(win);
          return;
        }
        setPlayerTurn(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [playerTurn, board, winner, moves]);

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setPlayerTurn(true);
    setWinner(null);
    setMoves(0);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, idx) => (
          <button
            key={idx}
            className="w-20 h-20 rounded-lg text-4xl font-bold flex items-center justify-center
              bg-gradient-to-br from-indigo-200 to-indigo-400 hover:from-indigo-300 hover:to-indigo-500
              transition-colors duration-200"
            onClick={() => handleClick(idx)}
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && (
        <div className="text-2xl font-semibold">
          {winner === "X" ? "You win!" : "AI wins!"}
        </div>
      )}
      {moves === 9 && !winner && (
        <div className="text-2xl font-semibold">It's a draw!</div>
      )}
      {(winner || moves === 9) && (
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={resetGame}
        >
          Restart
        </button>
      )}
    </div>
  );
}
