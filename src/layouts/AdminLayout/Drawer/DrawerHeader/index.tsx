'use client';

// @mui
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @project
import { handlerDrawerOpen, useGetMenuMaster } from '@/states/menu';
import Logo from '@/components/logo';

// @assets
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarRightCollapse } from '@tabler/icons-react';

interface Props {
  open: boolean;
}

/***************************  DRAWER HEADER  ***************************/

export default function DrawerHeader({ open }: Props) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  return (
    <Box sx={{ width: 1, px: 2, py: { xs: 2, md: 2.5 } }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: open ? 'space-between' : 'center', height: 36 }}>
        {open && (
          <Box sx={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}>
            <Logo />
          </Box>
        )}
        <IconButton
          aria-label="open drawer"
          onClick={() => handlerDrawerOpen(!drawerOpen)}
          size="small"
          sx={{
            color: 'rgba(255,255,255,0.70)',
            border: '1px solid rgba(255,255,255,0.20)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.35)' }
          }}
        >
          {!drawerOpen ? <IconLayoutSidebarRightCollapse size={20} /> : <IconLayoutSidebarLeftCollapse size={20} />}
        </IconButton>
      </Stack>
    </Box>
  );
}
