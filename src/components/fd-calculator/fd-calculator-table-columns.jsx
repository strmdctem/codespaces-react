import { NameColumn } from '../fd-table/fd-table-columns';

const commonColumnConfig = {
  enableColumnPinning: false,
  size: 0,
  enableSorting: false,
  Cell: ({ renderedCellValue, row }) => {
    return (
      <span className={row.original[`isTop`] ? 'isTop' : ''}>
        {renderedCellValue}
      </span>
    );
  }
};

export const fdColumns = [
  {
    ...NameColumn,
    enableSorting: false
  },
  {
    accessorKey: 'general_interest',
    header: 'G. Interest',
    ...commonColumnConfig
  },
  {
    accessorKey: 'senior_interest',
    header: 'S. Interest',
    ...commonColumnConfig
  },
  {
    accessorKey: 'general',
    header: 'G. Rate',
    ...commonColumnConfig
  },
  {
    accessorKey: 'senior',
    header: 'S. Rate',
    ...commonColumnConfig
  }
];

export default fdColumns;
