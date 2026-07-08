import React from "react";

export default function WelcomeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl max-w-md w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-neutral-200 font-sans">
        {/* Header */}
        <div className="text-center pb-4 border-b border-neutral-700">
          <h2 className="text-2xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 uppercase">
            Welcome to Extreme Wordle
          </h2>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest font-bold">
            Onboarding Manual
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-4 my-5 text-sm leading-relaxed">
          <div>
            <h3 className="font-bold text-white text-base mb-1">
              🔥 What makes it "Extreme"?
            </h3>
            <p className="text-neutral-300">
              Unlike ordinary Wordle which traps you in a static 5-letter grid,
              <strong> Extreme Wordle</strong> lets you break boundaries. You
              can dynamically scale the row difficulty entirely on the fly.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white text-base mb-1">
              🎮 The Length Selectors (3L - 8L)
            </h3>
            <p className="text-neutral-300">
              Use the top selector controls to swap dimensions anytime:
            </p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs text-neutral-400 pl-1">
              <li>
                <span className="text-amber-400 font-bold">3L / 4L:</span>{" "}
                Rapid-fire, tactical skirmishes.
              </li>
              <li>
                <span className="text-amber-500 font-bold">5L:</span> The
                classic golden standard layout.
              </li>
              <li>
                <span className="text-red-500 font-bold">6L / 7L / 8L:</span>{" "}
                Brain-melting, high-tier vocabulary puzzles.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-base mb-1">
              💾 Smart Cross-Session Persistence
            </h3>
            <p className="text-neutral-300">
              Never fear losing progress! Every single length category is
              managed under an
              <strong> isolated state vault</strong>. If you leave a 7-letter
              game half-finished to go play a quick 3-letter game, your exact
              guesses, key statuses, and target word will be waiting for you
              when you click back.
            </p>
          </div>

          <div className="bg-neutral-900/50 p-3 border border-neutral-700/50 rounded-xl text-xs text-neutral-400">
            <span className="text-amber-500 font-bold">💡 Quick Hint:</span>{" "}
            Pressing{" "}
            <span className="text-white font-mono bg-neutral-700 px-1 py-0.5 rounded">
              Play Another
            </span>{" "}
            on a game-over screen resets <em>only</em> that specific category's
            puzzle state.
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-bold rounded-xl uppercase tracking-wider text-xs transition-all shadow-lg active:scale-[0.98] cursor-pointer"
        >
          Let's Play
        </button>
      </div>
    </div>
  );
}
