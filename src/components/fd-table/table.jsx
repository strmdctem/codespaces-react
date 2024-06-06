import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import fdTableConfig from './config';
import getColumns from './columns';
import { isMobile } from '../utils';
import { useMemo } from 'react';

const FDTable = ({ filters, data, onNameClick }) => {

  const columns = useMemo(() => {
    // console.log("inside memo", filters.tenureCategories);
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
        if (cell.column.id === "name") {
          console.log('cell clicked', cell.getValue());
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
