import { isMobile } from '../utils';

export const fdColumns = [
  {
    accessorKey: 'tenure',
    header: 'Tenure',
    enableColumnPinning: true,
    enableSorting: false,
    Cell: ({ renderedCellValue }) => {
      return isMobile() ? (
        <div className="i-cell-value">{renderedCellValue}</div>
      ) : (
        renderedCellValue
      );
    }
  },
  {
    accessorKey: 'general',
    header: 'General',
    size: 0,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <span className={row.original[`general_isTop`] ? 'isTop' : ''}>
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
    accessorKey: 'senior',
    header: 'Senior',
    size: 0,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <span className={row.original[`senior_isTop`] ? 'isTop' : ''}>
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
    accessorKey: 'general_interest',
    header: 'G. Interest',
    size: 0,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <span className={row.original[`general_isTop`] ? 'isTop' : ''}>
          {renderedCellValue}
        </span>
      );
    },
    sortingFn: (rowA, rowB) => {
      let valA = rowA.original.general;
      let valB = rowB.original.general;
      return Number(valB) - Number(valA);
    }
  },
  {
    accessorKey: 'senior_interest',
    header: 'S. Interest',
    size: 0,
    Cell: ({ renderedCellValue, row }) => {
      return (
        <span className={row.original[`senior_isTop`] ? 'isTop' : ''}>
          {renderedCellValue}
        </span>
      );
    },
    sortingFn: (rowA, rowB) => {
      let valA = rowA.original.senior;
      let valB = rowB.original.senior;
      return Number(valB) - Number(valA);
    }
  }
];

const columnOrder = fdColumns.map((column) => column.accessorKey);

export const getColumnOrder = () => columnOrder;

export default fdColumns;
