import { ReactNode } from 'react';

// @mui
import { SxProps } from '@mui/material/styles';
import { AvatarProps } from '@mui/material/Avatar';
import { TypographyProps } from '@mui/material/Typography';

export interface ProfileProps {
  avatar?: AvatarProps;
  title?: string;
  caption?: string;
  label?: ReactNode;
  sx?: SxProps;
  titleProps?: TypographyProps;
  captionProps?: TypographyProps;
  placeholderIfEmpty?: boolean;
}
