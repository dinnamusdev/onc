// @mui
import { Theme } from '@mui/material/styles';

/***************************  OVERRIDES - OUTLINED INPUT  ***************************/

export default function OutlinedInput(theme: Theme) {
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // Autofill styling is handled in globals.css
        }
      }
    }
  };
}
