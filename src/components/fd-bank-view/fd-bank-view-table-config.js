import { fdTableCommonConfig } from '../fd-table/fd-table-config';
import { getColumnOrder } from './fd-bank-view-table-columns';

export const fdTableConfig = {
  ...fdTableCommonConfig,
  initialState: {
    ...fdTableCommonConfig.initialState,
    columnPinning: { left: ['tenure'] }
  },
  state: {
    columnOrder: getColumnOrder()
  }
};

export default fdTableConfig;
