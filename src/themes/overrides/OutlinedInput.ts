// @mui
import { Theme } from '@mui/material/styles';

/***************************  OVERRIDES - OUTLINED INPUT  ***************************/

export default function OutlinedInput(theme: Theme) {
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px transparent inset',
            WebkitTextFillColor: 'inherit',
            caretColor: 'inherit',
            transition: 'background-color 5000s ease-in-out 0s'
          },
          '&:-webkit-autofill:hover': {
            WebkitBoxShadow: '0 0 0 1000px transparent inset',
            WebkitTextFillColor: 'inherit',
            caretColor: 'inherit',
            transition: 'background-color 5000s ease-in-out 0s'
          },
          '&:-webkit-autofill:focus': {
            WebkitBoxShadow: '0 0 0 1000px transparent inset',
            WebkitTextFillColor: 'inherit',
            caretColor: 'inherit',
            transition: 'background-color 5000s ease-in-out 0s'
          },
          '&:-webkit-autofill:active': {
            WebkitBoxShadow: '0 0 0 1000px transparent inset',
            WebkitTextFillColor: 'inherit',
            caretColor: 'inherit',
            transition: 'background-color 5000s ease-in-out 0s'
          }
        }
      }
    }
  };
}
