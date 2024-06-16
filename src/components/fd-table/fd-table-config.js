import { getColumnOrder } from './fd-table-columns';

export const fdTableCommonConfig = {
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
    columnPinning: { left: ['name'] }
  }
};

export const fdTableConfig = {
  ...fdTableCommonConfig,
  initialState: {
    ...fdTableCommonConfig.initialState,
    sorting: [{ id: '451-540', desc: false }]
  },
  state: {
    columnOrder: getColumnOrder()
  }
};

export default fdTableConfig;
