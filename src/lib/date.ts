import { ADToBS } from "bikram-sambat-js";

export type DateLang = "en" | "ne";
export type DateStyle = "long" | "short";

const BS_MONTHS = [
  "बैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पुष",
  "माघ",
  "फागुन",
  "चैत",
] as const;

function toDate(input: string | number | Date) {
  return input instanceof Date ? input : new Date(input);
}

function formatGregorianDate(date: Date, style: DateStyle, locale: string) {
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: style === "long" ? "long" : "short",
    day: "numeric",
  });
}

function formatBikramSambatDate(date: Date, style: DateStyle) {
  const [year, month, day] = ADToBS(date.toISOString().slice(0, 10)).split("-");
  const monthName = BS_MONTHS[Number(month) - 1] ?? "";

  if (style === "short") {
    return `${day} ${monthName} ${year}`;
  }

  return `${year} ${monthName} ${day} गते`;
}

function toDevanagariDigits(value: string) {
  return value.replace(/\d/g, (digit) => "०१२३४५६७८९"[Number(digit)] ?? digit);
}

function formatNepaliClockTime(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).formatToParts(date);

  const hour = toDevanagariDigits(parts.find((part) => part.type === "hour")?.value ?? "");
  const minute = toDevanagariDigits(parts.find((part) => part.type === "minute")?.value ?? "");
  const dayPeriod = date.getHours() < 12 ? "बिहान" : date.getHours() < 18 ? "दिउँसो" : "साँझ";

  return `${hour}:${minute} ${dayPeriod}`;
}

function formatNepaliWeekday(date: Date) {
  return new Intl.DateTimeFormat("ne-NP-u-nu-deva", { weekday: "long" }).format(date);
}

export function formatDate(
  input: string | number | Date,
  lang: DateLang,
  style: DateStyle = "long",
) {
  const date = toDate(input);

  if (Number.isNaN(date.getTime())) return "";

  return lang === "en"
    ? formatGregorianDate(date, style, "en-US")
    : formatBikramSambatDate(date, style);
}

export function formatClockDate(input: string | number | Date, lang: DateLang) {
  const date = toDate(input);
  if (Number.isNaN(date.getTime())) return "";

  if (lang === "en") {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return `${formatNepaliWeekday(date)}, ${formatBikramSambatDate(date, "long")}`;
}

export function formatClockTime(input: string | number | Date, lang: DateLang) {
  const date = toDate(input);
  if (Number.isNaN(date.getTime())) return "";

  if (lang === "en") {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return formatNepaliClockTime(date);
}
