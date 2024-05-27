const globalFilter = (row, id, filterValue) => {
  const values = Object.values(row.original)
    .map(value => String(value).toLowerCase().replace(/[^\w\s]/g, ''));
  let terms = filterValue.split(',');
  terms = terms.flatMap(value => value.trim().split(' '));
  terms = terms.map(term => term.toLowerCase().replace(/[^\w\s]/g, ''));
  return terms.some(term => values.some(value => value.includes(term)));
};

const fdTableConfig = {
  enablePagination: false,
  enableBottomToolbar: false,
  enableColumnFilter: false,
  enableColumnActions: false,
  enableColumnPinning: true,
  enableStickyHeader: true,
  sortDescFirst: true,
  positionGlobalFilter: 'left',
  initialState: {
    showGlobalFilter: true,
    density: 'compact',
    columnPinning: { left: ['name'], right: [] },
  },
  filterFns: { globalFilter },
  globalFilterFn: 'globalFilter',
  muiSearchTextFieldProps: {
    placeholder: 'SBI HDFC bob bajaj',
  }
};

export default fdTableConfig;