'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    products: 'Products',
    orders: 'Orders',
    customers: 'Customers',
    settings: 'Settings',
    profile: 'Profile',
    workspace: 'Workspace',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    currency: 'Currency',
    timezone: 'Timezone',
    language: 'Language',
  },
  es: {
    dashboard: 'Panel',
    analytics: 'Analíticas',
    products: 'Productos',
    orders: 'Pedidos',
    customers: 'Clientes',
    settings: 'Configuración',
    profile: 'Perfil',
    workspace: 'Espacio de trabajo',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    currency: 'Moneda',
    timezone: 'Zona horaria',
    language: 'Idioma',
  },
  ne: {
    dashboard: 'ड्यासबोर्ड',
    analytics: 'विश्लेषण',
    products: 'उत्पादनहरू',
    orders: 'अर्डरहरू',
    customers: 'ग्राहकहरू',
    settings: 'सेटिङहरू',
    profile: 'प्रोफाइल',
    workspace: 'कार्यक्षेत्र',
    save: 'सेभ गर्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    edit: 'सम्पादन गर्नुहोस्',
    delete: 'मेटाउनुहोस्',
    currency: 'मुद्रा',
    timezone: 'समय क्षेत्र',
    language: 'भाषा',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');

  const t = (key: string) => {
    const langTranslations = translations[language as keyof typeof translations] || translations.en;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}