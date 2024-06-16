import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { useMemo } from 'react';
import { isMobile } from '../utils';
import getColumns from './fd-table-columns';
import fdTableConfig from './fd-table-config';

const FDTable = ({ filters, data, onNameClick }) => {
  const columns = useMemo(() => {
    return getColumns(filters.tenureCategories);
  }, [filters.tenureCategories]);

  const handleCellClick = (cell) => {
    if (cell.column.id === 'name') {
      onNameClick(cell.row.original.key);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data,
    ...fdTableConfig,
    muiTableContainerProps: {
      sx: {
        maxHeight: isMobile() ? 'calc(100vh - 200px)' : 'calc(100vh - 240px)'
      }
    },
    muiTableBodyCellProps: ({ cell }) => ({
      onClick: () => handleCellClick(cell)
    })
  });

  return <MaterialReactTable table={table} />;
};

export default FDTable;
