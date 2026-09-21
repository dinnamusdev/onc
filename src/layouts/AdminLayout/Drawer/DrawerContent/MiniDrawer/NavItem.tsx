import { useEffect } from 'react';

// @next
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// @mui
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// @project
import { handlerActiveItem, useGetMenuMaster } from '@/states/menu';
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

/***************************  MINI DRAWER - ITEM  ***************************/

export default function NavItem({ item, level = 0 }: Props) {
  const theme = useTheme();
  const { menuMaster } = useGetMenuMaster();
  const openItem = menuMaster.openedItem;

  // Active menu item on page load
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === item.url) handlerActiveItem(item.id!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isSelected = openItem === item.id;

  // level 0: icon in sidebar → use theme colors
  // level > 0: popup over white background → use theme colors
  const iconcolor =
    level === 0
      ? isSelected
        ? theme.vars.palette.primary.main
        : theme.vars.palette.text.secondary
      : isSelected
        ? theme.vars.palette.primary.main
        : theme.vars.palette.text.primary;
  const listItemAvatarStyle = {
    p: 0,
    my: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'default',
    '&:hover, &:focus': { bgcolor: 'transparent', '& .MuiListItemAvatar-root': { bgcolor: theme.vars.palette.action.hover } },
    '&.Mui-selected': {
      bgcolor: 'transparent',
      '& .MuiListItemAvatar-root': { bgcolor: withAlpha(theme.vars.palette.primary.main, 0.2) },
      '&:hover, &:focus': { bgcolor: 'transparent', '& .MuiListItemAvatar-root': { bgcolor: withAlpha(theme.vars.palette.primary.main, 0.3) } }
    }
  };

  // level > 0 - popup list item text style (over white background)
  const listItemStyle = {
    color: 'text.primary',
    '&.Mui-selected': {
      color: 'primary.main',
      bgcolor: 'transparent',
      ...theme.applyStyles('dark', { color: 'primary.light' }),
      '&:hover': { bgcolor: 'action.hover' },
      '&.Mui-focusVisible': { bgcolor: 'action.focus' },
      '& .MuiTypography-root': { fontWeight: 600 }
    }
  };

  return (
    <ListItemButton
      id={`${item.id}-btn`}
      selected={isSelected}
      disabled={item.disabled}
      disableRipple={level === 0}
      {...(level > 0 && { component: Link, href: item.url || '#', ...(item?.target && { target: '_blank' }) })}
      sx={{ ...(level === 0 ? listItemAvatarStyle : listItemStyle) }}
    >
      {level === 0 && (
        <ButtonBase
          component={Link}
          href={item.url || '#'}
          {...(item?.target && { target: '_blank' })}
          tabIndex={-1}
          sx={{ borderRadius: 2 }}
          aria-label="list-button"
        >
          <ListItemAvatar
            sx={{
              minWidth: 32,
              width: 44,
              height: 44,
              borderRadius: 2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ListItemIcon sx={{ minWidth: 0 }}>
              <DynamicIcon name={item.icon as DynamicIconProps['name']} size={22} stroke={1.5} color={iconcolor} />
            </ListItemIcon>
          </ListItemAvatar>
        </ButtonBase>
      )}
      {level > 0 && item.icon && (
        <ListItemIcon sx={{ minWidth: 32 }}>
          <DynamicIcon name={item.icon as DynamicIconProps['name']} color={iconcolor} size={18} stroke={1.5} />
        </ListItemIcon>
      )}
      {level > 0 && <ListItemText primary={<FormattedMessage id={item.title} />} />}
    </ListItemButton>
  );
}
