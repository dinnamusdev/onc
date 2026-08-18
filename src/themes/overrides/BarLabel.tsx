// @mui
import { Theme } from '@mui/material/styles';

/***************************  OVERRIDES - BAR LABEL  ***************************/

export default function BarLabel(theme: Theme) {
  return {
    MuiBarLabel: {
      styleOverrides: {
        root: {
          fill: theme.vars.palette.text.secondary
        }
      }
    }
  };
}
