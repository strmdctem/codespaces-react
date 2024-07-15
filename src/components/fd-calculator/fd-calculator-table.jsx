import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import fdColumns from './fd-calculator-table-columns';
import fdTableConfig from './fd-calculator-table-config';

const FDCalculatorTable = ({ data = [] }) => {
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

export default FDCalculatorTable;
