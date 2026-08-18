'use client';

import { useEffect, useState } from 'react';

// @third-party
import { IntlProvider, MessageFormatElement } from 'react-intl';

// @project
import { ThemeI18n } from '@/config';
import useConfig from '@/hooks/useConfig';
import { ChildrenProps } from '@/types/root';

// @locales
// Cache for loaded locale data to avoid re-importing
const localeCache = new Map<ThemeI18n, Record<string, string> | Record<string, MessageFormatElement[]>>();

const loadLocaleData = (locale: ThemeI18n) => {
  // Return cached data if available
  if (localeCache.has(locale)) {
    return Promise.resolve({ default: localeCache.get(locale)! });
  }

  switch (locale) {
    case ThemeI18n.FR:
      return import('@/utils/locales/fr.json').then((data) => {
        localeCache.set(locale, data.default);
        return data;
      });
    case ThemeI18n.RO:
      return import('@/utils/locales/ro.json').then((data) => {
        localeCache.set(locale, data.default);
        return data;
      });
    case ThemeI18n.ZH:
      return import('@/utils/locales/zh.json').then((data) => {
        localeCache.set(locale, data.default);
        return data;
      });
    case ThemeI18n.EN:
    default:
      return import('@/utils/locales/en.json').then((data) => {
        localeCache.set(locale, data.default);
        return data;
      });
  }
};

/***************************  LOCALIZATION  ***************************/

export default function Locales({ children }: ChildrenProps) {
  const {
    state: { i18n }
  } = useConfig();

  const [messages, setMessages] = useState<Record<string, string> | Record<string, MessageFormatElement[]> | undefined>(() => {
    // Initialize with cached data if available
    return localeCache.get(i18n);
  });

  useEffect(() => {
    // Check if we have cached data
    if (localeCache.has(i18n)) {
      setMessages(localeCache.get(i18n));
      return;
    }

    loadLocaleData(i18n).then((d: { default: Record<string, string> | Record<string, MessageFormatElement[]> | undefined }) => {
      setMessages(d.default);
    });
  }, [i18n]);

  return (
    <IntlProvider locale={i18n} defaultLocale="en" messages={messages}>
      {children as React.ReactElement}
    </IntlProvider>
  );
}
