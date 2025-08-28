import { useEffect, useState } from 'react';
import en from '../lang/en.json';
import tr from '../lang/tr.json';

const langs = { en, tr };
const LANG_KEY = 'lang';
const LANG_EVENT = 'app:lang-change';

export const useLanguage = () => {
  const [language, setLanguage] = useState('en');
  const [strings, setStrings] = useState(en);

  // Initialize from localStorage on first mount
  useEffect(() => {
    const savedLang = localStorage.getItem(LANG_KEY);
    if (savedLang && langs[savedLang]) {
      setLanguage(savedLang);
      setStrings(langs[savedLang]);
    }
  }, []);

  // Listen for language changes (same-tab via custom event, cross-tab via storage)
  useEffect(() => {
    const handleLangEvent = (e) => {
      const code = (e && e.detail && e.detail.lang) || localStorage.getItem(LANG_KEY) || 'en';
      if (langs[code]) {
        setLanguage(code);
        setStrings(langs[code]);
      }
    };
    const handleStorage = (e) => {
      if (e.key === LANG_KEY) {
        const code = e.newValue;
        if (langs[code]) {
          setLanguage(code);
          setStrings(langs[code]);
        }
      }
    };
    window.addEventListener(LANG_EVENT, handleLangEvent);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(LANG_EVENT, handleLangEvent);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const changeLanguage = (langCode) => {
    if (langs[langCode]) {
      setLanguage(langCode);
      setStrings(langs[langCode]);
      localStorage.setItem(LANG_KEY, langCode);
      // Notify other hook instances in the same tab
      try {
        window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: { lang: langCode } }));
      } catch (_) {
        // no-op if CustomEvent not available
      }
    }
  };

  return { strings, language, changeLanguage };
};
