import { Stack } from '@mui/material';
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
        <FDCalculatorForm onChange={handleCalcChange} />
        <FDCalculatorTable data={data} />
        <Stack direction="row" sx={{ height: 340 }} spacing={0}>
          <FDCalculatorChart data={data} />
        </Stack>
      </Stack>
    </Box>
  );
}
