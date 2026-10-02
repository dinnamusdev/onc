// @mui
import { Theme } from '@mui/material/styles';

/***************************  OVERRIDES - FILLED INPUT  ***************************/

export default function FilledInput(theme: Theme) {
  return {
    MuiFilledInput: {
      styleOverrides: {
        root: {
          // Autofill styling is handled in globals.css
        }
      }
    }
  };
}
