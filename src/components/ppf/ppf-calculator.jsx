import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Box,
  Button,
  Grid,
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
import React, { useEffect, useRef, useState } from 'react';
import { ToWords } from 'to-words';
import Markdown from '../markdown/Markdown';
import usePageInfo from '../page-info/use-page-info';
import { rupeeFormat } from '../utils';
import PPFCalculatorForm from './ppf-calculator-form';

// ToWords setup for amount in words
const toWords = new ToWords({
  converterOptions: {
    currency: true,
    ignoreZeroCurrency: true,
    doNotAddOnly: true
  }
});

// Helper function to convert amount to words
const inWords = (value) => {
  return value ? toWords.convert(value) : '';
};

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

const PPFCalculator = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [calcState, setCalcState] = useState({
    investmentAmount: 12500, // Default investment amount (monthly max)
    interestRate: 7.1, // Current PPF interest rate
    tenure: 180, // Default tenure in months (15 years)
    frequency: 'monthly' // Default frequency
  });
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [expandedCalculationIds, setExpandedCalculationIds] = useState([]);
  const [mainAccordionExpanded, setMainAccordionExpanded] = useState(true);
  const [calculatedBreakdowns, setCalculatedBreakdowns] = useState({});
  const [hasScrolledToTable, setHasScrolledToTable] = useState(false);

  const referenceTableRef = useRef(null);

  usePageInfo({
    title: 'PPF Calculator',
    description:
      'FinRates PPF Calculator helps you plan your Public Provident Fund investments with ease. Calculate maturity amount with annual interest compounding, visualize year-by-year growth with interactive charts, analyze investment vs returns over 15+ years, and save multiple scenarios for comparison. Make informed PPF investment decisions with our comprehensive analysis tools.'
  });

  useEffect(() => {
    // Load Saved References from localStorage on component mount
    const saved = localStorage.getItem('savedPPFCalculations');
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
  }, []);

  const handleCalcChange = (state) => {
    setCalcState(state);
  };
  const calculateFutureValue = () => {
    const { investmentAmount, interestRate, tenure, frequency } = calcState;

    if (!investmentAmount || !interestRate || !tenure) return 0;

    // Calculate number of investments based on frequency
    let periodsPerYear = 12; // Default for monthly

    switch (frequency) {
      case 'quarterly':
        periodsPerYear = 4;
        break;
      case 'half-yearly':
        periodsPerYear = 2;
        break;
      case 'yearly':
        periodsPerYear = 1;
        break;
      default: // monthly
        periodsPerYear = 12;
    }

    // PPF has annual compounding, so we calculate year by year
    const years = tenure / 12;
    const annualInvestment = investmentAmount * periodsPerYear;
    const annualRate = interestRate / 100;

    let futureValue = 0;

    // Calculate using formula for annuity with annual compounding
    // Each year's investment compounds for remaining years
    for (let year = 1; year <= years; year++) {
      const yearsToCompound = years - year + 1;
      const yearInvestment = annualInvestment;
      const compoundedValue =
        yearInvestment * Math.pow(1 + annualRate, yearsToCompound);
      futureValue += compoundedValue;
    }

    return isNaN(futureValue) ? 0 : Math.round(futureValue);
  };

  const calculateTotalInvestment = () => {
    const { investmentAmount, tenure, frequency } = calcState;
    if (!investmentAmount || !tenure) return 0;

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

    return Math.round(investmentAmount * numberOfInvestments);
  };

  const calculateTotalWealth = () => {
    return calculateFutureValue();
  };

  const calculateWealthGained = () => {
    const totalInvestment = calculateTotalInvestment();
    const totalWealth = calculateTotalWealth();

    return Math.round(totalWealth - totalInvestment);
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

  // Calculate year-by-year PPF breakdown
  const calculateYearlyPPFBreakdown = () => {
    const { investmentAmount, interestRate, tenure, frequency } = calcState;
    if (!investmentAmount || !interestRate || !tenure) return [];

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

    const annualRate = interestRate / 100;
    let runningInvestment = 0;
    let runningValue = 0;

    const monthlyBreakdown = [];

    // Calculate month-by-month breakdown with annual compounding
    for (let month = 1; month <= tenure; month++) {
      // Only add investment on appropriate intervals based on frequency
      const shouldInvest = (month - 1) % intervalMonths === 0;

      if (shouldInvest) {
        runningInvestment += investmentAmount;
        runningValue += investmentAmount;
      }

      // Apply annual interest at the end of each year (March 31st for PPF)
      if (month % 12 === 0) {
        const interestForYear = runningValue * annualRate;
        runningValue += interestForYear;

        monthlyBreakdown.push({
          month,
          investment: shouldInvest ? investmentAmount : 0,
          interest: interestForYear,
          totalInvestment: runningInvestment,
          totalValue: runningValue
        });
      } else {
        monthlyBreakdown.push({
          month,
          investment: shouldInvest ? investmentAmount : 0,
          interest: 0,
          totalInvestment: runningInvestment,
          totalValue: runningValue
        });
      }

      // For the last month, ensure it exactly matches the value from calculateFutureValue
      if (month === tenure) {
        const lastIndex = monthlyBreakdown.length - 1;
        monthlyBreakdown[lastIndex].totalValue = calculateFutureValue();
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

      // Calculate investment for this year
      const investmentInYear = monthsInYear.reduce(
        (sum, m) => sum + m.investment,
        0
      );

      // Calculate interest for this year
      const interestInYear = monthsInYear.reduce(
        (sum, m) => sum + m.interest,
        0
      );

      // Calculate absolute returns for this year
      const absoluteReturn =
        lastMonthInYear.totalInvestment > 0
          ? ((lastMonthInYear.totalValue - lastMonthInYear.totalInvestment) /
              lastMonthInYear.totalInvestment) *
            100
          : 0;

      const yearData = {
        year: year + 1,
        investmentInYear: investmentInYear,
        interestInYear: interestInYear,
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
      investmentAmount,
      interestRate,
      tenure,
      futureValue,
      frequency = 'monthly'
    } = calculation;
    if (!investmentAmount || !interestRate || !tenure) return [];

    // Determine interval and rate based on frequency
    let intervalMonths = 1;
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
      default:
        intervalMonths = 1;
        periodsPerYear = 12;
    }

    const annualRate = interestRate / 100;
    let runningInvestment = 0;
    let runningValue = 0;

    const monthlyBreakdown = [];

    // Calculate month-by-month breakdown
    for (let month = 1; month <= tenure; month++) {
      const shouldInvest = (month - 1) % intervalMonths === 0;

      if (shouldInvest) {
        runningInvestment += investmentAmount;
        runningValue += investmentAmount;
      }

      // Apply annual interest at the end of each year
      if (month % 12 === 0) {
        const interestForYear = runningValue * annualRate;
        runningValue += interestForYear;

        monthlyBreakdown.push({
          month,
          investment: shouldInvest ? investmentAmount : 0,
          interest: interestForYear,
          totalInvestment: runningInvestment,
          totalValue: runningValue
        });
      } else {
        monthlyBreakdown.push({
          month,
          investment: shouldInvest ? investmentAmount : 0,
          interest: 0,
          totalInvestment: runningInvestment,
          totalValue: runningValue
        });
      }

      // For the last month, ensure it exactly matches the stored future value
      if (month === tenure) {
        const lastIndex = monthlyBreakdown.length - 1;
        monthlyBreakdown[lastIndex].totalValue = futureValue;
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

      // Calculate investment and interest for this year
      const investmentInYear = monthsInYear.reduce(
        (sum, m) => sum + m.investment,
        0
      );
      const interestInYear = monthsInYear.reduce(
        (sum, m) => sum + m.interest,
        0
      );

      // Calculate absolute returns for this year
      const absoluteReturn =
        lastMonthInYear.totalInvestment > 0
          ? ((lastMonthInYear.totalValue - lastMonthInYear.totalInvestment) /
              lastMonthInYear.totalInvestment) *
            100
          : 0;

      const yearData = {
        year: year + 1,
        investmentInYear: investmentInYear,
        interestInYear: interestInYear,
        totalInvestment: lastMonthInYear.totalInvestment,
        totalValue: Math.round(lastMonthInYear.totalValue),
        absoluteReturn: absoluteReturn
      };

      yearlyBreakdown.push(yearData);
    }

    return yearlyBreakdown;
  };
  const saveCalculation = () => {
    const newCalculation = {
      id: Date.now(), // Use timestamp as unique ID
      investmentAmount: calcState.investmentAmount,
      interestRate: calcState.interestRate,
      tenure: calcState.tenure,
      frequency: calcState.frequency,
      futureValue: calculateFutureValue(),
      totalInvestment: calculateTotalInvestment(),
      wealthGained: calculateWealthGained(),
      absoluteReturns: calculateAbsoluteReturns(),
      // Don't store breakdown to save localStorage space
      date: new Date().toLocaleDateString()
    };

    const updatedCalculations = [...savedCalculations, newCalculation];
    setSavedCalculations(updatedCalculations);
    localStorage.setItem(
      'savedPPFCalculations',
      JSON.stringify(updatedCalculations)
    );

    // Scroll to reference table on first save only
    if (!hasScrolledToTable && referenceTableRef.current) {
      setTimeout(() => {
        referenceTableRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        setHasScrolledToTable(true);
      }, 100); // Small delay to ensure the table is rendered
    }
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
      'savedPPFCalculations',
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

  // Generate chart data for PPF breakdown visualization
  const generateChartData = () => {
    const yearlyBreakdown = calculateYearlyPPFBreakdown();
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

  // Configuration options for the PPF chart
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
                Returns: ₹${totalInterest}
              `,
              title: `Year ${datum.year.split(' ')[1]}`,
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
        yName: 'Interest Earned',
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
          placement: 'outside-end',
          color: '#000080',
          fontWeight: 'bold'
        },
        tooltip: {
          renderer: function ({ datum }) {
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
              title: `Year ${datum.year.split(' ')[1]}`,
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
          PPF Calculator
        </Typography>
        <PPFCalculatorForm onChange={handleCalcChange} />{' '}
        {/* Maturity Amount Highlight Card */}
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            mb: 3,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, fontSize: '0.85rem' }}
          >
            Maturity Amount
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 700,
              fontSize: '1.5rem',
              mt: 0.5
            }}
          >
            ₹{rupeeFormat(calculateTotalWealth())}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 1,
              display: 'block',
              lineHeight: 1.2,
              fontSize: '0.75rem',
              fontStyle: 'italic',
              color: alpha(theme.palette.primary.main, 0.7)
            }}
          >
            {inWords(calculateTotalWealth())}
          </Typography>
        </Box>
        {/* Financial Summary Grid */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2.5,
                bgcolor: alpha(theme.palette.info.main, 0.06),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                textAlign: 'center',
                minHeight: { xs: '90px', sm: '100px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, fontSize: '0.8rem' }}
              >
                Total Investment
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.info.main,
                  fontSize: '1.1rem',
                  mt: 0.5
                }}
              >
                ₹{rupeeFormat(calculateTotalInvestment())}
              </Typography>
              {/* Hidden placeholder to match height */}
              <Typography
                variant="caption"
                sx={{
                  visibility: 'hidden',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  mt: 0.5
                }}
              >
                (placeholder text)
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2.5,
                bgcolor: alpha(theme.palette.success.main, 0.06),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                textAlign: 'center',
                minHeight: { xs: '90px', sm: '100px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, fontSize: '0.8rem' }}
              >
                Interest Earned
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.success.main,
                  fontSize: '1.1rem',
                  mt: 0.5
                }}
              >
                ₹{rupeeFormat(calculateWealthGained())}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.success.main,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  mt: 0.5
                }}
              >
                ({calculateAbsoluteReturns()}%)
              </Typography>
            </Box>
          </Grid>
        </Grid>{' '}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ width: '100%', mt: 2 }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: '90%',
              borderRadius: 2.5,
              py: 1.2,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem'
            }}
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
          aria-controls="ppf-breakdown-content"
          id="ppf-breakdown-header"
        >
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            PPF Breakdown by Year
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
                {calculateYearlyPPFBreakdown().map((row) => (
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
        ref={referenceTableRef}
        sx={{
          p: 2,
          pt: 5,
          pb: 10
        }}
      >
        {savedCalculations.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 1, mb: 2 }} color="primary">
              Saved References
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
                      Investment
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '60px' }}>
                      Rate
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '70px' }}>
                      Frequency
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '70px' }}>
                      Duration
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '100px' }}>
                      Maturity Amount
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '100px' }}>
                      Interest Earned
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '70px' }}>
                      Total Returns
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
                          ₹{rupeeFormat(calc.investmentAmount)}
                        </TableCell>
                        <TableCell>{calc.interestRate}%</TableCell>
                        <TableCell>
                          {getInvestmentPeriodText(calc.frequency || 'monthly')}
                        </TableCell>
                        <TableCell>{formatDuration(calc.tenure)}</TableCell>
                        <TableCell>₹{rupeeFormat(calc.futureValue)}</TableCell>
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
      <Markdown path="/markdown/ppf.md"></Markdown>
    </Box>
  );
};

export default PPFCalculator;
