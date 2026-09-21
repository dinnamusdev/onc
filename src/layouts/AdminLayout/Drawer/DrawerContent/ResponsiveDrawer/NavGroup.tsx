// @mui
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

// @project
import NavCollapse from './NavCollapse';
import NavItem from './NavItem';
import useCurrentUser from '@/hooks/useCurrentUser';

// @third-party
import { FormattedMessage } from 'react-intl';

// @types
import { NavItemType } from '@/types/menu';

interface Props {
  item: NavItemType;
}

/***************************  RESPONSIVE DRAWER - GROUP  ***************************/

export default function NavGroup({ item }: Props) {
  const theme = useTheme();
  const { userData } = useCurrentUser();

  const renderNavItem = (menuItem: NavItemType) => {
    const userRole = userData?.role;

    // Check if menuItem has roles and whether userRole is allowed
    if (menuItem.roles?.length && userRole && !menuItem.roles.includes(userRole)) {
      return null;
    }

    // Render items based on the type
    switch (menuItem.type) {
      case 'collapse':
        return <NavCollapse key={menuItem.id} item={menuItem} />;
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  };

  return (
    <List
      component="div"
      subheader={
        <Typography 
          component="div" 
          variant="caption" 
          sx={{ 
            mb: 0.75, 
            color: theme.vars.palette.text.secondary,
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            fontSize: '0.68rem',
            ...theme.applyStyles('dark', {
              color: theme.vars.palette.text.primary
            })
          }}
        >
          <FormattedMessage id={item.title} />
        </Typography>
      }
      sx={{ '&:not(:first-of-type)': { pt: 1, borderTop: '1px solid', borderColor: theme.vars.palette.divider } }}
    >
      {item.children?.map((menuItem) => renderNavItem(menuItem))}
    </List>
  );
}
