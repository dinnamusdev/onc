'use client';

import { memo } from 'react';

// @mui
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

// @project
import Locales from '@/components/Locales';
import RTLLayout from '@/components/RTLLayout';
import Snackbar from '@/components/Snackbar';
import Notistack from '@/components/third-party/Notistack';
import { DEFAULT_THEME_MODE } from '@/config';
import { ConfigProvider } from '@/contexts/ConfigContext';
import ThemeCustomization from '@/themes';

// @types
import { ChildrenProps } from '@/types/root';

/***************************  LAYOUT - CONFIG, THEME  ***************************/

const ProviderWrapperComponent = function ProviderWrapper({ children }: ChildrenProps) {
  return (
    <>
      <InitColorSchemeScript modeStorageKey="theme-mode" attribute="data-color-scheme" defaultMode={DEFAULT_THEME_MODE} />
      <ConfigProvider>
        <ThemeCustomization>
          <RTLLayout>
            <Notistack>
              <Snackbar />
              <Locales>{children}</Locales>
            </Notistack>
          </RTLLayout>
        </ThemeCustomization>
      </ConfigProvider>
    </>
  );
};

export default memo(ProviderWrapperComponent);
