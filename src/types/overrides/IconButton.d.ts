// eslint-disable-next-line
import * as IconButton from '@mui/material/IconButton';

declare module '@mui/material/IconButton' {
  interface IconButtonOwnProps {
    variant?: string;
  }

  interface OverridableTypeMap {
    props: {
      variant?: string;
    };
  }
}
