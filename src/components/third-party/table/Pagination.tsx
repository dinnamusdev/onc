import { ChangeEvent } from 'react';

// @mui
import Stack from '@mui/material/Stack';
import MUIPagination from '@mui/material/Pagination';

import { Table } from '@tanstack/react-table';

/***************************  REACT TABLE - PANIGATION  ***************************/

export default function Pagination<TData>({ table }: { table: Table<TData> }) {
  const handleChangePagination = (event: ChangeEvent<unknown>, value: number) => {
    table.setPageIndex(value - 1);
  };

  return (
    <>
      {table.getRowModel().rows.length > 0 && (
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', px: { xs: 0.5, sm: 2.5 }, py: 1.5 }}>
          <MUIPagination count={table.getPageCount()} page={table.getState().pagination.pageIndex + 1} onChange={handleChangePagination} />
        </Stack>
      )}
    </>
  );
}
