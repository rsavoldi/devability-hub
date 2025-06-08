
"use client";

import React, { ReactNode } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { TooltipProvider } from '@/components/ui/tooltip'; // ShadCN TooltipProvider

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <TooltipProvider>
            {children}
        </TooltipProvider>
      </ProgressProvider>
    </LanguageProvider>
  );
};

export default AppProviders;
