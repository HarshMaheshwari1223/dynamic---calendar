"use client";

import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import { X, Trash2, StickyNote } from "lucide-react";
import { Note, NOTE_COLORS } from "@/lib/types";

interface MonthNotesModalProps {
  currentMonth: Date;
  notes: Note[];
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function MonthNotesModal({ currentMonth, notes, onDelete, onClose }: MonthNotesModalProps) {
  const prefix = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;

  const monthNotes = useMemo(() =>
    notes
      .filter(n => n.dateKey.startsWith(prefix) || n.dateKey.startsWith("range:"))
      .filter(n => {
        if (!n.dateKey.startsWith("range:")) return true;
        // for range notes, check if range overlaps this month
        const parts = n.dateKey.replace("range:", "").split(":");
        return parts.some(d => d.startsWith(prefix));
      })
      .sort((a, b) => a.dateKey.localeCompare(b.dateKey)),
    [notes, prefix]
  );

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, Note[]>();
    for (const note of monthNotes) {
      const key = note.dateKey;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(note);
    }
    return map;
  }, [monthNotes]);

  const formatDateLabel = (dateKey: string) => {
    if (dateKey.startsWith("range:")) {
      const parts = dateKey.replace("range:", "").split(":");
      if (parts.length === 2) return `${format(parseISO(parts[0]), "MMM d")} → ${format(parseISO(parts[1]), "MMM d")}`;
      return `From ${format(parseISO(parts[0]), "MMM d")}`;
    }
    try { return format(parseISO(dateKey), "EEEE, MMM d"); } catch { return dateKey; }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          animation: "fadeBackdrop 0.2s ease",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          background: "var(--paper, #fff)",
          borderRadius: 18,
          boxShadow: "0 24px 80px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.1)",
          width: "min(520px, 92vw)",
          maxHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          animation: "modalPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "18px 20px 14px",
          borderBottom: "1px solid var(--ink-100,#eeeae0)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(to bottom, rgba(26,158,220,0.04), transparent)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "rgba(26,158,220,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <StickyNote size={17} style={{ color: "#1a9edc" }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-900,#261e1a)", fontFamily: "'Playfair Display',serif" }}>
                {format(currentMonth, "MMMM yyyy")} Notes
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-400,#a48e76)", marginTop: 1 }}>
                {monthNotes.length} note{monthNotes.length !== 1 ? "s" : ""} this month
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-400,#a48e76)", padding: 6, borderRadius: 8, display: "flex", alignItems: "center", transition: "all 0.15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.06)"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "none"}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "14px 20px 20px", flex: 1 }}>
          {monthNotes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--ink-400,#a48e76)" }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>📝</div>
              <div style={{ fontSize: 13, fontStyle: "italic" }}>No notes for this month yet.</div>
              <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>Click a date on the calendar to add one.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {Array.from(grouped.entries()).map(([dateKey, dateNotes]) => (
                <div key={dateKey}>
                  {/* Date label */}
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "var(--ink-400,#a48e76)",
                    marginBottom: 6, display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span style={{ width: 20, height: 1, background: "var(--ink-100,#eeeae0)", display: "inline-block" }} />
                    {formatDateLabel(dateKey)}
                    <span style={{ flex: 1, height: 1, background: "var(--ink-100,#eeeae0)", display: "inline-block" }} />
                  </div>

                  {/* Notes for that date */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {dateNotes.map(note => {
                      const colors = NOTE_COLORS[note.color];
                      return (
                        <div
                          key={note.id}
                          className="group"
                          style={{
                            background: colors.bg,
                            border: `1px solid ${colors.border}`,
                            borderLeft: `3px solid ${colors.dot}`,
                            borderRadius: 8,
                            padding: "9px 36px 9px 12px",
                            position: "relative",
                            transition: "box-shadow 0.15s",
                          }}
                          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"}
                          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}
                        >
                          <p style={{ fontSize: 13, color: "var(--ink-700,#54443a)", lineHeight: 1.55, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {note.text}
                          </p>
                          <span style={{ fontSize: 10, color: "var(--ink-400,#a48e76)", marginTop: 4, display: "block" }}>
                            {format(new Date(note.createdAt), "h:mm a")}
                          </span>
                          <button
                            onClick={() => onDelete(note.id)}
                            style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", cursor: "pointer", color: "var(--ink-400,#a48e76)", padding: 4, borderRadius: 6, opacity: 0, transition: "opacity 0.15s" }}
                            className="group-hover:opacity-100"
                            title="Delete note"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
