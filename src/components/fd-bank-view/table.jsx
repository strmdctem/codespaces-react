import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import fdTableConfig from './config';
import { fdColumns } from './columns';
import { isMobile } from '../utils';

const FDBankTable = ({ data = [] }) => {

    // console.log('FDBankTable data', data);

    const table = useMaterialReactTable({
        columns: fdColumns,
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

export default FDBankTable;
