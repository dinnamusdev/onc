'use client';

import { ReactNode } from 'react';

// @mui
import { styled, Theme, useTheme } from '@mui/material/styles';
import { MUIStyledCommonProps } from '@mui/system';
import Box from '@mui/material/Box';

// @third-party
import MainSimpleBar, { Props } from 'simplebar-react';
import { BrowserView, MobileView } from 'react-device-detect';

// @project
import { ThemeDirection } from '@/config';
import { withAlpha } from '@/utils/colorUtils';

// root style
const RootStyle = styled(BrowserView)({ flexGrow: 1, height: '100%', overflow: 'hidden' });

// scroll bar wrapper
const SimpleBarStyle = styled(MainSimpleBar)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      background: withAlpha(theme.vars.palette.grey[500], 0.48),
      ...theme.applyStyles('dark', { background: withAlpha(theme.vars.palette.grey[200], 0.48) })
    },
    '&.simplebar-visible:before': { opacity: 1 }
  },
  '& .simplebar-track.simplebar-vertical': { width: 10 },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': { height: 6 },
  '& .simplebar-mask': { zIndex: 'inherit' }
}));

/***************************  SIMPLE SCROLL BAR   ***************************/

export default function SimpleBar({ children, sx, ...other }: MUIStyledCommonProps<Theme> & Props) {
  const theme = useTheme();

  return (
    <>
      <RootStyle>
        <SimpleBarStyle
          clickOnTrack={false}
          sx={sx}
          data-simplebar-direction={theme.direction === ThemeDirection.RTL ? 'rtl' : 'ltr'}
          {...other}
        >
          {children as ReactNode}
        </SimpleBarStyle>
      </RootStyle>
      <MobileView>
        <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
          {children as ReactNode}
        </Box>
      </MobileView>
    </>
  );
}
