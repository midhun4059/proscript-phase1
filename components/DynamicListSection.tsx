import React, { useState } from "react";

interface Props {
  title: string;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  isRed?: boolean;
  isPrint?: boolean;
  placeholder?: string;
}

const DynamicListSection: React.FC<Props & { textColor?: string }> = ({
  title,
  items,
  onAdd,
  onRemove,
  isRed = false,
  isPrint = false,
  placeholder = "Add entry...",
  textColor,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  if (isPrint) {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-md font-bold text-blue-900 border-b pb-0.5 mb-2">
          {title}
        </h3>
        <ul className="list-disc list-inside space-y-1">
          {items.map((item, idx) => (
            <li
              key={idx}
              className={`text-sm ${isRed ? "font-bold text-red-700" : "text-gray-800"}`}
              style={{ color: isRed ? "#dc2626" : textColor || undefined }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">
        {title}
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-sm ${isRed ? "bg-red-50 border-red-100" : "bg-gray-50"}`}
            style={{
              color: isRed ? "#dc2626" : textColor || undefined,
              fontWeight: isRed ? 700 : undefined,
            }}
          >
            <span
              style={{
                color: isRed ? "#dc2626" : textColor || undefined,
                fontWeight: isRed ? 700 : undefined,
              }}
            >
              {item}
            </span>
            <button
              onClick={() => onRemove(idx)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-gray-400 italic">No items added yet.</p>
        )}
      </div>
    </div>
  );
};

export default DynamicListSection;
