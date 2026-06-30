import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALE_COOKIE = "locale";
const SUPPORTED = ["en", "zh"];

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  if (!cookieLocale || !SUPPORTED.includes(cookieLocale)) {
    const acceptLang = request.headers.get("accept-language") ?? "";
    const locale = acceptLang.toLowerCase().startsWith("zh") ? "zh" : "en";
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    response.headers.set("x-locale", locale);
  } else {
    response.headers.set("x-locale", cookieLocale);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
