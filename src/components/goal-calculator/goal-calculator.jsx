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
import usePageInfo from '../page-info/use-page-info';
import { rupeeFormat } from '../utils';
import GoalCalculatorForm from './goal-calculator-form';

// Helper function to format tenure in years and months
function formatDuration(months) {
  if (months < 12) {
    return `${months} mo`;
  } else {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) {
      return `${years} yr`;
    } else {
      return `${years}y ${remainingMonths}m`;
    }
  }
}

// Helper function to get investment period text based on frequency
function getInvestmentPeriodText(frequency) {
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

const GoalCalculator = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [calcState, setCalcState] = useState({
    targetAmount: 10000000, // Default target amount (50 Lakh)
    expectedReturnRate: 12, // Default expected return rate
    tenure: 120, // Default tenure in months (10 years)
    frequency: 'monthly' // Default frequency
  });
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [expandedCalculationIds, setExpandedCalculationIds] = useState([]);
  const [mainAccordionExpanded, setMainAccordionExpanded] = useState(true);
  const [calculatedBreakdowns, setCalculatedBreakdowns] = useState({});

  usePageInfo({
    title: 'Goal Calculator',
    description:
      'FinRates Goal Calculator helps you plan your financial goals effectively. Adjust target amount, expected return rate, tenure, and frequency to calculate the required investment. Visualize year-by-year breakdowns with interactive charts and table, analyze investment vs returns, track total wealth, and save multiple scenarios for comparison. Achieve your financial goals with our comprehensive planning tools.'
  });

  useEffect(() => {
    // Load saved calculations from localStorage on component mount
    const saved = localStorage.getItem('savedGoalCalculations');
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
  }, []);

  const handleCalcChange = (state) => {
    setCalcState(state);
  };

  // Calculate required monthly investment to reach the target amount
  const calculateRequiredInvestment = () => {
    const { targetAmount, expectedReturnRate, tenure, frequency } = calcState;

    if (!targetAmount || !expectedReturnRate || !tenure) return 0;

    // Calculate number of investments based on frequency
    let numberOfInvestments = tenure;
    let periodsPerYear = 12; // Default for monthly

    switch (frequency) {
      case 'quarterly':
        periodsPerYear = 4;
        numberOfInvestments = Math.ceil(tenure / 3);
        break;
      case 'half-yearly':
        periodsPerYear = 2;
        numberOfInvestments = Math.ceil(tenure / 6);
        break;
      case 'yearly':
        periodsPerYear = 1;
        numberOfInvestments = Math.ceil(tenure / 12);
        break;
      default: // monthly
        periodsPerYear = 12;
        numberOfInvestments = tenure;
    }

    // Convert yearly interest rate to rate per period (decimal)
    const ratePerPeriod = expectedReturnRate / 100 / periodsPerYear;

    // Calculate PMT formula: FV = P * ((1 + r)^n - 1) / r * (1 + r)
    // Solving for P: P = FV * r / ((1 + r)^n - 1) / (1 + r)
    const requiredInvestment =
      (targetAmount * ratePerPeriod) /
      ((Math.pow(1 + ratePerPeriod, numberOfInvestments) - 1) *
        (1 + ratePerPeriod));

    return isNaN(requiredInvestment) ? 0 : Math.round(requiredInvestment);
  };

  const calculateTotalInvestment = () => {
    const requiredInvestment = calculateRequiredInvestment();
    const { tenure, frequency } = calcState;
    if (!requiredInvestment || !tenure) return 0;

    // Calculate number of investments based on frequency
    let numberOfInvestments = tenure;

    switch (frequency) {
      case 'quarterly':
        numberOfInvestments = Math.ceil(tenure / 3);
        break;
      case 'half-yearly':
        numberOfInvestments = Math.ceil(tenure / 6);
        break;
      case 'yearly':
        numberOfInvestments = Math.ceil(tenure / 12);
        break;
      default: // monthly
        numberOfInvestments = tenure;
    }

    return Math.round(requiredInvestment * numberOfInvestments);
  };

  const calculateWealthGained = () => {
    const totalInvestment = calculateTotalInvestment();
    const targetAmount = calcState.targetAmount;

    return Math.round(targetAmount - totalInvestment);
  };

  const calculateAbsoluteReturns = () => {
    const totalInvestment = calculateTotalInvestment();
    const wealthGained = calculateWealthGained();

    if (!totalInvestment || totalInvestment === 0) return '0';

    const absoluteReturn = (wealthGained / totalInvestment) * 100;

    // Only apply toFixed if there's a decimal part
    return absoluteReturn % 1 === 0
      ? absoluteReturn.toString()
      : absoluteReturn.toFixed(2);
  };

  // Calculate year-by-year goal breakdown
  const calculateYearlyGoalBreakdown = () => {
    const { targetAmount, expectedReturnRate, tenure, frequency } = calcState;
    if (!targetAmount || !expectedReturnRate || !tenure) return [];

    const requiredInvestment = calculateRequiredInvestment();
    if (!requiredInvestment) return [];

    // Determine interval and rate based on frequency
    let intervalMonths = 1; // Default for monthly
    let periodsPerYear = 12;

    switch (frequency) {
      case 'quarterly':
        intervalMonths = 3;
        periodsPerYear = 4;
        break;
      case 'half-yearly':
        intervalMonths = 6;
        periodsPerYear = 2;
        break;
      case 'yearly':
        intervalMonths = 12;
        periodsPerYear = 1;
        break;
      default: // monthly
        intervalMonths = 1;
        periodsPerYear = 12;
    }

    const ratePerPeriod = expectedReturnRate / 100 / periodsPerYear;
    let runningInvestment = 0;
    let runningValue = 0;

    const monthlyBreakdown = [];

    // Calculate month-by-month breakdown
    for (let month = 1; month <= tenure; month++) {
      // Only add investment on appropriate intervals based on frequency
      const shouldInvest = (month - 1) % intervalMonths === 0;

      if (shouldInvest) {
        runningInvestment += requiredInvestment;

        // Calculate interest for this period
        const interestForPeriod = runningValue * ratePerPeriod;

        // Add this period's investment and interest to running value
        runningValue += requiredInvestment + interestForPeriod;

        monthlyBreakdown.push({
          month,
          investment: requiredInvestment,
          interest: interestForPeriod,
          totalInvestment: runningInvestment,
          totalValue: runningValue
        });
      } else {
        // For months without investment, just copy the last values
        const lastEntry = monthlyBreakdown[monthlyBreakdown.length - 1] || {
          month: 0,
          investment: 0,
          interest: 0,
          totalInvestment: 0,
          totalValue: 0
        };

        monthlyBreakdown.push({
          month,
          investment: 0,
          interest: 0,
          totalInvestment: lastEntry.totalInvestment,
          totalValue: lastEntry.totalValue
        });
      }

      // For the last month, ensure it exactly matches the target amount
      if (month === tenure) {
        const lastIndex = monthlyBreakdown.length - 1;
        monthlyBreakdown[lastIndex].totalValue = targetAmount;
      }
    }

    // Group by year
    const yearlyBreakdown = [];
    const yearsCount = Math.ceil(tenure / 12);

    for (let year = 0; year < yearsCount; year++) {
      const startMonth = year * 12;
      const endMonth = Math.min((year + 1) * 12, tenure);

      const monthsInYear = monthlyBreakdown.slice(startMonth, endMonth);
      const lastMonthInYear = monthsInYear[monthsInYear.length - 1];

      // Calculate absolute returns for this year
      const absoluteReturn =
        lastMonthInYear.totalInvestment > 0
          ? ((lastMonthInYear.totalValue - lastMonthInYear.totalInvestment) /
              lastMonthInYear.totalInvestment) *
            100
          : 0;

      const yearData = {
        year: year + 1,
        investmentInYear: monthsInYear.reduce(
          (sum, m) => sum + m.investment,
          0
        ),
        interestInYear: monthsInYear.reduce((sum, m) => sum + m.interest, 0),
        totalInvestment: lastMonthInYear.totalInvestment,
        totalValue: Math.round(lastMonthInYear.totalValue),
        absoluteReturn: absoluteReturn
      };

      yearlyBreakdown.push(yearData);
    }

    return yearlyBreakdown;
  };

  // Calculate breakdown for a saved calculation
  const calculateBreakdownForSavedCalc = (calculation) => {
    const {
      targetAmount,
      expectedReturnRate,
      tenure,
      requiredInvestment,
      frequency = 'monthly'
    } = calculation;
    if (!targetAmount || !expectedReturnRate || !tenure) return [];

    // Determine interval and rate based on frequency
    let intervalMonths = 1; // Default for monthly
    let periodsPerYear = 12;

    switch (frequency) {
      case 'quarterly':
        intervalMonths = 3;
        periodsPerYear = 4;
        break;
      case 'half-yearly':
        intervalMonths = 6;
        periodsPerYear = 2;
        break;
      case 'yearly':
        intervalMonths = 12;
        periodsPerYear = 1;
        break;
      default: // monthly
        intervalMonths = 1;
        periodsPerYear = 12;
    }

    const ratePerPeriod = expectedReturnRate / 100 / periodsPerYear;
    let runningInvestment = 0;
    let runningValue = 0;

    const monthlyBreakdown = [];

    // Calculate month-by-month breakdown
    for (let month = 1; month <= tenure; month++) {
      // Only add investment on appropriate intervals based on frequency
      const shouldInvest = (month - 1) % intervalMonths === 0;

      if (shouldInvest) {
        runningInvestment += requiredInvestment;

        // Calculate interest for this period
        const interestForPeriod = runningValue * ratePerPeriod;

        // Add this period's investment and interest to running value
        runningValue += requiredInvestment + interestForPeriod;

        monthlyBreakdown.push({
          month,
          investment: requiredInvestment,
          interest: interestForPeriod,
          totalInvestment: runningInvestment,
          totalValue: runningValue
        });
      } else {
        // For months without investment, just copy the last values
        const lastEntry = monthlyBreakdown[monthlyBreakdown.length - 1] || {
          month: 0,
          investment: 0,
          interest: 0,
          totalInvestment: 0,
          totalValue: 0
        };

        monthlyBreakdown.push({
          month,
          investment: 0,
          interest: 0,
          totalInvestment: lastEntry.totalInvestment,
          totalValue: lastEntry.totalValue
        });
      }

      // For the last month, ensure it exactly matches the stored target amount
      if (month === tenure) {
        const lastIndex = monthlyBreakdown.length - 1;
        monthlyBreakdown[lastIndex].totalValue = targetAmount;
      }
    }

    // Group by year
    const yearlyBreakdown = [];
    const yearsCount = Math.ceil(tenure / 12);

    for (let year = 0; year < yearsCount; year++) {
      const startMonth = year * 12;
      const endMonth = Math.min((year + 1) * 12, tenure);

      const monthsInYear = monthlyBreakdown.slice(startMonth, endMonth);
      const lastMonthInYear = monthsInYear[monthsInYear.length - 1];

      // Calculate absolute returns for this year
      const absoluteReturn =
        lastMonthInYear.totalInvestment > 0
          ? ((lastMonthInYear.totalValue - lastMonthInYear.totalInvestment) /
              lastMonthInYear.totalInvestment) *
            100
          : 0;

      const yearData = {
        year: year + 1,
        investmentInYear: monthsInYear.reduce(
          (sum, m) => sum + m.investment,
          0
        ),
        interestInYear: monthsInYear.reduce((sum, m) => sum + m.interest, 0),
        totalInvestment: lastMonthInYear.totalInvestment,
        totalValue: Math.round(lastMonthInYear.totalValue),
        absoluteReturn: absoluteReturn
      };

      yearlyBreakdown.push(yearData);
    }

    return yearlyBreakdown;
  };

  const saveCalculation = () => {
    const requiredInvestment = calculateRequiredInvestment();
    const newCalculation = {
      id: Date.now(), // Use timestamp as unique ID
      targetAmount: calcState.targetAmount,
      expectedReturnRate: calcState.expectedReturnRate,
      tenure: calcState.tenure,
      frequency: calcState.frequency,
      requiredInvestment: requiredInvestment,
      totalInvestment: calculateTotalInvestment(),
      wealthGained: calculateWealthGained(),
      absoluteReturns: calculateAbsoluteReturns(),
      // Don't store breakdown to save localStorage space
      date: new Date().toLocaleDateString()
    };

    const updatedCalculations = [...savedCalculations, newCalculation];
    setSavedCalculations(updatedCalculations);
    localStorage.setItem(
      'savedGoalCalculations',
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
      'savedGoalCalculations',
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

  const generateChartData = () => {
    const yearlyBreakdown = calculateYearlyGoalBreakdown();
    let cumulativeInvestment = 0;
    let cumulativeInterest = 0;

    return yearlyBreakdown.map((row, index) => {
      cumulativeInvestment += row.investmentInYear;
      cumulativeInterest += row.interestInYear;

      return {
        year: `Year ${row.year}`,
        investment: cumulativeInvestment,
        interest: cumulativeInterest,
        totalValue: row.totalValue,
        isLast: index === yearlyBreakdown.length - 1
      };
    });
  };
  const chartOptions = {
    data: generateChartData(),
    theme: isDark ? 'ag-material-dark' : 'ag-material',
    series: [
      {
        type: 'bar',
        xKey: 'year',
        yKey: 'investment',
        stacked: true,
        yName: 'Investment',
        fill: '#3f51b5',
        tooltip: {
          renderer: function ({ datum }) {
            // Calculate the total value (investment + interest)
            const totalInvestment = Math.round(datum.investment).toLocaleString(
              'en-IN'
            );
            const totalInterest = Math.round(datum.interest).toLocaleString(
              'en-IN'
            );
            const totalValue = Math.round(datum.totalValue).toLocaleString(
              'en-IN'
            );

            return {
              content: `
                <b>Total Value:</b> ₹${totalValue}<br>
                <b>Investment:</b> ₹${totalInvestment}<br>
                Interest: ₹${totalInterest}
              `,
              title: `Year ${datum.year.split(' ')[1]}`, // Extract year from "Year X"
              titleFontWeight: 'bold'
            };
          }
        }
      },
      {
        type: 'bar',
        xKey: 'year',
        yKey: 'interest',
        stacked: true,
        yName: 'Interest',
        fill: '#00bfa5',
        label: {
          formatter: (params) => {
            // Get the total value (investment + interest)
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
            // Calculate the total value (investment + interest)
            const totalInvestment = Math.round(datum.investment).toLocaleString(
              'en-IN'
            );
            const totalInterest = Math.round(datum.interest).toLocaleString(
              'en-IN'
            );
            const totalValue = Math.round(datum.totalValue).toLocaleString(
              'en-IN'
            );

            return {
              content: `
                <b>Total Value:</b> ₹${totalValue}<br>
                Investment: ₹${totalInvestment}<br>
                <b>Interest:</b> ₹${totalInterest}
              `,
              title: `Year ${datum.year.split(' ')[1]}`, // Extract year from "Year X"
              titleFontWeight: 'bold'
            };
          }
        }
      }
    ],
    legend: { position: 'top' },
    axes: [
      {
        type: 'category',
        position: 'bottom'
      },
      {
        type: 'number',
        position: 'left',
        label: {
          formatter: () => {
            return '';
          }
        }
      }
    ]
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
          maxWidth: 400
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mt: -1,
            mb: 0,
            fontWeight: 'bold',
            color: 'primary.main',
            borderBottom: '2px solid',
            borderColor: 'primary.main',
            paddingBottom: 0
          }}
        >
          Goal Amount Calculator
        </Typography>
        <GoalCalculatorForm onChange={handleCalcChange} />
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            SIP Amount:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ₹{rupeeFormat(calculateRequiredInvestment())}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            Total Investment:
          </Typography>
          <Typography variant="subtitle2" fontWeight="bold">
            ₹{rupeeFormat(calculateTotalInvestment())}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
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
          <Typography variant="subtitle2" fontWeight="bold">
            Absolute Returns:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {calculateAbsoluteReturns()}%
          </Typography>
        </Stack>{' '}
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
          </Button>{' '}
          <Tooltip
            title="Your calculations are saved locally in your browser's storage. View and compare your saved scenarios at the bottom of this page."
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
            placement="top"
            enterTouchDelay={0}
            leaveTouchDelay={10000}
          >
            <InfoIcon sx={{ mt: 1, mb: -1, color: '#00bfa5' }} />
          </Tooltip>
        </Stack>
      </Box>
      <Accordion
        sx={{ mt: 0, mb: 0 }}
        TransitionProps={{ unmountOnExit: false }}
        expanded={mainAccordionExpanded}
        onChange={() => setMainAccordionExpanded(!mainAccordionExpanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="goal-breakdown-content"
          id="goal-breakdown-header"
        >
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Goal Breakdown by Year
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
                    Investment(₹)
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '120px' }}
                  >
                    Interest(₹)
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '120px' }}
                  >
                    Value(₹)
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '80px' }}
                  >
                    Returns(%)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calculateYearlyGoalBreakdown().map((row) => (
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
                      {rupeeFormat(Math.round(row.totalInvestment))}
                    </TableCell>
                    <TableCell align="right" style={{ padding: '6px 8px' }}>
                      {rupeeFormat(Math.round(row.interestInYear))}
                    </TableCell>
                    <TableCell align="right" style={{ padding: '6px 8px' }}>
                      {rupeeFormat(Math.round(row.totalValue))}
                    </TableCell>
                    <TableCell align="right" style={{ padding: '6px 8px' }}>
                      {row.absoluteReturn.toFixed(2)}%
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
          p: 2
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
                    minWidth: '600px'
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
                      Goal Amount
                    </TableCell>
                    <TableCell
                      style={{
                        padding: '6px 8px',
                        width: '100px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Monthly SIP
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '60px' }}>
                      Return
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '70px' }}>
                      Frequency
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '70px' }}>
                      Duration
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '100px' }}>
                      Total Invest
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '70px' }}>
                      Total(%)
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
                        <TableCell>₹{rupeeFormat(calc.targetAmount)}</TableCell>
                        <TableCell>
                          ₹{rupeeFormat(calc.requiredInvestment)}
                        </TableCell>
                        <TableCell>{calc.expectedReturnRate}%</TableCell>
                        <TableCell>
                          {getInvestmentPeriodText(calc.frequency || 'monthly')}
                        </TableCell>
                        <TableCell>{formatDuration(calc.tenure)}</TableCell>
                        <TableCell>
                          ₹{rupeeFormat(calc.totalInvestment)}
                        </TableCell>
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
                              colSpan={9}
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
                                        Investment (₹)
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        style={{
                                          padding: '6px 8px',
                                          width: '120px'
                                        }}
                                      >
                                        Interest (₹)
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        style={{
                                          padding: '6px 8px',
                                          width: '120px'
                                        }}
                                      >
                                        Value (₹)
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        style={{
                                          padding: '6px 8px',
                                          width: '80px'
                                        }}
                                      >
                                        Returns (%)
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
                                              Math.round(row.totalInvestment)
                                            )}
                                          </TableCell>
                                          <TableCell
                                            align="right"
                                            style={{ padding: '6px 8px' }}
                                          >
                                            {rupeeFormat(
                                              Math.round(row.interestInYear)
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
                                          <TableCell
                                            align="right"
                                            style={{ padding: '6px 8px' }}
                                          >
                                            {row.absoluteReturn.toFixed(2)}%
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
    </Box>
  );
};

export default GoalCalculator;
