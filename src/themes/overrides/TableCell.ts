// @mui
import { TableCellProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

/***************************  OVERRIDES - TABLE CELL  ***************************/

export default function TableCell(theme: Theme) {
  return {
    MuiTableCell: {
      styleOverrides: {
        // root: {
        root: ({ ownerState }: { ownerState: TableCellProps }) => {
          const baseStyle = {
            whiteSpace: 'nowrap',
            borderColor: theme.vars.palette.divider
          };

          const align = ownerState.align;

          if (align === 'right') {
            return {
              ...baseStyle,
              justifyContent: 'flex-end',
              textAlign: 'right',
              '& > *': {
                justifyContent: 'flex-end',
                margin: '0 0 0 auto'
              },
              '& .MuiOutlinedInput-input': {
                textAlign: 'right'
              }
            };
          }

          if (align === 'center') {
            return {
              ...baseStyle,
              justifyContent: 'center',
              textAlign: 'center',
              '& > *': {
                justifyContent: 'center',
                margin: '0 auto'
              }
            };
          }

          return baseStyle;
        },
        head: {
          ...theme.typography.caption,
          padding: '12px 20px',
          backgroundColor: 'transparent',
          ':has(.MuiCheckbox-root)': {
            paddingTop: 4,
            paddingBottom: 4
          }
        },
        body: { ...theme.typography.body2, color: theme.vars.palette.text.secondary, padding: '16px 20px' }
      }
    }
  };
}
