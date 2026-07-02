import type { Metadata } from "next";

export const siteConfig: Metadata = {
  title: "Lingo - 语言学习平台",
  description:
    "Lingo 是一款互动式语言学习平台，提供课程、测验和进度追踪。支持英语、西班牙语、法语、日语等多语言学习。",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://lingo-app.com",
    siteName: "Lingo",
  },
  keywords: [
    "reactjs",
    "nextjs",
    "vercel",
    "react",
    "duolingo-clone",
    "learn-language",
    "shadcn",
    "shadcn-ui",
    "radix-ui",
    "cn",
    "clsx",
    "lingo",
    "postgresql",
    "sonner",
    "drizzle",
    "zustand",
    "mysql",
    "lucide-react",
    "clerk-themes",
    "clerk",
    "postcss",
    "prettier",
    "react-dom",
    "tailwindcss",
    "tailwindcss-animate",
    "ui/ux",
    "js",
    "javascript",
    "typescript",
    "eslint",
    "html",
    "css",
  ] as Array<string>,
  authors: {
    name: "Sanidhya Kumar Verma",
    url: "https://github.com/sanidhyy",
  },
} as const;

export const links = {
  sourceCode: "https://github.com/sanidhyy/duolingo-clone",
  email: "sanidhya.verma12345@gmail.com",
} as const;
