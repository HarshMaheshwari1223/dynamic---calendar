"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Moon, Sun, Calendar } from "lucide-react";
import { MONTH_IMAGES } from "@/lib/types";
import MiniMonthPicker from "./MiniMonthPicker";

interface HeroPanelProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
  onJumpTo: (month: Date) => void;
  isDark: boolean;
  onToggleDark: () => void;
  isFlipping: boolean;
  flipDirection: "left" | "right";
  activeHolidayImage: string | null;
  activeHolidayName: string | null;
  activeHolidayEmoji: string | null;
}

export default function HeroPanel({
  currentMonth, onPrev, onNext, onJumpTo, isDark, onToggleDark,
  isFlipping, flipDirection, activeHolidayImage, activeHolidayName, activeHolidayEmoji,
}: HeroPanelProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [prevImg, setPrevImg] = useState<string | null>(null);
  const [curImg, setCurImg] = useState<string>("");
  const [kenBurns, setKenBurns] = useState(0);
  const kbTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const monthIndex = currentMonth.getMonth();
  const monthImg = MONTH_IMAGES[monthIndex];
  const displayImage = activeHolidayImage || monthImg.url;
  const displayAlt = activeHolidayName ? `${activeHolidayName} festival` : monthImg.alt;

  // Ken Burns cycle
  useEffect(() => {
    setKenBurns(0);
    if (kbTimer.current) clearInterval(kbTimer.current);
    kbTimer.current = setInterval(() => {
      setKenBurns((k) => (k + 1) % 4);
    }, 7000);
    return () => { if (kbTimer.current) clearInterval(kbTimer.current); };
  }, [displayImage]);


  

  // Cross-fade when image changes
  useEffect(() => {
    if (displayImage !== curImg) {
      setPrevImg(curImg || null);
      setCurImg(displayImage);
      setImgLoaded(false);
    }
  }, [displayImage]);

  const kenBurnsStyles = [
    { transform: "scale(1.08) translate(0%, 0%)" },
    { transform: "scale(1.1) translate(-2%, -1%)" },
    { transform: "scale(1.07) translate(1%, -2%)" },
    { transform: "scale(1.09) translate(-1%, 1%)" },
  ];

  return (
    <div className="relative overflow-hidden" style={{ borderRadius: "0" }}>
      {/* Image container with page-flip and Ken Burns */}
      <div
        className="relative w-full"
        style={{
          height: "clamp(200px, 34vw, 300px)",
          overflow: "hidden",
          perspective: "1200px",
        }}
      >
        {/* Page flip overlay - left half curls back */}
        {isFlipping && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 30,
              pointerEvents: "none",
              animation: flipDirection === "right"
                ? "pageFlipRight 0.55s cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards"
                : "pageFlipLeft 0.55s cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards",
            }}
          >
            {/* Flip shadow */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(0,0,0,0.18) 0%, transparent 60%)",
              animation: "flipShadow 0.55s ease forwards",
            }} />
          </div>
        )}

        {/* Previous image (fades out) */}
        {prevImg && (
          <img
            src={prevImg}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: imgLoaded ? 0 : 1,
              transition: "opacity 0.7s ease",
              filter: isDark ? "brightness(0.65) saturate(0.75)" : "brightness(0.82) saturate(1.1)",
            }}
          />
        )}

        {/* Current image with Ken Burns */}
        <img
          key={curImg}
          src={curImg}
          alt={displayAlt}
          onLoad={() => setImgLoaded(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 0.8s ease",
            filter: isDark ? "brightness(0.65) saturate(0.75)" : "brightness(0.82) saturate(1.1)",
            ...kenBurnsStyles[kenBurns],
            transitionProperty: "transform, opacity, filter",
            transitionDuration: "7000ms, 0.8s, 0.4s",
            transitionTimingFunction: "ease-in-out, ease, ease",
          }}
        />

        {/* Holiday name overlay */}
        {activeHolidayName && (
          <div style={{
            position: "absolute",
            top: 14,
            left: 14,
            zIndex: 15,
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: 20,
            padding: "5px 14px",
            border: "1px solid rgba(255,255,255,0.35)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            animation: "fadeSlideIn 0.5s ease",
          }}>
            <span style={{ fontSize: 16 }}>{activeHolidayEmoji ?? "🎉"}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", letterSpacing: "0.04em", fontFamily: "'DM Sans', sans-serif", textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>{activeHolidayName}</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 55%, rgba(255,255,255,0) 100%)",
        }} />

        {/* White triangle bottom-right */}
        <svg viewBox="0 0 400 120" style={{ position: "absolute", bottom: -1, right: 0, width: "55%", height: "auto" }} preserveAspectRatio="none">
          <polygon points="400,0 400,120 0,120" fill="var(--paper, #ffffff)" opacity="0.97" />
        </svg>

        {/* Blue accent triangle */}
        <svg viewBox="0 0 400 100" style={{ position: "absolute", bottom: -1, right: 0, width: "60%", height: "auto" }} preserveAspectRatio="none">
          <polygon points="400,20 400,100 30,100" fill="#1a9edc" opacity="0.92" />
        </svg>

        {/* Small left white cutout */}
        <svg viewBox="0 0 200 80" style={{ position: "absolute", bottom: -1, left: 0, width: "45%", height: "auto" }} preserveAspectRatio="none">
          <polygon points="0,80 200,80 0,30" fill="var(--paper, #ffffff)" opacity="0.97" />
        </svg>

        {/* Month & Year text */}
        <div style={{ position: "absolute", bottom: 10, right: 16, textAlign: "right", zIndex: 10 }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(11px, 1.6vw, 14px)", fontWeight: 500, color: "rgba(255,255,255,0.9)", letterSpacing: "0.12em", lineHeight: 1 }}>
            {format(currentMonth, "yyyy")}
          </div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 700, color: "#ffffff", letterSpacing: "0.04em", lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
            {format(currentMonth, "MMMM").toUpperCase()}
          </div>
        </div>

        {/* Controls top-right */}
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6, zIndex: 20 }}>
          <button onClick={onToggleDark} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", transition: "all 0.2s" }} title="Toggle dark mode">
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* Navigation row with page-flip effect wrapper */}
      <div
        className="flex items-center justify-between px-5 py-2"
        style={{
          background: "var(--paper, #fff)",
          borderBottom: "1px solid var(--ink-100, #eeeae0)",
          position: "relative",
          transition: "opacity 0.2s",
          opacity: isFlipping ? 0.6 : 1,
        }}
      >
        <button
          onClick={onPrev}
          disabled={isFlipping}
          className="flex items-center gap-1 text-sm font-medium transition-all hover:scale-105 active:scale-95"
          style={{ color: "var(--azure, #1a9edc)", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 6, opacity: isFlipping ? 0.5 : 1 }}
        >
          <ChevronLeft size={16} />
          {format(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1), "MMM")}
        </button>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowPicker((p) => !p)}
            style={{ fontSize: 11, color: "var(--ink-400, #a48e76)", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em", padding: "4px 8px", borderRadius: 6, transition: "background 0.15s", display: "flex", alignItems: "center", gap: 4 }}
            title="Jump to month/year"
          >
            <Calendar size={11} />
            {format(currentMonth, "MMMM yyyy")}
          </button>

          {showPicker && (
            <MiniMonthPicker
              currentMonth={currentMonth}
              onSelect={(m) => { onJumpTo(m); }}
              onClose={() => setShowPicker(false)}
            />
          )}
        </div>

        <button
          onClick={onNext}
          disabled={isFlipping}
          className="flex items-center gap-1 text-sm font-medium transition-all hover:scale-105 active:scale-95"
          style={{ color: "var(--azure, #1a9edc)", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 6, opacity: isFlipping ? 0.5 : 1 }}
        >
          {format(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1), "MMM")}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
