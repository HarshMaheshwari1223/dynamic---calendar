"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface MiniMonthPickerProps {
  currentMonth: Date;
  onSelect: (month: Date) => void;
  onClose: () => void;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function MiniMonthPicker({ currentMonth, onSelect, onClose }: MiniMonthPickerProps) {
  const [step, setStep] = useState<"year" | "month">("year");
  const [selectedYear, setSelectedYear] = useState(currentMonth.getFullYear());
  const [yearPage, setYearPage] = useState(() => Math.floor(currentMonth.getFullYear() / 12));

  // Fix 1: Sync selectedYear when currentMonth prop changes
  useEffect(() => {
    setSelectedYear(currentMonth.getFullYear());
    setYearPage(Math.floor(currentMonth.getFullYear() / 12));
  }, [currentMonth]);

  const yearStart = yearPage * 12;
  const years = Array.from({ length: 12 }, (_, i) => yearStart + i);
  const nowYear = new Date().getFullYear();
  const nowMonth = new Date().getMonth();

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: 44,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        background: "var(--paper, #fff)",
        border: "1px solid var(--ink-100, #eeeae0)",
        borderRadius: 14,
        boxShadow: "0 16px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)",
        padding: "14px",
        width: 256,
      }}
    >
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <button
          onClick={() => step === "year" ? setYearPage(p => p - 1) : setStep("year")}
          style={{ background:"none", border:"none", cursor:"pointer", color:"#1a9edc" }}
        >
          <ChevronLeft size={15} />
        </button>

        <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
           {step === "month" && (
            <button
              onClick={() => setStep("year")}
              style={{ fontSize:13, fontWeight:700, color:"#1a9edc", background:"rgba(26,158,220,0.09)", border:"1px solid rgba(26,158,220,0.22)", borderRadius:20, padding:"2px 12px", cursor:"pointer" }}
            >
              {selectedYear} ▾
            </button>
          )}
          {step === "year" && (
            <span style={{ fontSize:12, fontWeight:600 }}>
              {yearStart}–{yearStart+11}
            </span>
          )}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:2 }}>
          {step === "year" && (
            <button onClick={() => setYearPage(p => p + 1)} style={{ background:"none", border:"none", color:"#1a9edc" }}>
              <ChevronRight size={15} />
            </button>
          )}
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#a48e76" }}>
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Year Grid */}
      {step === "year" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:4 }}>
          {years.map(yr => {
            // Fix 2: Changed isActive to use selectedYear instead of currentMonth.getFullYear()
            const isActive = yr === selectedYear; 
            const isNow = yr === nowYear;
            return (
              <button
                key={yr}
                onClick={() => { setSelectedYear(yr); setStep("month"); }}
                style={{
                  padding:"8px 4px", borderRadius:8,
                  border: isNow && !isActive ? "1.5px solid #1a9edc" : "1.5px solid transparent",
                  background: isActive ? "#1a9edc" : "transparent",
                  color: isActive ? "#fff" : isNow ? "#1a9edc" : "var(--ink-700,#54443a)",
                  fontSize:12, cursor:"pointer"
                }}
              >
                {yr}
              </button>
            );
          })}
        </div>
      )}

      {/* Month Grid */}
      {step === "month" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:4 }}>
          {MONTHS.map((abbr, i) => {
            const isActive = i === currentMonth.getMonth() && selectedYear === currentMonth.getFullYear();
            const isNow = i === nowMonth && selectedYear === nowYear;
            return (
              <button
                key={abbr}
                onClick={() => { onSelect(new Date(selectedYear, i, 1)); onClose(); }}
                style={{
                  padding:"8px 4px", borderRadius:8,
                  background: isActive ? "#1a9edc" : "transparent",
                  color: isActive ? "#fff" : "var(--ink-700,#54443a)",
                  fontSize:12, cursor:"pointer"
                }}
              >
                {abbr}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}