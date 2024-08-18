import { Paper, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { getCalcData } from '../fd-view/data';
import { FDCalculatorChart } from './fd-calculator-chart';
import FDCalculatorForm from './fd-calculator-form';
import FDCalculatorTable from './fd-calculator-table';

export default function FDCalculator() {
  const [data, setData] = useState([]);
  const handleCalcChange = (calcState) => {
    console.log(calcState);
    const newData = getCalcData(calcState);
    console.log(newData);
    setData(newData);
  };
  return (
    <Box>
      <Stack spacing={1}>
        <Box p={2}>
          <label className="calc-label-1"> Fixed Deposit Calculator</label>
          <Paper elevation={3}>
            <FDCalculatorForm onChange={handleCalcChange} />
          </Paper>
        </Box>
        {/* <Typography variant="body2" align="right" sx={{ pr: 2 }}>
          G = General, S = Senior Citizen
        </Typography> */}
        <FDCalculatorTable data={data} />
        <Box>
          <Paper elevation={2}>
            <Stack direction="row" sx={{ height: 340, mt: 2 }} spacing={0}>
              <FDCalculatorChart data={data} />
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
