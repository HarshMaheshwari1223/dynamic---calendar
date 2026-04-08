"use client";

import { X, Calendar } from "lucide-react";
import { DateRange } from "@/lib/types";
import { formatRangeDisplay } from "@/lib/calendar";

interface RangeStatusBarProps {
  range: DateRange;
  onClear: () => void;
}

export default function RangeStatusBar({ range, onClear }: RangeStatusBarProps) {
  if (!range.start) return null;

  return (
    <div
      style={{
        padding: "8px 16px",
        background: "rgba(26,158,220,0.06)",
        borderTop: "1px solid rgba(26,158,220,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
        <Calendar size={12} style={{ color: "#1a9edc", flexShrink: 0 }} />
        <span
          style={{
            fontSize: 11,
            color: "#1a9edc",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {formatRangeDisplay(range)}
        </span>
      </div>
      <button
        onClick={onClear}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#1a9edc",
          opacity: 0.6,
          padding: 2,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          borderRadius: 4,
          transition: "opacity 0.15s",
        }}
        title="Clear selection"
      >
        <X size={12} />
      </button>
    </div>
  );
}
