import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { useMemo } from 'react';
import { isMobile } from '../utils';
import getColumns from './fd-special-table-columns';
import fdSpecialTableConfig from './fd-special-table-config';

const FDSpecialTable = ({ filters, data, onNameClick }) => {
  const columns = useMemo(() => {
    return getColumns(filters.calc);
  }, [filters.calc]);

  const table = useMaterialReactTable({
    columns,
    data,
    ...fdSpecialTableConfig,
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

export default FDSpecialTable;
