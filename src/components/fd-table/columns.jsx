import Link from '@mui/material/Link';
import { isMobile } from '../utils';

const sortingFn = (rowA, rowB, columnId) => {
  const valA = rowA.original[`${columnId}_max`];
  const valB = rowB.original[`${columnId}_max`];
  return Number(valB) - Number(valA);
};

const rupeeFormat = (value) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const commonColumnConfig = {
  enableColumnPinning: false,
  size: 0,
  sortUndefined: 'last',
  sortingFn,
  Cell: ({ renderedCellValue, row, column }) => {
    const calcValue = row.original[`${column.id}_calc`];
    const isTop = row.original[`${column.id}_isTop`];
    const formattedValue = calcValue
      ? rupeeFormat(calcValue)
      : renderedCellValue;
    if (isTop && formattedValue.includes('-')) {
      const [min, max] = formattedValue.split(' - ');
      return (
        <span>
          <span>{min}</span> - <span className="isTop">{max}</span>
        </span>
      );
    }
    return (
      <span className={isTop ? 'isTop' : ''}>
        {formattedValue ? formattedValue : '-'}
      </span>
    );
  }
};

const fdColumns = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 50,
    Cell: ({ renderedCellValue, row }) => {
      const cellValueClass = `cell-value ${isMobile() ? 'cell-value-m' : ''}`;
      const logoSrc = `/logos/${row.original.key}.svg`;

      return (
        <Link underline="none">
          <div className={cellValueClass}>
            <img className="logo" src={logoSrc} />
            <span className="cell-label">{renderedCellValue}</span>
          </div>
        </Link>
      );
    }
  },
  {
    accessorKey: '7-30',
    header: '<1m',
    tenureCategory: '1',
    ...commonColumnConfig
  },
  {
    accessorKey: '31-45',
    header: '>1m-1.5m',
    tenureCategory: '1',
    ...commonColumnConfig
  },
  {
    accessorKey: '46-90',
    header: '>1.5m-3m',
    tenureCategory: '1',
    ...commonColumnConfig
  },
  {
    accessorKey: '91-180',
    header: '>3m-6m',
    tenureCategory: '1',
    ...commonColumnConfig
  },
  {
    accessorKey: '181-270',
    header: '>6m-9m',
    tenureCategory: '1',
    ...commonColumnConfig
  },
  {
    accessorKey: '271-365',
    header: '>9m-12m',
    tenureCategory: '1',
    ...commonColumnConfig
  },
  {
    accessorKey: '366-450',
    header: '>12m-15m',
    tenureCategory: '2',
    ...commonColumnConfig
  },
  {
    accessorKey: '451-540',
    header: '>15m-18m',
    tenureCategory: '2',
    ...commonColumnConfig
  },
  {
    accessorKey: '541-630',
    header: '>18m-21m',
    tenureCategory: '2',
    ...commonColumnConfig
  },
  {
    accessorKey: '631-720',
    header: '>21m-2y',
    tenureCategory: '2',
    ...commonColumnConfig
  },
  {
    accessorKey: '721-1080',
    header: '>2y-3y',
    tenureCategory: '3',
    ...commonColumnConfig
  },
  {
    accessorKey: '1081-1440',
    header: '>3y-4y',
    tenureCategory: '3',
    ...commonColumnConfig
  },
  {
    accessorKey: '1441-1800',
    header: '>4y-5y',
    tenureCategory: '3',
    ...commonColumnConfig
  }
];

const columnOrder = fdColumns.map((column) => column.accessorKey);

export const getColumnOrder = () => columnOrder;

const getColumns = (tenureCategories) => {
  return fdColumns.filter(
    ({ tenureCategory }) =>
      !tenureCategory || tenureCategories.includes(tenureCategory)
  );
};

export default getColumns;
