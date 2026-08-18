// @mui
import { Theme } from '@mui/material/styles';

/***************************  OVERRIDES - CARD ACTIONS  ***************************/

export default function CardActions(theme: Theme) {
  return {
    MuiCardActions: {
      styleOverrides: {
        root: { padding: 20, borderTop: `1px solid ${theme.vars.palette.divider}` }
      }
    }
  };
}
