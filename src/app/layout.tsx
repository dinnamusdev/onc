// @next
import type { Metadata, Viewport } from 'next';

// @style
import './globals.css';

// @mui
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

// @project
import branding from '@/branding.json';
import ProviderWrapper from './ProviderWrapper';

// @types
import { ChildrenProps } from '@/types/root';

/***************************  METADATA - MAIN  ***************************/

// Configures the viewport settings for the application.
export const viewport: Viewport = {
  userScalable: false // Disables user scaling of the viewport.
};

export const metadata: Metadata = {
  title: `${branding.brandName} React MUI Dashboard Template`,
  description: `${branding.brandName} React MUI Dashboard Template`
};

/***************************  LAYOUT - ROOT  ***************************/

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true, prepend: true }}>
          <ProviderWrapper>{children}</ProviderWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
