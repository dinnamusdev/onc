import { JSX, MouseEvent, useState } from 'react';

// @mui
import { useColorScheme } from '@mui/material/styles';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import MainCard from '@/components/MainCard';
import { ThemeMode } from '@/config';

// @assets
import { IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react';

type ThemeModeItem = {
  title: string;
  mode: ThemeMode;
  icon: JSX.Element;
};

const themeModeData: ThemeModeItem[] = [
  { title: 'Light', mode: ThemeMode.LIGHT, icon: <IconSun size={16} /> },
  { title: 'Dark', mode: ThemeMode.DARK, icon: <IconMoon size={16} /> },
  { title: 'System', mode: ThemeMode.SYSTEM, icon: <IconSunMoon size={16} /> }
];

/***************************  HEADER - THEME MODE SWITCHER  ***************************/

export default function ThemeModeSwitcher() {
  const { mode, setMode } = useColorScheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'Theme-mode-popper' : undefined;

  const activeIcon = themeModeData.find((item) => item.mode === mode)?.icon;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const onModeChange = (item: ThemeModeItem) => {
    setAnchorEl(null);
    setMode(item.mode);
  };

  return (
    <>
      <IconButton variant="outlined" color="secondary" size="small" onClick={handleClick} aria-label="show theme mode">
        {activeIcon}
      </IconButton>
      <Popper
        placement="bottom"
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        popperOptions={{
          modifiers: [{ name: 'offset', options: { offset: [0, 8] } }]
        }}
      >
        {({ TransitionProps }) => (
          <Fade in={open} {...TransitionProps}>
            <MainCard sx={{ borderRadius: 2, minWidth: 120, p: 0.5 }}>
              <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                <List disablePadding>
                  {themeModeData.map((item, index) => (
                    <ListItemButton
                      selected={mode === item.mode}
                      key={index}
                      sx={{ borderRadius: 2, p: 1 }}
                      onClick={() => onModeChange(item)}
                    >
                      <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                        {item.icon} <Typography variant="body2">{item.title}</Typography>
                      </Stack>
                    </ListItemButton>
                  ))}
                </List>
              </ClickAwayListener>
            </MainCard>
          </Fade>
        )}
      </Popper>
    </>
  );
}
