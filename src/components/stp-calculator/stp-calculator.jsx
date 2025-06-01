import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { AgCharts as AgChartsReact } from 'ag-charts-react';
import React, { useEffect, useState } from 'react';
import Markdown from '../markdown/Markdown';
import usePageInfo from '../page-info/use-page-info';
import { rupeeFormat } from '../utils';
import STPCalculatorForm from './stp-calculator-form';

// Helper function to format tenure in years and months
function formatDuration(months) {
  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    let result = `${years} year${years !== 1 ? 's' : ''}`;
    if (remainingMonths > 0) {
      result += ` ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    return result;
  }
}

// Helper function to get transfer period text based on frequency
function getTransferPeriodText(frequency) {
  switch (frequency) {
    case 'quarterly':
      return 'Quarterly';
    case 'half-yearly':
      return 'Half-Yearly';
    case 'yearly':
      return 'Yearly';
    default:
      return 'Monthly';
  }
}

const STPCalculator = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [calcState, setCalcState] = useState({
    initialInvestment: 500000, // Default 5 lakhs
    transferAmount: 25000, // Default 25k
    sourceReturnRate: 7, // Conservative fund return rate
    targetReturnRate: 12, // Equity fund return rate
    tenure: 60, // Default tenure in months (5 years)
    frequency: 'monthly' // Default frequency
  });
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [expandedCalculationIds, setExpandedCalculationIds] = useState([]);
  const [mainAccordionExpanded, setMainAccordionExpanded] = useState(true);
  const [calculatedBreakdowns, setCalculatedBreakdowns] = useState({});

  usePageInfo({
    title: 'STP Calculator',
    description:
      'FinRates STP Calculator helps you plan your systematic transfer strategy with ease. Adjust initial investment, transfer amount, source and target fund returns, tenure, and frequency to explore wealth optimization. Visualize year-by-year breakdowns with interactive charts and table, analyze fund transfers vs returns, track total wealth, and save multiple scenarios for comparison. Make informed transfer decisions with our comprehensive STP analysis tools.'
  });

  useEffect(() => {
    // Load saved calculations from localStorage on component mount
    const saved = localStorage.getItem('savedSTPCalculations');
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
  }, []);

  const handleCalcChange = (state) => {
    setCalcState(state);
  };

  // Calculate total transfers based on frequency and tenure
  const calculateTotalTransfers = () => {
    const { transferAmount, tenure, frequency } = calcState;

    if (!transferAmount || !tenure) return 0;

    let numberOfTransfers = tenure;

    switch (frequency) {
      case 'quarterly':
        numberOfTransfers = Math.ceil(tenure / 3);
        break;
      case 'half-yearly':
        numberOfTransfers = Math.ceil(tenure / 6);
        break;
      case 'yearly':
        numberOfTransfers = Math.ceil(tenure / 12);
        break;
      default: // monthly
        numberOfTransfers = tenure;
    }

    return transferAmount * numberOfTransfers;
  };

  // Calculate final value in source fund
  const calculateSourceFundFinalValue = () => {
    const {
      initialInvestment,
      transferAmount,
      sourceReturnRate,
      tenure,
      frequency
    } = calcState;
    if (!initialInvestment || !sourceReturnRate || !tenure) return 0;

    let intervalMonths = 1;

    switch (frequency) {
      case 'quarterly':
        intervalMonths = 3;
        break;
      case 'half-yearly':
        intervalMonths = 6;
        break;
      case 'yearly':
        intervalMonths = 12;
        break;
      default: // monthly
        intervalMonths = 1;
    }

    const monthlyRate = Math.pow(1 + sourceReturnRate / 100, 1 / 12) - 1;
    let currentValue = initialInvestment;

    // Month-by-month calculation
    for (let month = 1; month <= tenure; month++) {
      // Apply monthly growth
      currentValue = currentValue * (1 + monthlyRate);

      // Transfer on appropriate intervals
      const shouldTransfer = (month - 1) % intervalMonths === 0;
      if (shouldTransfer && currentValue >= transferAmount) {
        currentValue -= transferAmount;
      }
    }

    return Math.round(currentValue);
  };

  // Calculate final value in target fund
  const calculateTargetFundFinalValue = () => {
    const { transferAmount, targetReturnRate, tenure, frequency } = calcState;

    if (!transferAmount || !targetReturnRate || !tenure) return 0;
    let intervalMonths = 1;

    switch (frequency) {
      case 'quarterly':
        intervalMonths = 3;
        break;
      case 'half-yearly':
        intervalMonths = 6;
        break;
      case 'yearly':
        intervalMonths = 12;
        break;
      default: // monthly
        intervalMonths = 1;
    }

    const monthlyRate = Math.pow(1 + targetReturnRate / 100, 1 / 12) - 1;
    let currentValue = 0;

    // Month-by-month calculation
    for (let month = 1; month <= tenure; month++) {
      // Apply monthly growth
      currentValue = currentValue * (1 + monthlyRate);

      // Add transfer on appropriate intervals
      const shouldTransfer = (month - 1) % intervalMonths === 0;
      if (shouldTransfer) {
        currentValue += transferAmount;
      }
    }

    return Math.round(currentValue);
  };

  // Calculate total final value
  const calculateTotalFinalValue = () => {
    const sourceFundValue = calculateSourceFundFinalValue();
    const targetFundValue = calculateTargetFundFinalValue();
    return sourceFundValue + targetFundValue;
  };

  // Calculate total wealth gained
  const calculateWealthGained = () => {
    const totalFinalValue = calculateTotalFinalValue();
    const { initialInvestment } = calcState;
    return Math.round(totalFinalValue - initialInvestment);
  };

  // Calculate absolute returns
  const calculateAbsoluteReturns = () => {
    const { initialInvestment } = calcState;
    const wealthGained = calculateWealthGained();

    if (!initialInvestment || initialInvestment === 0) return '0';

    const absoluteReturn = (wealthGained / initialInvestment) * 100;

    return absoluteReturn % 1 === 0
      ? absoluteReturn.toString()
      : absoluteReturn.toFixed(2);
  };

  // Calculate year-by-year STP breakdown
  const calculateYearlySTPBreakdown = () => {
    const {
      initialInvestment,
      transferAmount,
      sourceReturnRate,
      targetReturnRate,
      tenure,
      frequency
    } = calcState;

    if (
      !initialInvestment ||
      !transferAmount ||
      !sourceReturnRate ||
      !targetReturnRate ||
      !tenure
    )
      return [];

    let intervalMonths = 1;

    switch (frequency) {
      case 'quarterly':
        intervalMonths = 3;
        break;
      case 'half-yearly':
        intervalMonths = 6;
        break;
      case 'yearly':
        intervalMonths = 12;
        break;
      default: // monthly
        intervalMonths = 1;
    }

    const sourceMonthlyRate = Math.pow(1 + sourceReturnRate / 100, 1 / 12) - 1;
    const targetMonthlyRate = Math.pow(1 + targetReturnRate / 100, 1 / 12) - 1;

    let sourceValue = initialInvestment;
    let targetValue = 0;
    let totalTransfers = 0;

    const monthlyBreakdown = [];

    // Calculate month-by-month breakdown
    for (let month = 1; month <= tenure; month++) {
      // Apply monthly growth to both funds
      sourceValue = sourceValue * (1 + sourceMonthlyRate);
      targetValue = targetValue * (1 + targetMonthlyRate);

      // Transfer on appropriate intervals
      const shouldTransfer = (month - 1) % intervalMonths === 0;
      if (shouldTransfer && sourceValue >= transferAmount) {
        sourceValue -= transferAmount;
        targetValue += transferAmount;
        totalTransfers += transferAmount;
      }

      monthlyBreakdown.push({
        month,
        sourceValue: sourceValue,
        targetValue: targetValue,
        totalValue: sourceValue + targetValue,
        totalTransfers: totalTransfers
      });
    }

    // Group by years for display
    const yearlyBreakdown = [];
    const yearsInPeriod = Math.ceil(tenure / 12);

    for (let year = 0; year < yearsInPeriod; year++) {
      const startMonth = year * 12 + 1;
      const endMonth = Math.min((year + 1) * 12, tenure);
      const monthsInYear = monthlyBreakdown.slice(startMonth - 1, endMonth);

      if (monthsInYear.length === 0) continue;

      const lastMonthInYear = monthsInYear[monthsInYear.length - 1];

      // Calculate transfers in this year
      const transfersInYear =
        year === 0
          ? lastMonthInYear.totalTransfers
          : lastMonthInYear.totalTransfers -
            (yearlyBreakdown[year - 1]?.totalTransfers || 0);

      const yearData = {
        year: year + 1,
        transfersInYear: transfersInYear,
        sourceValue: Math.round(lastMonthInYear.sourceValue),
        targetValue: Math.round(lastMonthInYear.targetValue),
        totalValue: Math.round(lastMonthInYear.totalValue),
        totalTransfers: lastMonthInYear.totalTransfers
      };

      yearlyBreakdown.push(yearData);
    }

    return yearlyBreakdown;
  };

  // Calculate breakdown for a saved calculation
  const calculateBreakdownForSavedCalc = (calculation) => {
    const {
      initialInvestment,
      transferAmount,
      sourceReturnRate,
      targetReturnRate,
      tenure,
      frequency = 'monthly'
    } = calculation;

    if (
      !initialInvestment ||
      !transferAmount ||
      !sourceReturnRate ||
      !targetReturnRate ||
      !tenure
    )
      return [];

    // Use the same logic as calculateYearlySTPBreakdown but with saved calculation data
    let intervalMonths = 1;

    switch (frequency) {
      case 'quarterly':
        intervalMonths = 3;
        break;
      case 'half-yearly':
        intervalMonths = 6;
        break;
      case 'yearly':
        intervalMonths = 12;
        break;
      default: // monthly
        intervalMonths = 1;
    }

    const sourceMonthlyRate = Math.pow(1 + sourceReturnRate / 100, 1 / 12) - 1;
    const targetMonthlyRate = Math.pow(1 + targetReturnRate / 100, 1 / 12) - 1;

    let sourceValue = initialInvestment;
    let targetValue = 0;
    let totalTransfers = 0;

    const monthlyBreakdown = [];

    for (let month = 1; month <= tenure; month++) {
      sourceValue = sourceValue * (1 + sourceMonthlyRate);
      targetValue = targetValue * (1 + targetMonthlyRate);

      const shouldTransfer = (month - 1) % intervalMonths === 0;
      if (shouldTransfer && sourceValue >= transferAmount) {
        sourceValue -= transferAmount;
        targetValue += transferAmount;
        totalTransfers += transferAmount;
      }

      monthlyBreakdown.push({
        month,
        sourceValue: sourceValue,
        targetValue: targetValue,
        totalValue: sourceValue + targetValue,
        totalTransfers: totalTransfers
      });
    }

    const yearlyBreakdown = [];
    const yearsInPeriod = Math.ceil(tenure / 12);

    for (let year = 0; year < yearsInPeriod; year++) {
      const startMonth = year * 12 + 1;
      const endMonth = Math.min((year + 1) * 12, tenure);
      const monthsInYear = monthlyBreakdown.slice(startMonth - 1, endMonth);

      if (monthsInYear.length === 0) continue;

      const lastMonthInYear = monthsInYear[monthsInYear.length - 1];

      const transfersInYear =
        year === 0
          ? lastMonthInYear.totalTransfers
          : lastMonthInYear.totalTransfers -
            (yearlyBreakdown[year - 1]?.totalTransfers || 0);

      const yearData = {
        year: year + 1,
        transfersInYear: transfersInYear,
        sourceValue: Math.round(lastMonthInYear.sourceValue),
        targetValue: Math.round(lastMonthInYear.targetValue),
        totalValue: Math.round(lastMonthInYear.totalValue),
        totalTransfers: lastMonthInYear.totalTransfers
      };

      yearlyBreakdown.push(yearData);
    }

    return yearlyBreakdown;
  };

  const saveCalculation = () => {
    const newCalculation = {
      id: Date.now(), // Use timestamp as unique ID
      initialInvestment: calcState.initialInvestment,
      transferAmount: calcState.transferAmount,
      sourceReturnRate: calcState.sourceReturnRate,
      targetReturnRate: calcState.targetReturnRate,
      tenure: calcState.tenure,
      frequency: calcState.frequency,
      totalTransfers: calculateTotalTransfers(),
      sourceFundValue: calculateSourceFundFinalValue(),
      targetFundValue: calculateTargetFundFinalValue(),
      totalFinalValue: calculateTotalFinalValue(),
      wealthGained: calculateWealthGained(),
      absoluteReturns: calculateAbsoluteReturns(),
      date: new Date().toLocaleDateString()
    };

    const updatedCalculations = [...savedCalculations, newCalculation];
    setSavedCalculations(updatedCalculations);
    localStorage.setItem(
      'savedSTPCalculations',
      JSON.stringify(updatedCalculations)
    );
  };

  const deleteCalculation = (id) => {
    const updatedCalculations = savedCalculations.filter(
      (calc) => calc.id !== id
    );
    setSavedCalculations(updatedCalculations);

    // Remove from expanded IDs list and breakdown
    setExpandedCalculationIds((prev) => prev.filter((itemId) => itemId !== id));
    setCalculatedBreakdowns((prev) => {
      const newBreakdowns = { ...prev };
      delete newBreakdowns[id];
      return newBreakdowns;
    });

    localStorage.setItem(
      'savedSTPCalculations',
      JSON.stringify(updatedCalculations)
    );
  };

  const handleExpandClick = (id) => {
    // Check if we need to generate the breakdown
    if (!calculatedBreakdowns[id] && !expandedCalculationIds.includes(id)) {
      const calculation = savedCalculations.find((calc) => calc.id === id);
      if (calculation) {
        setCalculatedBreakdowns((prev) => ({
          ...prev,
          [id]: calculateBreakdownForSavedCalc(calculation)
        }));
      }
    }

    setExpandedCalculationIds((prev) => {
      // Check if the id is already in the array
      if (prev.includes(id)) {
        // If yes, remove it (close the accordion)
        return prev.filter((itemId) => itemId !== id);
      } else {
        // If not, add it (open the accordion)
        return [...prev, id];
      }
    });
  };

  // Generate chart data for STP breakdown visualization
  const generateChartData = () => {
    const yearlyBreakdown = calculateYearlySTPBreakdown();

    return yearlyBreakdown.map((row, index) => {
      const isLast = index === yearlyBreakdown.length - 1;

      return {
        year: `Year ${row.year}`,
        sourceValue: row.sourceValue,
        targetValue: row.targetValue,
        totalValue: row.totalValue,
        isLast: isLast
      };
    });
  };

  const chartOptions = {
    data: generateChartData(),
    title: {
      text: 'STP Fund Transfer Visualization',
      fontSize: 16,
      fontWeight: 'bold'
    },
    subtitle: {
      text: 'Year-by-Year Fund Distribution',
      fontSize: 12
    },
    background: {
      fill: isDark ? '#1e1e1e' : '#ffffff'
    },
    series: [
      {
        type: 'bar',
        xKey: 'year',
        yKey: 'sourceValue',
        stacked: true,
        yName: 'Source Fund',
        fill: '#1976d2',
        tooltip: {
          renderer: function ({ datum }) {
            const sourceValue = Math.round(datum.sourceValue).toLocaleString(
              'en-IN'
            );
            const targetValue = Math.round(datum.targetValue).toLocaleString(
              'en-IN'
            );
            const totalValue = Math.round(datum.totalValue).toLocaleString(
              'en-IN'
            );

            return {
              content: `
                <b>Total Value:</b> ₹${totalValue}<br>
                <b>Source Fund:</b> ₹${sourceValue}<br>
                Target Fund: ₹${targetValue}
              `,
              title: `${datum.year}`,
              titleFontWeight: 'bold'
            };
          }
        }
      },
      {
        type: 'bar',
        xKey: 'year',
        yKey: 'targetValue',
        stacked: true,
        yName: 'Target Fund',
        fill: '#00bfa5',
        label: {
          formatter: (params) => {
            if (!params.datum.isLast) {
              return '';
            }
            const total = params.datum.totalValue;

            // Format in lakhs and crores
            if (total >= 10000000) {
              // For values >= 1 crore (1,00,00,000)
              return `${(total / 10000000).toFixed(2)} cr`;
            } else if (total >= 100000) {
              // For values >= 1 lakh (1,00,000)
              return `${(total / 100000).toFixed(2)} lac`;
            } else {
              // For smaller values
              return `₹${Math.round(total).toLocaleString('en-IN')}`;
            }
          },
          placement: 'outside',
          color: '#000080',
          fontWeight: 'bold'
        },
        tooltip: {
          renderer: function ({ datum }) {
            const sourceValue = Math.round(datum.sourceValue).toLocaleString(
              'en-IN'
            );
            const targetValue = Math.round(datum.targetValue).toLocaleString(
              'en-IN'
            );
            const totalValue = Math.round(datum.totalValue).toLocaleString(
              'en-IN'
            );

            return {
              content: `
                <b>Total Value:</b> ₹${totalValue}<br>
                Source Fund: ₹${sourceValue}<br>
                <b>Target Fund:</b> ₹${targetValue}
              `,
              title: `${datum.year}`,
              titleFontWeight: 'bold'
            };
          }
        }
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom'
      },
      {
        type: 'number',
        position: 'left',
        label: {
          formatter: ({ value }) => {
            if (value >= 10000000) {
              return `₹${(value / 10000000).toFixed(1)}Cr`;
            } else if (value >= 100000) {
              return `₹${(value / 100000).toFixed(1)}L`;
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(0)}K`;
            }
            return `₹${value.toFixed(0)}`;
          }
        }
      }
    ],
    legend: {
      position: 'bottom'
    }
  };

  return (
    <Box
      sx={{
        maxWidth: '1024px',
        mx: 'auto'
      }}
    >
      <Box
        sx={{
          p: 2,
          pb: 0,
          maxWidth: 500
        }}
      >
        <Typography
          variant="h1"
          sx={{
            mt: -1,
            mb: 1.5,
            fontWeight: 'bold',
            color: 'primary.main',
            borderBottom: '2px solid',
            borderColor: 'primary.main',
            paddingBottom: 1,
            fontSize: '1.1rem'
          }}
        >
          STP Calculator
        </Typography>
        <STPCalculatorForm onChange={handleCalcChange} />
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0 }}>
          <Typography variant="body1" fontWeight="bold">
            Total Transfers:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ₹{rupeeFormat(calculateTotalTransfers())}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            Source Fund Value:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ₹{rupeeFormat(calculateSourceFundFinalValue())}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            Target Fund Value:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ₹{rupeeFormat(calculateTargetFundFinalValue())}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            Total Value:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ₹{rupeeFormat(calculateTotalFinalValue())}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            Wealth Gained:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ₹{rupeeFormat(calculateWealthGained())}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 1, mb: 1 }}
        >
          <Typography variant="body1" fontWeight="bold">
            Absolute Returns:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {calculateAbsoluteReturns()}%
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ width: '100%' }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1, mb: -1, width: '90%' }}
            onClick={saveCalculation}
          >
            Save for Reference
          </Button>
          <Tooltip
            title="Your calculations are saved locally in your browser's storage. View and compare your saved scenarios at the bottom of this page."
            placement="top"
            enterTouchDelay={0}
            leaveTouchDelay={10000}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: '#00bfa5',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  padding: '10px',
                  maxWidth: '300px'
                }
              }
            }}
          >
            <InfoIcon sx={{ mt: 1, mb: -1, color: '#00bfa5' }} />
          </Tooltip>
        </Stack>
      </Box>
      <Accordion
        sx={{ mt: 3, mb: 0 }}
        TransitionProps={{ unmountOnExit: false }}
        expanded={mainAccordionExpanded}
        onChange={() => setMainAccordionExpanded(!mainAccordionExpanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="stp-breakdown-content"
          id="stp-breakdown-header"
        >
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            STP Breakdown by Year
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2, ml: -2, mr: -2, mt: -3, height: 300 }}>
            <AgChartsReact options={chartOptions} />
          </Box>
          <TableContainer component={Paper}>
            <Table size="small" stickyHeader sx={{ minWidth: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      padding: '6px 8px',
                      width: '40px',
                      maxWidth: '40px',
                      textAlign: 'center'
                    }}
                  >
                    Year
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '120px' }}
                  >
                    Transfers(₹)
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '120px' }}
                  >
                    Source Fund(₹)
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '120px' }}
                  >
                    Target Fund(₹)
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '120px' }}
                  >
                    Total Value(₹)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calculateYearlySTPBreakdown().map((row) => (
                  <TableRow key={row.year}>
                    <TableCell
                      style={{
                        padding: '6px 8px',
                        width: '40px',
                        maxWidth: '40px',
                        textAlign: 'center'
                      }}
                    >
                      {row.year}
                    </TableCell>
                    <TableCell align="right" style={{ padding: '6px 8px' }}>
                      {rupeeFormat(Math.round(row.transfersInYear))}
                    </TableCell>
                    <TableCell align="right" style={{ padding: '6px 8px' }}>
                      {rupeeFormat(Math.round(row.sourceValue))}
                    </TableCell>
                    <TableCell align="right" style={{ padding: '6px 8px' }}>
                      {rupeeFormat(Math.round(row.targetValue))}
                    </TableCell>
                    <TableCell align="right" style={{ padding: '6px 8px' }}>
                      {rupeeFormat(Math.round(row.totalValue))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      <Box
        sx={{
          p: 2,
          pt: 0
        }}
      >
        {savedCalculations.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 1, mb: 2 }} color="primary">
              Saved Calculations
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                overflowX: 'auto',
                '& .MuiTable-root': {
                  '@media (max-width: 600px)': {
                    minWidth: '700px'
                  }
                }
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        padding: '6px 4px',
                        width: '50px',
                        textAlign: 'center'
                      }}
                    >
                      #
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '100px' }}>
                      Initial Amount
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '80px' }}>
                      Transfer Amount
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '60px' }}>
                      Source Rate
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '60px' }}>
                      Target Rate
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '70px' }}>
                      Frequency
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '70px' }}>
                      Duration
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '100px' }}>
                      Final Value
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '100px' }}>
                      Wealth Gain
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '70px' }}>
                      Returns(%)
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '80px' }}>
                      Saved On
                    </TableCell>
                    <TableCell
                      style={{
                        padding: '6px 4px',
                        width: '50px',
                        textAlign: 'center'
                      }}
                    >
                      Delete
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {savedCalculations.map((calc, index) => (
                    <React.Fragment key={calc.id}>
                      <TableRow>
                        <TableCell style={{ textAlign: 'center' }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleExpandClick(calc.id)}
                              aria-expanded={expandedCalculationIds.includes(
                                calc.id
                              )}
                              aria-label="show breakdown"
                              sx={{ padding: '2px' }}
                            >
                              <ExpandMoreIcon
                                fontSize="small"
                                sx={{
                                  transform: expandedCalculationIds.includes(
                                    calc.id
                                  )
                                    ? 'rotate(180deg)'
                                    : 'rotate(0deg)',
                                  transition: '0.2s'
                                }}
                              />
                            </IconButton>
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                              {index + 1}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          ₹{rupeeFormat(calc.initialInvestment)}
                        </TableCell>
                        <TableCell>
                          ₹{rupeeFormat(calc.transferAmount)}
                        </TableCell>
                        <TableCell>{calc.sourceReturnRate}%</TableCell>
                        <TableCell>{calc.targetReturnRate}%</TableCell>
                        <TableCell>
                          {getTransferPeriodText(calc.frequency || 'monthly')}
                        </TableCell>
                        <TableCell>{formatDuration(calc.tenure)}</TableCell>
                        <TableCell>
                          ₹{rupeeFormat(calc.totalFinalValue)}
                        </TableCell>
                        <TableCell>₹{rupeeFormat(calc.wealthGained)}</TableCell>
                        <TableCell>{calc.absoluteReturns}%</TableCell>
                        <TableCell>{calc.date}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => deleteCalculation(calc.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      {expandedCalculationIds.includes(calc.id) &&
                        calculatedBreakdowns[calc.id] && (
                          <TableRow>
                            <TableCell
                              colSpan={12}
                              style={{ paddingTop: 0, paddingBottom: 0 }}
                            >
                              <Box
                                sx={{
                                  margin: 1,
                                  overflowX: 'auto',
                                  '& .MuiTable-root': {
                                    '@media (max-width: 600px)': {
                                      minWidth: '500px'
                                    }
                                  }
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: 'bold',
                                    mb: 1,
                                    color: 'primary.main'
                                  }}
                                >
                                  Year-by-Year Breakdown
                                </Typography>
                                <Table size="small" sx={{ minWidth: '100%' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell
                                        style={{
                                          padding: '6px 8px',
                                          width: '40px',
                                          maxWidth: '40px',
                                          textAlign: 'center'
                                        }}
                                      >
                                        Year
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        style={{
                                          padding: '6px 8px',
                                          width: '120px'
                                        }}
                                      >
                                        Transfers (₹)
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        style={{
                                          padding: '6px 8px',
                                          width: '120px'
                                        }}
                                      >
                                        Source Fund (₹)
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        style={{
                                          padding: '6px 8px',
                                          width: '120px'
                                        }}
                                      >
                                        Target Fund (₹)
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        style={{
                                          padding: '6px 8px',
                                          width: '120px'
                                        }}
                                      >
                                        Total Value (₹)
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {calculatedBreakdowns[calc.id].map(
                                      (row) => (
                                        <TableRow key={row.year}>
                                          <TableCell
                                            style={{
                                              padding: '6px 8px',
                                              width: '40px',
                                              maxWidth: '40px',
                                              textAlign: 'center'
                                            }}
                                          >
                                            {row.year}
                                          </TableCell>
                                          <TableCell
                                            align="right"
                                            style={{ padding: '6px 8px' }}
                                          >
                                            {rupeeFormat(
                                              Math.round(row.transfersInYear)
                                            )}
                                          </TableCell>
                                          <TableCell
                                            align="right"
                                            style={{ padding: '6px 8px' }}
                                          >
                                            {rupeeFormat(
                                              Math.round(row.sourceValue)
                                            )}
                                          </TableCell>
                                          <TableCell
                                            align="right"
                                            style={{ padding: '6px 8px' }}
                                          >
                                            {rupeeFormat(
                                              Math.round(row.targetValue)
                                            )}
                                          </TableCell>
                                          <TableCell
                                            align="right"
                                            style={{ padding: '6px 8px' }}
                                          >
                                            {rupeeFormat(
                                              Math.round(row.totalValue)
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
      <Markdown path="/markdown/stp.md"></Markdown>
    </Box>
  );
};

export default STPCalculator;
