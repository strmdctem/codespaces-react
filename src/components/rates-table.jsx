import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import rates from '../data/rates.json'; // adjust the path as needed


//nested data is ok, see accessorKeys in ColumnDef below
const data = rates.map((item) => {
  const rates = item.rates.main.reduce((acc, rate) => {
    const key = `${rate.start}-${rate.end}`;
    acc[key] = rate.general;
    return acc;
  }, {});

  return {
    name: item.name,
    key: item.key,
    type: item.type,
    ...rates,
  };
});

const RatesTable = () => {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 5,
      },
      {
        accessorKey: '7-14', //access nested data with dot notation
        header: '7-14D',
        size: 0,
        enableColumnPinning: false,
      },
      {
        accessorKey: '15-29',
        header: '15-29D',
        size: 0,
        enableColumnPinning: false,
      },
      {
        accessorKey: '30-45',
        header: '30-45D',
        size: 5,
        enableColumnPinning: false,
      },
      {
        accessorKey: '46-60',
        header: '46-60D',
        size: 0,
        enableColumnPinning: false,
      },
      {
        accessorKey: '61-90',
        header: '>2M-3M',
        size: 0,
        enableColumnPinning: false,
      },
      {
        accessorKey: '91-180',
        header: '>3m-6m',
        size: 0,
        enableColumnPinning: false,
      },
      {
        accessorKey: '181-270',
        header: '6-9M',
        size: 0,
        enableColumnPinning: false,
      },
      {
        accessorKey: '271-365',
        header: '>9M-1Y',
        size: 0,
        enableColumnPinning: false,
      }
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enablePagination: false,
    enableBottomToolbar: false,
    enableColumnFilter: false,
    enableColumnActions: false,
    enableColumnPinning: true,
    initialState: {
      showGlobalFilter: true,
      columnPinning: { left: ['name'], right: [] },
    },
  });

  return <MaterialReactTable table={table} />;
};

export default RatesTable;
