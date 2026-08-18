import { Row } from '@tanstack/react-table';

/***************************  REACT TABLE - GLOBAL FILTER  ***************************/

export default function globalFilterFn<TData>(row: Row<TData>, columnIds: (string | undefined)[], filterValue: string): boolean {
  return columnIds.some((id) => {
    const value = row.getValue(id as string);
    return deepSearch(value, filterValue.toLowerCase());
  });
}

function deepSearch(value: unknown, filterValue: string): boolean {
  if (typeof value === 'string' || typeof value === 'number') {
    return value.toString().toLowerCase().includes(filterValue);
  }

  if (Array.isArray(value)) {
    return value.some((item) => deepSearch(item, filterValue));
  }

  if (typeof value === 'object' && value !== null) {
    return Object.values(value).some((nested) => deepSearch(nested, filterValue));
  }

  return false;
}
