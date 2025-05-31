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
          <Box sx={{ pl: 1, m: 0 }}>
            {[
              {
                label: 'G. Interest:',
                desc: 'Total interest earned for general citizens'
              },
              {
                label: 'S. Interest:',
                desc: 'Total interest earned for senior citizens'
              },
              {
                label: 'G. Rate:',
                desc: 'Interest rate applicable to general citizens'
              },
              {
                label: 'S. Rate:',
                desc: 'Interest rate applicable to senior citizens'
              },
              {
                label: 'G. yearly %:',
                desc: 'yearly percentage yield for general citizens, Compounding frequency is considered - Quarterly or Yearly'
              },
              {
                label: 'S. yearly %:',
                desc: 'yearly percentage yield for senior citizens, Compounding frequency is considered - Quarterly or Yearly'
              },
              {
                label: 'G. Total %:',
                desc: 'Total return percentage for general citizens over the selected period'
              },
              {
                label: 'S. Total %:',
                desc: 'Total return percentage for senior citizens over the selected period'
              }
            ].map(({ label, desc }, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 0.5 }}>
                <Box
                  component="span"
                  sx={{ minWidth: '90px', fontWeight: 'bold' }}
                >
                  {label}
                </Box>
                <Box component="span">{desc}</Box>
              </Box>
            ))}
          </Box>
        </Typography>
      </Box>
    </>
  );
};

export default FDCalculatorTable;
