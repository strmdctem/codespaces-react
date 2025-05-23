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
    title: 'FD Comparator and Calculator',
    description:
      'Use FinRates Fixed Deposit Comparator to know returns on your savings. Compare the latest FD interest rates and returns across different banks.'
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
    <Box
      sx={{
        maxWidth: '1024px',
        mx: 'auto'
      }}
    >
      <Stack spacing={1}>
        <Box p={2} paddingTop={1} paddingBottom={1}>
          <Typography
            variant="h6"
            sx={{
              mb: 1.5,
              fontWeight: 'bold',
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              paddingBottom: 1
            }}
          >
            Fixed Deposit Calculator and Comparator
          </Typography>
          <Paper elevation={3} sx={{ marginTop: 1, maxWidth: 400 }}>
            <FDCalculatorForm onChange={handleCalcChange} />
          </Paper>
        </Box>
        <Box paddingLeft={2}>
          <h2 className="calc-label-1">
            FD Returns and Interest rate comparison
          </h2>
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
