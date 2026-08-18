// @mui
import { Theme } from '@mui/material/styles';
import { LinearProgressProps } from '@mui/material/LinearProgress';

const validPaletteKeys = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;
type ValidPaletteKey = (typeof validPaletteKeys)[number];
const isValidPaletteKey = (value: unknown): value is ValidPaletteKey => validPaletteKeys.includes(value as ValidPaletteKey);

/***************************  COMPONENT - LINEAR PROGRESS  ***************************/

export default function LinearProgress(theme: Theme) {
  return {
    MuiLinearProgress: {
      defaultProps: {
        variant: 'determinate'
      },
      styleOverrides: {
        root: ({ ownerState }: { ownerState: LinearProgressProps }) => {
          const paletteColor = isValidPaletteKey(ownerState.color) ? theme.vars.palette[ownerState.color] : undefined;
          return {
            ...(paletteColor && {
              '& .MuiLinearProgress-bar': {
                backgroundColor: paletteColor.main,
                ...theme.applyStyles('dark', { backgroundColor: paletteColor.light })
              }
            }),
            borderRadius: 24,
            backgroundColor: theme.vars.palette.grey[100],
            ...theme.applyStyles('dark', { backgroundColor: theme.vars.palette.grey[300] }),
            variants: [
              {
                props: { type: 'light' },
                style: {
                  '& .MuiLinearProgress-bar': {
                    opacity: 0.6
                  }
                }
              }
            ]
          };
        },
        bar: {
          borderRadius: 24
        }
      }
    }
  };
}
