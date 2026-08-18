// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import MainCard from '@/components/MainCard';

// @types
import { CustomTooltipProps } from '@/types/chart';

/***************************  CHART - CUSTOM TOOLTIP  ***************************/

export default function CustomTooltip({ counter, groupLabel, label: xlabel }: CustomTooltipProps) {
  return (
    <MainCard sx={{ p: 1.25, borderRadius: 2, width: 'fit-content' }}>
      <Stack sx={{ alignItems: 'center', gap: 0.5 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
          <Typography variant="subtitle1">{counter}</Typography>
          <Typography variant="caption" color="text.secondary">
            {groupLabel}
          </Typography>
        </Stack>
        <Typography variant="body2">{xlabel}</Typography>
      </Stack>
    </MainCard>
  );
}
