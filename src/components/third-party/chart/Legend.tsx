// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface LegendProps {
  items: { label: string; color: string; visible: boolean; id: string }[];
  onToggle: (id: string) => void;
}

/***************************  CHART - LEGEND  ***************************/

export default function Legend({ items, onToggle }: LegendProps) {
  return (
    <Stack direction="row" sx={{ justifyContent: 'flex-end', gap: 1.5 }}>
      {items.map((item) => (
        <Stack key={item.id} direction="row" sx={{ alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={() => onToggle(item.id)}>
          <Box sx={{ width: 15, height: 15, bgcolor: item.visible ? item.color : 'grey.600', borderRadius: '50%' }} />
          <Typography variant="caption" color="text.secondary">
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
