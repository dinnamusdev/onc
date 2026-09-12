'use client';

import { MouseEvent, useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @third-party
import useSWR from 'swr';

// @project
import { ThemeDirection } from '@/config';
import MainCard from '@/components/MainCard';
import Profile from '@/components/Profile';
import ProfileForm from '@/sections/users/ProfileForm';
import { AuthRole, AvatarSize } from '@/enum';
import useCurrentUser from '@/hooks/useCurrentUser';
import { logout } from '@/utils/api/auth';
import { getUsers } from '@/utils/api/users';

// @types
import { ProfileProps } from '@/types/profile';
import { User } from '@/types/users';

// @assets
import { IconLogout, IconSettings } from '@tabler/icons-react';

const RoleTitles: Record<AuthRole, string> = {
  [AuthRole.SUPER_ADMIN]: 'Super Admin',
  [AuthRole.ADMIN]: 'Admin',
  [AuthRole.USER]: 'User'
};

/***************************  HEADER - PROFILE  ***************************/

export default function ProfileSection() {
  const theme = useTheme();
  const { userData } = useCurrentUser();

  const { data: registeredUsers } = useSWR<User[]>(userData?.email ? `/api/users?email=${encodeURIComponent(userData.email)}` : null, async () => {
    const { data, error } = await getUsers({ email: userData?.email });
    if (error) throw new Error(error);
    return (Array.isArray(data) ? data : data ? [data] : []) as User[];
  });

  const registeredUser = registeredUsers?.[0];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openProfile, setOpenProfile] = useState(false);

  const open = Boolean(anchorEl);
  const id = open ? 'profile-action-popper' : undefined;
  const buttonStyle = { borderRadius: 2, p: 1 };

  const profileData: ProfileProps = {
    // Prioriza fotoURL do perfil completo (SWR); cai para o valor persistido no AuthContext.
    avatar: { src: registeredUser?.fotoURL || userData?.fotoURL || undefined, size: AvatarSize.XS },
    title:
      registeredUser?.nomeCompleto ||
      registeredUser?.userName ||
      `${userData?.firstname ?? ''} ${userData?.lastname ?? ''}`.trim() ||
      userData?.nomeCompleto ||
      userData?.userName ||
      userData?.email ||
      'Usuário',
    caption: userData?.role ? RoleTitles[userData.role] : undefined,
    placeholderIfEmpty: true
  };

  const handleActionClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const logoutAccount = () => {
    setAnchorEl(null);
    logout();
  };

  return (
    <>
      <Box onClick={handleActionClick} sx={{ cursor: 'pointer' }}>
        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Profile {...profileData} />
        </Box>
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <Avatar {...profileData.avatar} alt={profileData.title} />
        </Box>
      </Box>
      <Popper
        placement="bottom-end"
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [theme.direction === ThemeDirection.RTL ? -8 : 8, 8] } }] }}
      >
        {({ TransitionProps }) => (
          <Fade in={open} {...TransitionProps}>
            <MainCard sx={{ borderRadius: 2, boxShadow: theme.vars.customShadows.tooltip, minWidth: 220, p: 0.5 }}>
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <Stack sx={{ px: 0.5, py: 0.75 }}>
                  <Profile
                    {...profileData}
                    sx={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      textAlign: 'center',
                      width: 1,
                      '& .MuiAvatar-root': { width: 48, height: 48 }
                    }}
                  />
                  <Divider sx={{ my: 1 }} />
                  <List disablePadding>
                    <ListItemButton
                      onClick={() => { setAnchorEl(null); setOpenProfile(true); }}
                      sx={{ ...buttonStyle, my: 0.5 }}
                    >
                      <ListItemIcon>
                        <IconSettings size={16} />
                      </ListItemIcon>
                      <ListItemText primary="Perfil" />
                    </ListItemButton>
                    <ListItem disablePadding>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        size="small"
                        endIcon={<IconLogout size={16} />}
                        onClick={logoutAccount}
                      >
                        Sair
                      </Button>
                    </ListItem>
                  </List>
                </Stack>
              </ClickAwayListener>
            </MainCard>
          </Fade>
        )}
      </Popper>

      <Dialog open={openProfile} onClose={() => setOpenProfile(false)} maxWidth={false} fullWidth scroll="paper" sx={{ maxWidth: '1600px', margin: 'auto' }}
        PaperProps={{
          sx: {
            borderRadius: 2.5,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }
        }}>
        <ProfileForm onClose={() => setOpenProfile(false)} />
      </Dialog>
    </>
  );
}
