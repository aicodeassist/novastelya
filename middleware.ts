import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n.config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed", // uk = /, ru = /ru
  localeDetection: false,
});

const AI_BOTS = [
  "googlebot",
  "gptbot",
  "claudebot",
  "perplexitybot",
  "anthropic-ai",
  "cohere-ai",
  "applebot",
  "bingbot",
];

export async function middleware(request: NextRequest) {
  console.log("MIDDLEWARE PATHNAME:", request.nextUrl.pathname);
  const ua = (request.headers.get("user-agent") ?? "").toLowerCase();
  const isBot = AI_BOTS.some((bot) => ua.includes(bot));

  const preferredCity = request.cookies.get("preferred-city")?.value;
  // Vercel Edge geolocation header (can be mocked or read)
  const detectedCity = (request as any).geo?.city?.toLowerCase() || "";

  // 1. Prepare request headers to pass information to React Server Components (RSCs)
  const requestHeaders = new Headers(request.headers);
  
  if (preferredCity) {
    requestHeaders.set("x-preferred-city", preferredCity);
  } else if (detectedCity) {
    requestHeaders.set("x-detected-city", detectedCity);
  }

  if (isBot) {
    requestHeaders.set("x-is-bot", "true");
  }

  // 2. Clone request with new headers and execute intlMiddleware
  const modifiedRequest = new NextRequest(request, {
    headers: requestHeaders,
  });

  const response = await intlMiddleware(modifiedRequest);

  // 3. Set response headers for client/debug usage
  if (isBot) {
    response.headers.set("x-render-mode", "static");
    response.headers.set("x-is-bot", "true");
  }

  if (!preferredCity && detectedCity) {
    response.headers.set("x-detected-city", detectedCity);
  }

  return response;
}

export const config = {
  // Match all paths except api, admin, _next, static, and static assets with extensions
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
