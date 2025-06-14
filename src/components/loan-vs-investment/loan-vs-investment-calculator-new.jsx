import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
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
  const [expandedCalculationIds, setExpandedCalculationIds] = useState([]);
  const [mainAccordionExpanded, setMainAccordionExpanded] = useState(true);
  const [hasScrolledToTable, setHasScrolledToTable] = useState(false);
  const referenceTableRef = useRef(null);

  usePageInfo({
    title: 'Loan Prepay vs Invest Calculator',
    description:
      'Compare loan prepayment vs investment strategies. Calculate whether to prepay your loan or invest the extra money for better returns. Analyze scenarios with detailed breakdowns, charts, and save multiple comparisons for informed financial decisions.'
  });

  useEffect(() => {
    // Load Saved References from localStorage on component mount
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
    const monthlyInvestmentReturn = investmentReturn / 12 / 100;

    let loanBalance = loanAmount;
    let investmentValue = 0;
    let totalInterestPaid = 0;

    const breakdown = [];

    for (let month = 1; month <= remainingTenure; month++) {
      // Loan calculations
      const interestPayment = loanBalance * monthlyRate;
      const principalPayment = currentEMI - interestPayment;
      loanBalance = Math.max(0, loanBalance - principalPayment);
      totalInterestPaid += interestPayment;

      // Investment calculations
      investmentValue =
        investmentValue * (1 + monthlyInvestmentReturn) + extraAmount;

      if (month % 12 === 0 || month === remainingTenure) {
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
    const totalLoanPayment = currentEMI * remainingTenure + loanBalance;

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
  };

  // Scenario B: Use Extra Amount for Loan Prepayment
  const calculatePrepaymentScenario = () => {
    const {
      loanAmount,
      currentEMI,
      loanInterestRate,
      extraAmount,
      investmentReturn
    } = calcState;

    const monthlyRate = loanInterestRate / 12 / 100;
    const monthlyInvestmentReturn = investmentReturn / 12 / 100;

    let loanBalance = loanAmount;
    let totalInterestPaid = 0;
    let month = 0;
    let investmentValue = 0;
    let loanClearedMonth = 0;

    const breakdown = [];
    const totalTimeHorizon = calcState.remainingTenure;

    // Phase 1: Loan repayment with prepayment
    while (loanBalance > 0 && month < 600) {
      month++;

      const interestPayment = loanBalance * monthlyRate;
      const totalPayment = Math.min(
        loanBalance + interestPayment,
        currentEMI + extraAmount
      );
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
    }

    // Phase 2: Post loan clearance - invest full EMI + extra amount for SAME total time horizon
    const monthlyInvestmentAmount = currentEMI + extraAmount;

    for (
      let postLoanMonth = loanClearedMonth + 1;
      postLoanMonth <= totalTimeHorizon;
      postLoanMonth++
    ) {
      investmentValue =
        investmentValue * (1 + monthlyInvestmentReturn) +
        monthlyInvestmentAmount;
      month = postLoanMonth;

      if (month % 12 === 0 || month === totalTimeHorizon) {
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

    const investmentMonths = totalTimeHorizon - loanClearedMonth;
    const totalInvested =
      extraAmount * loanClearedMonth +
      monthlyInvestmentAmount * investmentMonths;
    const investmentReturns = investmentValue - totalInvested;
    const totalLoanPayment = loanAmount + totalInterestPaid;

    return {
      breakdown,
      loanClearedInMonths: loanClearedMonth,
      loanClearedInYears: (loanClearedMonth / 12).toFixed(1),
      investmentMonths: investmentMonths,
      investmentYears: (investmentMonths / 12).toFixed(1),
      totalInterestPaid,
      finalInvestmentValue: investmentValue,
      netWorth: investmentValue,
      totalInvested,
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
        type: 'Scenario A'
      })),
      ...scenarioB.breakdown.map((item) => ({
        year: item.year,
        netWorthB: item.netWorth,
        type: 'Scenario B'
      }))
    ],
    series: [
      {
        type: 'line',
        xKey: 'year',
        yKey: 'netWorthA',
        yName: 'Conservative (EMI + Investment)',
        stroke: '#2196f3',
        marker: {
          fill: '#2196f3'
        }
      },
      {
        type: 'line',
        xKey: 'year',
        yKey: 'netWorthB',
        yName: 'Aggressive (Prepayment)',
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
    const filteredCalculations = savedCalculations.filter(
      (calc) => calc.id !== id
    );
    setSavedCalculations(filteredCalculations);
    localStorage.setItem(
      'loanVsInvestmentCalculations',
      JSON.stringify(filteredCalculations)
    );
  };

  const handleExpandClick = (id) => {
    setExpandedCalculationIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
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
          Prepay vs Invest Calculator
        </Typography>

        <LoanVsInvestmentForm onChange={handleCalcChange} />

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0 }}>
          <Typography variant="body1">Better Strategy:</Typography>
          <Typography variant="body1">
            {comparison.better === 'A'
              ? 'Conservative (EMI + Investment)'
              : 'Aggressive (Prepayment)'}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body1">Net Worth Advantage:</Typography>
          <Typography variant="body1">
            ₹{rupeeFormat(comparison.difference)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body1">Scenario A Net Worth:</Typography>
          <Typography variant="body1">
            ₹{rupeeFormat(scenarioA.netWorth)}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 1, mb: 1 }}
        >
          <Typography variant="body1">Scenario B Net Worth:</Typography>
          <Typography variant="body1">
            ₹{rupeeFormat(scenarioB.netWorth)}
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
            title="Compare different prepayment vs investment scenarios by saving your calculations and viewing them below."
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
        sx={{ mt: 3, mb: 0 }}
        TransitionProps={{ unmountOnExit: false }}
        expanded={mainAccordionExpanded}
        onChange={() => setMainAccordionExpanded(!mainAccordionExpanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="loan-vs-investment-breakdown-content"
          id="loan-vs-investment-breakdown-header"
        >
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Prepayment vs Investment Breakdown by Year
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          {/* Net Worth Comparison Chart */}
          <Box sx={{ mb: 2, ml: -2, mr: -2, mt: -3, height: 300 }}>
            <AgChartsReact options={comparisonChartOptions} />
          </Box>

          {/* Side by Side Tables */}
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
                    Scenario A (₹)
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '120px' }}
                  >
                    Scenario B (₹)
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '120px' }}
                  >
                    Difference (₹)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scenarioA.breakdown.map((rowA, index) => {
                  const rowB = scenarioB.breakdown[index];
                  const difference = rowB
                    ? rowB.netWorth - rowA.netWorth
                    : -rowA.netWorth;
                  return (
                    <TableRow key={rowA.year}>
                      <TableCell
                        style={{
                          padding: '6px 8px',
                          width: '40px',
                          maxWidth: '40px',
                          textAlign: 'center'
                        }}
                      >
                        {rowA.year}
                      </TableCell>
                      <TableCell align="right" style={{ padding: '6px 8px' }}>
                        {rupeeFormat(rowA.netWorth)}
                      </TableCell>
                      <TableCell align="right" style={{ padding: '6px 8px' }}>
                        {rowB ? rupeeFormat(rowB.netWorth) : '0'}
                      </TableCell>
                      <TableCell align="right" style={{ padding: '6px 8px' }}>
                        {difference >= 0 ? '+' : ''}
                        {rupeeFormat(difference)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      {/* Saved References Section */}
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
                        <TableCell>₹{rupeeFormat(calc.loanAmount)}</TableCell>
                        <TableCell>₹{rupeeFormat(calc.extraAmount)}</TableCell>
                        <TableCell>{calc.loanInterestRate}%</TableCell>
                        <TableCell>{calc.investmentReturn}%</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              calc.betterScenario === 'A' ? 'Invest' : 'Prepay'
                            }
                            color={
                              calc.betterScenario === 'A'
                                ? 'primary'
                                : 'secondary'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>₹{rupeeFormat(calc.difference)}</TableCell>
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
                      {expandedCalculationIds.includes(calc.id) && (
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
                                Scenario Comparison
                              </Typography>
                              <Table size="small" sx={{ minWidth: '100%' }}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell
                                      style={{
                                        padding: '6px 8px',
                                        width: '120px'
                                      }}
                                    >
                                      Metric
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        padding: '6px 8px',
                                        width: '120px'
                                      }}
                                    >
                                      Scenario A (₹)
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{
                                        padding: '6px 8px',
                                        width: '120px'
                                      }}
                                    >
                                      Scenario B (₹)
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell
                                      style={{
                                        padding: '6px 8px'
                                      }}
                                    >
                                      Net Worth
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{ padding: '6px 8px' }}
                                    >
                                      {rupeeFormat(calc.scenarioA.netWorth)}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{ padding: '6px 8px' }}
                                    >
                                      {rupeeFormat(calc.scenarioB.netWorth)}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell style={{ padding: '6px 8px' }}>
                                      Investment Value
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{ padding: '6px 8px' }}
                                    >
                                      {rupeeFormat(
                                        calc.scenarioA.finalInvestmentValue
                                      )}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{ padding: '6px 8px' }}
                                    >
                                      {rupeeFormat(
                                        calc.scenarioB.finalInvestmentValue
                                      )}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell style={{ padding: '6px 8px' }}>
                                      Interest Paid
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{ padding: '6px 8px' }}
                                    >
                                      {rupeeFormat(
                                        calc.scenarioA.totalInterestPaid
                                      )}
                                    </TableCell>
                                    <TableCell
                                      align="right"
                                      style={{ padding: '6px 8px' }}
                                    >
                                      {rupeeFormat(
                                        calc.scenarioB.totalInterestPaid
                                      )}
                                    </TableCell>
                                  </TableRow>
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
      <Markdown path="/markdown/loan-vs-investment.md" />
    </Box>
  );
};

export default LoanVsInvestmentCalculator;
