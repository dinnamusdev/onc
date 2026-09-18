// @mui
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

// @project
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from '@/config';

// Sidebar background color (gentelella-inspired dark wine/brown)
export const SIDEBAR_BG = '#2C1810';
export const SIDEBAR_BG_DARKER = '#231410';

// Mixin for common ) (open/closed) drawer state0....
const commonDrawerStyles = (_theme: Theme) =>
  ({
    borderRight: 'none',
    overflowX: 'hidden',
    backgroundColor: SIDEBAR_BG
  }) as CSSObject;

// Mixin for opened drawer state
const openedMixin = (theme: Theme) =>
  ({
    ...commonDrawerStyles(theme),
    width: DRAWER_WIDTH,

    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  }) as CSSObject;

// Mixin for closed drawer state
const closedMixin = (theme: Theme) =>
  ({
    ...commonDrawerStyles(theme),
    width: MINI_DRAWER_WIDTH,

    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  }) as CSSObject;

/***************************  DRAWER - MINI STYLED  ***************************/

const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

export default MiniDrawerStyled;
