import { fdTableCommonConfig } from '../fd-table/fd-table-config';

export const fdTableConfig = {
  ...fdTableCommonConfig,
  initialState: {
    ...fdTableCommonConfig.initialState,
    columnPinning: { left: ['tenure'] }
  }
};

export default fdTableConfig;
