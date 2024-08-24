import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { fdColumns } from './fd-bank-view-table-columns';
import fdTableConfig from './fd-bank-view-table-config';

const FDBankViewTable = ({ data = [] }) => {
  const table = useMaterialReactTable({
    columns: fdColumns,
    data,
    ...fdTableConfig
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default FDBankViewTable;
