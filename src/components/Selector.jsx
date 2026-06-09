import React, { useState } from "react";

export default function Selector({ currentLength, setLength }) {
  const options = [3, 4, 5, 6, 7, 8];
  return (
    <div className="flex flex-wrap justify-center gap-1.5 my-1 w-full max-w-sm mx-auto">
      {options.map((num) => (
        <button
          key={num}
          onClick={() => setLength(num)}
          className={`px-2.5 py-1 text-xs font-bold rounded-md border uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            currentLength === num
              ? "bg-[#6aaa64] border-[#6aaa64] text-white shadow-md scale-105"
              : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-500"
          }`}
        >
          {num}L
        </button>
      ))}
    </div>
  );
}
