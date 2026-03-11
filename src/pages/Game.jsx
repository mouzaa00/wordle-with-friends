import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DeleteIcon } from "lucide-react";
import { Header } from "../components/ui/Header";
import { WORDS } from "../utils/words";
import { decryptGameData } from "../utils/encryption";
import { GameOverModal } from "../components/GameOverModal";
import { HowToPlayModal } from "../components/HowToPlayModal";

const WORD_LENGTH = 5;
const backspace = <DeleteIcon data-role="backspace" />;
const ROW1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const ROW2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const ROW3 = ["Enter", "z", "x", "c", "v", "b", "n", "m", backspace];

function Tile({ char, solution, isFlipping, isGuessEntered, index }) {
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (isFlipping) {
      const timeout = setTimeout(() => setShowResult(true), index * 400 + 400);
      return () => clearTimeout(timeout);
    }
  }, [isFlipping, index]);

  const shouldShowColor = isGuessEntered && (!isFlipping || showResult);

  let className = `w-12 h-12 border-2 ${
    char ? "border-[#878a8c]" : "border-[#d3d6da]"
  } text-2xl flex justify-center items-center uppercase font-bold`;
  if (shouldShowColor) {
    if (char === solution[index]) {
      className = className + " text-white bg-correct border-correct";
    } else if (solution.includes(char)) {
      className = className + " text-white bg-present border-present";
    } else {
      className = className + " text-white bg-absent border-absent";
    }
  }
  if (isFlipping) {
    className = className + ` tile-flip`;
  }

  return (
    <div
      className={className}
      style={isFlipping ? { animationDelay: `${index * 0.4}s` } : undefined}
    >
      {char}
    </div>
  );
}

function Row({ guess, isGuessEntered, solution, submittedRow }) {
  const isFlipping = submittedRow !== undefined && isGuessEntered;

  const tiles = [];
  for (let i = 0; i < WORD_LENGTH; i++) {
    tiles.push(
      <Tile
        key={i}
        char={guess[i]}
        solution={solution}
        isFlipping={isFlipping}
        isGuessEntered={isGuessEntered}
        index={i}
      />,
    );
  }

  return <div className="flex gap-1">{tiles}</div>;
}

