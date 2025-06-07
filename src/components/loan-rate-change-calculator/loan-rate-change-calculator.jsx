import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import TableViewIcon from '@mui/icons-material/TableView';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import {
  alpha,
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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Markdown from '../markdown/Markdown';
import usePageInfo from '../page-info/use-page-info';
import { rupeeFormat } from '../utils';
import LoanRateChangeForm from './loan-rate-change-form';

const LoanRateChangeCalculator = () => {
  const theme = useTheme();
  const [calcState, setCalcState] = useState({
    loanAmount: 5000000, // Default outstanding loan amount (50 lakhs)
    currentInterestRate: 8.5, // Current interest rate
    remainingTenure: 240, // Remaining tenure in months (20 years)
    newInterestRate: 8.0 // New reduced interest rate
  });
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [expandedCalculationIds, setExpandedCalculationIds] = useState([]);
  const [hasScrolledToTable, setHasScrolledToTable] = useState(false);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const referenceTableRef = useRef(null);
  usePageInfo({
    title: 'Loan Rate Change Calculator - Impact of Interest Rate Changes',
    description:
      'Calculate the impact of interest rate changes on your loan. Compare options: adjust EMI or adjust tenure. Analyze interest impact and choose the best strategy for your home loan, car loan, or personal loan rate changes.'
  });

  useEffect(() => {
    // Load saved calculations from localStorage on component mount
    const saved = localStorage.getItem('savedLoanRateChangeCalculations');
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
  }, []);

  const handleCalcChange = (newState) => {
    setCalcState(newState);
  };

  // Calculate EMI using the standard formula
  const calculateEMI = (principal, rate, tenure) => {
    if (!principal || !rate || !tenure) return 0;

    const monthlyRate = rate / 100 / 12;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);

    return Math.round(emi);
  };

  // Calculate current EMI based on current loan parameters
  const getCurrentEMI = () => {
    return calculateEMI(
      calcState.loanAmount,
      calcState.currentInterestRate,
      calcState.remainingTenure
    );
  };

  // Calculate three scenarios after rate change
  const calculateScenarios = () => {
    const {
      loanAmount,
      currentInterestRate,
      remainingTenure,
      newInterestRate
    } = calcState;

    if (
      !loanAmount ||
      !currentInterestRate ||
      !remainingTenure ||
      !newInterestRate
    ) {
      return { optionA: null, optionB: null };
    }

    // Determine if rate is increasing or decreasing
    const isRateIncrease = newInterestRate > currentInterestRate;
    const isRateDecrease = newInterestRate < currentInterestRate;

    // Always use auto-calculated EMI based on current loan parameters
    const currentEMI = getCurrentEMI();

    // Calculate current total interest
    const currentTotalAmount = currentEMI * remainingTenure;
    const currentTotalInterest = currentTotalAmount - loanAmount;

    // Option A: Change EMI, keep same tenure
    const newEMI = calculateEMI(loanAmount, newInterestRate, remainingTenure);
    const newTotalAmount = newEMI * remainingTenure;
    const newTotalInterest = newTotalAmount - loanAmount;

    const optionA = {
      type: isRateDecrease
        ? 'Reduce EMI'
        : isRateIncrease
          ? 'Increase EMI'
          : 'Adjust EMI',
      description: isRateDecrease
        ? 'Lower monthly payment, same tenure'
        : isRateIncrease
          ? 'Higher monthly payment, same tenure'
          : 'Adjusted monthly payment, same tenure',
      newEMI: newEMI,
      newTenure: remainingTenure,
      emiChange: newEMI - currentEMI, // Positive for increase, negative for decrease
      tenureChange: 0,
      totalInterest: newTotalInterest,
      interestDifference: newTotalInterest - currentTotalInterest, // Positive for additional cost, negative for savings
      monthlyDifference: newEMI - currentEMI,
      totalDifference: (newEMI - currentEMI) * remainingTenure
    }; // Option B: Keep same EMI, adjust tenure
    // Calculate new tenure with same EMI but different rate
    const monthlyRate = newInterestRate / 100 / 12;
    let newTenure = remainingTenure;

    if (monthlyRate > 0 && currentEMI > 0) {
      // Using the formula: n = -log(1 - (P*r)/EMI) / log(1 + r)
      // where P = principal, r = monthly rate, EMI = monthly payment
      const ratio = (loanAmount * monthlyRate) / currentEMI;

      if (ratio < 1) {
        // Standard case: EMI can cover principal + interest
        newTenure = -Math.log(1 - ratio) / Math.log(1 + monthlyRate);
        newTenure = Math.ceil(newTenure);

        // Ensure the new tenure is not negative or zero
        if (newTenure <= 0) {
          newTenure = remainingTenure;
        }
      } else {
        // Edge case: EMI is too low to cover interest, keep original tenure
        newTenure = remainingTenure;
      }
    }

    const optionBTotalAmount = currentEMI * newTenure;
    const optionBTotalInterest = optionBTotalAmount - loanAmount;

    const optionB = {
      type: isRateDecrease
        ? 'Reduce Tenure'
        : isRateIncrease
          ? 'Increase Tenure'
          : 'Adjust Tenure',
      description: isRateDecrease
        ? 'Same monthly payment, shorter loan period'
        : isRateIncrease
          ? 'Same monthly payment, longer loan period'
          : 'Same monthly payment, adjusted loan period',
      newEMI: currentEMI,
      newTenure: newTenure,
      emiChange: 0,
      tenureChange: newTenure - remainingTenure, // Positive for increase, negative for decrease
      totalInterest: optionBTotalInterest,
      interestDifference: optionBTotalInterest - currentTotalInterest,
      monthlyDifference: 0,
      totalDifference: optionBTotalInterest - currentTotalInterest
    };

    return { optionA, optionB };
  };

  const saveCalculation = () => {
    const scenarios = calculateScenarios();
    const newCalculation = {
      id: Date.now(),
      loanAmount: calcState.loanAmount,
      currentInterestRate: calcState.currentInterestRate,
      newInterestRate: calcState.newInterestRate,
      remainingTenure: calcState.remainingTenure,
      currentEMI: calcState.currentEMI || getCurrentEMI(),
      scenarios: scenarios,
      date: new Date().toLocaleDateString()
    };

    const updatedCalculations = [...savedCalculations, newCalculation];
    setSavedCalculations(updatedCalculations);
    localStorage.setItem(
      'savedLoanRateChangeCalculations',
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
      }, 100);
    }
  };

  const deleteCalculation = (id) => {
    const updatedCalculations = savedCalculations.filter(
      (calc) => calc.id !== id
    );
    setSavedCalculations(updatedCalculations);
    localStorage.setItem(
      'savedLoanRateChangeCalculations',
      JSON.stringify(updatedCalculations)
    );
  };
  const toggleCalculationExpansion = (id) => {
    setExpandedCalculationIds((prev) =>
      prev.includes(id) ? prev.filter((calcId) => calcId !== id) : [...prev, id]
    );
  };

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const scenarios = calculateScenarios();
  const currentEMI = calcState.currentEMI || getCurrentEMI();

  // Determine if rate is increasing or decreasing for display logic
  const isRateIncrease =
    calcState.newInterestRate > calcState.currentInterestRate;
  const isRateDecrease =
    calcState.newInterestRate < calcState.currentInterestRate;

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', p: 2 }}>
      <Box
        sx={{
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
          Loan Rate Change Calculator
        </Typography>{' '}
        <LoanRateChangeForm onChange={handleCalcChange} calcState={calcState} />
        {/* View Mode Toggle */}
        {scenarios.optionA && (
          <Box sx={{ display: 'flex', justifyContent: 'right', mt: 0, mb: 0 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
              sx={{
                bgcolor: 'background.paper',
                '& .MuiToggleButton-root': {
                  border: '1px solid',
                  borderColor: 'divider',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  }
                }
              }}
            >
              <ToggleButton value="card" aria-label="card view">
                <ViewModuleIcon sx={{ mr: 1, fontSize: '1rem' }} />
                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                  Cards
                </Typography>
              </ToggleButton>
              <ToggleButton value="table" aria-label="table view">
                <TableViewIcon sx={{ mr: 1, fontSize: '1rem' }} />
                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                  Table
                </Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
        {/* Card View Summary */}
        {scenarios.optionA && viewMode === 'card' && (
          <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
            {/* Current Loan Card */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={1}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  background: theme.palette.background.paper,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: theme.shadows[2]
                  }
                }}
              >
                {' '}
                <CardContent sx={{ p: 1.5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '0.9rem'
                      }}
                    >
                      Current
                    </Typography>
                    <Chip
                      label="Baseline"
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  </Box>{' '}
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Box
                      sx={{
                        flex: 1,
                        textAlign: 'center',
                        p: 0.8,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.info.main, 0.05)
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        EMI
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.info.main,
                          fontSize: '0.9rem'
                        }}
                      >
                        ₹{rupeeFormat(currentEMI)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        textAlign: 'center',
                        p: 0.8,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.warning.main, 0.05)
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Tenure
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.warning.main,
                          fontSize: '0.9rem'
                        }}
                      >
                        {Math.round(calcState.remainingTenure / 12)}y{' '}
                        {calcState.remainingTenure % 12}m
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        textAlign: 'center',
                        p: 0.8,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.secondary.main, 0.05)
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Interest
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.secondary.main,
                          fontSize: '0.9rem'
                        }}
                      >
                        ₹
                        {rupeeFormat(
                          currentEMI * calcState.remainingTenure -
                            calcState.loanAmount
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Option A: Adjust EMI Card */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={1}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${scenarios.optionA.interestDifference <= 0 ? theme.palette.success.main : theme.palette.error.main}`,
                  background: `linear-gradient(145deg, ${alpha(scenarios.optionA.interestDifference <= 0 ? theme.palette.success.main : theme.palette.error.main, 0.05)}, ${alpha(scenarios.optionA.interestDifference <= 0 ? theme.palette.success.main : theme.palette.error.main, 0.08)})`,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: `0 2px 8px ${alpha(scenarios.optionA.interestDifference <= 0 ? theme.palette.success.main : theme.palette.error.main, 0.15)}`
                  }
                }}
              >
                {' '}
                <CardContent sx={{ p: 1.5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1
                    }}
                  >
                    {' '}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '0.9rem'
                      }}
                    >
                      {isRateDecrease
                        ? 'Option A: Lower EMI, Same Tenure'
                        : 'Option A: Higher EMI, Same Tenure'}
                    </Typography>
                    <Chip
                      label={
                        scenarios.optionA.interestDifference <= 0
                          ? 'Save'
                          : 'Cost'
                      }
                      size="small"
                      color={
                        scenarios.optionA.interestDifference <= 0
                          ? 'success'
                          : 'error'
                      }
                      sx={{ fontSize: '0.7rem' }}
                    />
                  </Box>{' '}
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Box
                      sx={{
                        flex: 1,
                        textAlign: 'center',
                        p: 0.8,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.info.main, 0.05)
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        EMI
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.info.main,
                          fontSize: '0.9rem'
                        }}
                      >
                        ₹{rupeeFormat(scenarios.optionA.newEMI)}
                      </Typography>{' '}
                      <Typography
                        variant="caption"
                        display="block"
                        color={
                          scenarios.optionA.emiChange < 0
                            ? 'success.main'
                            : 'error.main'
                        }
                        sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
                      >
                        {scenarios.optionA.emiChange < 0 ? 'Saves ' : 'Costs '}₹
                        {rupeeFormat(Math.abs(scenarios.optionA.emiChange))}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        textAlign: 'center',
                        p: 0.8,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.warning.main, 0.05)
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Tenure
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.warning.main,
                          fontSize: '0.9rem'
                        }}
                      >
                        {Math.round(scenarios.optionA.newTenure / 12)}y{' '}
                        {scenarios.optionA.newTenure % 12}m
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        textAlign: 'center',
                        p: 0.8,
                        borderRadius: 1,
                        bgcolor: alpha(
                          scenarios.optionA.interestDifference <= 0
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                          0.05
                        )
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        {isRateIncrease ? "Add'l Interest" : 'Saved'}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color:
                            scenarios.optionA.interestDifference <= 0
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                          fontSize: '0.9rem'
                        }}
                      >
                        {scenarios.optionA.interestDifference <= 0 ? '₹' : '+₹'}
                        {rupeeFormat(
                          Math.abs(scenarios.optionA.interestDifference)
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Option B: Adjust Tenure Card */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={1}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${scenarios.optionB.interestDifference <= 0 ? theme.palette.success.main : theme.palette.error.main}`,
                  background: `linear-gradient(145deg, ${alpha(scenarios.optionB.interestDifference <= 0 ? theme.palette.success.main : theme.palette.error.main, 0.05)}, ${alpha(scenarios.optionB.interestDifference <= 0 ? theme.palette.success.main : theme.palette.error.main, 0.08)})`,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: `0 2px 8px ${alpha(scenarios.optionB.interestDifference <= 0 ? theme.palette.success.main : theme.palette.error.main, 0.15)}`
                  }
                }}
              >
                {' '}
                <CardContent sx={{ p: 1.5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1
                    }}
                  >
                    {' '}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '0.9rem'
                      }}
                    >
                      {isRateDecrease
                        ? 'Option B: Shorter Tenure, Same EMI'
                        : 'Option B: Longer Tenure, Same EMI'}
                    </Typography>
                    <Chip
                      label={
                        scenarios.optionB.interestDifference <= 0
                          ? 'Save'
                          : 'Cost'
                      }
                      size="small"
                      color={
                        scenarios.optionB.interestDifference <= 0
                          ? 'success'
                          : 'error'
                      }
                      sx={{ fontSize: '0.7rem' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Box
                      sx={{
                        flex: 1,
                        textAlign: 'center',
                        p: 0.8,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.info.main, 0.05)
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        EMI
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.info.main,
                          fontSize: '0.9rem'
                        }}
                      >
                        ₹{rupeeFormat(scenarios.optionB.newEMI)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        textAlign: 'center',
                        p: 0.8,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.warning.main, 0.05)
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Tenure
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.warning.main,
                          fontSize: '0.9rem'
                        }}
                      >
                        {Math.round(scenarios.optionB.newTenure / 12)}y{' '}
                        {scenarios.optionB.newTenure % 12}m
                      </Typography>{' '}
                      <Typography
                        variant="caption"
                        display="block"
                        color={
                          scenarios.optionB.tenureChange < 0
                            ? 'success.main'
                            : 'error.main'
                        }
                        sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
                      >
                        {scenarios.optionB.tenureChange < 0
                          ? 'Reduces '
                          : 'Extends '}
                        {Math.abs(
                          Math.round(scenarios.optionB.tenureChange / 12)
                        )}
                        y
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        textAlign: 'center',
                        p: 0.8,
                        borderRadius: 1,
                        bgcolor: alpha(
                          scenarios.optionB.interestDifference <= 0
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                          0.05
                        )
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        {isRateIncrease ? "Add'l Interest" : 'Saved'}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color:
                            scenarios.optionB.interestDifference <= 0
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                          fontSize: '0.9rem'
                        }}
                      >
                        {scenarios.optionB.interestDifference <= 0 ? '₹' : '+₹'}
                        {rupeeFormat(
                          Math.abs(scenarios.optionB.interestDifference)
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        {/* Table View Summary */}
        {scenarios.optionA && viewMode === 'table' && (
          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              mb: 2,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.50' }}>
                  <TableCell
                    style={{
                      padding: '6px 8px',
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}
                  >
                    Option
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      padding: '6px 8px',
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}
                  >
                    Monthly EMI
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      padding: '6px 8px',
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}
                  >
                    Tenure
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      padding: '6px 8px',
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}
                  >
                    Total Interest
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      padding: '6px 8px',
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}
                  >
                    {isRateIncrease ? 'Additional Interest' : 'Interest Saved'}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell
                    style={{
                      padding: '6px 8px',
                      fontWeight: 'bold',
                      color: 'text.secondary'
                    }}
                  >
                    Current
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ padding: '6px 8px', fontWeight: 'bold' }}
                  >
                    ₹{rupeeFormat(currentEMI)}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ padding: '6px 8px', fontWeight: 'bold' }}
                  >
                    {Math.round(calcState.remainingTenure / 12)} years{' '}
                    {calcState.remainingTenure % 12} months
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ padding: '6px 8px', fontWeight: 'bold' }}
                  >
                    ₹
                    {rupeeFormat(
                      currentEMI * calcState.remainingTenure -
                        calcState.loanAmount
                    )}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      padding: '6px 8px',
                      fontWeight: 'bold',
                      color: 'text.secondary'
                    }}
                  >
                    -
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    bgcolor: 'info.50',
                    '&:hover': { bgcolor: 'info.100' }
                  }}
                >
                  <TableCell style={{ padding: '6px 8px', fontWeight: 'bold' }}>
                    {isRateDecrease
                      ? 'EMI Same, Tenure change'
                      : 'EMI Same, Tenure adjust'}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ padding: '6px 8px', fontWeight: 'bold' }}
                  >
                    ₹{rupeeFormat(scenarios.optionB.newEMI)}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ padding: '6px 8px', fontWeight: 'bold' }}
                  >
                    {Math.round(scenarios.optionB.newTenure / 12)} years{' '}
                    {scenarios.optionB.newTenure % 12} months{' '}
                    <Typography
                      variant="caption"
                      display="block"
                      color={
                        scenarios.optionB.tenureChange < 0
                          ? 'success.main'
                          : 'error.main'
                      }
                    >
                      {scenarios.optionB.tenureChange < 0 ? '↓' : '↑'}
                      {Math.abs(
                        Math.round(scenarios.optionB.tenureChange / 12)
                      )}{' '}
                      years {Math.abs(scenarios.optionB.tenureChange) % 12}{' '}
                      months
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ padding: '6px 8px', fontWeight: 'bold' }}
                  >
                    ₹{rupeeFormat(scenarios.optionB.totalInterest)}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      padding: '6px 8px',
                      fontWeight: 'bold',
                      color:
                        scenarios.optionB.interestDifference <= 0
                          ? 'success.main'
                          : 'error.main'
                    }}
                  >
                    {scenarios.optionB.interestDifference <= 0 ? '₹' : '+₹'}
                    {rupeeFormat(
                      Math.abs(scenarios.optionB.interestDifference)
                    )}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    bgcolor: 'success.50',
                    '&:hover': { bgcolor: 'success.100' }
                  }}
                >
                  <TableCell style={{ padding: '6px 8px', fontWeight: 'bold' }}>
                    {isRateDecrease
                      ? 'Tenure same, EMI change'
                      : 'Tenure same, EMI adjust'}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ padding: '6px 8px', fontWeight: 'bold' }}
                  >
                    ₹{rupeeFormat(scenarios.optionA.newEMI)}
                    <Typography
                      variant="caption"
                      display="block"
                      color={
                        scenarios.optionA.emiChange < 0
                          ? 'success.main'
                          : 'error.main'
                      }
                    >
                      {scenarios.optionA.emiChange < 0 ? '↓₹' : '↑₹'}
                      {rupeeFormat(Math.abs(scenarios.optionA.emiChange))}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ padding: '6px 8px', fontWeight: 'bold' }}
                  >
                    {Math.round(scenarios.optionA.newTenure / 12)} years{' '}
                    {scenarios.optionA.newTenure % 12} months
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ padding: '6px 8px', fontWeight: 'bold' }}
                  >
                    ₹{rupeeFormat(scenarios.optionA.totalInterest)}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      padding: '6px 8px',
                      fontWeight: 'bold',
                      color:
                        scenarios.optionA.interestDifference <= 0
                          ? 'success.main'
                          : 'error.main'
                    }}
                  >
                    {scenarios.optionA.interestDifference <= 0 ? '₹' : '+₹'}
                    {rupeeFormat(
                      Math.abs(scenarios.optionA.interestDifference)
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ width: '100%' }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1, mb: -1, width: '90%', maxWidth: '500px' }}
            onClick={saveCalculation}
            disabled={!scenarios.optionA}
          >
            Save for Reference
          </Button>
          <Tooltip title="Save this calculation to compare different rate change scenarios">
            <IconButton size="small" sx={{ mt: 1, mb: -1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>{' '}
      </Box>
      {/* Saved Calculations Table */}
      {savedCalculations.length > 0 && (
        <Box ref={referenceTableRef} sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Saved Rate Change Calculations
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              {' '}
              <TableHead>
                <TableRow>
                  <TableCell style={{ padding: '6px 4px', width: '50px' }}>
                    #
                  </TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>
                    Loan Amount
                  </TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>
                    Rate Change
                  </TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>
                    Original EMI
                  </TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>
                    Original Tenure
                  </TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>
                    Option A: EMI Change
                  </TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>
                    Option B: Tenure Change
                  </TableCell>
                  <TableCell style={{ padding: '6px 8px' }}>Date</TableCell>
                  <TableCell style={{ padding: '6px 4px' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedCalculations.map((calc, index) => {
                  return (
                    <TableRow key={calc.id}>
                      <TableCell style={{ padding: '6px 4px' }}>
                        <Stack direction="row" alignItems="center">
                          <IconButton
                            size="small"
                            onClick={() => toggleCalculationExpansion(calc.id)}
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
                      </TableCell>{' '}
                      <TableCell>₹{rupeeFormat(calc.loanAmount)}</TableCell>
                      <TableCell>
                        {calc.currentInterestRate}% → {calc.newInterestRate}%
                      </TableCell>
                      {/* Original EMI */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                        >
                          ₹{rupeeFormat(calc.currentEMI)}
                        </Typography>
                      </TableCell>
                      {/* Original Tenure */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                        >
                          {Math.round(calc.remainingTenure / 12)}y{' '}
                          {calc.remainingTenure % 12}m
                        </Typography>
                      </TableCell>
                      {/* Option A: EMI Change */}
                      <TableCell>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                          >
                            ₹{rupeeFormat(calc.scenarios.optionA.newEMI)} EMI
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                calc.scenarios.optionA.interestDifference <= 0
                                  ? 'success.main'
                                  : 'error.main',
                              fontSize: '0.7rem'
                            }}
                          >
                            {calc.scenarios.optionA.interestDifference <= 0
                              ? '₹'
                              : '+₹'}
                            {rupeeFormat(
                              Math.abs(
                                calc.scenarios.optionA.interestDifference
                              )
                            )}
                            {calc.scenarios.optionA.interestDifference <= 0
                              ? ' saved'
                              : ' additional'}
                          </Typography>
                        </Box>
                      </TableCell>
                      {/* Option B: Tenure Change */}
                      <TableCell>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                          >
                            {Math.round(calc.scenarios.optionB.newTenure / 12)}y{' '}
                            {calc.scenarios.optionB.newTenure % 12}m
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                calc.scenarios.optionB.interestDifference <= 0
                                  ? 'success.main'
                                  : 'error.main',
                              fontSize: '0.7rem'
                            }}
                          >
                            {calc.scenarios.optionB.interestDifference <= 0
                              ? '₹'
                              : '+₹'}
                            {rupeeFormat(
                              Math.abs(
                                calc.scenarios.optionB.interestDifference
                              )
                            )}
                            {calc.scenarios.optionB.interestDifference <= 0
                              ? ' saved'
                              : ' additional'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{calc.date}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteCalculation(calc.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>{' '}
          </TableContainer>
        </Box>
      )}{' '}
      <br />
      <Markdown path="/markdown/loan-rate-change.md"></Markdown>
    </Box>
  );
};

export default LoanRateChangeCalculator;
