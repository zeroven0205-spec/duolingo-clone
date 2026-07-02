import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const LOCALE_COOKIE = "locale";
const SUPPORTED = ["en", "zh"];

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/stripe",
]);

export default clerkMiddleware(async (auth, request) => {
  // Handle locale
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

  // Handle auth
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
