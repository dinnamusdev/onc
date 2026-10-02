// @mui
import { Theme } from '@mui/material/styles';

/***************************  OVERRIDES - AUTOCOMPLETE  ***************************/

export default function Autocomplete(theme: Theme) {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          // Autofill styling is handled in globals.css
        }
      }
    }
  };
}
