import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { cookies } from "next/headers";

import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/cookie-banner";
import { LocaleLoader } from "@/components/locale-loader";
import { UpdateToast } from "@/components/update-toast";
import { siteConfig } from "@/config";

import "./globals.css";

const font = Nunito({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#22C55E",
};

export const metadata: Metadata = siteConfig;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as "en" | "zh") ?? "en";

  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: "/favicon.ico",
        },
        variables: {
          colorPrimary: "#22C55E",
        },
      }}
      afterSignOutUrl="/"
    >
      <html lang={locale === "zh" ? "zh" : "en"}>
        <body className={font.className}>
          <UpdateToast />
          <LocaleLoader initialLocale={locale}>
            <Toaster theme="light" richColors closeButton />
            <CookieBanner />
            <ExitModal />
            <HeartsModal />
            <PracticeModal />
            {children}
          </LocaleLoader>
        </body>
      </html>
    </ClerkProvider>
  );
}
