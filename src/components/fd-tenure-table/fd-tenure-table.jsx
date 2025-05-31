import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { useLayoutEffect, useMemo } from 'react';
import getColumns from './fd-tenure-table-columns';
import { fdTenureTableConfig } from './fd-tenure-table-config';

const FDTenureTable = ({ filters, data }) => {
  const columns = useMemo(() => {
    return getColumns(filters.tenureCategories);
  }, [filters.tenureCategories]);

  useLayoutEffect(() => {
    const tableElement = document.getElementById('table-container-1');
    if (tableElement) {
      const rect = tableElement.getBoundingClientRect();
      const remainingHeight = window.innerHeight - rect.top - 68;
      tableElement.style.maxHeight = `${remainingHeight}px`;
      tableElement.style.visibility = 'visible';
    }
  }, []);
  const table = useMaterialReactTable({
    columns,
    data,
    ...fdTenureTableConfig,
    muiTableContainerProps: {
      id: 'table-container-1',
      sx: {
        maxHeight: 'auto',
        overflow: 'auto',
        visibility: 'hidden'
      }
    }
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default FDTenureTable;
