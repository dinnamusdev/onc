'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

/***************************  LEAD FORM HEADER CONTEXT  ***************************/
// Permite que um formulário multi-step público (ex.: CertificacaoForm, TreinamentoForm)
// publique seu título, frase de aviso e Stepper para serem renderizados no cabeçalho fixo
// do LeadLayout (junto com a logo), em vez de dentro do card que rola com a página.

export interface LeadFormHeaderState {
  title?: string;
  subtitle?: string;
  steps?: string[];
  activeStep?: number;
  onStepClick?: (stepIndex: number) => void;
}

export interface LeadFormNotice {
  id: number;
  message: string;
}

const NOTICE_DURATION_MS = 6000;

interface LeadFormHeaderContextValue {
  header: LeadFormHeaderState;
  setHeader: (header: LeadFormHeaderState) => void;
  clearHeader: () => void;
  notice: LeadFormNotice | null;
  showNotice: (message: string) => void;
  dismissNotice: () => void;
}

const LeadFormHeaderContext = createContext<LeadFormHeaderContextValue | undefined>(undefined);

export function LeadFormHeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeaderState] = useState<LeadFormHeaderState>({});

  // Identidades estáveis (não recriadas a cada mudança de `header`), para poderem ser usadas
  // com segurança como dependência de useEffect sem disparar o efeito repetidamente.
  const setHeader = useCallback((next: LeadFormHeaderState) => setHeaderState(next), []);
  const clearHeader = useCallback(() => setHeaderState({}), []);

  const [notice, setNotice] = useState<LeadFormNotice | null>(null);
  const showNotice = useCallback((message: string) => setNotice((prev) => ({ id: (prev?.id ?? 0) + 1, message })), []);
  const dismissNotice = useCallback(() => setNotice(null), []);

  // Cada novo aviso (mesmo com texto igual, pois o id muda) reinicia o tempo de exibição.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), NOTICE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [notice]);

  const value = useMemo(
    () => ({ header, setHeader, clearHeader, notice, showNotice, dismissNotice }),
    [header, setHeader, clearHeader, notice, showNotice, dismissNotice]
  );

  return <LeadFormHeaderContext.Provider value={value}>{children}</LeadFormHeaderContext.Provider>;
}

export function useLeadFormHeader() {
  const context = useContext(LeadFormHeaderContext);
  if (!context) {
    throw new Error('useLeadFormHeader deve ser usado dentro de um LeadFormHeaderProvider');
  }
  return context;
}
