"use client";
import { useEffect, useState } from "react";
import type { Locale } from "./use-locale";
import { LocaleProvider } from "./locale-provider";

const localeModules: Record<Locale, () => Promise<Record<string, unknown>>> = {
  zh: () => import("../messages/zh.json") as Promise<Record<string, unknown>>,
  en: () => import("../messages/en.json") as Promise<Record<string, unknown>>,
};

export function LocaleLoader({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState<Record<string, unknown> | null>(null);
  const [locale, setLocale] = useState<Locale>(initialLocale);

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null;
    const detected =
      stored ??
      (navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en");
    setLocale(detected);
    localeModules[detected]().then((m) => setMessages(m));
  }, []);

  function switchLocale(newLocale: Locale) {
    localStorage.setItem("locale", newLocale);
    setLocale(newLocale);
    localeModules[newLocale]().then((m) => {
      setMessages(m);
      // Force page reload to apply new language
      window.location.reload();
    });
  }

  if (!messages) return <>{children}</>;

  return (
    <LocaleProvider locale={locale} messages={messages}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex gap-1">
        <button
          onClick={() => switchLocale("en")}
          className={`rounded px-2 py-1 text-xs ${
            locale === "en" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => switchLocale("zh")}
          className={`rounded px-2 py-1 text-xs ${
            locale === "zh" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          中文
        </button>
      </div>
    </LocaleProvider>
  );
}
