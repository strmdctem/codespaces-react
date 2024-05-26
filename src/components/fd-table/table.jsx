import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import fdData from './data';
import fdTableConfig from './config';
import { useEffect, useMemo } from 'react';
import getColumns from './columns';

const FDTable = ({ tenureCategories = ["2"] }) => {

  const columns = useMemo(() => {
    console.log("inside memo", tenureCategories);
    return getColumns(tenureCategories);
  }, [tenureCategories]);

  console.log(columns, fdData, fdTableConfig);

  useEffect(() => {
    console.log("inside table", tenureCategories);
  }, [tenureCategories]);

  const table = useMaterialReactTable({
    columns,
    data: fdData,
    ...fdTableConfig
  });

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>

  );
};

export default FDTable;
