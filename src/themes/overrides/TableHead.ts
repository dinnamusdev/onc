// @mui
import { Theme } from '@mui/material/styles';

/***************************  OVERRIDES - TABLE HEAD  ***************************/

export default function TableHead(theme: Theme) {
  return {
    MuiTableHead: {
      styleOverrides: {
        root: { background: theme.vars.palette.grey[100] }
      }
    }
  };
}
