import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import getData from './data';
import fdTableConfig from './config';
import { useEffect, useMemo } from 'react';
import getColumns from './columns';

const FDTable = ({ filters }) => {

  const columns = useMemo(() => {
    // console.log("inside memo", filters.tenureCategories);
    return getColumns(filters.tenureCategories);
  }, [filters.tenureCategories]);

  const data = useMemo(() => {
    return getData(filters);
  }, [filters.bankTypes, filters.bankNames, filters.category]);

  useEffect(() => {
    console.log("inside table", filters.tenureCategories);
  }, [filters.tenureCategories]);

  const table = useMaterialReactTable({
    columns,
    data,
    ...fdTableConfig
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>

  );
};

export default FDTable;
