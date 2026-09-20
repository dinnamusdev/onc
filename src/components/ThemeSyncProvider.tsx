'use client';

import { useEffect } from 'react';

// @mui
import { useColorScheme } from '@mui/material/styles';

// @project
import useConfig from '@/hooks/useConfig';
import { ThemeMode } from '@/config';

// @types
import { ChildrenProps } from '@/types/root';

/***************************  THEME SYNC PROVIDER  ***************************/

/**
 * Sincroniza o estado da aplicação com o MUI's useColorScheme hook
 * Garante que mudanças no tema (claro/escuro) sejam aplicadas em tempo real
 */
export default function ThemeSyncProvider({ children }: ChildrenProps) {
  const { setColorScheme } = useColorScheme();
  const { state } = useConfig();

  // Sincroniza o tema com o MUI's useColorScheme
  useEffect(() => {
    if (!setColorScheme) return;

    // Verifica se há um valor salvo no localStorage do MUI
    const storedMode = localStorage.getItem('theme-mode');
    if (storedMode === 'light' || storedMode === 'dark') {
      setColorScheme(storedMode as 'light' | 'dark');
    } else {
      // Fallback para nulo (segue sistema) se nada estiver salvo
      setColorScheme(null);
    }
  }, [setColorScheme]);

  return <>{children}</>;
}
