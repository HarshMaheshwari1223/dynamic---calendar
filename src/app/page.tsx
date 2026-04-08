"use client";

import WallCalendar from "@/components/calendar/WallCalendar";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-4xl">
        <WallCalendar />
      </div>
    </main>
  );
}
