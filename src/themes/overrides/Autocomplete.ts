// @mui
import { Theme } from '@mui/material/styles';

/***************************  OVERRIDES - AUTOCOMPLETE  ***************************/

export default function Autocomplete(theme: Theme) {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px transparent inset',
            WebkitTextFillColor: 'inherit',
            caretColor: 'inherit',
            transition: 'background-color 5000s ease-in-out 0s'
          },
          '& .MuiInputBase-root:-webkit-autofill:hover': {
            WebkitBoxShadow: '0 0 0 1000px transparent inset',
            WebkitTextFillColor: 'inherit',
            caretColor: 'inherit',
            transition: 'background-color 5000s ease-in-out 0s'
          },
          '& .MuiInputBase-root:-webkit-autofill:focus': {
            WebkitBoxShadow: '0 0 0 1000px transparent inset',
            WebkitTextFillColor: 'inherit',
            caretColor: 'inherit',
            transition: 'background-color 5000s ease-in-out 0s'
          },
          '& .MuiInputBase-root:-webkit-autofill:active': {
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
