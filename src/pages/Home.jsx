import { useState } from "react";
import { WORDS } from "../utils/words";
import { Header } from "../components/ui/Header";
import { encryptGameData } from "../utils/encryption";

const WORD_LENGTH = 5;

function HomePage() {
  const [word, setWord] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isNext, setIsNext] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  function handleCreateLink() {
    if (!isNext) {
      if (word.length !== WORD_LENGTH) {
        setError("The word should be 5 letters long");
        return;
      }
      if (!WORDS.includes(word)) {
        setError("Not in word list");
        return;
      }
      setError("");
      setIsNext(true);
      return;
    }
    const token = encryptGameData(word, name);
    const baseUrl = window.location.href;
    navigator.clipboard.writeText(`${baseUrl}game?token=${token}`);
    setIsCopied(true);
  }

  return (
    <>
      <Header />
      <h2 className="text-lg text-center mt-5 font-medium">
        Let your friends solve your{" "}
        <a
          href="https://www.nytimes.com/games/wordle/index.html"
          target="_blank"
          className="underline hover:text-gray-600"
        >
          Wordle!
        </a>
      </h2>
      <p className="mt-2 text-center text-sm">
        Enter a 5 letters word to get started.
      </p>
      <div className="mt-6 flex flex-col items-center">
        <input
          className="shadow appearance-none border uppercase rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-80 sm:w-96"
          type="text"
          placeholder="Enter your word here"
          onChange={(e) => {
            console.log(e.key);
            if (e.target.value.length > WORD_LENGTH) return;
            setWord(e.target.value.toLowerCase());
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateLink();
            }
          }}
          disabled={isNext}
          value={word}
          autoFocus
          required
        />
        {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
        {isNext && (
          <input
            className="mt-3 shadow appearance-none border capitalize rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-80 sm:w-96"
            type="text"
            placeholder="What's your name?"
            disabled={isCopied}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateLink();
              }
            }}
            value={name}
            autoFocus
            required
          />
        )}
        <button
          onClick={handleCreateLink}
          className={`py-2 mt-3 w-80 sm:w-96 ${
            isCopied ? "bg-green-600" : "bg-black"
          } text-white rounded font-bold`}
          disabled={isNext ? !name : !word}
        >
          {isCopied ? "Copied!" : isNext ? "Create link" : "Next"}
        </button>
      </div>
      {isCopied && (
        <p className="mt-6 max-w-96 mx-auto text-center text-sm">
          A shareable link has been created and copied. Send it to your friends!
        </p>
      )}
    </>
  );
}

export default HomePage;
