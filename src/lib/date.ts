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

  return lang === "en"
    ? date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : formatBikramSambatDate(date, "long");
}

export function formatClockTime(input: string | number | Date, lang: DateLang) {
  const date = toDate(input);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString(lang === "en" ? "en-US" : "ne-NP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatClockDay(input: string | number | Date, lang: DateLang) {
  const date = toDate(input);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(lang === "en" ? "en-US" : "ne-NP", {
    weekday: "long",
  });
}
