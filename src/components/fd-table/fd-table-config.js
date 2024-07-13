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
  sortDescFirst: false,
  initialState: {
    density: 'compact',
    columnPinning: { left: ['name'] }
  }
};

export const fdTableConfig = {
  ...fdTableCommonConfig,
  initialState: {
    ...fdTableCommonConfig.initialState
  },
  state: {
    columnOrder: getColumnOrder()
  }
};

export default fdTableConfig;
