import React, { useRef, useEffect } from "react";

interface Props {
  content: string;
  onChange: (content: string) => void;
}

const PRESET_COLORS = [
  "#000000",
  "#dc2626",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#7c3aed",
];

const ParagraphEditor: React.FC<Props> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || "";
    }
  }, [content]);

  const exec = (command: string, value?: string) => {
    // Using execCommand for simple inline formatting
    document.execCommand(command, false, value);
    // push updated HTML back to parent
    if (editorRef.current) onChange(editorRef.current.innerHTML);
    // focus back
    editorRef.current?.focus();
  };

  const applyColor = (color: string) => exec("foreColor", color);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <button
          onClick={() => exec("bold")}
          className="px-3 py-1 border rounded-md text-sm font-bold"
        >
          B
        </button>
        <button
          onClick={() => exec("underline")}
          className="px-3 py-1 border rounded-md text-sm font-bold"
        >
          U
        </button>
        <button
          onClick={() => exec("italic")}
          className="px-3 py-1 border rounded-md text-sm font-bold"
        >
          I
        </button>

        <div className="flex items-center gap-1 ml-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => applyColor(c)}
              title={c}
              className="w-6 h-6 rounded border"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <div>
        <div
          className="border border-gray-300 rounded-md p-2 min-h-[150px] bg-white"
          contentEditable
          ref={editorRef as any}
          onInput={() => {
            if (editorRef.current) onChange(editorRef.current.innerHTML);
          }}
          suppressContentEditableWarning={true}
        />
        <p className="text-xs text-gray-400 mt-1">
          Select text and click formatting buttons to apply styles directly in
          the editor.
        </p>
      </div>
    </div>
  );
};

export default ParagraphEditor;
