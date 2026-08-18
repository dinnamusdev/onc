// @mui
import { Theme } from '@mui/material/styles';

/***************************  OVERRIDES - CHARTS AXIS HIGHLIGHT  ***************************/

export default function ChartsAxiasHighlight(theme: Theme) {
  return {
    MuiChartsAxisHighlight: {
      styleOverrides: {
        root: {
          stroke: theme.vars.palette.grey[600]
        }
      }
    }
  };
}
