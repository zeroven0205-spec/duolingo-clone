"use server";

const dictionaries: Record<string, Record<string, unknown>> = {};

async function loadDictionary(locale: string) {
  if (dictionaries[locale]) return dictionaries[locale];
  try {
    const mod = await import(`../messages/${locale}.json`);
    dictionaries[locale] = mod.default;
    return dictionaries[locale];
  } catch {
    const en = await import("../messages/en.json");
    dictionaries["en"] = en.default;
    return dictionaries["en"];
  }
}

export type Locale = "en" | "zh";

export async function getTranslations(locale: Locale = "en") {
  const dict = (await loadDictionary(locale)) as Record<string, Record<string, string>>;

  function t(key: string): string {
    const keys = key.split(".");
    let value: unknown = dict;
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

export const supportedLocales: Locale[] = ["en", "zh"];
export const defaultLocale: Locale = "en";
