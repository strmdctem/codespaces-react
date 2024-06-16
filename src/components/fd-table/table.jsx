import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { useMemo } from 'react';
import { isMobile } from '../utils';
import getColumns from './columns';
import fdTableConfig from './config';

const FDTable = ({ filters, data, onNameClick }) => {
  const columns = useMemo(() => {
    return getColumns(filters.tenureCategories);
  }, [filters.tenureCategories]);

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
      onClick: () => {
        if (cell.column.id === 'name') {
          onNameClick(cell.getValue());
        }
      }
    })
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default FDTable;
