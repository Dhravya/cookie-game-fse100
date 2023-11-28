import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Header from "~/components/Header";

function App() {
  const { data: session, status } = useSession();

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [currentSize, setCurrentSize] = useState(50);
  const [isWrong, setIsWrong] = useState(false);

  useEffect(() => {
    if (attempts > 3) {
      const response = fetch("/api/addCookies?cookies=" + score / 10).then(
        (res) => {
          if (res.status === 200) {
            alert("You earnt " + score / 10 + " cookies");
          } else {
            alert("Something went wrong");
          }
        },
      );
      console.log(response);
    }
    if (attempts < 3 && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setAttempts((prev) => prev + 1);
      resetGame();
    }
  }, [timeLeft, attempts]);

  const resetGame = () => {
    randomPosition();
    setTimeLeft((prevTime) => (prevTime <= 2 ? 2 : prevTime - 1));
  };

  const randomPosition = () => {
    const top = Math.random() * (window.innerHeight - 50);
    const left = Math.random() * (window.innerWidth - 50);
    setCurrentSize(Math.random() * 100 + 50);
    setPosition({ top, left });
  };

  const onCookieClick = () => {
    setScore((prevScore) => prevScore + 10);
    resetGame();
  };

  const onMissClick = () => {
    setIsWrong(true);
    setTimeout(() => setIsWrong(false), 100);
    setAttempts((prev) => prev + 1);
    if (attempts + 1 < 3) resetGame();
  };

  if (status === "loading") return null;
  if (!session) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-12 font-sans font-semibold">
        You are not logged in{" "}
        <Link href={"/"} className="rounded-full bg-blue-400 p-2">
          Back to home page
        </Link>
      </div>
    );
  }

  return (
    <div >
      <Header />
      {attempts < 3 ? (
        <div
          className={`relative h-screen w-screen overflow-hidden`}
          style={{
            backgroundImage: `url('/bg.jpeg')`,
            backgroundSize: "cover",
          }}
          onClick={onMissClick}
        >
          <div className="absolute left-5 top-5 rounded-lg bg-white p-4 ">
            <p>Score: {score}</p>
            <p>Time Left: {timeLeft}</p>
            <p>Attempts Left: {3 - attempts}</p>
          </div>
          <div
            className={`absolute h-16 w-16 cursor-pointer rounded-full bg-cover bg-center ${isWrong ? "bg-red-500" : "bg-white "}`}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              backgroundImage: !isWrong ? `url('https://i.pinimg.com/564x/3c/32/fc/3c32fc5df675e77467b0343ea7b46dbb.jpg')` : "url('red')",
              width: `${currentSize}px`,
              height: `${currentSize}px`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onCookieClick();
            }}
          ></div>
        </div>
      ) : (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <p className="text-xl font-bold">Game Over</p>
          <p className="mt-4">Your Score: {score}</p>
          <p className="mt-4">You earnt: {score / 10} cookies</p>
          <button
            onClick={() => {
              window.location.reload();
            }}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
