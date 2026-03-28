import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
// Optional: detect browser language and persist in cookie
import { NextRequest, NextResponse } from 'next/server';
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});




export function detectBrowserLang(req: NextRequest) {
  const acceptLang = req.headers.get('accept-language');
  if (!acceptLang) return defaultLocale;

  // pick first supported language
  const matched = locales.find(lang => acceptLang.startsWith(lang));
  return matched || defaultLocale;
}

export function middleware(req: NextRequest) {
  const res = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'as-needed',
  })(req as any);

  // set cookie if not set
  const cookie = req.cookies.get('NEXT_LOCALE');
  if (!cookie) {
    const detected = detectBrowserLang(req);
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', detected, { path: '/' });
    return response;
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};