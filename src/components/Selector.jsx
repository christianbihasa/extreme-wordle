import React from "react";

export default function Selector({ currentLength, setLength }) {
  const options = [3, 4, 5, 6, 7, 8];
  return (
    <div className="flex flex-wrap justify-center gap-2 my-6">
      {options.map((num) => (
        <button
          key={num}
          onClick={() => setLength(num)}
          className={`px-4 py-2 text-sm font-bold rounded-lg border uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            currentLength === num
              ? "bg-[#6aaa64] border-[#6aaa64] text-white shadow-lg scale-105"
              : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-500"
          }`}
        >
          {num} Letters
        </button>
      ))}
    </div>
  );
}
