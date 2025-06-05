import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { useLayoutEffect, useMemo } from 'react';
import getColumns from './fd-special-table-columns';
import fdSpecialTableConfig from './fd-special-table-config';

const FDSpecialTable = ({ filters, data, onNameClick }) => {
  const columns = useMemo(() => {
    return getColumns(filters.calc);
  }, [filters.calc]);

  useLayoutEffect(() => {
    const tableElement = document.getElementById('table-container-sp');
    if (tableElement) {
      const rect = tableElement.getBoundingClientRect();
      const remainingHeight = window.innerHeight - rect.top - 66;
      tableElement.style.maxHeight = `${remainingHeight}px`;
      tableElement.style.visibility = 'visible';
    }
  }, []);

  const table = useMaterialReactTable({
    columns,
    data,
    ...fdSpecialTableConfig,
    muiTableContainerProps: {
      id: 'table-container-sp',
      sx: {
        maxHeight: 'auto',
        overflowY: 'auto'
      }
    },
    muiTableBodyCellProps: ({ cell }) => ({
      onClick: () => {
        if (cell.column.id === 'name') {
          onNameClick(cell.row.original.key);
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
