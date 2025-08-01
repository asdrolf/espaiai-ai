import { UI_TEXT, DEFAULT_LANG, LANGUAGES } from '../consts';

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

/**
 * Ensures a URL has a trailing slash for consistency with trailingSlash: "always"
 * @param url - The URL to normalize
 * @returns URL with trailing slash (except for files with extensions)
 */
export function ensureTrailingSlash(url: string): string {
  // Don't add trailing slash to files with extensions
  if (url.includes('.')) return url;
  
  // Don't add trailing slash to root
  if (url === '/') return url;
  
  // Add trailing slash if not present
  return url.endsWith('/') ? url : url + '/';
}

/**
 * Creates a localized URL with proper trailing slash
 * @param path - The path (e.g., '/about', '/contact')
 * @param lang - The language code
 * @returns Localized URL with trailing slash
 */
export function getLocalizedPath(path: string, lang: Lang): string {
  const normalizedPath = ensureTrailingSlash(path);
  if (lang === DEFAULT_LANG) return normalizedPath;
  return `/${lang}${normalizedPath}`;
}

/**
 * Creates a localized URL for navigation links
 * @param path - The path (e.g., 'about', 'contact', '' for home)
 * @param lang - The language code
 * @returns Localized URL with trailing slash
 */
export function getNavLink(path: string, lang: Lang): string {
  // Handle home page (empty path)
  if (!path || path === '' || path === '/') {
    return lang === DEFAULT_LANG ? '/' : `/${lang}/`;
  }
  
  // Ensure path starts with /
  const fullPath = path.startsWith('/') ? path : `/${path}`;
  return getLocalizedPath(fullPath, lang);
}

// Browser language detection functions
export function detectBrowserLanguage(): Lang | null {
  if (typeof window === 'undefined') return null;
  
  const browserLang = navigator.language || navigator.languages?.[0];
  if (!browserLang) return null;
  
  // Extract language code (e.g., 'es-ES' -> 'es')
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Check if we support this language
  if (langCode in LANGUAGES) {
    return langCode as Lang;
  }
  
  return null;
}

export function shouldShowLanguagePrompt(currentLang: Lang, detectedLang: Lang): boolean {
  // Don't show if already on detected language
  if (currentLang === detectedLang) return false;
  
  // Don't show if user dismissed it before
  const dismissed = localStorage.getItem('lang-detection-dismissed');
  if (dismissed === 'true') return false;
  
  // Don't show if user has already set a preferred language
  const preferredLang = localStorage.getItem('user-preferred-lang');
  if (preferredLang) return false;
  
  return true;
}

export function dismissLanguagePrompt(): void {
  localStorage.setItem('lang-detection-dismissed', 'true');
}

export function setUserPreferredLanguage(lang: Lang): void {
  localStorage.setItem('user-preferred-lang', lang);
}

export function getUserPreferredLanguage(): Lang | null {
  const preferred = localStorage.getItem('user-preferred-lang');
  if (preferred && preferred in UI_TEXT) {
    return preferred as Lang;
  }
  return null;
}

export function switchToLanguage(newLang: Lang): void {
  const currentPath = window.location.pathname;
  const segments = currentPath.split('/');
  
  // Remove current language from path if it exists
  if (segments[1] && segments[1] in UI_TEXT) {
    segments.splice(1, 1);
  }
  
  // Add new language prefix (except for English)
  const newPath = newLang === 'en' 
    ? segments.join('/') || '/'
    : `/${newLang}${segments.join('/') || '/'}`;
  
  // Ensure trailing slash
  const normalizedPath = ensureTrailingSlash(newPath);
  
  // Save user's preferred language
  setUserPreferredLanguage(newLang);
  
  // Navigate to new URL
  window.location.href = normalizedPath;
} 