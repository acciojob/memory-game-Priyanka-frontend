import React, { useEffect, useState } from "react";
import "./../styles/App.css";

const LEVELS = {
  easy: 4,
  normal: 8,
  hard: 16,
};

function App() {
  const [level, setLevel] = useState("");
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);

  const createCards = (pairs) => {
    const numbers = [];

    for (let i = 1; i <= pairs; i++) {
      numbers.push(i);
      numbers.push(i);
    }

    // Shuffle cards
    for (let i = numbers.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));

      [numbers[i], numbers[randomIndex]] = [
        numbers[randomIndex],
        numbers[i],
      ];
    }

    return numbers.map((number, index) => ({
      id: index,
      number,
    }));
  };

  const startGame = (selectedLevel) => {
    setLevel(selectedLevel);
    setCards(createCards(LEVELS[selectedLevel]));
    setFlipped([]);
    setMatched([]);
    setAttempts(0);
  };

  const handleCardClick = (id) => {
    // Do not allow more than two cards to be selected
    if (flipped.length === 2) {
      return;
    }

    // Do not allow clicking the same card again
    if (flipped.includes(id)) {
      return;
    }

    // Do not allow already matched cards
    if (matched.includes(id)) {
      return;
    }

    const newFlipped = [...flipped, id];

    setFlipped(newFlipped);

    // Wait until two cards are selected
    if (newFlipped.length !== 2) {
      return;
    }

    setAttempts((previous) => previous + 1);

    const firstCard = cards.find(
      (card) => card.id === newFlipped[0]
    );

    const secondCard = cards.find(
      (card) => card.id === newFlipped[1]
    );

    if (firstCard.number === secondCard.number) {
      setMatched((previous) => [
        ...previous,
        firstCard.id,
        secondCard.id,
      ]);

      setFlipped([]);
    } else {
      setTimeout(() => {
        setFlipped([]);
      }, 800);
    }
  };

  const isGameComplete =
    cards.length > 0 && matched.length === cards.length;

  useEffect(() => {
    if (isGameComplete) {
      // Game completed
    }
  }, [isGameComplete]);

  return (
    <div className="app">
      <h1>Memory Matching Game</h1>

      {!level && (
        <div className="levels_container">
          <h2>Select Difficulty</h2>

          <label>
            <input
              id="easy"
              type="radio"
              name="level"
              onChange={() => startGame("easy")}
            />
            Easy
          </label>

          <label>
            <input
              id="normal"
              type="radio"
              name="level"
              onChange={() => startGame("normal")}
            />
            Normal
          </label>

          <label>
            <input
              id="hard"
              type="radio"
              name="level"
              onChange={() => startGame("hard")}
            />
            Hard
          </label>
        </div>
      )}

      {level && (
        <div className="game">
          <div className="game_header">
            <h2>
              {level.charAt(0).toUpperCase() +
                level.slice(1)}{" "}
              Mode
            </h2>

            <p>Attempts: {attempts}</p>

            {isGameComplete && (
              <p className="success">
                🎉 All pairs matched!
              </p>
            )}

            <button
              className="restart"
              onClick={() => startGame(level)}
            >
              Restart
            </button>
          </div>

          <div
            className={`cells_container ${level}`}
          >
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id);
              const isMatched = matched.includes(card.id);

              return (
                <button
                  key={card.id}
                  className={`cell ${
                    isFlipped || isMatched
                      ? "visible"
                      : ""
                  } ${isMatched ? "matched" : ""}`}
                  onClick={() =>
                    handleCardClick(card.id)
                  }
                  disabled={isMatched}
                >
                  {isFlipped || isMatched
                    ? card.number
                    : "?"}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

