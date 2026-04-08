export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface Note {
  id: string;
  text: string;
  dateKey: string;
  color: NoteColor;
  createdAt: number;
}

export type NoteColor = "azure" | "amber" | "rose" | "sage";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  holiday?: string;
  holidayInfo?: HolidayInfo;
}

export const NOTE_COLORS: Record<NoteColor, { bg: string; border: string; dot: string }> = {
  azure: { bg: "rgba(26,158,220,0.08)", border: "rgba(26,158,220,0.3)", dot: "#1a9edc" },
  amber: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)", dot: "#f59e0b" },
  rose: { bg: "rgba(232,93,74,0.08)", border: "rgba(232,93,74,0.3)", dot: "#e85d4a" },
  sage: { bg: "rgba(52,168,131,0.08)", border: "rgba(52,168,131,0.3)", dot: "#34a883" },
};

export interface HolidayInfo {
  name: string;
  emoji: string;
  image: string;
  imageAlt: string;
}

export const RECURRING_HOLIDAYS: Record<string, HolidayInfo> = {
  "01-01": { name: "New Year's Day", emoji: "🎆", image: "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=1200&q=85", imageAlt: "New Year fireworks" },
  "02-14": { name: "Valentine's Day", emoji: "❤️", image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&q=85", imageAlt: "Valentine roses and hearts" },
  "03-17": { name: "St. Patrick's Day", emoji: "☘️", image: "https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?w=1200&q=85", imageAlt: "St. Patrick's Day green" },
  "03-08": { name: "International Women's Day", emoji: "♀️", image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&q=85", imageAlt: "Women empowerment" },
  "04-22": { name: "Earth Day", emoji: "🌍", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85", imageAlt: "Beautiful nature Earth Day" },
  "06-21": { name: "Summer Solstice", emoji: "☀️", image: "https://images.unsplash.com/photo-1543877087-ebf71fde2be1?w=1200&q=85", imageAlt: "Golden summer solstice sunset" },
  "07-04": { name: "Independence Day", emoji: "🇺🇸", image: "https://images.unsplash.com/photo-1572726779098-c2ec2e5a5c34?w=1200&q=85", imageAlt: "Fourth of July fireworks" },
  "06-19": { name: "Juneteenth", emoji: "✊", image: "https://images.unsplash.com/photo-1591951425328-48c26c0f8f8c?w=1200&q=85", imageAlt: "Juneteenth freedom celebration" },
  "10-31": { name: "Halloween", emoji: "🎃", image: "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=1200&q=85", imageAlt: "Halloween pumpkins" },
  "11-11": { name: "Veterans Day", emoji: "🎖️", image: "https://images.unsplash.com/photo-1555871877-b6f78f573f78?w=1200&q=85", imageAlt: "Veterans memorial flag" },
  "12-24": { name: "Christmas Eve", emoji: "🕯️", image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=1200&q=85", imageAlt: "Christmas Eve candles and snow" },
  "12-25": { name: "Christmas Day", emoji: "🎄", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&q=85", imageAlt: "Christmas tree with decorations" },
  "12-26": { name: "Kwanzaa begins", emoji: "🕯️", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&q=85", imageAlt: "Kwanzaa celebration candles" },
  "12-31": { name: "New Year's Eve", emoji: "🥂", image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1200&q=85", imageAlt: "New Year Eve celebration" },
};

function getNthWeekday(year: number, month: number, weekday: number, n: number): string {
  let count = 0;
  for (let day = 1; day <= 31; day++) {
    const d = new Date(year, month, day);
    if (d.getMonth() !== month) break;
    if (d.getDay() === weekday) { count++; if (count === n) return fk(year, month + 1, day); }
  }
  return "";
}

function getLastWeekday(year: number, month: number, weekday: number): string {
  let last = "";
  for (let day = 1; day <= 31; day++) {
    const d = new Date(year, month, day);
    if (d.getMonth() !== month) break;
    if (d.getDay() === weekday) last = fk(year, month + 1, day);
  }
  return last;
}

function fk(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

function getEasterDate(year: number): string {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m2 = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m2 + 114) / 31);
  const day = ((h + l - 7 * m2 + 114) % 31) + 1;
  return fk(year, month, day);
}

function getDiwaliDate(year: number): string {
  const d: Record<number,string> = { 2023:"2023-11-12", 2024:"2024-11-01", 2025:"2025-10-20", 2026:"2026-11-08", 2027:"2027-10-29", 2028:"2028-10-17", 2029:"2029-11-05", 2030:"2030-10-26" };
  return d[year] || `${year}-11-01`;
}

function getHoliName(key: string): HolidayInfo {
  return RECURRING_HOLIDAYS[key.substring(5)] || { name: key, emoji: "🎉", image: "", imageAlt: "" };
}

export function getAllHolidaysForYear(year: number): Record<string, HolidayInfo> {
  const result: Record<string, HolidayInfo> = {};
  for (const [mmdd, info] of Object.entries(RECURRING_HOLIDAYS)) {
    result[`${year}-${mmdd}`] = info;
  }
  // Floating
  result[getNthWeekday(year, 0, 1, 3)] = { name: "MLK Jr. Day", emoji: "✊", image: "https://images.unsplash.com/photo-1591951425328-48c26c0f8f8c?w=1200&q=85", imageAlt: "Civil rights celebration" };
  result[getNthWeekday(year, 1, 1, 3)] = { name: "Presidents' Day", emoji: "🏛️", image: "https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=1200&q=85", imageAlt: "US Capitol building" };
  result[getLastWeekday(year, 4, 1)] = { name: "Memorial Day", emoji: "🌺", image: "https://images.unsplash.com/photo-1555871877-b6f78f573f78?w=1200&q=85", imageAlt: "Memorial Day flags" };
  result[getNthWeekday(year, 8, 1, 1)] = { name: "Labor Day", emoji: "⚒️", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=85", imageAlt: "Labor Day workers" };
  result[getNthWeekday(year, 9, 1, 2)] = { name: "Columbus Day", emoji: "⚓", image: "https://images.unsplash.com/photo-1507919909716-c8262e491cde?w=1200&q=85", imageAlt: "Columbus Day ships" };
  result[getNthWeekday(year, 10, 4, 4)] = { name: "Thanksgiving", emoji: "🦃", image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=1200&q=85", imageAlt: "Thanksgiving feast" };
  result[getEasterDate(year)] = { name: "Easter", emoji: "🐣", image: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=1200&q=85", imageAlt: "Easter eggs and spring" };
  result[getDiwaliDate(year)] = { name: "Diwali", emoji: "🪔", image: "https://images.unsplash.com/photo-1604427178-4ed51f7bd33e?w=1200&q=85", imageAlt: "Diwali festival of lights" };
  // remove empty keys
  delete result[""];
  return result;
}

export const MONTH_IMAGES: Record<number, { url: string; alt: string; credit: string }> = {
  0: { url: "https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=1200&q=85", alt: "Snowy mountain peak in January", credit: "Unsplash" },
  1: { url: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1200&q=85", alt: "Frosty winter forest in February", credit: "Unsplash" },
  2: { url: "https://images.unsplash.com/photo-1490750967868-88df5691cc8a?w=1200&q=85", alt: "Cherry blossoms in March", credit: "Unsplash" },
  3: { url: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&q=85", alt: "Spring meadow in April", credit: "Unsplash" },
  4: { url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=85", alt: "Green hills in May", credit: "Unsplash" },
  5: { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85", alt: "Tropical beach in June", credit: "Unsplash" },
  6: { url: "https://images.unsplash.com/photo-1543877087-ebf71fde2be1?w=1200&q=85", alt: "Summer sunset in July", credit: "Unsplash" },
  7: { url: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1200&q=85", alt: "Late summer fields in August", credit: "Unsplash" },
  8: { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85", alt: "Autumn forest in September", credit: "Unsplash" },
  9: { url: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=1200&q=85", alt: "Fall foliage in October", credit: "Unsplash" },
  10: { url: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=1200&q=85", alt: "Misty autumn lake in November", credit: "Unsplash" },
  11: { url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&q=85", alt: "Snow covered pine trees in December", credit: "Unsplash" },
};
