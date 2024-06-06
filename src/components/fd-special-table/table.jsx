import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import fdTableConfig from './config';
import getColumns from './columns';
import { isMobile } from '../utils';
import { useMemo } from 'react';

const FDSpecialTable = ({ filters, data }) => {

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
    });

    return (
        <>
            <MaterialReactTable table={table} />
        </>
    );
};

export default FDSpecialTable;
