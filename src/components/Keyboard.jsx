import React from "react";

export default function Keyboard({ statuses, onKeyClick }) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  const getKeyColor = (key) => {
    const status = statuses[key];
    if (status === "correct") return "bg-[#6aaa64] text-white";
    if (status === "present") return "bg-[#c9b458] text-white";
    if (status === "absent") return "bg-[#787c7e] text-neutral-400";
    return "bg-neutral-800 text-white hover:bg-neutral-700";
  };

  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto my-6 px-2 w-full select-none">
      {rows.map((row, rIdx) => (
        <div key={rIdx} className="flex justify-center gap-1.5 w-full">
          {row.map((key) => {
            const isWide = key === "ENTER" || key === "BACKSPACE";
            return (
              <button
                key={key}
                onClick={() => onKeyClick(key)}
                className={`h-14 font-bold rounded flex items-center justify-center text-xs md:text-sm cursor-pointer transition-all uppercase ${getKeyColor(key)} ${
                  isWide ? "flex-1 max-w-[5rem]" : "w-10"
                }`}
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
