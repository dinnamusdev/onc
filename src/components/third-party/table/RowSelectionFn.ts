import { Table } from '@tanstack/react-table';

/***************************  REACT TABLE - RESET ROW SELECTION  ***************************/

export function resetRowSelection<TData>(table: Table<TData>, rowId: string) {
  const currentSelection = table.getState().rowSelection;
  if (Object.prototype.hasOwnProperty.call(currentSelection, rowId)) {
    // Create a copy and remove the specific row id get by `getRowId` in table
    const updatedSelection = { ...currentSelection };
    delete updatedSelection[rowId];

    table.setRowSelection(updatedSelection);
  }
}
