"use server";
import { headers } from "next/headers";
import type { Locale } from "@/components/use-locale";

const zhMessages = () => import("../messages/zh.json");
const enMessages = () => import("../messages/en.json");

const loaders: Record<Locale, () => Promise<unknown>> = {
  zh: zhMessages,
  en: enMessages,
};

export async function detectLocale(): Promise<Locale> {
  const headersList = await headers();
  const stored = headersList.get("x-locale") as Locale | null;
  if (stored === "zh" || stored === "en") return stored;

  const acceptLang = headersList.get("accept-language") ?? "";
  if (acceptLang.toLowerCase().startsWith("zh")) return "zh";
  return "en";
}

export async function getMessages(locale: Locale) {
  const loader = loaders[locale] ?? loaders.en;
  return (await loader()) as Record<string, unknown>;
}
