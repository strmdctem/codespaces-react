const fdTableConfig = {
    enablePagination: false,
    enableBottomToolbar: false,
    enableColumnFilter: false,
    enableColumnActions: false,
    enableColumnPinning: true,
    enableStickyHeader: true,
    sortDescFirst: true,
    initialState: {
      showGlobalFilter: true,
      columnPinning: { left: ['name'], right: [] },
    }
};

export default fdTableConfig;