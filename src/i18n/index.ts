import RNLanguageDetector from '@os-team/i18next-react-native-language-detector';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import hi from './locales/hi.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';

const resources = {
  en: {
    translation: en,
  },
  pt: {
    translation: pt,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  hi: {
    translation: hi,
  },
  de: {
    translation: de,
  },
  ru: {
    translation: ru,
  },
  zh: {
    translation: zh,
  },
  ja: {
    translation: ja,
  },
  ko: {
    translation: ko,
  },
};

i18n
  .use(RNLanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });

const languageList = [
  { label: 'English', value: 'en' },
  { label: 'Português', value: 'pt' },
  { label: 'Español', value: 'es' },
  { label: 'Français', value: 'fr' },
  { label: 'हिंदी', value: 'hi' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Русский', value: 'ru' },
  { label: '中文', value: 'zh' },
  { label: '日本語', value: 'ja' },
  { label: '한국어', value: 'ko' }
];

export default i18n;
export { languageList };
