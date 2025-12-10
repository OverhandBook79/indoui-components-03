import React from 'react';
import { ThemeProvider } from 'next-themes';

interface IndoUIProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  storageKey?: string;
}

export const IndoUIProvider: React.FC<IndoUIProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'indoui-color-mode',
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
};
