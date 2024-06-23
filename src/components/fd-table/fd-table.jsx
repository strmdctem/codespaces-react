import Popover from '@mui/material/Popover';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { isMobile } from '../utils';
import getColumns from './fd-table-columns';
import fdTableConfig from './fd-table-config';

const FDTable = ({ filters, data, onNameClick }) => {
  const columns = useMemo(() => {
    return getColumns(filters.tenureCategories);
  }, [filters.tenureCategories]);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverContent, setPopoverContent] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [longPressTimeoutId, setLongPressTimeoutId] = useState(null);

  const handleCellMouseEnter = (event, cell) => {
    setPopoverContent(cell.getValue() || '');
    setAnchorEl(event.currentTarget);
    setPopoverOpen(true);
  };

  const handleCellMouseLeave = () => {
    setPopoverOpen(false);
    setAnchorEl(null);
  };

  const handleCellClick = (cell) => {
    if (cell.column.id === 'name') {
      onNameClick(cell.row.original.key);
    }
  };
  const handleTouchStart = (event, cell) => {
    if (longPressTimeoutId) {
      clearTimeout(longPressTimeoutId);
    }
    const target = event.currentTarget;
    const timeoutId = setTimeout(() => {
      setPopoverContent(cell.getValue() || '');
      setAnchorEl(target);
      console.log('long press', target);
      setPopoverOpen(true);
    }, 500); // Adjust time as needed
    setLongPressTimeoutId(timeoutId);
  };

  const handleTouchEnd = () => {
    if (longPressTimeoutId) {
      clearTimeout(longPressTimeoutId);
      setLongPressTimeoutId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (longPressTimeoutId) {
        clearTimeout(longPressTimeoutId);
      }
    };
  }, [longPressTimeoutId]);

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
      onMouseEnter: (event) => handleCellMouseEnter(event, cell),
      onMouseLeave: handleCellMouseLeave,
      onTouchStart: (event) => handleTouchStart(event, cell),
      onTouchEnd: handleTouchEnd,
      onClick: () => handleCellClick(cell)
    })
  });

  return (
    <>
      <Popover
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
      </Popover>
      <MaterialReactTable table={table} />
    </>
  );
};

export default FDTable;
