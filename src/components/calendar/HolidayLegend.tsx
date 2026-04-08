"use client";

import { getAllHolidaysForYear } from "@/lib/types";
import { format, startOfMonth, endOfMonth } from "date-fns";

interface HolidayLegendProps {
  currentMonth: Date;
  onHolidayClick: (image: string, name: string, emoji: string) => void;
}

export default function HolidayLegend({ currentMonth, onHolidayClick }: HolidayLegendProps) {
  const year = currentMonth.getFullYear();
  const holidays = getAllHolidaysForYear(year);
  const prefix = format(currentMonth, "yyyy-MM");

  const monthHolidays = Object.entries(holidays).filter(([key]) => key.startsWith(prefix));
  if (monthHolidays.length === 0) return null;

  return (
    <div style={{ padding: "8px 16px", borderTop: "1px solid var(--ink-100, #eeeae0)", display: "flex", flexWrap: "wrap", gap: "4px 10px" }}>
      {monthHolidays.map(([key, info]) => {
        const date = new Date(key + "T12:00:00");
        return (
          <button
            key={key}
            onClick={() => info.image && onHolidayClick(info.image, info.name, info.emoji)}
            title={info.image ? `Click to see ${info.name} image` : info.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              cursor: info.image ? "pointer" : "default",
              padding: "2px 6px",
              borderRadius: 10,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { if (info.image) (e.currentTarget as HTMLButtonElement).style.background = "rgba(232,93,74,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
          >
            <span style={{ fontSize: 10 }}>{info.emoji}</span>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#e85d4a", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: "var(--ink-400, #a48e76)", whiteSpace: "nowrap" }}>
              {format(date, "d")} – {info.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
