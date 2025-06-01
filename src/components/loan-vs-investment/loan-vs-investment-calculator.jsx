import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
import { useEffect, useState } from 'react';
import Markdown from '../markdown/Markdown';
import usePageInfo from '../page-info/use-page-info';
import { rupeeFormat } from '../utils';
import LoanVsInvestmentForm from './loan-vs-investment-form';

const LoanVsInvestmentCalculator = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [calcState, setCalcState] = useState({
    loanAmount: 5000000, // Outstanding loan amount (50 lakhs)
    currentEMI: 45000, // Current EMI
    loanInterestRate: 8.5, // Loan interest rate
    remainingTenure: 120, // Remaining tenure in months (10 years)
    extraAmount: 20000, // Extra amount available monthly
    investmentReturn: 12, // Expected investment return %
    prepaymentFrequency: 'monthly' // monthly, yearly
  });
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [mainAccordionExpanded, setMainAccordionExpanded] = useState(true);

  usePageInfo({
    title: 'Loan vs Investment Calculator',
    description:
      'Compare loan prepayment vs investment strategies. Calculate whether to prepay your loan or invest the extra money for better returns. Analyze scenarios with detailed breakdowns, charts, and save multiple comparisons for informed financial decisions.'
  });

  useEffect(() => {
    // Load saved calculations from localStorage on component mount
    const saved = localStorage.getItem('loanVsInvestmentCalculations');
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
  }, []);

  const handleCalcChange = (newState) => {
    setCalcState(newState);
  };
  // Scenario A: Continue EMI + Invest Extra Amount
  const calculateInvestmentScenario = () => {
    const {
      loanAmount,
      currentEMI,
      loanInterestRate,
      remainingTenure,
      extraAmount,
      investmentReturn
    } = calcState;

    const monthlyRate = loanInterestRate / 12 / 100;
    const annualInvestmentReturn = investmentReturn / 100;

    let loanBalance = loanAmount;
    let monthlyInvestment = 0; // Track monthly investments for annual compounding
    let totalInterestPaid = 0;
    let investmentValue = 0;

    const breakdown = [];
    for (let month = 1; month <= remainingTenure; month++) {
      // Loan calculations - Regular EMI payment
      const interestPayment = loanBalance * monthlyRate;

      // Ensure we don't pay more than remaining balance
      const actualEMI = Math.min(currentEMI, loanBalance + interestPayment);
      const actualInterest = loanBalance * monthlyRate;
      const actualPrincipal = actualEMI - actualInterest;

      loanBalance = Math.max(0, loanBalance - actualPrincipal);
      totalInterestPaid += actualInterest;

      // Investment calculations - Monthly contributions with annual compounding
      monthlyInvestment += extraAmount;

      // Apply annual compounding at year-end or final month
      if (month % 12 === 0 || month === remainingTenure) {
        // Apply one year of growth to existing investment
        if (investmentValue > 0) {
          investmentValue = investmentValue * (1 + annualInvestmentReturn);
        }
        // Add this year's contributions with proportional growth
        const monthsThisYear = month % 12 === 0 ? 12 : month % 12;
        const avgGrowthThisYear =
          (annualInvestmentReturn * monthsThisYear) / 12;
        investmentValue += monthlyInvestment * (1 + avgGrowthThisYear / 2); // Mid-year average
        monthlyInvestment = 0; // Reset for next year

        breakdown.push({
          year: Math.ceil(month / 12),
          month: month,
          loanBalance: Math.round(loanBalance),
          investmentValue: Math.round(investmentValue),
          interestPaid: Math.round(totalInterestPaid),
          netWorth: Math.round(investmentValue - loanBalance)
        });
      }
    }

    const totalInvested = extraAmount * remainingTenure;
    const investmentReturns = investmentValue - totalInvested;
    const totalLoanPayment = currentEMI * remainingTenure; // Only EMI payments, not remaining balance

    return {
      breakdown,
      finalLoanBalance: loanBalance,
      finalInvestmentValue: investmentValue,
      totalInterestPaid,
      netWorth: investmentValue - loanBalance,
      totalInvested,
      investmentReturns,
      originalLoanAmount: loanAmount,
      totalLoanPayment
    };
  }; // Scenario B: Use Extra Amount for Loan Prepayment
  const calculatePrepaymentScenario = () => {
    const {
      loanAmount,
      currentEMI,
      loanInterestRate,
      extraAmount,
      investmentReturn
    } = calcState;

    const monthlyRate = loanInterestRate / 12 / 100;
    const annualInvestmentReturn = investmentReturn / 100;

    let loanBalance = loanAmount;
    let totalInterestPaid = 0;
    let month = 0;
    let investmentValue = 0;
    let monthlyInvestment = 0; // Track monthly investments for annual compounding
    let loanClearedMonth = 0;

    const breakdown = [];
    const totalTimeHorizon = calcState.remainingTenure; // Same time horizon as Scenario A

    // Phase 1: Loan repayment with monthly prepayment
    while (loanBalance > 0 && month < 600) {
      month++;

      const interestPayment = loanBalance * monthlyRate;
      const maxPayment = currentEMI + extraAmount; // Always apply extra amount monthly

      const totalPayment = Math.min(loanBalance + interestPayment, maxPayment);
      const actualInterest = Math.min(interestPayment, totalPayment);
      const actualPrincipal = totalPayment - actualInterest;

      loanBalance = Math.max(0, loanBalance - actualPrincipal);
      totalInterestPaid += actualInterest;

      if (loanBalance === 0 && loanClearedMonth === 0) {
        loanClearedMonth = month;
      }

      if (month % 12 === 0) {
        breakdown.push({
          year: Math.ceil(month / 12),
          month: month,
          loanBalance: Math.round(loanBalance),
          investmentValue: Math.round(investmentValue),
          interestPaid: Math.round(totalInterestPaid),
          netWorth: Math.round(investmentValue - loanBalance),
          phase: 'loan_repayment'
        });
      }
    } // Phase 2: Post loan clearance - invest full EMI + extra amount monthly
    const monthlyInvestmentAmount = currentEMI + extraAmount;

    for (
      let postLoanMonth = loanClearedMonth + 1;
      postLoanMonth <= totalTimeHorizon;
      postLoanMonth++
    ) {
      monthlyInvestment += monthlyInvestmentAmount;
      month = postLoanMonth;

      // Apply annual compounding at year-end or final month
      if (month % 12 === 0 || month === totalTimeHorizon) {
        // Apply one year of growth to existing investment
        if (investmentValue > 0) {
          investmentValue = investmentValue * (1 + annualInvestmentReturn);
        }
        // Add this year's contributions with proportional growth
        if (monthlyInvestment > 0) {
          const monthsThisYear = month % 12 === 0 ? 12 : month % 12;
          const monthsInvested = Math.min(
            monthsThisYear,
            postLoanMonth - loanClearedMonth
          );
          const avgGrowthThisYear =
            (annualInvestmentReturn * monthsInvested) / 12;
          investmentValue += monthlyInvestment * (1 + avgGrowthThisYear / 2); // Mid-year average
          monthlyInvestment = 0; // Reset for next year
        }

        breakdown.push({
          year: Math.ceil(month / 12),
          month: month,
          loanBalance: 0,
          investmentValue: Math.round(investmentValue),
          interestPaid: Math.round(totalInterestPaid),
          netWorth: Math.round(investmentValue),
          phase: 'investment_only'
        });
      }
    }
    const investmentMonths = Math.max(0, totalTimeHorizon - loanClearedMonth);

    // Calculate total invested amount for monthly investments
    const totalInvestedAmount = monthlyInvestmentAmount * investmentMonths;

    const investmentReturns = investmentValue - totalInvestedAmount;
    const totalLoanPayment = loanAmount + totalInterestPaid; // Principal + Interest paid

    return {
      breakdown,
      loanClearedInMonths: loanClearedMonth,
      loanClearedInYears: (loanClearedMonth / 12).toFixed(1),
      investmentMonths: investmentMonths,
      investmentYears: (investmentMonths / 12).toFixed(1),
      totalInterestPaid,
      finalInvestmentValue: investmentValue,
      netWorth: investmentValue,
      totalInvested: totalInvestedAmount, // Corrected: only actual investment
      investmentReturns,
      originalLoanAmount: loanAmount,
      totalLoanPayment
    };
  };
  const scenarioA = calculateInvestmentScenario();
  const scenarioB = calculatePrepaymentScenario();

  const getBetterScenario = () => {
    if (scenarioA.netWorth > scenarioB.netWorth) {
      return {
        better: 'A',
        difference: scenarioA.netWorth - scenarioB.netWorth,
        recommendation: 'Continue EMI + Invest Extra Money'
      };
    } else {
      return {
        better: 'B',
        difference: scenarioB.netWorth - scenarioA.netWorth,
        recommendation: 'Use Extra Money for Loan Prepayment'
      };
    }
  };

  const comparison = getBetterScenario();
  // Chart options for comparison
  const comparisonChartOptions = {
    data: [
      ...scenarioA.breakdown.map((item) => ({
        year: item.year,
        netWorthA: item.netWorth,
        type: 'Investment'
      })),
      ...scenarioB.breakdown.map((item) => ({
        year: item.year,
        netWorthB: item.netWorth,
        type: 'Prepayment'
      }))
    ],
    series: [
      {
        type: 'line',
        xKey: 'year',
        yKey: 'netWorthA',
        yName: 'Investment Strategy',
        stroke: '#2196f3',
        marker: {
          fill: '#2196f3'
        }
      },
      {
        type: 'line',
        xKey: 'year',
        yKey: 'netWorthB',
        yName: 'Prepayment Strategy',
        stroke: '#ff9800',
        marker: {
          fill: '#ff9800'
        }
      }
    ],
    axes: [
      {
        type: 'number',
        position: 'bottom',
        title: {
          text: 'Years'
        }
      },
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Net Worth (₹)'
        },
        label: {
          formatter: ({ value }) => `₹${(value / 100000).toFixed(1)}L`
        }
      }
    ],
    legend: {
      position: 'bottom'
    },
    background: {
      fill: isDark ? '#1a1a1a' : '#ffffff'
    }
  };

  const saveCalculation = () => {
    const calculation = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-IN'),
      ...calcState,
      scenarioA: {
        netWorth: Math.round(scenarioA.netWorth),
        totalInterestPaid: Math.round(scenarioA.totalInterestPaid),
        finalInvestmentValue: Math.round(scenarioA.finalInvestmentValue)
      },
      scenarioB: {
        netWorth: Math.round(scenarioB.netWorth),
        totalInterestPaid: Math.round(scenarioB.totalInterestPaid),
        loanClearedInYears: scenarioB.loanClearedInYears,
        finalInvestmentValue: Math.round(scenarioB.finalInvestmentValue)
      },
      recommendation: comparison.recommendation,
      betterScenario: comparison.better,
      difference: Math.round(comparison.difference)
    };

    const newCalculations = [calculation, ...savedCalculations];
    setSavedCalculations(newCalculations);
    localStorage.setItem(
      'loanVsInvestmentCalculations',
      JSON.stringify(newCalculations)
    );
  };
  const deleteCalculation = (id) => {
    const filteredCalculations = savedCalculations.filter(
      (calc) => calc.id !== id
    );
    setSavedCalculations(filteredCalculations);
    localStorage.setItem(
      'loanVsInvestmentCalculations',
      JSON.stringify(filteredCalculations)
    );
  };
  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ p: 2, pb: 0, maxWidth: 600 }}>
        <Typography
          variant="h1"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            borderBottom: '2px solid',
            borderColor: 'primary.main',
            paddingBottom: 1,
            fontSize: '1.1rem',
            mt: -1,
            mb: 1.5
          }}
        >
          Loan Prepayment vs Investment Calculator
        </Typography>
        <LoanVsInvestmentForm onChange={handleCalcChange} />
        {/* Dashboard Summary Cards */}
        <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
          {/* Strategy Recommendation - Simplified Summary */}
          <Grid item xs={12}>
            <Stack
              spacing={0.5}
              sx={{
                bgcolor: 'action.hover',
                p: 2,
                borderRadius: 1
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main'
                }}
              >
                Final Net Worth Comparison
              </Typography>

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ color: 'text.secondary' }}
              >
                <Typography variant="body2">Investment Strategy:</Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="primary.main"
                >
                  ₹{rupeeFormat(scenarioA.netWorth)}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ color: 'text.secondary' }}
              >
                <Typography variant="body2">Prepayment Strategy:</Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="secondary.main"
                >
                  ₹{rupeeFormat(scenarioB.netWorth)}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  pt: 0.5,
                  mt: 0.5,
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  Difference:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color={
                    comparison.better === 'A'
                      ? 'primary.main'
                      : 'secondary.main'
                  }
                >
                  ₹{rupeeFormat(comparison.difference)}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          {/* Investment Strategy Card */}
          <Grid item xs={12} md={6} sx={{ borderRadius: 0 }}>
            <Card sx={{ height: '100%', borderRadius: 0 }}>
              <CardContent sx={{ borderRadius: 0 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary.main"
                  sx={{ mb: 2 }}
                >
                  Investment Strategy
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    p: 1.5,
                    bgcolor: 'action.hover',
                    borderRadius: 0
                  }}
                >
                  <strong>Summary:</strong> Continue paying regular EMI + invest
                  extra ₹{rupeeFormat(calcState.extraAmount)}/month at
                  {calcState.investmentReturn}% returns for
                  {(calcState.remainingTenure / 12).toFixed(1)} years
                </Typography>
                {/* Comprehensive Results Table */}
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{ padding: '6px 8px', fontWeight: 'bold' }}
                        >
                          Financial Metrics
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ padding: '6px 8px', fontWeight: 'bold' }}
                        >
                          Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Original Loan Amount</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{rupeeFormat(scenarioA.originalLoanAmount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Loan Payment</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{rupeeFormat(scenarioA.totalLoanPayment)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Investment Principal</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{rupeeFormat(scenarioA.totalInvested)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Investment Returns</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{rupeeFormat(scenarioA.investmentReturns)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Investment Value</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{rupeeFormat(scenarioA.finalInvestmentValue)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Outstanding Loan Balance</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{rupeeFormat(scenarioA.finalLoanBalance)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Net Worth
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{rupeeFormat(scenarioA.netWorth)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Interest Paid</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{rupeeFormat(scenarioA.totalInterestPaid)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          {/* Prepayment Strategy Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="secondary.main"
                  sx={{ mb: 2 }}
                >
                  Prepayment Strategy
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    p: 1.5,
                    bgcolor: 'action.hover',
                    borderRadius: 1
                  }}
                >
                  <strong>Summary:</strong> Use extra ₹
                  {rupeeFormat(calcState.extraAmount)}/month for prepayment
                  (clears loan in {scenarioB.loanClearedInYears} years), then
                  invest full ₹
                  {rupeeFormat(calcState.currentEMI + calcState.extraAmount)}
                  /month for {scenarioB.investmentYears} years (same total time
                  horizon)
                </Typography>
                {/* Comprehensive Results Table */}
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{ padding: '6px 8px', fontWeight: 'bold' }}
                        >
                          Financial Metrics
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ padding: '6px 8px', fontWeight: 'bold' }}
                        >
                          Amount / Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Original Loan Amount</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{rupeeFormat(scenarioB.originalLoanAmount)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Loan Payment</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{rupeeFormat(scenarioB.totalLoanPayment)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Loan Clearance Time</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {scenarioB.loanClearedInYears} years
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Investment Duration</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {scenarioB.investmentYears} years (post-loan)
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Investment Principal</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{rupeeFormat(scenarioB.totalInvested)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Investment Returns</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{rupeeFormat(scenarioB.investmentReturns)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Investment Value</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{rupeeFormat(scenarioB.finalInvestmentValue)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Outstanding Loan Balance</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹0 (Fully Paid)
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Net Worth
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{rupeeFormat(scenarioB.netWorth)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Interest Savings vs Investment</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹
                          {rupeeFormat(
                            scenarioA.totalInterestPaid -
                              scenarioB.totalInterestPaid
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          {/* Interest Savings Comparison */}
          <Grid item xs={12}>
            <Card sx={{ bgcolor: 'action.hover' }}>
              <CardContent sx={{ py: 1.5 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  Key Insights & Strategy Breakdown
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Investment Strategy:</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}
                    >
                      • Keep paying regular EMI for
                      {(calcState.remainingTenure / 12).toFixed(1)} years
                      <br />• Invest extra ₹{rupeeFormat(calcState.extraAmount)}
                      /month separately
                      <br />
                      • Loan remains but investment grows continuously
                      <br />• Lower risk, steady wealth building
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Prepayment Strategy:</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}
                    >
                      • Phase 1: Prepay loan with extra ₹
                      {rupeeFormat(calcState.extraAmount)}/month
                      <br />• Phase 2: After {scenarioB.loanClearedInYears}
                      years, invest full ₹
                      {rupeeFormat(
                        calcState.currentEMI + calcState.extraAmount
                      )}
                      /month
                      <br />• Saves ₹
                      {rupeeFormat(
                        scenarioA.totalInterestPaid -
                          scenarioB.totalInterestPaid
                      )}
                      in interest
                      <br />• Higher potential returns but requires discipline
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ width: '100%', mb: 2 }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ width: '90%' }}
            onClick={saveCalculation}
          >
            Save for Reference
          </Button>
          <Tooltip
            title="Compare different loan vs investment scenarios by saving your calculations and viewing them below."
            placement="top"
            enterTouchDelay={0}
            leaveTouchDelay={10000}
          >
            <InfoIcon sx={{ color: 'info.main' }} />
          </Tooltip>
        </Stack>
      </Box>
      {/* Detailed Breakdown Accordion */}
      <Accordion
        sx={{ mt: 2, mb: 0 }}
        expanded={mainAccordionExpanded}
        onChange={() => setMainAccordionExpanded(!mainAccordionExpanded)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Detailed Comparison & Charts
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          {/* Net Worth Comparison Chart */}
          <Box sx={{ mb: 3, height: 400 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Net Worth Comparison Over Time
            </Typography>
            <AgChartsReact options={comparisonChartOptions} />
          </Box>
          {/* Side by Side Tables */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Investment Strategy (EMI + Investment)
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: 400,
                  overflowX: 'auto',
                  '& .MuiTable-root': {
                    '@media (max-width: 600px)': {
                      minWidth: '500px'
                    }
                  }
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: '40px',
                          maxWidth: '40px',
                          textAlign: 'center'
                        }}
                      >
                        Year
                      </TableCell>
                      <TableCell align="right" sx={{ width: '120px' }}>
                        Loan Balance(₹)
                      </TableCell>
                      <TableCell align="right" sx={{ width: '120px' }}>
                        Investment(₹)
                      </TableCell>
                      <TableCell align="right" sx={{ width: '120px' }}>
                        Net Worth(₹)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scenarioA.breakdown.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell
                          sx={{
                            width: '40px',
                            maxWidth: '40px',
                            textAlign: 'center'
                          }}
                        >
                          {row.year}
                        </TableCell>
                        <TableCell align="right">
                          {rupeeFormat(row.loanBalance)}
                        </TableCell>
                        <TableCell align="right">
                          {rupeeFormat(row.investmentValue)}
                        </TableCell>
                        <TableCell align="right">
                          {rupeeFormat(row.netWorth)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Prepayment Strategy
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: 400,
                  overflowX: 'auto',
                  '& .MuiTable-root': {
                    '@media (max-width: 600px)': {
                      minWidth: '600px'
                    }
                  }
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: '40px',
                          maxWidth: '40px',
                          textAlign: 'center'
                        }}
                      >
                        Year
                      </TableCell>
                      <TableCell align="right" sx={{ width: '100px' }}>
                        Phase
                      </TableCell>
                      <TableCell align="right" sx={{ width: '120px' }}>
                        Loan Balance(₹)
                      </TableCell>
                      <TableCell align="right" sx={{ width: '120px' }}>
                        Investment(₹)
                      </TableCell>
                      <TableCell align="right" sx={{ width: '120px' }}>
                        Net Worth(₹)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scenarioB.breakdown.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell
                          sx={{
                            width: '40px',
                            maxWidth: '40px',
                            textAlign: 'center'
                          }}
                        >
                          {row.year}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={
                              row.phase === 'loan_repayment'
                                ? 'Prepaying'
                                : 'Investing'
                            }
                            size="small"
                            color={
                              row.phase === 'loan_repayment'
                                ? 'warning'
                                : 'success'
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          {rupeeFormat(row.loanBalance)}
                        </TableCell>
                        <TableCell align="right">
                          {rupeeFormat(row.investmentValue)}
                        </TableCell>
                        <TableCell align="right">
                          {rupeeFormat(row.netWorth)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {/* Saved Calculations Section */}
      {savedCalculations.length > 0 && (
        <Box sx={{ p: 2, pt: 1 }}>
          <Typography variant="h6" sx={{ mt: 1, mb: 2 }} color="primary">
            Saved Calculations
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              overflowX: 'auto',
              '& .MuiTable-root': {
                '@media (max-width: 600px)': {
                  minWidth: '800px'
                }
              }
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      width: '50px',
                      textAlign: 'center'
                    }}
                  >
                    #
                  </TableCell>
                  <TableCell style={{ padding: '6px 8px', width: '100px' }}>
                    Loan Amount
                  </TableCell>
                  <TableCell style={{ padding: '6px 8px', width: '80px' }}>
                    Extra Amount
                  </TableCell>
                  <TableCell style={{ padding: '6px 8px', width: '60px' }}>
                    Loan Rate
                  </TableCell>
                  <TableCell style={{ padding: '6px 8px', width: '70px' }}>
                    Investment Rate
                  </TableCell>
                  <TableCell style={{ padding: '6px 8px', width: '100px' }}>
                    Recommendation
                  </TableCell>
                  <TableCell style={{ padding: '6px 8px', width: '100px' }}>
                    Better By
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
                  <TableRow key={calc.id}>
                    <TableCell
                      style={{ padding: '6px 4px', textAlign: 'center' }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px' }}>
                      ₹{rupeeFormat(calc.loanAmount)}
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px' }}>
                      ₹{rupeeFormat(calc.extraAmount)}
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px' }}>
                      {calc.loanInterestRate}%
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px' }}>
                      {calc.investmentReturn}%
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px' }}>
                      <Chip
                        label={
                          calc.betterScenario === 'A' ? 'Invest' : 'Prepay'
                        }
                        color={
                          calc.betterScenario === 'A' ? 'primary' : 'secondary'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px' }}>
                      ₹{rupeeFormat(calc.difference)}
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px' }}>
                      {calc.date}
                    </TableCell>
                    <TableCell
                      style={{ padding: '6px 4px', textAlign: 'center' }}
                    >
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteCalculation(calc.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Markdown path="/markdown/loan-vs-investment.md" />
    </Box>
  );
};

export default LoanVsInvestmentCalculator;
