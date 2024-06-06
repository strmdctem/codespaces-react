import { Link } from "@mui/material";
import { isMobile } from "../utils";

const commonColumnConfig = {
  enableColumnPinning: false,
  size: 0,
  sortUndefined: 'last',
  sortingFn: (rowA, rowB, columnId) => {
    let valA = rowA.original[columnId];
    let valB = rowB.original[columnId];
    if (valA.includes('-')) valA = valA.split('-')[1].trim();
    if (valB.includes('-')) valB = valB.split('-')[1].trim();
    return Number(valB) - Number(valA);
  },
  Cell: ({ renderedCellValue, row, column }) => {
    if (row.original[`${column.id}_isTop`] && renderedCellValue.includes('-')) {
      const [min, max] = renderedCellValue.split(' - ');
      return (
        <span>
          <span>{min}</span> - <span className="isTop">{max}</span>
        </span>
      );
    }
    return (
      <span className={row.original[`${column.id}_isTop`] ? "isTop" : ""}>
        {renderedCellValue ? renderedCellValue : "NA"}
      </span>
    );
  }
};

const fdColumns = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 50,
    Cell: ({ renderedCellValue }) => {
      return isMobile()
        ? <Link underline="none"><div className="cell-value">{renderedCellValue}</div></Link> : <Link underline="none">renderedCellValue</Link>;
    }
  },
  {
    accessorKey: '1-30',
    header: '<1m',
    tenureCategory: "1",
    ...commonColumnConfig
  },
  {
    accessorKey: '31-45',
    header: '>1m-1.5m',
    tenureCategory: "1",
    ...commonColumnConfig
  },
  {
    accessorKey: '46-90',
    header: '>1.5m-3m',
    tenureCategory: "1",
    ...commonColumnConfig
  },
  {
    accessorKey: '91-180',
    header: '>3m-6m',
    tenureCategory: "1",
    ...commonColumnConfig
  },
  {
    accessorKey: '181-270',
    header: '>6m-9m',
    tenureCategory: "1",
    ...commonColumnConfig
  },
  {
    accessorKey: '271-365',
    header: '>9m-12m',
    tenureCategory: "1",
    ...commonColumnConfig
  },
  {
    accessorKey: '366-450',
    header: '>12m-15m',
    tenureCategory: "2",
    ...commonColumnConfig
  },
  {
    accessorKey: '451-540',
    header: '>15m-18m',
    tenureCategory: "2",
    ...commonColumnConfig
  },
  {
    accessorKey: '541-630',
    header: '>18m-21m',
    tenureCategory: "2",
    ...commonColumnConfig
  },
  {
    accessorKey: '631-720',
    header: '>21m-2y',
    tenureCategory: "2",
    ...commonColumnConfig
  },
  {
    accessorKey: '721-1080',
    header: '>2y-3y',
    tenureCategory: "3",
    ...commonColumnConfig
  },
  {
    accessorKey: '1081-1440',
    header: '>3y-4y',
    tenureCategory: "3",
    ...commonColumnConfig
  },
  {
    accessorKey: '1441-1800',
    header: '>4y-5y',
    tenureCategory: "3",
    ...commonColumnConfig
  }
];

const columnOrder = fdColumns.map(column => column.accessorKey);

export const getColumnorder = () => columnOrder;

const getColumns = (tenureCategories) => {
  return fdColumns.filter(column => column.tenureCategory === undefined
    || tenureCategories.includes(column.tenureCategory));
};

export default getColumns;