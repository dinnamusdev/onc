'use client';

// @mui
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  return (
    <Box sx={{ width: 1, px: 2, py: { xs: 2, md: 2.5 } }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: open ? 'space-between' : 'center', height: 36 }}>
        {open && (
          <Box>
            <Logo />
          </Box>
        )}
        <IconButton
          aria-label="open drawer"
          onClick={() => handlerDrawerOpen(!drawerOpen)}
          size="small"
          sx={{
            color: theme.vars.palette.text.secondary,
            border: '1px solid',
            borderColor: theme.vars.palette.divider,
            '&:hover': { 
              bgcolor: theme.vars.palette.action.hover,
              borderColor: theme.vars.palette.primary.main
            }
          }}
        >
          {!drawerOpen ? <IconLayoutSidebarRightCollapse size={20} /> : <IconLayoutSidebarLeftCollapse size={20} />}
        </IconButton>
      </Stack>
    </Box>
  );
}
