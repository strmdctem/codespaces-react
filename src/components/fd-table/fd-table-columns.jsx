import { Link } from 'react-router-dom';
import SvgIcon from '../svg-icon/svg-icon';
import { isMobile } from '../utils';

const sortingFn = (rowA, rowB, columnId) => {
  const valA = rowA.original[`${columnId}_max`];
  const valB = rowB.original[`${columnId}_max`];
  return Number(valB) - Number(valA);
};

const commonColumnConfig = {
  enableColumnPinning: false,
  size: 0,
  sortUndefined: 'last',
  sortingFn,
  Cell: ({ renderedCellValue, row, column }) => {
    //const isTop = row.original[`${column.id}_isTop`];
    const isNewTop = row.original[`${column.id}_max_isNewTop`];
    if (isNewTop && renderedCellValue?.includes('-')) {
      const [min, max] = renderedCellValue.split(' - ');
      const isNewTopMin = row.original[`${column.id}_min_isNewTop`];
      return (
        <span>
          <span className={isNewTopMin ? 'isTop' : ''}>{min}</span> -
          <span className="isTop">{max}</span>
        </span>
      );
    }
    return (
      <span className={isNewTop ? 'isTop' : ''}>
        {renderedCellValue ? renderedCellValue : '-'}
      </span>
    );
  }
};

function NameCell({ renderedCellValue, row }) {
  const cellValueClass = `cell-value ${isMobile() ? 'cell-value-m' : ''}`;
  return (
    <Link
      to={`/fixed-deposit/${row.original.key}`}
      title={`FD Rates and Calculator for ${row.original.name}`}
      aria-label={`Fixed Deposit Rates and Calculator for ${row.original.name}`}
    >
      <div className={cellValueClass}>
        <SvgIcon className="logo" accessKey={row.original.key} />
        <span className="cell-label">{renderedCellValue}</span>
      </div>
    </Link>
  );
}

export const NameColumn = {
  accessorKey: 'name',
  header: 'Name',
  size: 50,
  Cell: NameCell
};

const fdColumns = [
  {
    ...NameColumn
  },
  {
    accessorKey: '7-30',
    header: '<=1m',
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
    accessorKey: '366-455',
    header: '>12m-15m',
    tenureCategory: '2',
    ...commonColumnConfig
  },
  {
    accessorKey: '456-545',
    header: '>15m-18m',
    tenureCategory: '2',
    ...commonColumnConfig
  },
  {
    accessorKey: '546-635',
    header: '>18m-21m',
    tenureCategory: '2',
    ...commonColumnConfig
  },
  {
    accessorKey: '636-730',
    header: '>21m-2y',
    tenureCategory: '2',
    ...commonColumnConfig
  },
  {
    accessorKey: '731-1095',
    header: '>2y-3y',
    tenureCategory: '3',
    ...commonColumnConfig
  },
  {
    accessorKey: '1096-1460',
    header: '>3y-4y',
    tenureCategory: '3',
    ...commonColumnConfig
  },
  {
    accessorKey: '1461-1825',
    header: '>4y-5y',
    tenureCategory: '3',
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
