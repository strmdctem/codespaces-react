import { NameColumn, filterColumns } from '../fd-table/fd-table-columns';

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
    header: 'Tenure',
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
    accessorKey: 'schemeName',
    header: 'Scheme',
    enableSorting: false
  }
];

const getColumns = filterColumns(fdColumns);

export default getColumns;
