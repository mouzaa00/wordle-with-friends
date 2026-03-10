import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CircleXIcon, DeleteIcon, Share2Icon } from "lucide-react";
import { Header } from "../components/ui/Header";
import { WORDS } from "../utils/words";
import { decryptGameData } from "../utils/encryption";

const WORD_LENGTH = 5;
const backspace = <DeleteIcon data-role="backspace" />;
const ROW1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const ROW2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const ROW3 = ["Enter", "z", "x", "c", "v", "b", "n", "m", backspace];

function Modal({ creator, solution, setIsModelOpen, guess }) {
  return (
    <div className="z-10 inset-0 overflow-y-auto absolute top-32 flex justify-center items-start">
      <div className="text-white space-y-8 text-center relative bg-[#121213] rounded-lg p-6 overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-sm sm:w-full">
        {guess === solution ? (
          <h3 className="text-3xl leading-6 font-bold">
            You won!{" "}
            <span role="img" aria-label="win" aria-hidden="false">
              🎉
            </span>{" "}
          </h3>
        ) : (
          <h3 className="text-3xl leading-6 font-bold">
            You lost!{" "}
            <span role="img" aria-label="win" aria-hidden="false">
              😢
            </span>{" "}
          </h3>
        )}
        <div>
          {creator.charAt(0).toUpperCase() + creator.slice(1)}&apos;s word was{" "}
          {solution.toUpperCase()}.
        </div>
        <button
          onClick={() => setIsModelOpen(false)}
          type="button"
          className="absolute right-2 top-[-24px]"
        >
          <CircleXIcon className="hover:text-red-500" />
        </button>
        <div className="sm:flex sm:justify-center sm:space-x-2">
          <a
            href={window.location.href.replace(window.location.pathname, "/")}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-correct text-base font-medium text-white sm:col-start-2 sm:text-sm"
          >
            Create a Word
          </a>
          <button
            type="button"
            className="flex bg-present items-center space-x-2 mt-3 w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 font-medium text-white sm:mt-0 sm:col-start-1 sm:text-sm"
          >
            <span>Share</span>
            <Share2Icon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ guess, isGuessEntered, solution }) {
  const tiles = [];
  // when the guess is null or '', we still want to render the tiles with empty strings
  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    let className = `w-12 h-12 border-2 ${
      char ? "border-[#878a8c]" : "border-[#d3d6da]"
    } text-2xl flex justify-center items-center uppercase font-bold`;
    if (isGuessEntered) {
      if (char === solution[i]) {
        className = className + " text-white bg-correct border-correct";
      } else if (solution.includes(char)) {
        className = className + " text-white bg-present border-present";
      } else {
        className = className + " text-white bg-absent border-absent";
      }
    }
    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>,
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
      const newGuesses = guesses;
      newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
      setGuesses(newGuesses);

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

function Guide({ setIsGuideOpen }) {
  const example1 = ["w", "e", "a", "r", "y"];
  const example2 = ["p", "i", "l", "l", "s"];
  const example3 = ["v", "a", "g", "u", "e"];

  return (
    <div className="z-10 p-6 inset-0 overflow-y-auto absolute top-14 bg-white sm:max-w-3xl sm:mx-auto">
      <button
        type="button"
        className="absolute right-2 top-0"
        onClick={() => setIsGuideOpen(false)}
      >
        <CircleXIcon className="hover:text-red-500" />
      </button>
      <article>
        <h2 className="font-bold text-2xl">How To Play</h2>
        <p>Guess the wordle in 6 tries.</p>
        <ul className="my-4 text-sm">
          <li className="before:w-2 before:h-2 before:bg-black before:inline-block before:rounded-full before:mr-2">
            Each guess must be a valid 5-letter word.
          </li>
          <li className="before:w-2 before:h-2 before:bg-black before:inline-block before:rounded-full before:mr-2">
            The color of the tiles will change to show how close your guess was
            to the word.
          </li>
        </ul>
        <p className="font-semibold">Examples</p>
        <div className="flex gap-1 mt-2">
          {example1.map((char, idx) => {
            if (char === "w") {
              return (
                <div
                  className="w-8 h-8 border-2 border-correct bg-correct text-2xl flex justify-center items-center text-white font-bold uppercase"
                  key={idx}
                >
                  {char}
                </div>
              );
            }
            return (
              <div
                className="w-8 h-8 border-2 border-[#878a8c] text-2xl flex justify-center items-center font-bold uppercase"
                key={idx}
              >
                {char}
              </div>
            );
          })}
        </div>
        <p className="mt-2">
          <span className="uppercase font-bold">w</span> is in the word and in
          the correct spot.
        </p>
        <div className="flex gap-1 mt-2">
          {example2.map((char, idx) => {
            if (char === "i") {
              return (
                <div
                  className="w-8 h-8 border-2 border-present bg-present text-2xl flex justify-center items-center text-white font-bold uppercase"
                  key={idx}
                >
                  {char}
                </div>
              );
            }
            return (
              <div
                className="w-8 h-8 border-2 border-[#878a8c] text-2xl flex justify-center items-center font-bold uppercase"
                key={idx}
              >
                {char}
              </div>
            );
          })}
        </div>
        <p className="mt-2">
          <span className="uppercase font-bold">i</span> is in the word but in
          the wrong spot.
        </p>
        <div className="flex gap-1 mt-2">
          {example3.map((char, idx) => {
            if (char === "u") {
              return (
                <div
                  className="w-8 h-8 border-2 border-absent bg-absent text-2xl flex justify-center items-center text-white font-bold uppercase"
                  key={idx}
                >
                  {char}
                </div>
              );
            }
            return (
              <div
                className="w-8 h-8 border-2 border-[#878a8c] text-2xl flex justify-center items-center font-bold uppercase"
                key={idx}
              >
                {char}
              </div>
            );
          })}
        </div>
        <p className="mt-2">
          <span className="uppercase font-bold">u</span> is not in the word in
          any spot.
        </p>
      </article>
    </div>
  );
}

function GamePage() {
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

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
        const newGuesses = guesses;
        newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
        setGuesses(newGuesses);
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
          onClick={() => setIsGuideOpen(true)}
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
              />
            );
          })}
        </div>
        {isModelOpen && (
          <Modal
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
        />
        {isPopupOpen && <PopUp setIsPopupOpen={setIsPopupOpen} />}
        {isGuideOpen && <Guide setIsGuideOpen={setIsGuideOpen} />}
      </main>
    </>
  );
}

export default GamePage;
