import React, { useState } from "react";
import { SectionFormat, CustomSection } from "../types";

interface Props {
  onAddSection: (section: CustomSection) => void;
}

const CustomSectionBuilder: React.FC<Props> = ({ onAddSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState<SectionFormat>(SectionFormat.BULLET);
  const [bulletColor, setBulletColor] = useState<string>("#111827");
  const [tableCols, setTableCols] = useState<number>(2);
  const [tableRows, setTableRows] = useState<number>(2);
  const [tableHeaders, setTableHeaders] = useState<string[]>(["", ""]);

  const handleCreate = () => {
    if (!title.trim()) return;
    let content: any = "";
    if (format === SectionFormat.PARAGRAPH) content = "";
    else if (format === SectionFormat.BULLET)
      content = { items: [], color: bulletColor };
    else if (format === SectionFormat.TABLE) {
      const headers = tableHeaders.slice(0, tableCols);
      const rows = Array.from({ length: tableRows }).map(() =>
        headers.map(() => ""),
      );
      content = { headers, rows };
    }

    const newSection: CustomSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      format,
      content,
    };

    onAddSection(newSection);
    setTitle("");
    setIsOpen(false);
  };

  return (
    <div className="mt-6 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold uppercase text-sm tracking-wider transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add New Section
        </button>
      ) : (
        <div className="w-full max-w-md space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-700">Configure New Section</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-red-500"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div>
            <label className="block text-left text-xs font-bold text-gray-500 uppercase mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Clinical Notes, Vital Signs"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-left text-xs font-bold text-gray-500 uppercase mb-1">
              Format Type
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as SectionFormat)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value={SectionFormat.BULLET}>Bullet Points</option>
              <option value={SectionFormat.PARAGRAPH}>Paragraph Text</option>
              <option value={SectionFormat.TABLE}>Table (3 Columns)</option>
            </select>
          </div>
          {format === SectionFormat.BULLET && (
            <div>
              <label className="block text-left text-xs font-bold text-gray-500 uppercase mb-1">
                Bullet Text Color
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={bulletColor}
                  onChange={(e) => setBulletColor(e.target.value)}
                />
                <span className="text-sm text-gray-500">Preview</span>
              </div>
            </div>
          )}

          {format === SectionFormat.TABLE && (
            <div className="space-y-2">
              <label className="block text-left text-xs font-bold text-gray-500 uppercase mb-1">
                Columns
              </label>
              <input
                type="number"
                min={1}
                max={6}
                value={tableCols}
                onChange={(e) => {
                  const v = Math.max(
                    1,
                    Math.min(6, Number(e.target.value) || 1),
                  );
                  setTableCols(v);
                  setTableHeaders((h) => {
                    const copy = [...h];
                    while (copy.length < v) copy.push("");
                    return copy.slice(0, v);
                  });
                }}
                className="w-24 px-2 py-1 border rounded-md"
              />

              <label className="block text-left text-xs font-bold text-gray-500 uppercase mb-1">
                Rows
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={tableRows}
                onChange={(e) =>
                  setTableRows(
                    Math.max(1, Math.min(20, Number(e.target.value) || 1)),
                  )
                }
                className="w-24 px-2 py-1 border rounded-md"
              />

              <div>
                <label className="block text-left text-xs font-bold text-gray-500 uppercase mb-1">
                  Table Headers
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: tableCols }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      value={tableHeaders[i] || ""}
                      onChange={(e) =>
                        setTableHeaders((h) => {
                          const copy = [...h];
                          copy[i] = e.target.value;
                          return copy;
                        })
                      }
                      placeholder={`Header ${i + 1}`}
                      className="px-2 py-1 border rounded-md"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleCreate}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition-colors"
          >
            Create Section
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomSectionBuilder;
