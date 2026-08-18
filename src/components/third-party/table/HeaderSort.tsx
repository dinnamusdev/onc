'use client';

// @mui
import { useColorScheme, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

// @third-party
import { Column } from '@tanstack/react-table';

// @project
import { ThemeMode } from '@/config';

// @assets
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';

enum SortType {
  ASC = 'asc',
  DESC = 'desc'
}

/***************************  HEADER SORT - TOGGLER  ***************************/

function SortToggler({ type }: { type?: SortType }) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();

  const iconColor = colorScheme === ThemeMode.DARK ? theme.vars.palette.grey[600] : theme.vars.palette.grey[500];

  return (
    <>
      {(!type || type === SortType.ASC) && (
        <IconArrowUp size={16} color={type === SortType.ASC ? theme.vars.palette.grey[700] : iconColor} />
      )}
      {type === SortType.DESC && <IconArrowDown size={16} color={theme.vars.palette.grey[700]} />}
    </>
  );
}

interface HeaderSortProps<TData> {
  column: Column<TData, unknown>;
  sort?: boolean;
}

/***************************  REACT TABLE - HEADER SORT  ***************************/

export default function HeaderSort<TData>({ column, sort }: HeaderSortProps<TData>) {
  return (
    <Stack {...(sort && { onClick: column.getToggleSortingHandler(), sx: { cursor: 'pointer' } })}>
      {{
        asc: <SortToggler type={SortType.ASC} />,
        desc: <SortToggler type={SortType.DESC} />
      }[column.getIsSorted() as string] ?? <SortToggler />}
    </Stack>
  );
}
