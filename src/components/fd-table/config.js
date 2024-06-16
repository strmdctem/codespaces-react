import { getColumnOrder } from './columns';

export const commonColumnConfig = {
  enablePagination: false,
  enableBottomToolbar: false,
  enableColumnFilter: false,
  enableColumnActions: false,
  enableColumnPinning: true,
  enableStickyHeader: true,
  enableMultiSort: false,
  enableSortingRemoval: false,
  enableTopToolbar: false
};

export const fdTableConfig = {
  ...commonColumnConfig,
  initialState: {
    density: 'compact',
    columnPinning: { left: ['name'] },
    sorting: [{ id: '541-630', desc: false }]
  },
  state: {
    columnOrder: getColumnOrder()
  }
};

export default fdTableConfig;
