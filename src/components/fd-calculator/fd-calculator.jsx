import { Box, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { getCalcData } from '../fd-view/data';
import usePageInfo from '../page-info/use-page-info';
import { FDCalculatorChart } from './fd-calculator-chart';
import FDCalculatorForm from './fd-calculator-form';
import FDCalculatorTable from './fd-calculator-table';

export default function FDCalculator() {
  const [data, setData] = useState([]);
  const tableRef = useRef(null);
  const chartRef = useRef(null);

  usePageInfo({
    title: 'FD Calculator',
    description:
      'Use FinRates Fixed Deposit Calculator to know returns on your savings. Compare the latest FD interest rates of  2024 and returns across different banks to find the best FD schemes for your needs.'
  });

  const handleCalcChange = (calcState) => {
    const newData = getCalcData(calcState);
    setData(newData);
  };

  useEffect(() => {
    const updateChartHeight = () => {
      if (tableRef.current && chartRef.current) {
        const tableHeight = tableRef.current.offsetHeight;
        chartRef.current.style.height = `${tableHeight * 2 + 50}px`;
      }
    };

    const resizeObserver = new ResizeObserver(updateChartHeight);
    if (tableRef.current) {
      resizeObserver.observe(tableRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [data]);

  return (
    <Box>
      <Stack spacing={1}>
        <Box p={2}>
          <h1 className="calc-label-1"> Fixed Deposit Calculator</h1>
          <Paper elevation={3}>
            <FDCalculatorForm onChange={handleCalcChange} />
          </Paper>
        </Box>
        <Stack direction="row" justifyContent="flex-end">
          <Typography variant="body2" sx={{ pr: 2 }}>
            G = General, S = Senior Citizen
          </Typography>
        </Stack>

        <div ref={tableRef}>
          <FDCalculatorTable data={data} />
        </div>
        <Box id="char-cnt" ref={chartRef}>
          <FDCalculatorChart data={data} />
        </Box>
      </Stack>
    </Box>
  );
}
