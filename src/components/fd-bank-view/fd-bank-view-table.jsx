import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { isMobile } from '../utils';
import { fdColumns } from './fd-bank-view-table-columns';
import fdTableConfig from './fd-bank-view-table-config';

const FDBankViewTable = ({ data = [] }) => {
  const table = useMaterialReactTable({
    columns: fdColumns,
    data,
    ...fdTableConfig,
    muiTableContainerProps: {
      sx: {
        maxHeight: isMobile() ? 'calc(100vh - 200px)' : 'calc(100vh - 240px)'
      }
    }
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default FDBankViewTable;
