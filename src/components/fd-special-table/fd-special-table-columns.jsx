import { NameColumn } from '../fd-table/fd-table-columns';

const commonColumnConfig = {
  enableColumnPinning: false,
  size: 0
};

const fdColumns = [
  {
    ...NameColumn
  },
  {
    accessorKey: 'tenure',
    header: 'Tenure1',
    ...commonColumnConfig
  },
  {
    accessorKey: 'rate',
    header: 'Rate',
    ...commonColumnConfig,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <span className={row.original[`isTop`] ? 'isTop' : ''}>
          {renderedCellValue}
        </span>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      let valA = rowA.original[columnId];
      let valB = rowB.original[columnId];
      return Number(valB) - Number(valA);
    }
  },
  {
    accessorKey: 'calc',
    header: 'Interest',
    ...commonColumnConfig,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <span className={row.original[`isTop`] ? 'isTop' : ''}>
          {renderedCellValue}
        </span>
      );
    },
    sortingFn: (rowA, rowB) => {
      let valA = rowA.original.calcValue;
      let valB = rowB.original.calcValue;
      return Number(valB) - Number(valA);
    }
  },
  {
    accessorKey: 'schemeName',
    header: 'Tenure',
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      let valA = rowA.original.tenure;
      let valB = rowB.original.tenure;
      return Number(valA) - Number(valB);
    }
  }
];

const columnOrder = fdColumns
  .filter((column) => column.accessorKey !== 'tenure')
  .map((column) => column.accessorKey);

export const getColumnOrder = () => columnOrder;

const getColumns = (calc) => {
  let columns = fdColumns;

  // Always filter out tenure column
  columns = columns.filter((column) => column.accessorKey !== 'tenure');

  if (!calc) {
    return columns.filter((column) => column.accessorKey !== 'calc');
  }
  return columns;
};

export default getColumns;
