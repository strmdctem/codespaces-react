import { fdTableCommonConfig } from '../fd-table/fd-table-config';

const fdSpecialTableConfig = {
  ...fdTableCommonConfig,
  initialState: {
    ...fdTableCommonConfig.initialState,
    sorting: [{ id: 'rate', desc: false }]
  }
};

export default fdSpecialTableConfig;
