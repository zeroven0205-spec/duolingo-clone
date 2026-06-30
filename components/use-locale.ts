"use client";
import { useState, useEffect } from "react";

export type Locale = "en" | "zh";

export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored === "en" || stored === "zh") {
      setLocale(stored);
      return;
    }
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("zh")) {
      setLocale("zh");
    } else {
      setLocale("en");
    }
  }, []);

  return locale;
}

export function setLocale(locale: Locale) {
  localStorage.setItem("locale", locale);
}
