import { X } from "lucide-react";

export function HowToPlayModal({ setIsHowToPlayModalOpen }) {
  const example1 = ["w", "e", "a", "r", "y"];
  const example2 = ["p", "i", "l", "l", "s"];
  const example3 = ["v", "a", "g", "u", "e"];

  return (
    <div className="z-10 p-9 inset-0 overflow-y-auto absolute top-14 bg-white border border-gray-300 shadow-2xl rounded-lg h-fit sm:max-w-lg sm:mx-auto">
      <button
        type="button"
        className="absolute right-4 top-4"
        onClick={() => setIsHowToPlayModalOpen(false)}
      >
        <X className="size-8" />
      </button>
      <article className="p-4">
        <h2 className="font-bold text-3xl mt-7 mb-1">How To Play</h2>
        <p className="text-xl">Guess the wordle in 6 tries.</p>
        <ul className="my-4 pl-5 text-base list-disc">
          <li>Each guess must be a valid 5-letter word.</li>
          <li>
            The color of the tiles will change to show how close your guess was
            to the word.
          </li>
        </ul>
        <p className="font-semibold text-xl mb-1 mt-4">Examples</p>
        <div className="flex gap-1 mt-3">
          {example1.map((char, idx) => (
            <div
              className={`w-8 h-8 border-2 border-[#878a8c] text-2xl flex justify-center items-center font-bold uppercase ${char === "w" ? "bg-correct text-white" : ""}`}
              key={idx}
            >
              {char}
            </div>
          ))}
        </div>
        <p className="mt-1">
          <span className="uppercase font-bold">w</span> is in the word and in
          the correct spot.
        </p>
        <div className="flex gap-1 mt-3">
          {example2.map((char, idx) => (
            <div
              className={`w-8 h-8 border-2 border-[#878a8c] text-2xl flex justify-center items-center font-bold uppercase ${char === "i" ? "bg-present text-white" : ""}`}
              key={idx}
            >
              {char}
            </div>
          ))}
        </div>
        <p className="mt-1">
          <span className="uppercase font-bold">i</span> is in the word but in
          the wrong spot.
        </p>
        <div className="flex gap-1 mt-3">
          {example3.map((char, idx) => (
            <div
              className={`w-8 h-8 border-2 border-[#878a8c] text-2xl flex justify-center items-center font-bold uppercase ${char === "u" ? "bg-absent text-white" : ""}`}
              key={idx}
            >
              {char}
            </div>
          ))}
        </div>
        <p className="mt-1">
          <span className="uppercase font-bold">u</span> is not in the word in
          any spot.
        </p>
      </article>
    </div>
  );
}
