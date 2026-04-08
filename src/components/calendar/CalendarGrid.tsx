"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { CalendarDay, DateRange } from "@/lib/types";
import { buildCalendarGrid, getDayStatus, handleDateClick } from "@/lib/calendar";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
  currentMonth: Date;
  range: DateRange;
  setRange: (r: DateRange) => void;
  hoveredDate: Date | null;
  setHoveredDate: (d: Date | null) => void;
  noteDates: Set<string>;
  onHolidayClick: (image: string, name: string, emoji: string) => void;
  onClearHoliday: () => void;
}

export default function CalendarGrid({
  currentMonth, range, setRange, hoveredDate, setHoveredDate, noteDates, onHolidayClick, onClearHoliday,
}: CalendarGridProps) {
  const days = useMemo(() => buildCalendarGrid(currentMonth), [currentMonth]);

  return (
    <div className="px-4 pb-4 pt-2 select-none">
      <div className="grid mb-1" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center py-1" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: d === "Sat" || d === "Sun" ? "#1a9edc" : "var(--ink-400, #a48e76)", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase" }}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "2px 0" }}>
        {days.map((day, i) => (
          <DayCell
            key={i}
            day={day}
            range={range}
            setRange={setRange}
            hoveredDate={hoveredDate}
            setHoveredDate={setHoveredDate}
            hasNote={noteDates.has(format(day.date, "yyyy-MM-dd"))}
            onHolidayClick={onHolidayClick}
            onClearHoliday={onClearHoliday}
          />
        ))}
      </div>
    </div>
  );
}

interface DayCellProps {
  day: CalendarDay;
  range: DateRange;
  setRange: (r: DateRange) => void;
  hoveredDate: Date | null;
  setHoveredDate: (d: Date | null) => void;
  hasNote: boolean;
  onHolidayClick: (image: string, name: string, emoji: string) => void;
  onClearHoliday: () => void;
}

function DayCell({ day, range, setRange, hoveredDate, setHoveredDate, hasNote, onHolidayClick, onClearHoliday }: DayCellProps) {
  const { isStart, isEnd, isInRange, isHoverRange } = getDayStatus(day, range, hoveredDate);
  const isSelected = isStart || isEnd;
  const isRange = isInRange || isHoverRange;
  const isHoliday = !!day.holidayInfo;

  const handleClick = () => {
    if (!day.isCurrentMonth) return;
    if (day.holidayInfo?.image) {
      onHolidayClick(day.holidayInfo.image, day.holidayInfo.name, day.holidayInfo.emoji);
    } else {
      onClearHoliday();
    }
    handleDateClick(day.date, range, setRange);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => { if (day.isCurrentMonth) setHoveredDate(day.date); }}
      onMouseLeave={() => setHoveredDate(null)}
      title={day.holiday ?? undefined}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 38,
        fontSize: 13,
        fontWeight: isSelected ? 600 : 400,
        fontFamily: "'DM Sans', sans-serif",
        color: isSelected
          ? "#fff"
          : isRange ? "#0a6fa8"
          : day.isToday ? "#1a9edc"
          : isHoliday && day.isCurrentMonth ? "#e85d4a"
          : day.isWeekend && day.isCurrentMonth ? "#1a9edc"
          : "var(--ink-700, #54443a)",
        background: isSelected
          ? "#1a9edc"
          : isHoverRange ? "rgba(26,158,220,0.12)"
          : isInRange ? "rgba(26,158,220,0.1)"
          : undefined,
        position: "relative",
        cursor: day.isCurrentMonth ? "pointer" : "default",
        transition: "all 0.15s ease",
        borderRadius: isSelected ? 8 : 6,
        opacity: !day.isCurrentMonth ? 0.3 : 1,
      }}
    >
      {/* Holiday glow background */}
      {isHoliday && day.isCurrentMonth && !isSelected && (
        <div style={{
          position: "absolute",
          inset: 1,
          borderRadius: 6,
          background: "rgba(232,93,74,0.07)",
          border: "1px solid rgba(232,93,74,0.18)",
          pointerEvents: "none",
          animation: "pulseHoliday 3s ease-in-out infinite",
        }} />
      )}

      {/* Holiday emoji */}
      {isHoliday && day.isCurrentMonth && (
        <span style={{
          position: "absolute",
          top: 1,
          right: 2,
          fontSize: 8,
          lineHeight: 1,
          pointerEvents: "none",
          zIndex: 2,
        }}>
          {day.holidayInfo!.emoji}
        </span>
      )}

      <span style={{ lineHeight: 1, position: "relative", zIndex: 1, fontSize: isHoliday && day.isCurrentMonth ? 12 : 13, marginTop: isHoliday && day.isCurrentMonth ? 4 : 0 }}>
        {format(day.date, "d")}
      </span>

      {/* Note dot */}
      {hasNote && day.isCurrentMonth && !isSelected && (
        <span style={{
          position: "absolute",
          bottom: 3,
          left: "50%",
          transform: "translateX(-50%)",
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#1a9edc",
          opacity: 0.8,
          boxShadow: "0 0 4px rgba(26,158,220,0.5)",
        }} />
      )}

      {/* Holiday dot */}
      {isHoliday && day.isCurrentMonth && !isSelected && !hasNote && (
        <span style={{
          position: "absolute",
          bottom: 3,
          left: "50%",
          transform: "translateX(-50%)",
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#e85d4a",
          opacity: 0.85,
        }} />
      )}

      {/* Note + holiday dual dots */}
      {isHoliday && hasNote && day.isCurrentMonth && !isSelected && (
        <>
          <span style={{ position: "absolute", bottom: 3, left: "calc(50% - 5px)", width: 4, height: 4, borderRadius: "50%", background: "#1a9edc", opacity: 0.8 }} />
          <span style={{ position: "absolute", bottom: 3, left: "calc(50% + 1px)", width: 4, height: 4, borderRadius: "50%", background: "#e85d4a", opacity: 0.85 }} />
        </>
      )}

      {/* Today ring */}
      {day.isToday && !isSelected && (
        <span style={{ position: "absolute", inset: 2, border: "1.5px solid #1a9edc", borderRadius: 6, opacity: 0.6, pointerEvents: "none" }} />
      )}
    </div>
  );
}
