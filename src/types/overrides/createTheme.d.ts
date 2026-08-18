// @mui

import * as Theme from '@mui/material/styles';

// @project
import { CustomShadowProps } from '@types/mui';

declare module '@mui/material/styles' {
  interface ThemeVars {
    customShadows: CustomShadowProps;
    typography: Theme['typography'];
    transitions: Theme['transitions'];
  }

  interface ColorSystem {
    customShadows: CustomShadowProps;
  }

  interface ColorSystemOptions {
    customShadows?: CustomShadowProps;
  }
}
