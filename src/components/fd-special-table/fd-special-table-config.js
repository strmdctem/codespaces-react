import { fdTableCommonConfig } from '../fd-table/fd-table-config';
import { getColumnOrder } from './fd-special-table-columns';

const fdSpecialTableConfig = {
  ...fdTableCommonConfig,
  initialState: {
    ...fdTableCommonConfig.initialState,
    sorting: [{ id: 'rate', desc: true }]
  },
  state: {
    columnOrder: getColumnOrder()
  }
};

export default fdSpecialTableConfig;
