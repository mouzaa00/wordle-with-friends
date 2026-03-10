import { CircleXIcon, Share2Icon } from "lucide-react";

export function GameOverModal({ creator, solution, setIsModelOpen, guess }) {
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
