import { NameColumn } from '../fd-table/fd-table-columns';

const sortingFn = (rowA, rowB, columnId) => {
  const valA = rowA.original[`${columnId}_rate`];
  const valB = rowB.original[`${columnId}_rate`];
  if (!valA || !valB) {
    return undefined; // Handle undefined values gracefully
  }
  return Number(valB) - Number(valA);
};

const commonColumnConfig = {
  enableColumnPinning: false,
  size: 0,
  sortUndefined: 'last',
  sortingFn,
  Cell: ({ renderedCellValue, row, column }) => {
    return (
      <span className={row.original[`${column.id}_isTop`] ? 'isTop' : ''}>
        {renderedCellValue}
      </span>
    );
  }
};

const fdColumns = [
  {
    ...NameColumn
  },
  {
    accessorKey: '1_Month',
    header: '1 Month',
    tenureCategory: '1',
    ...commonColumnConfig
  },
  {
    accessorKey: '3_Months',
    header: '3 Months',
    tenureCategory: '1',
    ...commonColumnConfig
  },
  {
    accessorKey: '6_Months',
    header: '6 Months',
    tenureCategory: '1',
    ...commonColumnConfig
  },
  {
    accessorKey: '1_Year',
    header: '1 Year',
    tenureCategory: '2',
    ...commonColumnConfig
  },
  {
    accessorKey: '2_Years',
    header: '2 Years',
    tenureCategory: '2',
    ...commonColumnConfig
  },
  {
    accessorKey: '3_Years',
    header: '3 Years',
    tenureCategory: '3',
    ...commonColumnConfig
  },
  {
    accessorKey: '5_Years',
    header: '5 Years',
    tenureCategory: '3',
    ...commonColumnConfig
  },
  {
    accessorKey: '10_Years',
    header: '10 Years',
    tenureCategory: '120',
    ...commonColumnConfig
  }
];

const columnOrder = fdColumns.map((column) => column.accessorKey);

export const getColumnOrder = () => columnOrder;

export const filterColumns = (columns) => (tenureCategories) => {
  return columns.filter(
    ({ tenureCategory }) =>
      !tenureCategory || tenureCategories.includes(tenureCategory)
  );
};

const getColumns = filterColumns(fdColumns);

export default getColumns;
