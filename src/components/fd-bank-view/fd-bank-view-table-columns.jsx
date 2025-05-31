import { isMobile } from '../utils';

// Common column configuration
const commonColumnConfig = {
  size: 0
};

// Common cell component for highlighting top values
const createHighlightCell = (isTopField) => {
  const HighlightCell = ({ renderedCellValue, row }) => {
    return (
      <span className={row.original[isTopField] ? 'isTop' : ''}>
        {renderedCellValue}
      </span>
    );
  };
  HighlightCell.displayName = `HighlightCell_${isTopField}`;
  return HighlightCell;
};

// Common sorting function for numeric values
const createNumericSortingFn = (fieldName) => (rowA, rowB) => {
  let valA = rowA.original[fieldName];
  let valB = rowB.original[fieldName];
  return Number(valB) - Number(valA);
};

// Common sorting function using column ID
const numericSortingFnByColumn = (rowA, rowB, columnId) => {
  let valA = rowA.original[columnId];
  let valB = rowB.original[columnId];
  return Number(valB) - Number(valA);
};

// Tenure cell component
const TenureCell = ({ renderedCellValue }) => {
  return isMobile() ? (
    <div className="i-cell-value">{renderedCellValue}</div>
  ) : (
    renderedCellValue
  );
};
TenureCell.displayName = 'TenureCell';

export const fdColumns = [
  {
    accessorKey: 'tenure',
    header: 'Tenure',
    enableColumnPinning: true,
    enableSorting: false,
    Cell: TenureCell
  },
  {
    accessorKey: 'general',
    header: 'G. Rate',
    ...commonColumnConfig,
    Cell: createHighlightCell('general_isTop'),
    sortingFn: numericSortingFnByColumn
  },
  {
    accessorKey: 'senior',
    header: 'S. Rate',
    ...commonColumnConfig,
    Cell: createHighlightCell('senior_isTop'),
    sortingFn: numericSortingFnByColumn
  },
  {
    accessorKey: 'general_interest',
    header: 'G. Interest',
    ...commonColumnConfig,
    Cell: createHighlightCell('general_isTop'),
    sortingFn: createNumericSortingFn('general')
  },
  {
    accessorKey: 'senior_interest',
    header: 'S. Interest',
    ...commonColumnConfig,
    Cell: createHighlightCell('senior_isTop'),
    sortingFn: createNumericSortingFn('senior')
  }
  // {
  //   accessorKey: 'general_yearly_percentage',
  //   header: 'G. yearly %',
  //   ...commonColumnConfig,
  //   Cell: createHighlightCell('general_isTop'),
  //   sortingFn: createNumericSortingFn('general_yearly_percentage')
  // },
  // {
  //   accessorKey: 'senior_yearly_percentage',
  //   header: 'S. yearly %',
  //   ...commonColumnConfig,
  //   Cell: createHighlightCell('senior_isTop'),
  //   sortingFn: createNumericSortingFn('senior_yearly_percentage')
  // },
  // {
  //   accessorKey: 'general_absolute_percentage',
  //   header: 'G. Total %',
  //   ...commonColumnConfig,
  //   Cell: createHighlightCell('general_isTop'),
  //   sortingFn: createNumericSortingFn('general_absolute_percentage')
  // },
  // {
  //   accessorKey: 'senior_absolute_percentage',
  //   header: 'S. Total %',
  //   ...commonColumnConfig,
  //   Cell: createHighlightCell('senior_isTop'),
  //   sortingFn: createNumericSortingFn('senior_absolute_percentage')
  // }
];

const columnOrder = fdColumns.map((column) => column.accessorKey);

export const getColumnOrder = () => columnOrder;

export default fdColumns;
