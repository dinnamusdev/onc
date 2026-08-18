'use client';

import { MouseEvent, useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import MainCard from '@/components/MainCard';
import SimpleBar from '@/components/third-party/SimpleBar';

// @assets
import { IconPlus } from '@tabler/icons-react';

/***************************  REACT TABLE - TAG LIST  ***************************/

export default function TagList({ list, max = 2, typographyProps }: { list: string[]; max?: number; typographyProps?: TypographyProps }) {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'Tag-popper' : undefined;

  const tagData = [...list];
  const extraTags: string[] = [];
  if (tagData?.length > max) extraTags.push(...tagData.splice(max));

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  if (tagData.length === 0) return <>-</>;

  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
      <Typography variant="body2" color="text.secondary" {...typographyProps} sx={{ ...typographyProps?.sx }}>
        {tagData.join(', ')}
      </Typography>
      {extraTags.length > 0 && (
        <>
          <Chip
            icon={<IconPlus color={theme.vars.palette.grey[700]} />}
            label={extraTags.length + ' more'}
            clickable
            variant="outlined"
            size="small"
            sx={{ color: 'text.secondary' }}
            onClick={handleClick}
          />
          <Popper
            placement="bottom-end"
            id={id}
            open={open}
            anchorEl={anchorEl}
            transition
            popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 4] } }] }}
            sx={{ zIndex: 1301 }}
          >
            {({ TransitionProps }) => (
              <Fade in={open} {...TransitionProps}>
                <MainCard sx={{ p: 0, borderRadius: 2, boxShadow: theme.vars.customShadows.tooltip, width: 180 }}>
                  <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                    <Box sx={{ p: 0.75 }}>
                      <SimpleBar sx={{ maxHeight: 220, height: 1 }}>
                        <List disablePadding>
                          {extraTags.map((tag, index) => (
                            <ListItem key={index} sx={{ px: 0.75, py: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                {tag}
                              </Typography>
                            </ListItem>
                          ))}
                        </List>
                      </SimpleBar>
                    </Box>
                  </ClickAwayListener>
                </MainCard>
              </Fade>
            )}
          </Popper>
        </>
      )}
    </Stack>
  );
}
