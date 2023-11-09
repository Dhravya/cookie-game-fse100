import React, { useState, useEffect, useRef } from "react";

const COOKIE_WORDS = [
  "chocolate",
  "sugar",
  "biscuit",
  "snickerdoodle",
  "gingersnap",
  "shortbread",
  "macaroon",
  "oatmeal",
  "butter",
  "dough",
];

const TIME_LIMIT = 10; // Seconds allowed for each word

const getRandomWord = () => {
  return COOKIE_WORDS[Math.floor(Math.random() * COOKIE_WORDS.length)]!;
};

const SpeedTypingGame = () => {
  const [word, setWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [points, setPoints] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef(0);


  useEffect(() => {
    setWord(getRandomWord());
  }, []);

  useEffect(() => {
    if (isGameRunning) {
      inputRef.current?.focus();
    }
  }, [isGameRunning]);

  const startGame = () => {
    setUserInput("");
    setWord(getRandomWord());
    setIsGameRunning(true);
    setHasGameStarted(true);
    setTimeLeft(TIME_LIMIT);
    setPoints(0);

    // Clear any existing timers before setting a new one
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft === 1) {
          clearInterval(timerRef.current);
          setIsGameRunning(false);
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setUserInput(newValue);

    if (newValue.toLowerCase() === word.toLowerCase()) {
      setPoints((prevPoints) => prevPoints + 100);
      setWord(getRandomWord());
      setUserInput("");
      // Do not reset the timer after a correct word is typed
    }
  };

  useEffect(() => {
    if (!isGameRunning && hasGameStarted) {
      const response = fetch("/api/addCookies?cookies=" + points / 10).then(
        (res) => {
          if (res.status === 200) {
            alert("You earnt " + points * 10 + " cookies");
          } else {
            alert("Something went wrong");
          }
        },
      );
      console.log(response);
      // Cleanup the timer when the game is over
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isGameRunning, hasGameStarted, points]);

  useEffect(() => {
    return () => {
      // Clean up the timer when the component unmounts
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-6 text-center text-4xl text-gray-800">
        🍪 Cookie Themed Speed Typing Game 🍪
      </h1>
      <p className="mb-2 text-lg">
        Type the following word as fast as you can!
      </p>
      <h2 className="mb-4 rounded bg-yellow-200 p-3 text-2xl font-semibold shadow">
        {word}
      </h2>
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className="h-10 rounded-lg border-2 border-gray-300 bg-white px-5 text-sm focus:outline-none"
        disabled={!isGameRunning}
      />
      <p className="mt-2 text-red-500">Time left: {timeLeft}</p>
      <button
        onClick={startGame}
        className={`mt-4 rounded px-8 py-2 ${
          isGameRunning
            ? "cursor-not-allowed bg-gray-400"
            : "bg-blue-500 hover:bg-blue-700"
        } font-bold text-white focus:outline-none`}
        disabled={isGameRunning}
      >
        {isGameRunning ? "Game in progress..." : "Start Game"}
      </button>
      <p className="mt-4 text-green-700">Points: {points}</p>
    </div>
  );
};

export default SpeedTypingGame;
