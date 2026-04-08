"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2, Plus, Palette } from "lucide-react";
import { Note, NoteColor, NOTE_COLORS } from "@/lib/types";
import { DateRange } from "@/lib/types";
import { formatRangeDisplay, formatDateKey } from "@/lib/calendar";
import clsx from "clsx";




interface NotesPanelProps {
  range: DateRange;
  notes: Note[];
  onAddNote: (text: string, dateKey: string) => void;
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, text: string) => void;
  activeColor: NoteColor;
  onColorChange: (c: NoteColor) => void;
  rangeNoteKey: string | null;
}

export default function NotesPanel({
  range,
  notes,
  onAddNote,
  onDeleteNote,
  onUpdateNote,
  activeColor,
  onColorChange,
  rangeNoteKey,
}: NotesPanelProps) {
  const [draft, setDraft] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const rangeDisplay = formatRangeDisplay(range);
  const hasRange = !!range.start;
  const currentNoteKey = rangeNoteKey ?? (range.start ? formatDateKey(range.start) : "general");

  const relevantNotes = notes.filter((n) => {
    if (!range.start) return n.dateKey === "general";
    if (rangeNoteKey) return n.dateKey === rangeNoteKey;
    return n.dateKey === formatDateKey(range.start);
  });



  useEffect(() => {
  if (!range.start) {
    setDraft("");
    return;
  }

  const existing = notes.find(
    (n) => n.dateKey === (rangeNoteKey ?? formatDateKey(range.start!))
  );

  if (existing) {
    setDraft(existing.text);
  } else {
    setDraft("");
  }
}, [range.start, notes, rangeNoteKey]);


  const handleAdd = () => {
    if (!draft.trim()) return;
    onAddNote(draft.trim(), currentNoteKey);
    setDraft("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleAdd();
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) onUpdateNote(id, editText.trim());
    setEditingId(null);
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "var(--paper, #fff)",
        borderLeft: "1px solid var(--ink-100, #eeeae0)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 pt-4 pb-3"
        style={{ borderBottom: "1px solid var(--ink-100, #eeeae0)" }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            fontWeight: 600,
            textTransform: "uppercase",
            color: "var(--ink-400, #a48e76)",
            marginBottom: 4,
          }}
        >
          Notes
        </div>

        {hasRange ? (
          <div
            style={{
              fontSize: 12,
              color: "#1a9edc",
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            {rangeDisplay}
          </div>
        ) : (
          <div
            style={{
              fontSize: 12,
              color: "var(--ink-400, #a48e76)",
              fontStyle: "italic",
            }}
          >
            Select dates to attach notes
          </div>
        )}
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ minHeight: 0 }}>
        {relevantNotes.length === 0 && (
          <div
            className="flex flex-col items-center justify-center h-full py-8"
            style={{ color: "var(--ink-400, #a48e76)", textAlign: "center" }}
          >
            <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>📝</div>
            <div style={{ fontSize: 12, fontStyle: "italic", opacity: 0.7 }}>
              No notes yet.
              <br />
              Add one below.
            </div>
          </div>
        )}

        {relevantNotes.map((note) => {
          const colors = NOTE_COLORS[note.color];
          return (
            <div
              key={note.id}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderLeft: `3px solid ${colors.dot}`,
                borderRadius: 8,
                padding: "8px 10px",
                position: "relative",
                animation: "fadeIn 0.25s ease-out",
              }}
              className="group"
            >
              {editingId === note.id ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => saveEdit(note.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      saveEdit(note.id);
                    }
                  }}
                  autoFocus
                  rows={3}
                  className="notes-textarea"
                  style={{
                    fontSize: 12,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    resize: "none",
                    width: "100%",
                    fontFamily: "'DM Sans', sans-serif",
                    color: "var(--ink-700, #54443a)",
                  }}
                />
              ) : (
                <p
                  onClick={() => startEdit(note)}
                  style={{
                    fontSize: 12,
                    color: "var(--ink-700, #54443a)",
                    lineHeight: 1.5,
                    cursor: "text",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    paddingRight: 20,
                  }}
                >
                  {note.text}
                </p>
              )}

              <button
                onClick={() => onDeleteNote(note.id)}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--ink-400, #a48e76)",
                  padding: 2,
                  opacity: 0,
                  transition: "opacity 0.15s",
                  borderRadius: 4,
                }}
                className="group-hover:opacity-100"
                title="Delete note"
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Input area */}
      <div
        className="px-4 pb-4 pt-3"
        style={{ borderTop: "1px solid var(--ink-100, #eeeae0)" }}
      >
        {/* Color selector */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setShowColorPicker((p) => !p)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink-400, #a48e76)",
              padding: 2,
              display: "flex",
              alignItems: "center",
            }}
            title="Pick note color"
          >
            <Palette size={13} />
          </button>

          {showColorPicker &&
            (Object.keys(NOTE_COLORS) as NoteColor[]).map((c) => (
              <button
                key={c}
                onClick={() => {
                  onColorChange(c);
                  setShowColorPicker(false);
                }}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: NOTE_COLORS[c].dot,
                  border: activeColor === c ? "2px solid var(--ink-700)" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "transform 0.15s",
                  transform: activeColor === c ? "scale(1.3)" : "scale(1)",
                }}
                title={c}
              />
            ))}

          {!showColorPicker && (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: NOTE_COLORS[activeColor].dot,
                marginLeft: 2,
              }}
            />
          )}
        </div>

        {/* Textarea */}
        <div
          className="notes-lines"
          style={{
            background: "var(--cream, #f9f6f0)",
            borderRadius: 8,
            padding: "6px 10px",
            minHeight: 72,
            position: "relative",
          }}
        >
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasRange ? "Add a note for this selection…" : "General note…"}
            rows={3}
            className="notes-textarea"
            style={{
              fontSize: 12,
              lineHeight: "24px",
              display: "block",
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <span
            style={{
              fontSize: 10,
              color: "var(--ink-400, #a48e76)",
              opacity: 0.7,
            }}
          >
            ⌘ + Enter to save
          </span>
          <button
            onClick={handleAdd}
            disabled={!draft.trim()}
            style={{
              background: draft.trim() ? "#1a9edc" : "var(--ink-100, #eeeae0)",
              color: draft.trim() ? "white" : "var(--ink-400, #a48e76)",
              border: "none",
              borderRadius: 6,
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 500,
              cursor: draft.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: "all 0.15s",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Plus size={12} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
