import { ReactNode } from 'react';

// @mui
import { styled } from '@mui/material/styles';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Slide, { SlideProps } from '@mui/material/Slide';
import Zoom from '@mui/material/Zoom';

// @third-party
import { SnackbarProvider } from 'notistack';

// @project
import { useGetSnackbar } from '@/states/snackbar';

// @types
import { KeyedObject } from '@/types/root';

// @assets
import { IconAlertTriangle, IconBug, IconChecks, IconInfoCircle, IconSpeakerphone } from '@tabler/icons-react';

// custom styles
const StyledSnackbarProvider = styled(SnackbarProvider)(({ theme }) => ({
  '&.notistack-MuiContent': {
    color: theme.vars.palette.background.default
  },
  '&.notistack-MuiContent-default': {
    backgroundColor: theme.vars.palette.primary.main
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: theme.vars.palette.error.main
  },
  '&.notistack-MuiContent-success': {
    backgroundColor: theme.vars.palette.success.main
  },
  '&.notistack-MuiContent-info': {
    backgroundColor: theme.vars.palette.info.main
  },
  '&.notistack-MuiContent-warning': {
    backgroundColor: theme.vars.palette.warning.main
  },
  '& #notistack-snackbar': {
    gap: 8
  }
}));

/***************************  SNACKBAR - ANIMATION  ***************************/

function TransitionSlideLeft(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

function TransitionSlideUp(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

function TransitionSlideRight(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

function TransitionSlideDown(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

function GrowTransition(props: SlideProps) {
  return <Grow {...props} />;
}

function ZoomTransition(props: SlideProps) {
  return <Zoom {...props} />;
}

const animation: KeyedObject = {
  SlideLeft: TransitionSlideLeft,
  SlideUp: TransitionSlideUp,
  SlideRight: TransitionSlideRight,
  SlideDown: TransitionSlideDown,
  Grow: GrowTransition,
  Zoom: ZoomTransition,
  Fade
};

const iconSX = { fontSize: '1.15rem' };

/***************************  SNACKBAR - NOTISTACK  ***************************/

export default function Notistack({ children }: { children: ReactNode }) {
  const { snackbar } = useGetSnackbar();

  return (
    <StyledSnackbarProvider
      maxSnack={snackbar.maxStack}
      dense={snackbar.dense}
      anchorOrigin={snackbar.anchorOrigin}
      TransitionComponent={animation[snackbar.transition]}
      iconVariant={
        snackbar.iconVariant === 'useemojis'
          ? {
              default: <IconSpeakerphone style={iconSX} />,
              success: <IconChecks style={iconSX} />,
              error: <IconBug style={iconSX} />,
              warning: <IconAlertTriangle style={iconSX} />,
              info: <IconInfoCircle style={iconSX} />
            }
          : undefined
      }
      hideIconVariant={snackbar.iconVariant === 'hide' ? true : false}
    >
      {children}
    </StyledSnackbarProvider>
  );
}
