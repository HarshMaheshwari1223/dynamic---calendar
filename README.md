# 🗓️ Wall Calendar — Interactive Date Planner

A polished, production-grade interactive wall calendar built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Inspired by the physical wall calendar aesthetic with a hero image, day-range selector, integrated notes, and a dark mode toggle.

---

## ✨ Features

### Core
| Feature | Details |
|---|---|
| **Wall Calendar Aesthetic** | Spiral binding header, hero image per month, blue diagonal accent chevron (matches reference image), paper texture |
| **Day Range Selector** | Click start → click end; visual states for start, end, in-range, hover-preview, today ring, weekend colour |
| **Integrated Notes** | Attach notes to any date or selected range; 4 colour options; inline editing; delete; persisted via `localStorage` |
| **Responsive Layout** | Desktop: side-by-side grid + notes panel · Mobile: stacked with collapsible notes drawer |

### Extras / Stand-Out
| Feature | Details |
|---|---|
| **Month-jump Picker** | Click the month/year label in the nav bar → popover grid to jump to any month/year |
| **Page-flip Animation** | Smooth CSS keyframe animation on month change (`flip-enter`) |
| **Holiday Markers** | US public holidays shown as red dots on day cells with a legend below the grid |
| **Note Dot Indicators** | Blue dot appears on any day that has an attached note |
| **Dark Mode** | Toggle via 🌙 button in the hero image; CSS variable swap; persists within session |
| **Note Colours** | 4 colours — azure, amber, rose, sage — switchable per note via palette button |
| **Inline Note Editing** | Click any note chip to edit in-place; Blur or Enter saves |
| **localStorage Persistence** | Notes and date range survive page refresh |
| **Month-specific Hero Images** | Each of the 12 months has a curated Unsplash image |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm / yarn / pnpm

### Install & Run

```bash
# Clone or unzip the project
cd wall-calendar

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles, CSS variables, day-cell states
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Entry page — renders <WallCalendar />
│
├── components/
│   └── calendar/
│       ├── WallCalendar.tsx     # Root orchestrator; desktop/mobile layouts
│       ├── HeroPanel.tsx        # Month image + navigation + dark toggle
│       ├── SpiralBinding.tsx    # Decorative spiral holes header
│       ├── CalendarGrid.tsx     # 7-col day grid with range/hover logic
│       ├── NotesPanel.tsx       # Notes list, textarea, colour picker
│       ├── RangeStatusBar.tsx   # Inline range summary + clear button
│       ├── HolidayLegend.tsx    # Month holidays listed below grid
│       └── MiniMonthPicker.tsx  # Popover month/year jump picker
│
├── hooks/
│   └── useCalendarState.ts  # All state: range, notes, navigation, dark mode
│
└── lib/
    ├── types.ts             # TypeScript interfaces, constants, holiday map
    └── calendar.ts          # Pure date utilities (grid builder, range logic)
```

---

## 🎨 Design Decisions

### Aesthetic
- **Playfair Display** (serif) for the month name — matches the editorial, print-quality feel of a physical calendar
- **DM Sans** for body/UI — clean, modern, legible at small sizes
- **Azure blue (#1a9edc)** as the primary accent — directly pulled from the reference image
- Diagonal SVG polygons in the image overlay recreate the angular blue chevron from the reference
- Paper texture via an inline SVG noise filter — no external image files needed

### State Architecture
All state lives in a single custom hook (`useCalendarState`) which keeps components purely presentational. `localStorage` is written on every mutation for zero-backend persistence.

### Range Selection UX
- First click → sets `start`
- Second click → sets `end` (auto-swaps if picked before start)
- Clicking start again → clears selection
- Hover preview shows a lighter blue range before committing the end date

---

## 🛠 Tech Stack

| Tool | Version | Role |
|---|---|---|
| Next.js | 14.2 | Framework (App Router) |
| React | 18 | UI |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3.4 | Utility styling |
| date-fns | 3.6 | Date arithmetic |
| clsx | 2.1 | Conditional classNames |
| lucide-react | 0.400 | Icons |

---

## 🧩 Extending

### Add more holidays
Edit `HOLIDAYS_2024_2025` in `src/lib/types.ts` — keys are `"YYYY-MM-DD"` strings.

### Swap hero images
Edit `MONTH_IMAGES` in `src/lib/types.ts` — any image URL works (Unsplash, local `/public`, etc.).

### Add a backend / real persistence
Replace the `localStorage` calls in `useCalendarState.ts` with your API calls. The hook's interface doesn't change — components are unaffected.

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 768px` (mobile) | Stacked — image → grid → status bar → collapsible notes drawer |
| `≥ 768px` (desktop) | Side-by-side — left: image + grid · right: notes panel |
