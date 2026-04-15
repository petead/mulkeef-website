import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = [
  "en", "fr", "ar", "ru", "zh", "de", "es", "pt", "hi", "it",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Francais",
  ar: "العربية",
  ru: "Русский",
  zh: "中文",
  de: "Deutsch",
  es: "Espanol",
  pt: "Portugues",
  hi: "हिन्दी",
  it: "Italiano",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  ar: "🇦🇪",
  ru: "🇷🇺",
  zh: "🇨🇳",
  de: "🇩🇪",
  es: "🇪🇸",
  pt: "🇧🇷",
  hi: "🇮🇳",
  it: "🇮🇹",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
