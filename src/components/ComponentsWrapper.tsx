// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @types
import { ChildrenProps } from '@/types/root';

interface Props extends ChildrenProps {
  title: string;
}

/***************************  COMPONENTS WRAPPER  ***************************/

export default function ComponentsWrapper({ children, title }: Props) {
  return (
    <Stack sx={{ gap: { xs: 2, sm: 4 } }}>
      <Stack sx={{ py: 1.25, justifyContent: 'center' }}>
        <Typography variant="h6">{title}</Typography>
      </Stack>
      {children}
    </Stack>
  );
}
