import { useEffect } from 'react';

// @next
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// @mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// @project
import { handlerActiveItem, handlerDrawerOpen, useGetMenuMaster } from '@/states/menu';
import DynamicIcon from '@/components/DynamicIcon';

// @third-party
import { FormattedMessage } from 'react-intl';

// @types
import { NavItemType } from '@/types/menu';
import { DynamicIconProps } from '@/types/tabler';

// Sidebar dark theme color tokens
const SIDEBAR_TEXT = 'rgba(255,255,255,0.82)';
const SIDEBAR_TEXT_ACTIVE = '#FFCDD2';
const SIDEBAR_ACTIVE_BG = 'rgba(183,28,28,0.28)';
const SIDEBAR_HOVER_BG = 'rgba(255,255,255,0.07)';

interface Props {
  item: NavItemType;
  level?: number;
}

/***************************  RESPONSIVE DRAWER - ITEM  ***************************/

export default function NavItem({ item, level = 0 }: Props) {
  const theme = useTheme();
  const { menuMaster } = useGetMenuMaster();
  const openItem = menuMaster.openedItem;

  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  // Active menu item on page load
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === item.url) handlerActiveItem(item.id!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isActive = openItem === item.id;
  const iconcolor = isActive ? SIDEBAR_TEXT_ACTIVE : SIDEBAR_TEXT;

  const itemHandler = () => {
    if (downMD) handlerDrawerOpen(false);
  };

  return (
    <ListItemButton
      id={`${item.id}-btn`}
      component={Link}
      href={item.url || '#'}
      {...(item?.target && { target: '_blank' })}
      selected={isActive}
      disabled={item.disabled}
      onClick={itemHandler}
      sx={{
        color: SIDEBAR_TEXT,
        '&:hover': { bgcolor: SIDEBAR_HOVER_BG },
        ...(level === 0 && {
          my: 0.25,
          '&.Mui-selected': {
            bgcolor: SIDEBAR_ACTIVE_BG,
            color: SIDEBAR_TEXT_ACTIVE,
            '&:hover': { bgcolor: 'rgba(183,28,28,0.40)' },
            '&.Mui-focusVisible': { bgcolor: SIDEBAR_ACTIVE_BG }
          }
        }),
        ...(level > 0 && {
          '&.Mui-selected': {
            color: SIDEBAR_TEXT_ACTIVE,
            bgcolor: 'transparent',
            '&:hover': { bgcolor: SIDEBAR_HOVER_BG },
            '&.Mui-focusVisible': { bgcolor: SIDEBAR_HOVER_BG },
            '& .MuiTypography-root': { fontWeight: 600 }
          }
        })
      }}
    >
      {item.icon && (
        <ListItemIcon sx={{ color: 'inherit' }}>
          <DynamicIcon name={item.icon as DynamicIconProps['name']} color={iconcolor} size={18} stroke={1.5} />
        </ListItemIcon>
      )}
      <ListItemText primary={<FormattedMessage id={item.title} />} sx={{ mb: '-1px' }} />
    </ListItemButton>
  );
}
