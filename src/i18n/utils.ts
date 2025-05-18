import es from "./languages/es.json";
import en from "./languages/en.json";

const defaultLang = "es";
const supportedLangs = ["en", "es"];

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang && supportedLangs.includes(lang)) return lang;
  return defaultLang;
}

export function useTranslations(lang: "en" | "es") {
  const translations = lang === "es" ? es : en;

  return function t(key: string) {
    const keys = key.split(".");
    let value: any = translations;
    for (const k of keys) {
      value = value[k];
      if (value === undefined) return key;
    }

    return value as string;
  };
}

export function detectBrowserLanguage(): string {
  if (typeof window === 'undefined') return defaultLang;
  const browserLang = navigator.language?.split('-')[0] || '';
  return supportedLangs.includes(browserLang) ? browserLang : defaultLang;
}

export function redirectToLanguagePath(path: string, lang: string): string {
  const pathWithoutLang = path.replace(/^\/(en|es)/, '');
  return `/${lang}${pathWithoutLang}`;
}
