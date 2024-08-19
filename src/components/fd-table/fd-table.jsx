import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { useLayoutEffect, useMemo } from 'react';
import getColumns from './fd-table-columns';
import fdTableConfig from './fd-table-config';

const FDTable = ({ filters, data }) => {
  const columns = useMemo(() => {
    return getColumns(filters.tenureCategories);
  }, [filters.tenureCategories]);

  // const [popoverOpen, setPopoverOpen] = useState(false);
  // const [popoverContent, setPopoverContent] = useState('');
  // const [anchorEl, setAnchorEl] = useState(null);
  // const [longPressTimeoutId, setLongPressTimeoutId] = useState(null);

  // const handleCellMouseEnter = (event, cell) => {
  //   if (cell.column.id === 'name') return;
  //   setPopoverContent(cell.getValue() || '');
  //   setAnchorEl(event.currentTarget);
  //   setPopoverOpen(true);
  // };

  // const handleCellMouseLeave = () => {
  //   setPopoverOpen(false);
  //   setAnchorEl(null);
  // };

  // const handleTouchStart = (event, cell) => {
  //   if (cell.column.id === 'name') return;
  //   if (longPressTimeoutId) {
  //     clearTimeout(longPressTimeoutId);
  //   }
  //   const target = event.currentTarget;
  //   const timeoutId = setTimeout(() => {
  //     setPopoverContent(cell.getValue() || '');
  //     setAnchorEl(target);
  //     console.log('long press', target);
  //     setPopoverOpen(true);
  //   }, 500); // Adjust time as needed
  //   setLongPressTimeoutId(timeoutId);
  // };

  // const handleTouchEnd = () => {
  //   if (longPressTimeoutId) {
  //     clearTimeout(longPressTimeoutId);
  //     setLongPressTimeoutId(null);
  //   }
  // };

  // useEffect(() => {
  //   return () => {
  //     if (longPressTimeoutId) {
  //       clearTimeout(longPressTimeoutId);
  //     }
  //   };
  // }, [longPressTimeoutId]);

  useLayoutEffect(() => {
    const tableElement = document.getElementById('table-container');
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
    ...fdTableConfig,
    muiTableContainerProps: {
      id: 'table-container',
      sx: {
        maxHeight: 'auto',
        overflow: 'auto',
        visibility: 'hidden'
      }
    }
    // muiTableBodyCellProps: () => ({
    //   // onMouseEnter: (event) => handleCellMouseEnter(event, cell),
    //   // onMouseLeave: handleCellMouseLeave,
    //   // onTouchStart: (event) => handleTouchStart(event, cell),
    //   // onTouchEnd: handleTouchEnd
    // })
  });

  return (
    <>
      {/* <Popover
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={() => setPopoverOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        elevation={24}
      >
        <div style={{ padding: '10px' }}>{popoverContent}</div>
      </Popover> */}
      <MaterialReactTable table={table} />
    </>
  );
};

export default FDTable;
