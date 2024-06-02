import { getColumnorder } from "./columns";

const globalFilter = (row, id, filterValue) => {
  const values = Object.values(row.original)
    .map(value => String(value).toLowerCase().replace(/[^\w\s]/g, ''));
  let terms = filterValue.split(',');
  terms = terms.flatMap(value => value.trim().split(/\s+/));
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
  enableMultiSort: false,
  enableSortingRemoval: false,
  positionGlobalFilter: 'left',
  initialState: {
    showGlobalFilter: true,
    density: 'compact',
    columnPinning: { left: ['name'], right: [] },
    sorting: [
      { id: '541-630', desc: false }
    ],
  },
  state: {
    columnOrder: getColumnorder(),
  },
  filterFns: { globalFilter },
  globalFilterFn: 'globalFilter',
  muiSearchTextFieldProps: {
    placeholder: 'SBI HDFC bob bajaj',
  }
};

export default fdTableConfig;