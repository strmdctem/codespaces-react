import { fdTableCommonConfig } from '../fd-table/fd-table-config';
import { getColumnOrder } from './fd-tenure-table-columns';

export const fdTenureTableConfig = {
  ...fdTableCommonConfig,
  state: {
    columnOrder: getColumnOrder()
  }
};
