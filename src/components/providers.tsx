'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthProvider } from '@/contexts/auth-context';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider delayDuration={0}>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}
