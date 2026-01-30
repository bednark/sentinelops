export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

export const generateMetricData = (
  points: number = 20,
  min: number = 0,
  max: number = 100,
  volatility: number = 10
) => {
  const data = [];
  const now = Date.now();
  let lastValue = min + (max - min) / 2;

  for (let i = points - 1; i >= 0; i--) {
    const change = (Math.random() - 0.5) * volatility;
    lastValue = Math.max(min, Math.min(max, lastValue + change));
    data.push({
      timestamp: now - i * 30000,
      value: Math.round(lastValue * 10) / 10,
    });
  }
  return data;
};

export function formatRelativeTime(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const rtf = new Intl.RelativeTimeFormat("pl", { numeric: "auto" });

  if (seconds < 60) return rtf.format(-seconds, "second");
  if (minutes < 60) return rtf.format(-minutes, "minute");
  if (hours < 24) return rtf.format(-hours, "hour");
  return rtf.format(-days, "day");
}