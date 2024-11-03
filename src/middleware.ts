import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales } from '@/config';

export default async function middleware(request: NextRequest) {
  const defaultLocale = request.headers.get('negin-cms-locale') || 'fa';
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'never',
  });
  const response = handleI18nRouting(request);
  response.headers.set('negin-cms-locale', defaultLocale);
  return response;
}
export const config = {
  matcher: [
    '/((?!api|static|.*\\..*|_next|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
