// @mui
import { Theme } from '@mui/material/styles';

/***************************  OVERRIDES - DAY CALENDAR  ***************************/

export default function DayCalendar(theme: Theme) {
  return {
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: {
          ...theme.typography.body1,
          color: theme.vars.palette.text.primary
        }
      }
    }
  };
}
