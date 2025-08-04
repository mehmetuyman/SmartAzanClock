import { useEffect, useState } from 'react';
import en from '../lang/en.json';
import tr from '../lang/tr.json';

const langs = { en, tr };

export const useLanguage = () => {
  const [language, setLanguage] = useState('en');
  const [strings, setStrings] = useState(en);

  useEffect(() => {
    const savedLang = localStorage.getItem('lang');
    if (savedLang && langs[savedLang]) {
      setLanguage(savedLang);
      setStrings(langs[savedLang]);
    }
  }, []);

  const changeLanguage = (langCode) => {
    if (langs[langCode]) {
      setLanguage(langCode);
      setStrings(langs[langCode]);
      localStorage.setItem('lang', langCode);
    }
  };

  return { strings, language, changeLanguage };
};
