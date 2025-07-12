import { UI_TEXT, DEFAULT_LANG } from '../consts';

export type Lang = keyof typeof UI_TEXT;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in UI_TEXT) return lang as Lang;
  return DEFAULT_LANG as Lang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof UI_TEXT[Lang]) {
    return UI_TEXT[lang][key] || UI_TEXT[DEFAULT_LANG][key];
  }
}

export function getLocalizedUrl(url: string, lang: Lang): string {
  if (lang === DEFAULT_LANG) return url;
  return `/${lang}${url}`;
}

export function removeLocaleFromUrl(url: string): string {
  const segments = url.split('/');
  if (segments[1] && segments[1] in UI_TEXT) {
    return '/' + segments.slice(2).join('/');
  }
  return url;
} 