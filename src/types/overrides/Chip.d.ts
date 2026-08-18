// eslint-disable-next-line
import * as Chip from '@mui/material/Chip';

// @project
import { ChipIconPosition } from '@/enum';

declare module '@mui/material/Chip' {
  interface ChipOwnProps {
    position?: ChipIconPosition;
  }

  interface ChipPropsVariantOverrides {
    text;
    light;
    tag;
  }

  interface ChipPropsSizeOverrides {
    large: true;
  }
}
