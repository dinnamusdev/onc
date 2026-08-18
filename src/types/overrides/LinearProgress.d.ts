// eslint-disable-next-line
import * as LinearProgress from '@mui/material/LinearProgress';

// @project
import { LinearProgressType } from '@/enum';

declare module '@mui/material/LinearProgress' {
  interface LinearProgressProps {
    type?: LinearProgressType.LIGHT;
  }
}
