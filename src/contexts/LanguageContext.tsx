
"use client";

import type { Language } from '@/types';
import { uiTexts } from '@/content/translations';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/constants';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  text: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('pt');

  useEffect(() => {
    const storedLanguage = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) as Language | null;
    if (storedLanguage && (storedLanguage === 'pt' || storedLanguage === 'en')) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, lang);
  };

  const text = (key: string): string => {
    return uiTexts[language]?.[key] || uiTexts['en']?.[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, text }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
