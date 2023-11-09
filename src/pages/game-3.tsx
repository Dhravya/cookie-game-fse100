import React, { useState, useEffect, useCallback } from "react";

type CookieShape = "circle" | "square" | "triangle";

interface Shape {
  id: string;
  shape: CookieShape;
  color: string;
}

const shapes: CookieShape[] = ["circle", "square", "triangle"];
const colors = ["red", "blue", "green"]; // Add more colors if needed

const getRandomShape = (): Shape => {
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)]!;
  const randomColor = colors[Math.floor(Math.random() * colors.length)]!;
  return {
    id: `shape_${Math.random()}`,
    shape: randomShape,
    color: randomColor,
  };
};

const CookieShapeGame: React.FC = () => {
  const [currentShape, setCurrentShape] = useState<Shape>({
    id: "initial_shape",
    shape: "circle", // or any shape you want as the default
    color: "red", // or any color as the default
  });
  const [points, setPoints] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [timeLimit, setTimeLimit] = useState<number>(10);
  const [timer, setTimer] = useState<number>(10);

  // Timer countdown logic
  useEffect(() => {
    // If time runs out, end the game
    if (timer <= 0) {
      setGameOver(true);
      return;
    }

    // Countdown timer
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Clear interval on cleanup
    return () => clearInterval(intervalId);
  }, [timer]);

  // Reset the timer whenever a new shape is generated
  useEffect(() => {
    setTimer(timeLimit);
  }, [currentShape, timeLimit]);

  // Decrease the timeLimit when the player scores a point
  const decreaseTimeLimit = useCallback(() => {
    setTimeLimit((prevTime) => Math.max(3, prevTime * 0.9)); // Decrease time limit but not below 3 seconds
  }, []);

  useEffect(() => {
    setCurrentShape(getRandomShape());
  }, []);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    shape: Shape,
  ) => {
    e.dataTransfer.setData("application/json", JSON.stringify(shape));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetShape: CookieShape,
  ) => {
    event.preventDefault();

    // Retrieve the JSON string data and parse it back into an object
    const droppedShapeData = JSON.parse(
      event.dataTransfer.getData("application/json"),
    ) as Shape;

    console.log("Dropped Shape:", droppedShapeData.shape);
    console.log("Target Shape:", targetShape);

    // Compare the shape type of the dragged element with the target zone
    if (droppedShapeData.shape === targetShape) {
      // Correct shape was dropped
      onCorrectDrop();
    } else {
      setGameOver(true);
    }
  };

  const getShapeSvg = (shapeType: CookieShape, color: string) => {
    const svgStyles = `fill-current text-${color}-500`;
    switch (shapeType) {
      case "circle":
        return <circle cx="50%" cy="50%" r="40%" className={svgStyles} />;
      case "square":
        return (
          <rect
            x="10%"
            y="10%"
            width="80%"
            height="80%"
            className={svgStyles}
          />
        );
      case "triangle":
        return <polygon points="50,15 80,85 20,85" className={svgStyles} />;
      default:
        return null;
    }
  };

  const onCorrectDrop = () => {
    setPoints(points + 1);
    setCurrentShape(getRandomShape());
    decreaseTimeLimit(); // Call to decrease the time after scoring
  };

  useEffect(() => {
    if (gameOver) {
      // Game over logic
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
    }
  }, [gameOver]);

  if (gameOver)
    return (
      <div className="text-center">
        Game Over! Your score: {points}
        {/* Reset game button */}
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => {
            setGameOver(false);
            setPoints(0);
            setTimeLimit(10);
            setTimer(10);
          }}
        >
          Play Again
        </button>
      </div>
    );

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="mb-6 text-center text-4xl text-gray-800">
        🍪 Cookie Shape Match Game 🍪
      </h1>
      <div className="fixed left-4 top-4 rounded-full bg-white p-3 text-black shadow-lg">
        Timer: {timer}s
      </div>
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, currentShape)}
        className={`flex h-20 w-20 cursor-grab items-center justify-center rounded-md shadow-lg`}
        style={{ backgroundColor: currentShape.color }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          {getShapeSvg(currentShape.shape, currentShape.color)}
        </svg>
      </div>

      <div className="mt-8 flex items-center justify-center space-x-4">
        {shapes.map((shape) => (
          <div
            key={shape}
            onDrop={(e) => handleDrop(e, shape)}
            onDragOver={handleDragOver}
            className={`flex h-24 w-24 items-center justify-center rounded-md border-2 border-gray-400`}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              className="text-gray-300"
            >
              {getShapeSvg(shape, "gray")}
            </svg>
          </div>
        ))}
      </div>

      <div className="mt-4 text-green-700">
        <p>Your score: {points}</p>
      </div>
    </div>
  );
};

export default CookieShapeGame;
