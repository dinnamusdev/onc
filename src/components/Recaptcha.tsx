'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

// @mui
import Box from '@mui/material/Box';

/***************************  RECAPTCHA V2  ***************************/

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, params: Record<string, unknown>) => number;
      reset: (widgetId?: number) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

const SCRIPT_ID = 'google-recaptcha-script';

export interface RecaptchaHandle {
  reset: () => void;
}

interface RecaptchaProps {
  onChange: (token: string | null) => void;
}

const Recaptcha = forwardRef<RecaptchaHandle, RecaptchaProps>(function Recaptcha({ onChange }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current !== null) window.grecaptcha?.reset(widgetIdRef.current);
      onChangeRef.current(null);
    }
  }));

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;

    const renderWidget = () => {
      if (!containerRef.current || !window.grecaptcha || widgetIdRef.current !== null) return;
      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        hl: 'pt-BR',
        callback: (token: string) => onChangeRef.current(token),
        'expired-callback': () => onChangeRef.current(null),
        'error-callback': () => onChangeRef.current(null)
      });
    };

    if (window.grecaptcha?.render) {
      renderWidget();
    } else {
      window.onRecaptchaLoad = renderWidget;
      if (!document.getElementById(SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit&hl=pt-BR';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      widgetIdRef.current = null;
    };
  }, []);

  if (!RECAPTCHA_SITE_KEY) return null;

  return <Box ref={containerRef} sx={{ display: 'flex', justifyContent: 'center', minHeight: 78 }} />;
});

export default Recaptcha;
