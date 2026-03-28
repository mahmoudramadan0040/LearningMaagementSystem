export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'en';

export const rtlLocales = ['ar'];

export type Locale = (typeof locales)[number];