// @mui
import { Theme } from '@mui/material/styles';

/***************************  COMPONENT - BREADCRUMBS  ***************************/

export default function Breadcrumbs(theme: Theme) {
  return {
    MuiBreadcrumbs: {
      styleOverrides: {
        separator: {
          color: theme.vars.palette.text.secondary,
          marginLeft: 4,
          marginRight: 4
        }
      }
    }
  };
}
