const commonColumnConfig = {
  size: 0,
  enableColumnPinning: false
};

const fdColumns = [
  {
    accessorKey: 'abb',
    header: 'Name',
    size: 5,
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

const getColumns = (tenureCategories = ["2"]) => {
  return fdColumns.filter(column => column.tenureCategory === undefined
    || tenureCategories.includes(column.tenureCategory));
};

export default getColumns;