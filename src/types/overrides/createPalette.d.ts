/* eslint-disable */
import * as createPalette from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
    100?: string;
    400?: string;
  }

  interface PaletteColor {
    lighter: string;
    darker: string;
    100: string;
    400: string;
  }
}
