// @mui
import { Theme } from '@mui/material/styles';

/***************************  OVERRIDES - INPUT  ***************************/

export default function Input(theme: Theme) {
  return {
    MuiInput: {
      styleOverrides: {
        root: {
          // Autofill styling is handled in globals.css
        }
      }
    }
  };
}
