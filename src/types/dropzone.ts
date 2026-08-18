// @mui
import { Theme, SxProps } from '@mui/material/styles';

// @third-party
import { DropzoneOptions } from 'react-dropzone';

/***************************  TYPES - DROPZONE  ***************************/

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean;
  file: CustomFile[] | string | null;
  setFieldValue: (field: string, value: CustomFile[] | string | null) => void;
  sx?: SxProps<Theme>;
  initialFile?: string;
}
