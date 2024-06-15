import { getColumnorder } from './columns';

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
    columnPinning: { left: ['key', 'name'], right: [] },
    sorting: [{ id: '541-630', desc: false }]
  },
  state: {
    columnOrder: getColumnorder()
  }
};

export default fdTableConfig;
