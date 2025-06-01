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
import SWPCalculatorForm from './swp-calculator-form';

// Helper function to format tenure in years and months
function formatDuration(months) {
  if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    let yearText = `${years} year${years > 1 ? 's' : ''}`;
    let monthText =
      remainingMonths > 0
        ? `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`
        : '';
    return `${yearText}${remainingMonths > 0 ? ' ' + monthText : ''}`;
  }
}

// Helper function to get withdrawal period text based on frequency
function getWithdrawalPeriodText(frequency) {
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

const SWPCalculator = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [calcState, setCalcState] = useState({
    initialInvestment: 1000000, // Default 10 lakhs
    withdrawalAmount: 10000, // Default 10k per month
    expectedReturnRate: 10, // Expected return rate
    tenure: 120, // Default tenure in months (10 years)
    frequency: 'monthly' // Default frequency
  });
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [expandedCalculationIds, setExpandedCalculationIds] = useState([]);
  const [mainAccordionExpanded, setMainAccordionExpanded] = useState(true);
  const [calculatedBreakdowns, setCalculatedBreakdowns] = useState({});

  usePageInfo({
    title: 'SWP Calculator',
    description:
      'FinRates SWP Calculator helps you plan your systematic withdrawal strategy with ease. Adjust initial investment, withdrawal amount, expected return rate, tenure, and frequency to explore wealth depletion scenarios. Visualize year-by-year breakdowns with interactive charts and table, analyze withdrawals vs remaining balance, track corpus depletion, and save multiple scenarios for comparison. Make informed retirement and withdrawal decisions with our comprehensive SWP analysis tools.'
  });

  useEffect(() => {
    // Load saved calculations from localStorage on component mount
    const saved = localStorage.getItem('savedSWPCalculations');
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
  }, []);

  const handleCalcChange = (state) => {
    setCalcState(state);
  };

  // Calculate total withdrawals based on frequency and tenure
  const calculateTotalWithdrawals = () => {
    const { withdrawalAmount, tenure, frequency } = calcState;
    if (!withdrawalAmount || !tenure) return 0;

    let numberOfWithdrawals = tenure;

    switch (frequency) {
      case 'quarterly':
        numberOfWithdrawals = Math.ceil(tenure / 3);
        break;
      case 'half-yearly':
        numberOfWithdrawals = Math.ceil(tenure / 6);
        break;
      case 'yearly':
        numberOfWithdrawals = Math.ceil(tenure / 12);
        break;
      default: // monthly
        numberOfWithdrawals = tenure;
    }

    return withdrawalAmount * numberOfWithdrawals;
  };
  // Calculate remaining balance after all withdrawals
  const calculateRemainingBalance = () => {
    const {
      initialInvestment,
      withdrawalAmount,
      expectedReturnRate,
      tenure,
      frequency
    } = calcState;

    if (
      !initialInvestment ||
      !withdrawalAmount ||
      !expectedReturnRate ||
      !tenure
    )
      return 0;

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

    const monthlyRate = Math.pow(1 + expectedReturnRate / 100, 1 / 12) - 1;
    let currentBalance = initialInvestment;

    // Month-by-month calculation
    for (let month = 1; month <= tenure; month++) {
      // Apply monthly growth
      currentBalance = currentBalance * (1 + monthlyRate);

      // Withdraw on appropriate intervals - fix withdrawal timing
      const shouldWithdraw = month % intervalMonths === 0;
      if (shouldWithdraw && currentBalance > 0) {
        const actualWithdrawal = Math.min(withdrawalAmount, currentBalance);
        currentBalance = Math.max(0, currentBalance - actualWithdrawal);
      }

      // If balance becomes zero, stop
      if (currentBalance <= 0) {
        return 0;
      }
    }

    return Math.round(currentBalance);
  };
  // Calculate when the corpus will be exhausted
  const calculateExhaustionPeriod = () => {
    const {
      initialInvestment,
      withdrawalAmount,
      expectedReturnRate,
      frequency
    } = calcState;

    if (!initialInvestment || !withdrawalAmount || !expectedReturnRate)
      return null;

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

    const monthlyRate = Math.pow(1 + expectedReturnRate / 100, 1 / 12) - 1;
    let currentBalance = initialInvestment;
    let month = 0;

    // Month-by-month calculation until exhaustion
    while (currentBalance > 0 && month < 1200) {
      // Max 100 years
      month++;

      // Apply monthly growth
      currentBalance = currentBalance * (1 + monthlyRate);

      // Withdraw on appropriate intervals - fix withdrawal timing
      const shouldWithdraw = month % intervalMonths === 0;
      if (shouldWithdraw && currentBalance > 0) {
        const actualWithdrawal = Math.min(withdrawalAmount, currentBalance);
        currentBalance = Math.max(0, currentBalance - actualWithdrawal);
      }

      // Check if exhausted
      if (currentBalance <= 0) {
        return month;
      }
    }
    return null; // Never exhausted in reasonable time
  };
  // Calculate year-by-year SWP breakdown
  const calculateYearlySWPBreakdown = () => {
    const {
      initialInvestment,
      withdrawalAmount,
      expectedReturnRate,
      tenure,
      frequency
    } = calcState;
    if (
      !initialInvestment ||
      !withdrawalAmount ||
      !expectedReturnRate ||
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

    const monthlyRate = Math.pow(1 + expectedReturnRate / 100, 1 / 12) - 1;
    let currentBalance = initialInvestment;

    const monthlyBreakdown = [];

    // Calculate month-by-month breakdown
    for (let month = 1; month <= tenure; month++) {
      // Apply monthly growth first
      const growthForMonth = currentBalance * monthlyRate;
      currentBalance = currentBalance + growthForMonth;

      // Withdraw on appropriate intervals - fix withdrawal timing
      const shouldWithdraw = month % intervalMonths === 0;
      let withdrawalForMonth = 0;

      if (shouldWithdraw && currentBalance > 0) {
        withdrawalForMonth = Math.min(withdrawalAmount, currentBalance);
        currentBalance = Math.max(0, currentBalance - withdrawalForMonth);
      }

      monthlyBreakdown.push({
        month,
        withdrawal: withdrawalForMonth,
        growth: growthForMonth,
        remainingBalance: Math.max(0, currentBalance)
      });

      // If balance becomes zero, stop
      if (currentBalance <= 0) {
        break;
      }
    }

    // Group by years for display - fix year-by-year breakdown logic
    const yearlyBreakdown = [];
    const totalYears = Math.ceil(tenure / 12);

    for (let year = 0; year < totalYears; year++) {
      const startMonth = year * 12 + 1;
      const endMonth = Math.min((year + 1) * 12, tenure);

      const monthsInYear = monthlyBreakdown.filter(
        (m) => m.month >= startMonth && m.month <= endMonth
      );

      if (monthsInYear.length === 0) break; // Get balance at the end of the year for accurate calculation
      const lastMonthInYear = monthsInYear[monthsInYear.length - 1];

      // Calculate accurate totals for the year
      const totalWithdrawalInYear = monthsInYear.reduce(
        (sum, m) => sum + m.withdrawal,
        0
      );
      const totalGrowthInYear = monthsInYear.reduce(
        (sum, m) => sum + m.growth,
        0
      );

      const yearData = {
        year: year + 1,
        withdrawalInYear: Math.round(totalWithdrawalInYear),
        growthInYear: Math.round(totalGrowthInYear),
        remainingBalance: Math.round(lastMonthInYear.remainingBalance)
      };

      yearlyBreakdown.push(yearData);

      // If balance is zero, stop
      if (lastMonthInYear.remainingBalance <= 0) {
        break;
      }
    }

    return yearlyBreakdown;
  };
  // Calculate breakdown for a saved calculation
  const calculateBreakdownForSavedCalc = (calculation) => {
    const {
      initialInvestment,
      withdrawalAmount,
      expectedReturnRate,
      tenure,
      frequency = 'monthly'
    } = calculation;
    if (
      !initialInvestment ||
      !withdrawalAmount ||
      !expectedReturnRate ||
      !tenure
    )
      return [];

    // Use the same logic as calculateYearlySWPBreakdown but with saved calc data
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

    const monthlyRate = Math.pow(1 + expectedReturnRate / 100, 1 / 12) - 1;
    let currentBalance = initialInvestment;

    const monthlyBreakdown = [];

    // Calculate month-by-month breakdown
    for (let month = 1; month <= tenure; month++) {
      // Apply monthly growth first
      const growthForMonth = currentBalance * monthlyRate;
      currentBalance = currentBalance + growthForMonth;

      // Withdraw on appropriate intervals - fix withdrawal timing
      const shouldWithdraw = month % intervalMonths === 0;
      let withdrawalForMonth = 0;

      if (shouldWithdraw && currentBalance > 0) {
        withdrawalForMonth = Math.min(withdrawalAmount, currentBalance);
        currentBalance = Math.max(0, currentBalance - withdrawalForMonth);
      }

      monthlyBreakdown.push({
        month,
        withdrawal: withdrawalForMonth,
        growth: growthForMonth,
        remainingBalance: Math.max(0, currentBalance)
      });

      // If balance becomes zero, stop
      if (currentBalance <= 0) {
        break;
      }
    }

    // Group by years for display - fix year-by-year breakdown logic
    const yearlyBreakdown = [];
    const totalYears = Math.ceil(tenure / 12);

    for (let year = 0; year < totalYears; year++) {
      const startMonth = year * 12 + 1;
      const endMonth = Math.min((year + 1) * 12, tenure);

      const monthsInYear = monthlyBreakdown.filter(
        (m) => m.month >= startMonth && m.month <= endMonth
      );

      if (monthsInYear.length === 0) break;

      const lastMonthInYear = monthsInYear[monthsInYear.length - 1];

      const totalWithdrawalInYear = monthsInYear.reduce(
        (sum, m) => sum + m.withdrawal,
        0
      );
      const totalGrowthInYear = monthsInYear.reduce(
        (sum, m) => sum + m.growth,
        0
      );

      const yearData = {
        year: year + 1,
        withdrawalInYear: Math.round(totalWithdrawalInYear),
        growthInYear: Math.round(totalGrowthInYear),
        remainingBalance: Math.round(lastMonthInYear.remainingBalance)
      };

      yearlyBreakdown.push(yearData);

      // If balance is zero, stop
      if (lastMonthInYear.remainingBalance <= 0) {
        break;
      }
    }

    return yearlyBreakdown;
  };

  const saveCalculation = () => {
    const exhaustionPeriod = calculateExhaustionPeriod();

    const newCalculation = {
      id: Date.now(), // Use timestamp as unique ID
      initialInvestment: calcState.initialInvestment,
      withdrawalAmount: calcState.withdrawalAmount,
      expectedReturnRate: calcState.expectedReturnRate,
      tenure: calcState.tenure,
      frequency: calcState.frequency,
      totalWithdrawals: calculateTotalWithdrawals(),
      remainingBalance: calculateRemainingBalance(),
      exhaustionPeriod: exhaustionPeriod,
      // Don't store breakdown to save localStorage space
      date: new Date().toLocaleDateString()
    };

    const updatedCalculations = [...savedCalculations, newCalculation];
    setSavedCalculations(updatedCalculations);
    localStorage.setItem(
      'savedSWPCalculations',
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
      'savedSWPCalculations',
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

  // Generate chart data for SWP breakdown visualization
  const generateChartData = () => {
    const yearlyBreakdown = calculateYearlySWPBreakdown();

    return yearlyBreakdown.map((row, index) => ({
      year: `Year ${row.year}`,
      withdrawals: row.withdrawalInYear,
      growth: row.growthInYear,
      remainingBalance: row.remainingBalance,
      isLast: index === yearlyBreakdown.length - 1
    }));
  };

  const chartOptions = {
    data: generateChartData(),
    title: {
      text: 'SWP Withdrawal vs Remaining Balance',
      fontSize: 16,
      fontWeight: 'bold'
    },
    subtitle: {
      text: 'Year-by-Year Balance Depletion',
      fontSize: 12
    },
    background: {
      fill: isDark ? '#1e1e1e' : '#ffffff'
    },
    series: [
      {
        type: 'bar',
        xKey: 'year',
        yKey: 'remainingBalance',
        yName: 'Remaining Balance',
        fill: '#1976d2',
        tooltip: {
          renderer: function ({ datum }) {
            const withdrawals = Math.round(datum.withdrawals).toLocaleString(
              'en-IN'
            );
            const growth = Math.round(datum.growth).toLocaleString('en-IN');
            const balance = Math.round(datum.remainingBalance).toLocaleString(
              'en-IN'
            );

            return {
              content: `
                <b>Remaining Balance:</b> ₹${balance}<br>
                <b>Withdrawals:</b> ₹${withdrawals}<br>
                Growth: ₹${growth}
              `,
              title: `${datum.year}`,
              titleFontWeight: 'bold'
            };
          }
        }
      },
      {
        type: 'line',
        xKey: 'year',
        yKey: 'withdrawals',
        yName: 'Annual Withdrawals',
        stroke: '#ff5722',
        strokeWidth: 3,
        marker: {
          fill: '#ff5722',
          size: 6
        },
        label: {
          formatter: (params) => {
            if (!params.datum.isLast) {
              return '';
            }
            const total = params.datum.withdrawals;

            // Format in lakhs and crores
            if (total >= 10000000) {
              return `${(total / 10000000).toFixed(2)} cr`;
            } else if (total >= 100000) {
              return `${(total / 100000).toFixed(2)} lac`;
            } else {
              return `₹${Math.round(total).toLocaleString('en-IN')}`;
            }
          },
          placement: 'outside',
          color: '#ff5722',
          fontWeight: 'bold'
        },
        tooltip: {
          renderer: function ({ datum }) {
            const withdrawals = Math.round(datum.withdrawals).toLocaleString(
              'en-IN'
            );
            const growth = Math.round(datum.growth).toLocaleString('en-IN');
            const balance = Math.round(datum.remainingBalance).toLocaleString(
              'en-IN'
            );

            return {
              content: `
                <b>Annual Withdrawals:</b> ₹${withdrawals}<br>
                <b>Growth:</b> ₹${growth}<br>
                Remaining: ₹${balance}
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
            } else {
              return `₹${(value / 1000).toFixed(0)}K`;
            }
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
          SWP Calculator
        </Typography>
        <SWPCalculatorForm onChange={handleCalcChange} />
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0 }}>
          <Typography variant="body1" fontWeight="bold">
            Total Withdrawals:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ₹{rupeeFormat(calculateTotalWithdrawals())}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            Remaining Balance:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ₹{rupeeFormat(calculateRemainingBalance())}
          </Typography>
        </Stack>
        {(() => {
          const exhaustionPeriod = calculateExhaustionPeriod();
          if (exhaustionPeriod) {
            return (
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 1 }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="warning.main"
                >
                  Corpus Exhausted In:
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="warning.main"
                >
                  {formatDuration(exhaustionPeriod)}
                </Typography>
              </Stack>
            );
          }
          return (
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 1 }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                color="success.main"
              >
                Corpus Status:
              </Typography>
              <Typography
                variant="body1"
                fontWeight="bold"
                color="success.main"
              >
                Sustainable
              </Typography>
            </Stack>
          );
        })()}
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
          aria-controls="swp-breakdown-content"
          id="swp-breakdown-header"
        >
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            SWP Breakdown by Year
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
                    Withdrawals (₹)
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '120px' }}
                  >
                    Growth (₹)
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '120px' }}
                  >
                    Balance (₹)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calculateYearlySWPBreakdown().map((row) => (
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
                      {rupeeFormat(Math.round(row.withdrawalInYear))}
                    </TableCell>
                    <TableCell align="right" style={{ padding: '6px 8px' }}>
                      {rupeeFormat(Math.round(row.growthInYear))}
                    </TableCell>
                    <TableCell align="right" style={{ padding: '6px 8px' }}>
                      {rupeeFormat(Math.round(row.remainingBalance))}
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
                      Withdrawal
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '60px' }}>
                      Return Rate
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '70px' }}>
                      Frequency
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '70px' }}>
                      Duration
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '100px' }}>
                      Remaining
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '80px' }}>
                      Exhausted In
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
                          ₹{rupeeFormat(calc.withdrawalAmount)}
                        </TableCell>
                        <TableCell>{calc.expectedReturnRate}%</TableCell>
                        <TableCell>
                          {getWithdrawalPeriodText(calc.frequency || 'monthly')}
                        </TableCell>
                        <TableCell>{formatDuration(calc.tenure)}</TableCell>
                        <TableCell>
                          ₹{rupeeFormat(calc.remainingBalance)}
                        </TableCell>
                        <TableCell>
                          {calc.exhaustionPeriod
                            ? formatDuration(calc.exhaustionPeriod)
                            : 'Never'}
                        </TableCell>
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
                              colSpan={10}
                              style={{ paddingTop: 0, paddingBottom: 0 }}
                            >
                              <Box
                                sx={{
                                  margin: 1,
                                  overflowX: 'auto',
                                  '& .MuiTable-root': {
                                    '@media (max-width: 600px)': {
                                      minWidth: '450px'
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
                                        Withdrawals (₹)
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        style={{
                                          padding: '6px 8px',
                                          width: '120px'
                                        }}
                                      >
                                        Growth (₹)
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        style={{
                                          padding: '6px 8px',
                                          width: '120px'
                                        }}
                                      >
                                        Balance (₹)
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
                                              Math.round(row.withdrawalInYear)
                                            )}
                                          </TableCell>
                                          <TableCell
                                            align="right"
                                            style={{ padding: '6px 8px' }}
                                          >
                                            {rupeeFormat(
                                              Math.round(row.growthInYear)
                                            )}
                                          </TableCell>
                                          <TableCell
                                            align="right"
                                            style={{ padding: '6px 8px' }}
                                          >
                                            {rupeeFormat(
                                              Math.round(row.remainingBalance)
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
      <Markdown path="/markdown/swp.md"></Markdown>
    </Box>
  );
};

export default SWPCalculator;
