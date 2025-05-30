import { Box, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { getCalcData } from '../fd-view/data';
import usePageInfo from '../page-info/use-page-info';
import { FDCalculatorChart } from './fd-calculator-chart';
import FDCalculatorForm from './fd-calculator-form';
import FDCalculatorTable from './fd-calculator-table';

export default function FDCalculator() {
  const [data, setData] = useState([]);
  const [chartHeight, setChartHeight] = useState(400);
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
        const newHeight = tableHeight * 2;
        chartRef.current.style.height = `${newHeight}px`;

        // Force chart re-render with new height
        setChartHeight(newHeight);
      }
    };

    const resizeObserver = new ResizeObserver(updateChartHeight);
    if (tableRef.current) {
      resizeObserver.observe(tableRef.current);
    }

    updateChartHeight(); // Initial call to set height

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
            variant="h1"
            sx={{
              mt: 0.5,
              mb: 1.5,
              fontWeight: 'bold',
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              paddingBottom: 1,
              fontSize: '1.1rem'
            }}
          >
            FD Calculator and Comparator
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
        <Box id="char-cnt" ref={chartRef} sx={{ height: '100%' }}>
          <FDCalculatorChart data={data} height={chartHeight} />
        </Box>
      </Stack>
    </Box>
  );
}
