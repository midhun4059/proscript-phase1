import React from "react";

interface Props {
  data: { headers: string[]; rows: string[][] };
  onChange: (data: { headers: string[]; rows: string[][] }) => void;
}

const TableSectionEditor: React.FC<Props> = ({ data, onChange }) => {
  const updateHeader = (index: number, value: string) => {
    const headers = [...data.headers];
    headers[index] = value;
    onChange({ ...data, headers });
  };

  const updateCell = (r: number, c: number, value: string) => {
    const rows = data.rows.map((row) => [...row]);
    rows[r][c] = value;
    onChange({ ...data, rows });
  };

  const addRow = () => {
    const newRow = data.headers.map(() => "");
    onChange({ ...data, rows: [...data.rows, newRow] });
  };

  const removeRow = (rowIndex: number) => {
    onChange({ ...data, rows: data.rows.filter((_, i) => i !== rowIndex) });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-bold text-gray-700">Table Rows</h4>
        <button
          onClick={addRow}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        >
          + Add Row
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-gray-500 uppercase text-xs bg-gray-50">
              {data.headers.map((h, i) => (
                <th key={i} className="py-2 px-3 border border-gray-200">
                  <input
                    value={h}
                    onChange={(e) => updateHeader(i, e.target.value)}
                    placeholder={`Header ${i + 1}`}
                    className="w-full px-2 py-1 border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-gray-700 font-semibold"
                  />
                </th>
              ))}
              <th className="py-2 px-1 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.rows.map((row, r) => (
              <tr key={r} className="hover:bg-gray-50 transition-colors">
                {row.map((cell, c) => (
                  <td key={c} className="py-2 px-3 border border-gray-200">
                    <input
                      value={cell}
                      onChange={(e) => updateCell(r, c, e.target.value)}
                      placeholder={`Enter value`}
                      className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </td>
                ))}
                <td className="py-2 px-1">
                  <button
                    onClick={() => removeRow(r)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Remove row"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSectionEditor;
