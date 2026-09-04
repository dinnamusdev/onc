'use client';

import { MouseEvent, useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';

// @project
import { ThemeDirection, ThemeI18n } from '@/config';
import MainCard from '@/components/MainCard';
import Profile from '@/components/Profile';
import { AuthRole, AvatarSize, ChipIconPosition } from '@/enum';
import useConfig from '@/hooks/useConfig';
import useCurrentUser from '@/hooks/useCurrentUser';
import { logout } from '@/utils/api/auth';

// @types
import { ProfileProps } from '@/types/profile';

// @assets
import { IconChevronRight, IconLanguage, IconLogout, IconSettings, IconTextDirectionLtr } from '@tabler/icons-react';

const languageList: { key: ThemeI18n; value: string }[] = [
  { key: ThemeI18n.EN, value: 'Inglês' },
  { key: ThemeI18n.FR, value: 'Francês' },
  { key: ThemeI18n.RO, value: 'Romeno' },
  { key: ThemeI18n.ZH, value: 'Chinês' }
];

const RoleTitles: Record<AuthRole, string> = {
  [AuthRole.SUPER_ADMIN]: 'Super Admin',
  [AuthRole.ADMIN]: 'Admin',
  [AuthRole.USER]: 'User'
};

/***************************  HEADER - PROFILE  ***************************/

export default function ProfileSection() {
  const theme = useTheme();
  const {
    state: { i18n, themeDirection },
    setField
  } = useConfig();
  const { userData } = useCurrentUser();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [innerAnchorEl, setInnerAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const innerOpen = Boolean(innerAnchorEl);
  const id = open ? 'profile-action-popper' : undefined;
  const innerId = innerOpen ? 'profile-inner-popper' : undefined;
  const buttonStyle = { borderRadius: 2, p: 1 };

  const profileData: ProfileProps = {
    avatar: { src: userData?.fotoURL || undefined, size: AvatarSize.XS },
    title:
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

  const handleInnerActionClick = (event: MouseEvent<HTMLElement>) => {
    setInnerAnchorEl(innerAnchorEl ? null : event.currentTarget);
  };

  const logoutAccount = () => {
    setAnchorEl(null);
    logout();
  };

  const i18nHandler = (event: MouseEvent<HTMLElement>, key: ThemeI18n) => {
    handleInnerActionClick(event);
    if (key != i18n) setField('i18n', key);
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
                    <ListItem
                      secondaryAction={
                        <Switch
                          size="small"
                          checked={theme.direction === ThemeDirection.RTL}
                          onChange={() =>
                            setField('themeDirection', themeDirection === ThemeDirection.RTL ? ThemeDirection.LTR : ThemeDirection.RTL)
                          }
                        />
                      }
                      sx={{ py: 1, pl: 1, '& .MuiListItemSecondaryAction-root': { right: 8 } }}
                    >
                      <ListItemIcon>
                        <IconTextDirectionLtr size={16} />
                      </ListItemIcon>
                      <ListItemText primary="RTL" />
                    </ListItem>
                    <ListItemButton sx={buttonStyle} onClick={handleInnerActionClick}>
                      <ListItemIcon>
                        <IconLanguage size={16} />
                      </ListItemIcon>
                      <ListItemText primary="Idioma" />
                      <Chip
                        label={languageList.filter((item) => item.key === i18n)[0]?.value.slice(0, 3)}
                        variant="text"
                        size="small"
                        color="secondary"
                        icon={<IconChevronRight size={16} />}
                        position={ChipIconPosition.RIGHT}
                        sx={{ textTransform: 'capitalize' }}
                      />
                      <Popper
                        placement="left-start"
                        id={innerId}
                        open={innerOpen}
                        anchorEl={innerAnchorEl}
                        transition
                        popperOptions={{
                          modifiers: [
                            {
                              name: 'preventOverflow',
                              options: {
                                boundary: 'clippingParents'
                              }
                            },
                            { name: 'offset', options: { offset: [0, 8] } }
                          ]
                        }}
                      >
                        {({ TransitionProps }) => (
                          <Fade in={innerOpen} {...TransitionProps}>
                            <MainCard sx={{ borderRadius: 2, boxShadow: theme.vars.customShadows.tooltip, minWidth: 150, p: 0.5 }}>
                              <ClickAwayListener onClickAway={() => setInnerAnchorEl(null)}>
                                <List disablePadding>
                                  {languageList.map((item, index) => (
                                    <ListItemButton
                                      selected={item.key === i18n}
                                      key={index}
                                      sx={buttonStyle}
                                      onClick={(event) => i18nHandler(event, item.key)}
                                    >
                                      <ListItemText>{item.value}</ListItemText>
                                    </ListItemButton>
                                  ))}
                                </List>
                              </ClickAwayListener>
                            </MainCard>
                          </Fade>
                        )}
                      </Popper>
                    </ListItemButton>
                    <ListItemButton href="#" sx={{ ...buttonStyle, my: 0.5 }}>
                      <ListItemIcon>
                        <IconSettings size={16} />
                      </ListItemIcon>
                      <ListItemText primary="Configurações" />
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
    </>
  );
}
