'use client';

// @mui
import { useTheme } from '@mui/material/styles';

// @types
import { ImageCommonProps, ImageComponentProps } from '@/types/graphics';

/***************************  IMAGE - TYPE IDENTIFY ***************************/

function isImageComponentProps(value: ImageCommonProps): value is ImageComponentProps {
  return (value as ImageComponentProps).light !== undefined && (value as ImageComponentProps).dark !== undefined;
}

/***************************  COMMON - IMAGE PATH  ***************************/

export default function GetImagePath(image: string | ImageComponentProps) {
  const theme = useTheme();

  return isImageComponentProps(image) ? image[theme.palette.mode] : image;
}
