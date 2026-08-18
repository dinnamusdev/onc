// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @images
import { UnboxingDoodle } from '@/images/illustration';

/***************************  REACT TABLE - EMPTY  ***************************/

export default function EmptyTable({ msg }: { msg: string }) {
  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: 150 }}>
      <UnboxingDoodle />
      <Typography color="text.secondary">{msg}</Typography>
    </Stack>
  );
}
