"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

/** Syncs <html lang> and <html dir> with the active next-intl locale (RTL for Arabic). */
export default function LocaleHtmlSync() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
