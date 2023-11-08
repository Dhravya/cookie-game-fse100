import React, { useState, useEffect, useRef } from 'react';

const COOKIE_WORDS: string[] = [
  'chocolate',
  'sugar',
  'biscuit',
  'snickerdoodle',
  'gingersnap',
  'shortbread',
  'macaroon',
  'oatmeal',
  'butter',
  'dough'
];

const TIME_LIMIT = 10; // Seconds allowed for each word

const getRandomWord = (): string => {
  return COOKIE_WORDS[Math.floor(Math.random() * COOKIE_WORDS.length)]!;
};

const SpeedTypingGame  = () => {
  const [word, setWord] = useState<string>(''); // We start with an empty string
  const [userInput, setUserInput] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(TIME_LIMIT);
  const [points, setPoints] = useState<number>(0);
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // This will only execute once on client side mount to prevent mismatch
    setWord(getRandomWord());
  }, []);

  const startGame = (): void => {
    setUserInput('');
    setWord(getRandomWord());
    setIsGameRunning(true);
    setHasGameStarted(true); // Set to true when the game starts
    setTimeLeft(TIME_LIMIT);
    setPoints(0);
    inputRef.current?.focus();

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft === 1) {
          clearInterval(timerRef.current!);
          setIsGameRunning(false);
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);
  };

  const resetTimer = (): void => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIME_LIMIT);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setUserInput(newValue);

    if (newValue.toLowerCase() === word.toLowerCase()) {
      setPoints((prevPoints) => prevPoints + 1);
      setWord(getRandomWord());
      setUserInput('');
      resetTimer();
    }
  };

  useEffect(() => {
    if (!isGameRunning && hasGameStarted) {
      alert(`Game over! Your score is ${points} point(s).`);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isGameRunning, hasGameStarted, points]);

  useEffect(() => {
    return () => {
      // Clean up the interval on component unmount
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-4xl text-center text-gray-800 mb-6">🍪 Cookie Themed Speed Typing Game 🍪</h1>
      <p className="mb-2 text-lg">Type the following word as fast as you can!</p>
      <h2 className="mb-4 text-2xl font-semibold bg-yellow-200 p-3 rounded shadow">{word}</h2>
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className="border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
        disabled={!isGameRunning}
      />
      <p className="mt-2 text-red-500">Time left: {timeLeft}</p>
      <button
        onClick={startGame}
        className={`mt-4 px-8 py-2 rounded ${isGameRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold focus:outline-none`}
        disabled={isGameRunning}
      >
        {isGameRunning ? 'Game in progress...' : 'Start Game'}
      </button>
      <p className="mt-4 text-green-700">Points: {points}</p>
    </div>
  );
};

export default SpeedTypingGame;
