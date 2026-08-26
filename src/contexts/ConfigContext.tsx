'use client';

import { createContext, useMemo, memo } from 'react';

// @project
import config from '@/config';
import useLocalStorage from '@/hooks/useLocalStorage';

// @types
import { ChildrenProps } from '@/types/root';
import { ConfigContextValue, ConfigStates } from '@/types/config';

const CONFIG_KEY = 'saas-able-react-mui-admin-vite-ts';

// Valid config keys — limpa localStorage se tiver campos inválidos
const VALID_KEYS: (keyof ConfigStates)[] = ['currentTheme', 'themeDirection', 'miniDrawer', 'i18n'];

function sanitizeConfig(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const hasInvalidKeys = Object.keys(parsed).some((k) => !VALID_KEYS.includes(k as keyof ConfigStates));
    if (hasInvalidKeys) {
      localStorage.removeItem(CONFIG_KEY);
    }
  } catch {
    localStorage.removeItem(CONFIG_KEY);
  }
}

// Executa a limpeza SINCRONAMENTE no carregamento do módulo, antes de qualquer
// render — garante que o useLocalStorage nunca leia um valor corrompido/legado.
sanitizeConfig();

/***************************  CONFIG CONTEXT  ***************************/

export const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

/***************************  CONFIG PROVIDER  ***************************/

const ConfigProviderComponent = function ConfigProvider({ children }: ChildrenProps) {
  const { state, setState, setField, resetState } = useLocalStorage<ConfigStates>(CONFIG_KEY, config);

  const memoizedValue = useMemo(() => ({ state, setState, setField, resetState }), [state, setField, setState, resetState]);

  return <ConfigContext.Provider value={memoizedValue}>{children}</ConfigContext.Provider>;
};

export const ConfigProvider = memo(ConfigProviderComponent);
