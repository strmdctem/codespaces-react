import { Box, Typography } from '@mui/material';
import {
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table';
import fdColumns from './fd-calculator-table-columns';
import fdTableConfig from './fd-calculator-table-config';

const FDCalculatorTable = ({ data = [] }) => {
  const table = useMaterialReactTable({
    columns: fdColumns,
    data,
    ...fdTableConfig
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <Box sx={{ mt: 2, p: 2, borderRadius: 1 }}>
        <Typography variant="body2" sx={{ pr: 2 }}>
          <b> G = General, S = Senior Citizen </b>
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Column Explanations:
        </Typography>
        <Typography variant="body2" component="div">
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <li>
              <b>G. Interest</b>: Total interest earned for general citizens.
            </li>
            <li>
              <b>S. Interest</b>: Total interest earned for senior citizens.
            </li>
            <li>
              <b>G. Rate</b>: Interest rate applicable to general citizens.
            </li>
            <li>
              <b>S. Rate</b>: Interest rate applicable to senior citizens.
            </li>
            <li>
              <b>G. yearly %</b>: Annualized percentage yield for general
              citizens.
            </li>
            <li>
              <b>S. yearly %</b>: Annualized percentage yield for senior
              citizens.
            </li>
            <li>
              <b>G. Total %</b>: Total return percentage for general citizens
              over the selected period.
            </li>
            <li>
              <b>S. Total %</b>: Total return percentage for senior citizens
              over the selected period.
            </li>
          </Box>
        </Typography>
      </Box>
    </>
  );
};

export default FDCalculatorTable;
