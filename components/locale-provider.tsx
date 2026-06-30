"use client";
import { createContext, useContext, type ReactNode } from "react";
import { useLocale } from "./use-locale";

export type Locale = "en" | "zh";

interface LocaleContextValue {
  locale: Locale;
  messages: Record<string, unknown>;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  messages: {},
});

export function LocaleProvider({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: Locale;
  messages: Record<string, unknown>;
}) {
  return (
    <LocaleContext.Provider value={{ locale, messages }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  return useContext(LocaleContext);
}

export function useTranslation() {
  const { locale, messages } = useLocaleContext();

  function t(key: string): string {
    const keys = key.split(".");
    let value: unknown = messages;
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    return typeof value === "string" ? value : key;
  }

  return { t, locale };
}
