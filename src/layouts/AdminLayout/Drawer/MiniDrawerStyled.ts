// @mui
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

// @project
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from '@/config';

// Sidebar background color using theme palette CSS variables
// Light: grey.100 (#F5F2FA) - surface container low
// Dark: grey.100 (#1B1B1F) - surface container low
const commonDrawerStyles = (theme: Theme) =>
  ({
    borderRight: 'none',
    overflowX: 'hidden',
    backgroundColor: theme.vars.palette.background.paper,
    color: theme.vars.palette.text.primary
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
