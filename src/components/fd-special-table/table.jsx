import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import fdTableConfig from './config';
import getColumns from './columns';
import { isMobile } from '../utils';
import { useMemo } from 'react';

const FDSpecialTable = ({ filters, data, onNameClick }) => {

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
        muiTableBodyCellProps: ({ cell }) => ({
            onClick: () => {
                if (cell.column.id === "name") {
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
