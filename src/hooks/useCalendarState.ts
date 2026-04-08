"use client";

import { useState, useEffect, useCallback } from "react";
import { DateRange, Note, NoteColor } from "@/lib/types";
import { formatDateKey } from "@/lib/calendar";

const STORAGE_KEY = "wall-calendar-notes-v2";
const RANGE_KEY = "wall-calendar-range-v2";

function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveNotes(notes: Note[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}
function loadRange(): DateRange {
  if (typeof window === "undefined") return { start: null, end: null };
  try {
    const raw = localStorage.getItem(RANGE_KEY);
    if (!raw) return { start: null, end: null };
    const parsed = JSON.parse(raw);
    return { start: parsed.start ? new Date(parsed.start) : null, end: parsed.end ? new Date(parsed.end) : null };
  } catch { return { start: null, end: null }; }
}

export function useCalendarState() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [range, setRangeState] = useState<DateRange>({ start: null, end: null });
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"left" | "right">("right");
  const [isDark, setIsDark] = useState(false);
  const [activeNoteColor, setActiveNoteColor] = useState<NoteColor>("azure");
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeHolidayImage, setActiveHolidayImage] = useState<string | null>(null);
  const [activeHolidayName, setActiveHolidayName] = useState<string | null>(null);
  const [activeHolidayEmoji, setActiveHolidayEmoji] = useState<string | null>(null);

  useEffect(() => {
    setNotes(loadNotes());
    setRangeState(loadRange());
    setIsHydrated(true);
  }, []);

  // Clear holiday highlight when month changes
  useEffect(() => {
    setActiveHolidayImage(null);
    setActiveHolidayName(null);
    setActiveHolidayEmoji(null);
  }, [currentMonth]);

  const setRange = useCallback((r: DateRange) => {
    setRangeState(r);
    if (typeof window !== "undefined") {
      localStorage.setItem(RANGE_KEY, JSON.stringify({ start: r.start?.toISOString() ?? null, end: r.end?.toISOString() ?? null }));
    }
  }, []);

  const navigateMonth = useCallback((direction: 1 | -1) => {
    if (isFlipping) return;
    setFlipDirection(direction === 1 ? "right" : "left");
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentMonth((prev) => {
        const next = new Date(prev);
        next.setMonth(next.getMonth() + direction);
        return next;
      });
      setIsFlipping(false);
    }, 400);
  }, [isFlipping]);

  const jumpToMonth = useCallback((month: Date) => {
    const diff = (month.getFullYear() - currentMonth.getFullYear()) * 12 + (month.getMonth() - currentMonth.getMonth());
    setFlipDirection(diff >= 0 ? "right" : "left");
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentMonth(new Date(month.getFullYear(), month.getMonth(), 1));
      setIsFlipping(false);
    }, 400);
  }, [currentMonth]);

  const addNote = useCallback((text: string, dateKey: string) => {
    if (!text.trim()) return;
    const note: Note = { id: `${Date.now()}-${Math.random()}`, text: text.trim(), dateKey, color: activeNoteColor, createdAt: Date.now() };
    setNotes((prev) => { const updated = [...prev, note]; saveNotes(updated); return updated; });
  }, [activeNoteColor]);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => { const updated = prev.filter((n) => n.id !== id); saveNotes(updated); return updated; });
  }, []);

  const updateNote = useCallback((id: string, text: string) => {
    setNotes((prev) => { const updated = prev.map((n) => (n.id === id ? { ...n, text } : n)); saveNotes(updated); return updated; });
  }, []);

  const getNotesForMonth = useCallback((month: Date) => {
    const prefix = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
    return notes.filter((n) => {
      if (n.dateKey.startsWith(prefix)) return true;
      if (n.dateKey.startsWith("range:")) {
        const parts = n.dateKey.replace("range:", "").split(":");
        return parts.some(d => d.startsWith(prefix));
      }
      return false;
    });
  }, [notes]);

  const getNotesForDateKey = useCallback((dateKey: string) => notes.filter((n) => n.dateKey === dateKey), [notes]);

  const getRangeNoteKey = useCallback(() => {
    if (!range.start) return null;
    return range.end ? `range:${formatDateKey(range.start)}:${formatDateKey(range.end)}` : `range:${formatDateKey(range.start)}`;
  }, [range]);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) document.documentElement.classList.add("theme-dark");
      else document.documentElement.classList.remove("theme-dark");
      return next;
    });
  }, []);

  const handleHolidayClick = useCallback((image: string, name: string, emoji: string) => {
    setActiveHolidayImage((prev) => prev === image ? null : image);
    setActiveHolidayName((prev) => prev === name ? null : name);
    setActiveHolidayEmoji((prev) => prev === emoji ? null : emoji);
  }, []);

  const clearHolidayHighlight = useCallback(() => {
    setActiveHolidayImage(null);
    setActiveHolidayName(null);
    setActiveHolidayEmoji(null);
  }, []);

  return {
    currentMonth, setCurrentMonth, range, setRange, hoveredDate, setHoveredDate,
    notes, addNote, deleteNote, updateNote, getNotesForMonth, getNotesForDateKey,
    getRangeNoteKey, isFlipping, flipDirection, navigateMonth, jumpToMonth,
    isDark, toggleDark, activeNoteColor, setActiveNoteColor, isHydrated,
    activeHolidayImage, activeHolidayName, activeHolidayEmoji, handleHolidayClick, clearHolidayHighlight,
  };
}
