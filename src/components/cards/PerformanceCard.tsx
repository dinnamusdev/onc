// @mui
import { CardProps } from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import MainCard from '@/components/MainCard';
import LinearProgressWithTarget from '@/components/progress/LinearProgressWithTarget';

// @types
import { TargetProgressProps } from '@/types/targetProgress';

export interface PerformanceCardProps {
  title: string;
  value: string;
  compare: string;
  targetProgress: TargetProgressProps;
  cardProps?: CardProps;
}

/***************************   CARD - PERFORMANCE   ***************************/

export default function PerformanceCard({ title, value, compare, targetProgress, cardProps }: PerformanceCardProps) {
  return (
    <MainCard {...cardProps}>
      <Stack sx={{ gap: 2.5 }}>
        <Typography variant="subtitle1">{title}</Typography>
        <Stack direction="row" sx={{ gap: 0.75, alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack sx={{ gap: 0.5 }}>
            <Typography variant="h4">{value}</Typography>
            <Typography variant="caption" color="grey.700">
              {compare}
            </Typography>
          </Stack>
          <Box sx={{ width: 128 }}>
            <LinearProgressWithTarget {...targetProgress} />
          </Box>
        </Stack>
      </Stack>
    </MainCard>
  );
}
