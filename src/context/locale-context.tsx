
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import enTranslations from '@/locales/en.json';
import nlTranslations from '@/locales/nl.json';
import esTranslations from '@/locales/es.json';
import frTranslations from '@/locales/fr.json';
import deTranslations from '@/locales/de.json';
import jpTranslations from '@/locales/jp.json';
import ptBRTranslations from '@/locales/pt-BR.json'; // Added Brazilian Portuguese

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const availableLanguages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'jp', name: '日本語', flag: '🇯🇵' },
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' }, // Added Brazilian Portuguese
];

type Translations = Record<string, any>; // Allow nested translations

interface LocaleContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
  availableLanguages: Language[];
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations: Record<string, Translations> = {
  en: enTranslations,
  nl: nlTranslations,
  es: esTranslations,
  fr: frTranslations,
  de: deTranslations,
  jp: jpTranslations,
  'pt-BR': ptBRTranslations, // Added Brazilian Portuguese translations
};

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(availableLanguages[0]);
  const [currentTranslations, setCurrentTranslations] = useState<Translations>(translations[availableLanguages[0].code]);

  useEffect(() => {
    // Attempt to load saved language from localStorage
    const savedLangCode = localStorage.getItem('looview_lang');
    const savedLang = availableLanguages.find(l => l.code === savedLangCode);
    if (savedLang) {
      setLanguageState(savedLang);
      setCurrentTranslations(translations[savedLang.code] || translations.en);
    } else {
      // Fallback to browser language or default
      const browserLang = navigator.language.split('-')[0];
      const browserLangFull = navigator.language;
      const initialLang = availableLanguages.find(l => l.code === browserLangFull) || availableLanguages.find(l => l.code === browserLang) || availableLanguages[0];
      setLanguageState(initialLang);
      setCurrentTranslations(translations[initialLang.code] || translations.en);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    setCurrentTranslations(translations[newLanguage.code] || translations.en);
    localStorage.setItem('looview_lang', newLanguage.code);
     //Potentially force re-render or update document lang attribute if needed for accessibility/SEO
    document.documentElement.lang = newLanguage.code;
  };

  const t = useCallback((key: string, replacements?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = currentTranslations;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found or if structure is different
        let fallbackValue: any = translations.en;
        for (const fk of keys) {
            if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
                fallbackValue = fallbackValue[fk];
            } else {
                console.warn(`Translation key "${key}" not found in current language (${language.code}) or fallback (en).`);
                return key; // Return key if not found in English either
            }
        }
        value = fallbackValue;
        break; 
      }
    }

    if (typeof value === 'string') {
      if (replacements) {
        return Object.entries(replacements).reduce((acc, [placeholder, replacementValue]) => {
          return acc.replace(new RegExp(`{{${placeholder}}}`, 'g'), replacementValue);
        }, value);
      }
      return value;
    }
    console.warn(`Translation for key "${key}" in language "${language.code}" is not a string. Found:`, value);
    return key; // Return the key itself if not found or not a string
  }, [currentTranslations, language.code]);

  return (
    <LocaleContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

