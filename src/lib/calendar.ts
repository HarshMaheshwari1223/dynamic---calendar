import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isToday,
  isWeekend, isSameDay, isWithinInterval, isAfter, isBefore,
} from "date-fns";
import { CalendarDay, DateRange, getAllHolidaysForYear } from "./types";

export function buildCalendarGrid(date: Date): CalendarDay[] {
  const year = date.getFullYear();
  const holidays = getAllHolidaysForYear(year);
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((d) => {
    const key = format(d, "yyyy-MM-dd");
    const info = holidays[key];
    return {
      date: d,
      isCurrentMonth: isSameMonth(d, date),
      isToday: isToday(d),
      isWeekend: isWeekend(d),
      holiday: info?.name,
      holidayInfo: info,
    };
  });
}

export function getDayStatus(day: CalendarDay, range: DateRange, hoveredDate: Date | null) {
  const { start, end } = range;
  const isStart = start ? isSameDay(day.date, start) : false;
  const isEnd = end ? isSameDay(day.date, end) : false;
  let isInRange = false;
  if (start && end) isInRange = isWithinInterval(day.date, { start, end }) && !isStart && !isEnd;
  let isHoverRange = false;
  if (start && !end && hoveredDate && isAfter(hoveredDate, start)) {
    isHoverRange = isWithinInterval(day.date, { start, end: hoveredDate }) && !isSameDay(day.date, start);
  }
  return { isStart, isEnd, isInRange, isHoverRange };
}

export function formatDateKey(date: Date): string { return format(date, "yyyy-MM-dd"); }
export function formatDisplayDate(date: Date): string { return format(date, "MMM d, yyyy"); }
export function formatRangeDisplay(range: DateRange): string {
  if (!range.start) return "No dates selected";
  if (!range.end) return `From ${formatDisplayDate(range.start)}`;
  const days = Math.round((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return `${formatDisplayDate(range.start)} → ${formatDisplayDate(range.end)} · ${days} day${days !== 1 ? "s" : ""}`;
}

export function handleDateClick(date: Date, range: DateRange, setRange: (r: DateRange) => void) {
  const { start, end } = range;
  if (!start || (start && end)) { setRange({ start: date, end: null }); }
  else {
    if (isSameDay(date, start)) setRange({ start: null, end: null });
    else if (isBefore(date, start)) setRange({ start: date, end: start });
    else setRange({ start, end: date });
  }
}
