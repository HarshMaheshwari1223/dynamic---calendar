"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useCalendarState } from "@/hooks/useCalendarState";
import SpiralBinding from "./SpiralBinding";
import HeroPanel from "./HeroPanel";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import RangeStatusBar from "./RangeStatusBar";
import HolidayLegend from "./HolidayLegend";
import MonthNotesModal from "./MonthNotesModal";
import { StickyNote, ChevronDown, ChevronUp, BookOpen } from "lucide-react";

export default function WallCalendar() {
  const {
    currentMonth, range, setRange, hoveredDate, setHoveredDate,
    notes, addNote, deleteNote, updateNote, getNotesForMonth, getRangeNoteKey,
    isFlipping, flipDirection, navigateMonth, jumpToMonth,
    isDark, toggleDark, activeNoteColor, setActiveNoteColor, isHydrated,
    activeHolidayImage, activeHolidayName, activeHolidayEmoji,
    handleHolidayClick, clearHolidayHighlight,
  } = useCalendarState();

  const [mobileNotesOpen, setMobileNotesOpen] = useState(false);
  const [showMonthNotes, setShowMonthNotes] = useState(false);

  const noteDates = useMemo(() => {
    const prefix = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;
    const result = new Set<string>();
    for (const note of notes) {
      if (note.dateKey.startsWith(prefix)) {
        result.add(note.dateKey);
      } else if (note.dateKey.startsWith("range:")) {
        // Expand range notes: mark each day in range that falls in this month
        const parts = note.dateKey.replace("range:", "").split(":");
        if (parts.length >= 1) {
          const start = new Date(parts[0] + "T12:00:00");
          const end = parts[1] ? new Date(parts[1] + "T12:00:00") : start;
          let cur = new Date(start);
          while (cur <= end) {
            const key = cur.toISOString().slice(0, 10);
            if (key.startsWith(prefix)) result.add(key);
            cur.setDate(cur.getDate() + 1);
          }
        }
      }
    }
    return result;
  }, [notes, currentMonth]);

  const monthNoteCount = useMemo(() => getNotesForMonth(currentMonth).length, [notes, currentMonth, getNotesForMonth]);

  const rangeNoteKey = getRangeNoteKey();

  if (!isHydrated) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:400, color:"var(--ink-400,#a48e76)", fontSize:14 }}>
        Loading calendar…
      </div>
    );
  }

  const heroPanel = (
    <HeroPanel
      currentMonth={currentMonth}
      onPrev={() => navigateMonth(-1)}
      onNext={() => navigateMonth(1)}
      onJumpTo={jumpToMonth}
      isDark={isDark}
      onToggleDark={toggleDark}
      isFlipping={isFlipping}
      flipDirection={flipDirection}
      activeHolidayImage={activeHolidayImage}
      activeHolidayName={activeHolidayName}
      activeHolidayEmoji={activeHolidayEmoji}
    />
  );

  const calendarGrid = (
    <CalendarGrid
      currentMonth={currentMonth}
      range={range}
      setRange={setRange}
      hoveredDate={hoveredDate}
      setHoveredDate={setHoveredDate}
      noteDates={noteDates}
      onHolidayClick={handleHolidayClick}
      onClearHoliday={clearHolidayHighlight}
    />
  );

  // "View all notes" button shown beneath the grid
  const viewNotesBtn = (
    <button
      onClick={() => setShowMonthNotes(true)}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        margin: "0 16px 10px",
        padding: "7px 14px",
        background: monthNoteCount > 0 ? "rgba(26,158,220,0.07)" : "transparent",
        border: monthNoteCount > 0 ? "1px solid rgba(26,158,220,0.22)" : "1px solid var(--ink-100,#eeeae0)",
        borderRadius: 20, cursor: "pointer",
        fontFamily: "'DM Sans',sans-serif",
        fontSize: 11, fontWeight: 500,
        color: monthNoteCount > 0 ? "#1a9edc" : "var(--ink-400,#a48e76)",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(26,158,220,0.12)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = monthNoteCount > 0 ? "rgba(26,158,220,0.07)" : "transparent"; }}
    >
      <BookOpen size={13} />
      {monthNoteCount > 0
        ? `View all notes this month (${monthNoteCount})`
        : "No notes this month"}
      {monthNoteCount > 0 && (
        <span style={{ background:"#1a9edc", color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:10, marginLeft:2 }}>
          {monthNoteCount}
        </span>
      )}
    </button>
  );

  return (
    <>
      <div style={{ perspective:"1400px" }}>
        <div
          className="relative"
          style={{
            boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
            borderRadius: 12,
            overflow: "hidden",
            animation: isFlipping
              ? (flipDirection === "right"
                  ? "calPageFlipRight 0.45s cubic-bezier(0.645,0.045,0.355,1.0) forwards"
                  : "calPageFlipLeft 0.45s cubic-bezier(0.645,0.045,0.355,1.0) forwards")
              : undefined,
            transformOrigin: flipDirection === "right" ? "left center" : "right center",
          }}
        >
          <SpiralBinding />

          <div className="paper-texture" style={{ background:"var(--paper,#ffffff)" }}>
            {/* DESKTOP */}
            <div className="hidden md:block">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 280px" }}>
                <div>
                  {heroPanel}
                  {calendarGrid}
                  {viewNotesBtn}
                  <RangeStatusBar range={range} onClear={() => setRange({ start:null, end:null })} />
                  <HolidayLegend currentMonth={currentMonth} onHolidayClick={handleHolidayClick} />
                </div>
                <NotesPanel
                  range={range} notes={notes} onAddNote={addNote} onDeleteNote={deleteNote}
                  onUpdateNote={updateNote} activeColor={activeNoteColor} onColorChange={setActiveNoteColor}
                  rangeNoteKey={rangeNoteKey}
                />
              </div>
            </div>

            {/* MOBILE */}
            <div className="block md:hidden">
              {heroPanel}
              {calendarGrid}
              {viewNotesBtn}
              <RangeStatusBar range={range} onClear={() => setRange({ start:null, end:null })} />
              <HolidayLegend currentMonth={currentMonth} onHolidayClick={handleHolidayClick} />

              <div style={{ borderTop:"1px solid var(--ink-100,#eeeae0)" }}>
                <button onClick={() => setMobileNotesOpen(p => !p)}
                  style={{ width:"100%", background:"none", border:"none", padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", color:"var(--ink-700,#54443a)" }}>
                  <div className="flex items-center gap-2">
                    <StickyNote size={14} style={{ color:"#1a9edc" }} />
                    <span style={{ fontSize:13, fontWeight:500 }}>
                      Notes {notes.length > 0 && <span style={{ background:"#1a9edc", color:"white", borderRadius:10, padding:"1px 6px", fontSize:10, marginLeft:4 }}>{notes.length}</span>}
                    </span>
                  </div>
                  {mobileNotesOpen ? <ChevronUp size={16} style={{ color:"#1a9edc" }} /> : <ChevronDown size={16} style={{ color:"#1a9edc" }} />}
                </button>
                {mobileNotesOpen && (
                  <div style={{ height:320 }}>
                    <NotesPanel range={range} notes={notes} onAddNote={addNote} onDeleteNote={deleteNote}
                      onUpdateNote={updateNote} activeColor={activeNoteColor} onColorChange={setActiveNoteColor}
                      rangeNoteKey={rangeNoteKey} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ background:"var(--ink-50,#f8f7f4)", borderTop:"1px solid var(--ink-100,#eeeae0)", padding:"6px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:10, color:"var(--ink-400,#a48e76)", letterSpacing:"0.06em" }}>
              Click dates to select · Click holiday to see festival image
            </span>
            <span style={{ fontSize:10, color:"var(--ink-400,#a48e76)", letterSpacing:"0.04em" }}>
              {format(new Date(), "EEEE, d MMMM yyyy")}
            </span>
          </div>
        </div>
      </div>

      {/* Month Notes Modal */}
      {showMonthNotes && (
        <MonthNotesModal
          currentMonth={currentMonth}
          notes={notes}
          onDelete={deleteNote}
          onClose={() => setShowMonthNotes(false)}
        />
      )}
    </>
  );
}
