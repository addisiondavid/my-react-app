const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function RetrieveDateTime(stringDateTime: string) {
  const d = new Date(stringDateTime);
  if (isNaN(d.getTime())) return null;

  const year = String(d.getFullYear());
  const month = months[d.getMonth()];
  const date = String(d.getDate()).padStart(2, "0");
  const weekday = weekdays[d.getDay()];

  return { year, month, date, weekday, dateObj: d };
}

export function getHourlyRangeForWeekday(
  hourlyTimes: string[],
  currentDate: Date,
  selectedWeekday: string
): { start: number; end: number } {
  const len = hourlyTimes?.length ?? 0;
  if (len === 0) return { start: 0, end: Math.max(0, len - 1) };

  const now = new Date(currentDate);
  const curIdx = now.getDay();
  const targetIdx = weekdays.indexOf(selectedWeekday);
  if (targetIdx === -1) return { start: 0, end: Math.min(len - 1, 23) };

  const daysAhead = (targetIdx - curIdx + 7) % 7;
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysAhead);
  targetDate.setHours(0, 0, 0, 0);

  const sameDay = (iso: string, d: Date) => {
    const dd = new Date(iso);
    return (
      dd.getFullYear() === d.getFullYear() &&
      dd.getMonth() === d.getMonth() &&
      dd.getDate() === d.getDate()
    );
  };

  // try to find exact indices for that calendar day
  const firstIndex = hourlyTimes.findIndex((t) => sameDay(t, targetDate));
  if (firstIndex >= 0) {
    let lastIndex = firstIndex;
    for (let i = firstIndex + 1; i < len; i++) {
      if (sameDay(hourlyTimes[i], targetDate)) lastIndex = i;
      else break;
    }
    return { start: firstIndex, end: lastIndex };
  }

  // fallback: approximate using the first hourly timestamp as a base
  const base = new Date(hourlyTimes[0]);
  const approxHours = Math.round(
    (targetDate.getTime() - base.getTime()) / (1000 * 60 * 60)
  );
  const start = Math.max(0, Math.min(len - 1, approxHours));
  const end = Math.max(start, Math.min(len - 1, start + 23));
  return { start, end };
}
