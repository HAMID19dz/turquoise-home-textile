import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import arDict from './ar.json';
import frDict from './fr.json';
import enDict from './en.json';

export type SupportedLanguage = 'ar' | 'fr' | 'en';

export const dictionaries = {
  ar: arDict,
  fr: frDict,
  en: enDict,
};

export interface I18nContextType {
  language: SupportedLanguage;
  dir: 'rtl' | 'ltr';
  setLanguage: (lang: SupportedLanguage) => void;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const { lang } = useParams<{ lang?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const activeLang: SupportedLanguage =
    lang === 'fr' || lang === 'en' || lang === 'ar' ? (lang as SupportedLanguage) : 'ar';

  const dir: 'rtl' | 'ltr' = activeLang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = activeLang;
    document.documentElement.dir = dir;
    localStorage.setItem('turquoise_preferred_lang', activeLang);
  }, [activeLang, dir]);

  const setLanguage = (newLang: SupportedLanguage) => {
    if (newLang === activeLang) return;
    // Replace current language in pathname
    const currentPath = location.pathname;
    const segments = currentPath.split('/').filter(Boolean);
    if (segments.length > 0 && ['ar', 'fr', 'en'].includes(segments[0])) {
      segments[0] = newLang;
    } else {
      segments.unshift(newLang);
    }
    const newPath = '/' + segments.join('/') + location.search + location.hash;
    navigate(newPath);
  };

  const t = (path: string): string => {
    const dict = dictionaries[activeLang] || dictionaries.ar;
    return getNestedValue(dict as unknown as Record<string, unknown>, path);
  };

  return (
    <I18nContext.Provider value={{ language: activeLang, dir, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return ctx;
}
