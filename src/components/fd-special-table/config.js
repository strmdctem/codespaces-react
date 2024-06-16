const fdTableConfig = {
  enablePagination: false,
  enableBottomToolbar: false,
  enableColumnFilter: false,
  enableColumnActions: false,
  enableColumnPinning: true,
  enableStickyHeader: true,
  enableMultiSort: false,
  enableSortingRemoval: false,
  enableTopToolbar: false,
  initialState: {
    density: 'compact',
    columnPinning: { left: ['name'] },
    sorting: [{ id: 'rate', desc: false }]
  }
};

export default fdTableConfig;
