'use client';

// @mui
import Card, { CardProps } from '@mui/material/Card';
import { SxProps, Theme } from '@mui/material/styles';

/***************************  MAIN CARD  ***************************/

export default function MainCard({ children, sx = {}, ref, ...others }: CardProps) {
  const defaultSx: SxProps<Theme> = (theme) => ({
    p: { xs: 1.75, sm: 2.25, md: 3 },
    border: `1px solid ${theme.vars.palette.divider}`,
    borderRadius: 4,
    boxShadow: theme.vars.customShadows.section
  });

  const combinedSx: SxProps<Theme> = (theme) => ({
    ...defaultSx(theme),
    ...(typeof sx === 'function' ? sx(theme) : sx)
  });

  return (
    <Card ref={ref} elevation={0} sx={combinedSx} {...others}>
      {children}
    </Card>
  );
}
