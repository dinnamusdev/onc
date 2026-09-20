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
import { withAlpha } from '@/utils/colorUtils';

// @third-party
import { FormattedMessage } from 'react-intl';

// @types
import { NavItemType } from '@/types/menu';
import { DynamicIconProps } from '@/types/tabler';

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
  const iconcolor = isActive ? theme.vars.palette.primary.main : theme.vars.palette.text.secondary;

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
        color: theme.vars.palette.text.primary,
        '&:hover': { bgcolor: theme.vars.palette.action.hover },
        ...(level === 0 && {
          my: 0.25,
          '&.Mui-selected': {
            bgcolor: withAlpha(theme.vars.palette.primary.main, 0.15),
            color: theme.vars.palette.primary.main,
            '&:hover': { bgcolor: withAlpha(theme.vars.palette.primary.main, 0.25) },
            '&.Mui-focusVisible': { bgcolor: withAlpha(theme.vars.palette.primary.main, 0.15) }
          }
        }),
        ...(level > 0 && {
          '&.Mui-selected': {
            color: theme.vars.palette.primary.main,
            bgcolor: 'transparent',
            '&:hover': { bgcolor: theme.vars.palette.action.hover },
            '&.Mui-focusVisible': { bgcolor: theme.vars.palette.action.hover },
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
