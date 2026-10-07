// @mui
import { Theme } from '@mui/material/styles';

/***************************  OVERRIDES - TEXT FIELD  ***************************/

export default function TextField(theme: Theme) {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          // Autofill styling is handled in globals.css
        }
      }
    }
  };
}
