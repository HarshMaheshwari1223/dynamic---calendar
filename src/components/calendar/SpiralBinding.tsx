"use client";

export default function SpiralBinding() {
  const holes = Array.from({ length: 13 });
  return (
    <div
      className="relative flex items-center justify-around px-6"
      style={{
        height: 36,
        background:
          "linear-gradient(to bottom, #b8b0a4 0%, #d8d0c4 50%, #a8a098 100%)",
        borderRadius: "6px 6px 0 0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)",
      }}
    >
      {/* Metal rod line */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 12,
          right: 12,
          height: 3,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(0,0,0,0.1))",
          borderRadius: 2,
          transform: "translateY(-50%)",
        }}
      />
      {holes.map((_, i) => (
        <div key={i} className="relative z-10">
          {/* Outer ring */}
          <div
            style={{
              width: 16,
              height: 22,
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.5) 0%, #6b6055 40%, #3a332e 100%)",
              borderRadius: "50%",
              boxShadow:
                "inset 0 2px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Inner hole */}
            <div
              style={{
                width: 8,
                height: 14,
                background: "rgba(10,8,6,0.9)",
                borderRadius: "50%",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.8)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