function KeyboardLayout({
  currentGuess,
  setCurrentGuess,
  guesses,
  setGuesses,
  solution,
  isGameOver,
  setIsGameOver,
  setIsPopupOpen,
  setIsModelOpen,
  setFlipRowIndex,
}) {
  function handleClick(event) {
    if (isGameOver) return;
    if (event.target.dataset.role === "backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
      return;
    }

    if (
      event.target.textContent == "Enter" &&
      currentGuess.length == WORD_LENGTH
    ) {
      if (!WORDS.includes(currentGuess)) {
        setIsPopupOpen(true);
        return;
      }
      const currentRowIndex = guesses.findIndex((val) => val == null);
      const newGuesses = guesses;
      newGuesses[currentRowIndex] = currentGuess;
      setGuesses(newGuesses);
      setFlipRowIndex(currentRowIndex);

      if (currentGuess === solution) {
        setIsGameOver(!isGameOver);
        setIsModelOpen(true);
        setCurrentGuess("");
        return;
      }
      if (guesses.findIndex((val) => val == null) == -1) {
        setIsGameOver(true);
        setIsModelOpen(true);
      }
      setCurrentGuess("");
      return;
    }

    if (currentGuess.length === WORD_LENGTH) return;

    setCurrentGuess(currentGuess + event.target.textContent);
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex justify-center items-center gap-1">
        {ROW1.map((element, idx) => (
          <button
            className="bg-gray-300 text-sm w-8 h-12  rounded uppercase font-bold"
            key={idx}
            onClick={handleClick}
          >
            {element}
          </button>
        ))}
      </div>
      <div className="flex justify-center items-center gap-1">
        {ROW2.map((element, idx) => (
          <button
            className="bg-gray-300 text-sm w-8 h-12  rounded uppercase font-bold"
            key={idx}
            onClick={handleClick}
          >
            {element}
          </button>
        ))}
      </div>
      <div className="flex justify-center items-center gap-1">
        {ROW3.map((element, idx) => {
          if (element == backspace) {
            return (
              <button
                className="bg-gray-300 rounded uppercase py-3 px-4 font-bold flex justify-center items-center"
                key={idx}
                onClick={handleClick}
              >
                {element}
              </button>
            );
          }
          if (element == "Enter") {
            return (
              <button
                className="bg-gray-300 rounded uppercase w-14 h-12 text-sm font-bold flex justify-center items-center"
                key={idx}
                onClick={handleClick}
              >
                {element}
              </button>
            );
          }
          return (
            <button
              className="bg-gray-300 text-sm w-8 h-12  rounded uppercase font-bold"
              key={idx}
              onClick={handleClick}
            >
              {element}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PopUp({ setIsPopupOpen }) {
  useEffect(() => {
    setTimeout(() => setIsPopupOpen(false), 2000);
  }, [setIsPopupOpen]);

  return (
    <div className="z-10 inset-0 overflow-y-auto absolute flex justify-center items-start">
      <div
        className="relative p-2 text-sm text-white rounded-lg bg-black w-fit shadow-xl transform transition-all top-10"
        role="alert"
      >
        <span className="font-medium">Not in words list!</span>
      </div>
    </div>
  );
}

function GamePage() {
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);
  const [flipRowIndex, setFlipRowIndex] = useState(null);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { word, creator } = decryptGameData(token);

  useEffect(() => {
    function handleType(event) {
      if (isGameOver) return;

      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (event.key == "Enter" && currentGuess.length == WORD_LENGTH) {
        if (!WORDS.includes(currentGuess)) {
          setIsPopupOpen(true);
          return;
        }
        const currentRowIndex = guesses.findIndex((val) => val == null);
        const newGuesses = guesses;
        newGuesses[currentRowIndex] = currentGuess;
        setGuesses(newGuesses);
        setFlipRowIndex(currentRowIndex);
        if (currentGuess === word) {
          setIsGameOver(true);
          setIsModelOpen(true);
          setCurrentGuess("");
          return;
        }
        if (guesses.findIndex((val) => val == null) == -1) {
          setIsGameOver(true);
          setIsModelOpen(true);
        }
        setCurrentGuess("");
        return;
      }

      if (
        event.key.length !== 1 ||
        event.key.charCodeAt(0) < 97 ||
        event.key.charCodeAt(0) > 122
      )
        return;

      if (currentGuess.length === WORD_LENGTH) return;

      setCurrentGuess(currentGuess + event.key);
    }

    window.addEventListener("keydown", handleType);

    return () => window.removeEventListener("keydown", handleType);
  }, [currentGuess, guesses, isGameOver, word]);

  return (
    <>
      <Header />
      <main className="px-2 py-4">
        <p className="text-sm text-center">
          You have 6 tries to guess{" "}
          {creator.charAt(0).toUpperCase() + creator.slice(1)}
          &apos;s 5 letter word!
        </p>
        <button
          onClick={() => setIsHowToPlayModalOpen(true)}
          className="text-sm w-full mt-2 underline hover:text-gray-800 transition-colors"
        >
          How to play
        </button>
        <div className="flex flex-col items-center gap-1 mt-4">
          {guesses.map((guess, idx) => {
            const isCurrentGuess =
              idx === guesses.findIndex((val) => val == null);
            return (
              <Row
                key={idx}
                guess={isCurrentGuess ? currentGuess : (guess ?? "")}
                isGuessEntered={!isCurrentGuess && guess != null}
                solution={word}
                submittedRow={flipRowIndex === idx ? idx : undefined}
              />
            );
          })}
        </div>
        {isModelOpen && (
          <GameOverModal
            creator={creator}
            solution={word}
            setIsModelOpen={setIsModelOpen}
            guess={guesses[guesses.findIndex((val) => val == null) - 1]}
          />
        )}
        <KeyboardLayout
          currentGuess={currentGuess}
          setCurrentGuess={setCurrentGuess}
          guesses={guesses}
          setGuesses={setGuesses}
          isGameOver={isGameOver}
          setIsGameOver={setIsGameOver}
          solution={word}
          setIsPopupOpen={setIsPopupOpen}
          setIsModelOpen={setIsModelOpen}
          setFlipRowIndex={setFlipRowIndex}
        />
        {isPopupOpen && <PopUp setIsPopupOpen={setIsPopupOpen} />}
        {isHowToPlayModalOpen && (
          <HowToPlayModal setIsHowToPlayModalOpen={setIsHowToPlayModalOpen} />
        )}
      </main>
    </>
  );
}

export default GamePage;
