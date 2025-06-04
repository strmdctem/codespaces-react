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
import React, { useEffect, useRef, useState } from 'react';
import Markdown from '../markdown/Markdown';
import usePageInfo from '../page-info/use-page-info';
import { rupeeFormat } from '../utils';
import EMICalculatorForm from './emi-calculator-form';

const EMICalculator = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [calcState, setCalcState] = useState({
    amount: 1000000, // Default loan amount (10 lakhs)
    interestRate: 8, // Default interest rate
    tenure: 60 // Default tenure in months (5 years)
  }); // We use monthly payments by default and don't allow changing for simplicity
  const paymentFrequency = 'monthly';
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [expandedCalculationIds, setExpandedCalculationIds] = useState([]);
  const [mainAccordionExpanded, setMainAccordionExpanded] = useState(true);
  const [
    tenureComparisonAccordionExpanded,
    setTenureComparisonAccordionExpanded
  ] = useState(true);
  const [hasScrolledToTable, setHasScrolledToTable] = useState(false);
  const referenceTableRef = useRef(null);

  usePageInfo({
    title: 'EMI Calculator',
    description:
      'FinRates EMI Calculator helps you calculate loan EMIs with ease. Adjust loan amount, interest rate, and tenure to explore repayment options. Visualize year-by-year breakdowns with interactive charts, analyze principal vs interest payments, track remaining balance, and save multiple scenarios for comparison. Make informed financial decisions with our detailed loan analysis tools.'
  });

  useEffect(() => {
    // Load saved calculations from localStorage on component mount
    const saved = localStorage.getItem('savedEMICalculations');
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
  }, []);

  const handleCalcChange = (state) => {
    setCalcState(state);
  };
  // Payment frequency is fixed to monthly for simplicity

  // Calculate EMI using the formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
  const calculateEMI = () => {
    const { amount, interestRate, tenure } = calcState;

    if (!amount || !interestRate || !tenure) return 0;

    // Convert annual interest rate to monthly/quarterly rate (decimal)
    let ratePerPeriod;
    let totalPeriods;

    if (paymentFrequency === 'monthly') {
      ratePerPeriod = interestRate / 100 / 12;
      totalPeriods = tenure;
    } else {
      // quarterly
      ratePerPeriod = interestRate / 100 / 4;
      totalPeriods = Math.ceil(tenure / 3);
    }

    // Calculate EMI
    const emi =
      (amount * ratePerPeriod * Math.pow(1 + ratePerPeriod, totalPeriods)) /
      (Math.pow(1 + ratePerPeriod, totalPeriods) - 1);

    return isNaN(emi) ? 0 : Math.round(emi);
  };

  const calculateTotalInterest = () => {
    const { amount, tenure } = calcState;
    const emi = calculateEMI();

    let totalPayments;
    if (paymentFrequency === 'monthly') {
      totalPayments = tenure;
    } else {
      // quarterly
      totalPayments = Math.ceil(tenure / 3);
    }

    const totalAmount = emi * totalPayments;
    const totalInterest = totalAmount - amount;

    return Math.round(totalInterest);
  };

  const calculateTotalAmount = () => {
    const { amount } = calcState;
    const totalInterest = calculateTotalInterest();
    return parseInt(amount) + totalInterest;
  };

  const calculateInterestPercentage = () => {
    const totalInterest = calculateTotalInterest();
    const totalAmount = calculateTotalAmount();

    if (!totalAmount || totalAmount === 0) return '0';

    const percentReturn = (totalInterest / totalAmount) * 100;

    // Only apply toFixed if there's a decimal part
    return percentReturn % 1 === 0
      ? percentReturn.toString()
      : percentReturn.toFixed(2);
  };

  // Calculate year-by-year EMI breakdown
  const calculateYearlyEMIBreakdown = () => {
    const { amount, interestRate, tenure } = calcState;
    if (!amount || !interestRate || !tenure) return [];

    const monthlyRate = interestRate / 100 / 12;
    const monthlyEMI = calculateEMI();

    let remainingPrincipal = amount;
    const monthlyBreakdown = [];

    // Calculate month-by-month breakdown first
    for (let month = 1; month <= tenure; month++) {
      const interestForMonth = remainingPrincipal * monthlyRate;
      const principalForMonth = monthlyEMI - interestForMonth;

      // For the last month, adjust to ensure zero remaining balance
      if (month === tenure) {
        // The last payment should clear the remaining balance exactly
        remainingPrincipal = 0;
      } else {
        remainingPrincipal -= principalForMonth;
        // Ensure we don't have negative remaining principal due to rounding
        if (remainingPrincipal < 0) remainingPrincipal = 0;
      }

      monthlyBreakdown.push({
        month,
        emi: monthlyEMI,
        principal: principalForMonth,
        interest: interestForMonth,
        balance: remainingPrincipal
      });
    }

    // Group by year
    const yearlyBreakdown = [];
    const yearsCount = Math.ceil(tenure / 12);

    for (let year = 0; year < yearsCount; year++) {
      const startMonth = year * 12;
      const endMonth = Math.min((year + 1) * 12, tenure);

      const monthsInYear = monthlyBreakdown.slice(startMonth, endMonth);

      const yearData = {
        year: year + 1,
        totalEMI: monthsInYear.reduce((sum, m) => sum + m.emi, 0),
        totalPrincipal: monthsInYear.reduce((sum, m) => sum + m.principal, 0),
        totalInterest: monthsInYear.reduce((sum, m) => sum + m.interest, 0),
        remainingBalance: monthsInYear[monthsInYear.length - 1].balance
      };

      yearlyBreakdown.push(yearData);
    }

    return yearlyBreakdown;
  };
  const saveCalculation = () => {
    const newCalculation = {
      id: Date.now(), // Use timestamp as unique ID
      amount: calcState.amount,
      interestRate: calcState.interestRate,
      tenure: calcState.tenure,
      paymentFrequency:
        paymentFrequency === 'monthly' ? 'Monthly' : 'Quarterly',
      emi: calculateEMI(),
      totalInterest: calculateTotalInterest(),
      totalAmount: calculateTotalAmount(),
      interestPercentage: calculateInterestPercentage(),
      breakdown: calculateYearlyEMIBreakdown(),
      date: new Date().toLocaleDateString()
    };
    const updatedCalculations = [...savedCalculations, newCalculation];
    setSavedCalculations(updatedCalculations);
    localStorage.setItem(
      'savedEMICalculations',
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
    localStorage.setItem(
      'savedEMICalculations',
      JSON.stringify(updatedCalculations)
    );
  };
  const handleExpandClick = (id) => {
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
  // Generate chart data for EMI breakdown visualization
  const generateChartData = () => {
    const yearlyBreakdown = calculateYearlyEMIBreakdown();
    let cumulativePrincipal = 0;
    let cumulativeInterest = 0;

    return yearlyBreakdown.map((row, index) => {
      cumulativePrincipal += row.totalPrincipal;
      cumulativeInterest += row.totalInterest;

      return {
        year: `Year ${row.year}`,
        principal: cumulativePrincipal,
        interest: cumulativeInterest,
        balance: row.remainingBalance,
        isLast: index === yearlyBreakdown.length - 1
      };
    });
  };
  // Generate tenure comparison data showing different loan tenures and their impact
  const generateTenureComparisonData = () => {
    const { amount, interestRate, tenure } = calcState;
    if (!amount || !interestRate || !tenure) return [];

    // Maximum loan tenure is 30 years (360 months)
    const maxTenure = 360;

    // If current tenure would cause 150% variation to exceed 360 months,
    // adjust the base to ensure all variations stay within limit
    const maxBaseForVariations = Math.floor(maxTenure / 1.5); // 240 months (20 years)
    const adjustedBaseTenure = Math.min(tenure, maxBaseForVariations); // Create tenure variations (50%, 75%, 100%, 125%, 150% of adjusted base)
    const tenureVariations = [0.5, 0.75, 1.0, 1.25, 1.5].map((factor) => {
      const calculatedTenure = Math.round(adjustedBaseTenure * factor);
      const monthlyRate = interestRate / 100 / 12;

      // Calculate EMI for this tenure
      const emi =
        (amount * monthlyRate * Math.pow(1 + monthlyRate, calculatedTenure)) /
        (Math.pow(1 + monthlyRate, calculatedTenure) - 1);

      const totalAmount = emi * calculatedTenure;
      const totalInterest = totalAmount - amount;

      // Create short format for display
      const tenureYears = calculatedTenure / 12;
      const tenureShort =
        tenureYears >= 1
          ? `${tenureYears.toFixed(1)}Y`
          : `${calculatedTenure}M`;

      return {
        tenure: `${calculatedTenure} months`,
        tenureShort,
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalAmount: Math.round(totalAmount),
        calculatedTenure,
        factor,
        wasBaseAdjusted: adjustedBaseTenure !== tenure
      };
    });

    // Find which variation is closest to the user's actual tenure
    const userTenureVariation = tenureVariations.reduce((closest, current) => {
      const currentDiff = Math.abs(current.calculatedTenure - tenure);
      const closestDiff = Math.abs(closest.calculatedTenure - tenure);
      return currentDiff < closestDiff ? current : closest;
    });

    // Mark the closest variation as the user's tenure
    return tenureVariations.map((variation) => ({
      ...variation,
      isUserTenure: variation === userTenureVariation
    }));
  };
  // Configuration options for the EMI chart
  const chartOptions = {
    data: generateChartData(),
    theme: isDark ? 'ag-material-dark' : 'ag-material',
    series: [
      {
        type: 'bar',
        xKey: 'year',
        yKey: 'principal',
        stacked: true,
        yName: 'Principal',
        fill: '#3f51b5',
        tooltip: {
          renderer: function ({ datum }) {
            const totalPrincipal = Math.round(datum.principal).toLocaleString(
              'en-IN'
            );
            const totalInterest = Math.round(datum.interest).toLocaleString(
              'en-IN'
            );
            const totalPaid = Math.round(
              datum.principal + datum.interest
            ).toLocaleString('en-IN');
            const balance = Math.round(datum.balance).toLocaleString('en-IN');

            return {
              content: `
                <b>Total Paid:</b> ₹${totalPaid}<br>
                <b>Principal Paid:</b> ₹${totalPrincipal}<br>
                Interest Paid: ₹${totalInterest}<br>
                Balance: ₹${balance}
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
        yName: 'Interest',
        fill: '#f44336',
        label: {
          formatter: (params) => {
            if (!params.datum.isLast) {
              return '';
            }
            const totalPaid = params.datum.principal + params.datum.interest;

            // Format in lakhs and crores
            if (totalPaid >= 10000000) {
              // For values >= 1 crore (1,00,00,000)
              return `${(totalPaid / 10000000).toFixed(2)} cr`;
            } else if (totalPaid >= 100000) {
              // For values >= 1 lakh (1,00,000)
              return `${(totalPaid / 100000).toFixed(2)} lac`;
            } else {
              // For smaller values
              return `₹${Math.round(totalPaid).toLocaleString('en-IN')}`;
            }
          },
          placement: 'outside-end',
          color: '#000080',
          fontWeight: 'bold'
        },
        tooltip: {
          renderer: function ({ datum }) {
            const totalPrincipal = Math.round(datum.principal).toLocaleString(
              'en-IN'
            );
            const totalInterest = Math.round(datum.interest).toLocaleString(
              'en-IN'
            );
            const totalPaid = Math.round(
              datum.principal + datum.interest
            ).toLocaleString('en-IN');
            const balance = Math.round(datum.balance).toLocaleString('en-IN');

            return {
              content: `
                <b>Total Paid:</b> ₹${totalPaid}<br>
                Principal Paid: ₹${totalPrincipal}<br>
                <b>Interest Paid:</b> ₹${totalInterest}<br>
                Balance: ₹${balance}
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
  }; // Configuration options for the EMI comparison chart
  const emiComparisonChartOptions = {
    data: generateTenureComparisonData(),
    theme: isDark ? 'ag-material-dark' : 'ag-material',
    title: {
      text: 'EMI Amount Comparison Across Different Tenures',
      fontSize: 14
    },
    series: [
      {
        type: 'bar',
        xKey: 'tenureShort',
        yKey: 'emi',
        yName: 'EMI Amount',
        fill: '#3f51b5',
        label: {
          formatter: (params) => {
            const emi = params.value;
            // Format in thousands/lakhs
            if (emi >= 100000) {
              return `₹${(emi / 100000).toFixed(0)}L`;
            } else if (emi >= 1000) {
              return `₹${(emi / 1000).toFixed(0)}K`;
            } else {
              return `₹${emi.toFixed(0)}`;
            }
          },
          placement: 'outside-end',
          color: (params) =>
            params.datum.isUserTenure ? '#ff6b35' : '#000080',
          fontWeight: 'bold'
        },
        tooltip: {
          renderer: function ({ datum }) {
            const emi = Math.round(datum.emi).toLocaleString('en-IN');
            const userIndicator = datum.isUserTenure ? ' (Your Current)' : '';

            return {
              content: `<b>EMI Amount:</b> ₹${emi}`,
              title: `${datum.tenure}${userIndicator}`,
              titleFontWeight: 'bold'
            };
          }
        }
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'Loan Tenure' }
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'EMI Amount (₹)' },
        label: {
          formatter: (params) => {
            const value = params.value;
            if (value >= 100000) {
              return `₹${(value / 100000).toFixed(0)}L`;
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(0)}K`;
            } else {
              return `₹${value.toFixed(0)}`;
            }
          }
        }
      }
    ]
  };

  // Configuration options for the tenure comparison chart (Principal + Interest stacked)
  const tenureComparisonChartOptions = {
    data: generateTenureComparisonData().map((item) => ({
      ...item,
      principal: item.totalAmount - item.totalInterest // Calculate principal from totalAmount - totalInterest
    })),
    theme: isDark ? 'ag-material-dark' : 'ag-material',
    title: {
      text: 'Principal vs Interest Breakdown by Tenure',
      fontSize: 14
    },
    series: [
      {
        type: 'bar',
        xKey: 'tenureShort',
        yKey: 'principal',
        yName: 'Principal Amount',
        stacked: true,
        fill: '#3f51b5',
        tooltip: {
          renderer: function ({ datum }) {
            const principal = Math.round(datum.principal).toLocaleString(
              'en-IN'
            );
            const userIndicator = datum.isUserTenure ? ' (Your Current)' : '';

            return {
              content: `<b>Principal Amount:</b> ₹${principal}`,
              title: `${datum.tenure}${userIndicator}`,
              titleFontWeight: 'bold'
            };
          }
        }
      },
      {
        type: 'bar',
        xKey: 'tenureShort',
        yKey: 'totalInterest',
        yName: 'Total Interest',
        stacked: true,
        fill: '#f44336',
        label: {
          formatter: (params) => {
            // Show total amount on top of stack
            const totalAmount =
              params.datum.principal + params.datum.totalInterest;
            if (totalAmount >= 10000000) {
              return `₹${(totalAmount / 10000000).toFixed(1)}Cr`;
            } else if (totalAmount >= 100000) {
              return `₹${(totalAmount / 100000).toFixed(0)}L`;
            } else if (totalAmount >= 1000) {
              return `₹${(totalAmount / 1000).toFixed(0)}K`;
            } else {
              return `₹${totalAmount.toFixed(0)}`;
            }
          },
          placement: 'outside-end',
          color: '#000080',
          fontWeight: 'bold'
        },
        tooltip: {
          renderer: function ({ datum }) {
            const totalInterest = Math.round(
              datum.totalInterest
            ).toLocaleString('en-IN');
            const principal = Math.round(datum.principal).toLocaleString(
              'en-IN'
            );
            const totalAmount = Math.round(
              datum.principal + datum.totalInterest
            ).toLocaleString('en-IN');
            const userIndicator = datum.isUserTenure ? ' (Your Current)' : '';

            return {
              content: `
                <b>Total Amount:</b> ₹${totalAmount}<br>
                Principal: ₹${principal}<br>
                <b>Interest:</b> ₹${totalInterest}
              `,
              title: `${datum.tenure}${userIndicator}`,
              titleFontWeight: 'bold'
            };
          }
        }
      }
    ],
    legend: {
      position: 'top',
      spacing: 40
    },
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'Loan Tenure' }
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Amount (₹)' },
        label: {
          formatter: (params) => {
            const value = params.value;
            if (value >= 10000000) {
              return `₹${(value / 10000000).toFixed(0)}Cr`;
            } else if (value >= 100000) {
              return `₹${(value / 100000).toFixed(0)}L`;
            } else if (value >= 1000) {
              return `₹${(value / 1000).toFixed(0)}K`;
            } else {
              return `₹${value.toFixed(0)}`;
            }
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
          EMI Calculator
        </Typography>
        <EMICalculatorForm
          onChange={handleCalcChange}
          interestRate={calcState.interestRate}
        />
        {/* <Stack direction="row" spacing={3} sx={{ mt: -1, mb: 4, mr: 2 }}>
          <label className="calc-label">Payment:</label>
          <FormControl fullWidth size="small">
            <Select
              value={paymentFrequency}
              onChange={handlePaymentFrequencyChange}
              displayEmpty
              variant="outlined"
              size="small"
              sx={{
                height: '32px',
                '.MuiSelect-select': {
                  paddingTop: '8px',
                  paddingBottom: '8px'
                }
              }}
            >
              <MenuItem value={'monthly'}>Monthly</MenuItem>
              <MenuItem value={'quarterly'}>Quarterly</MenuItem>
            </Select>
          </FormControl>
        </Stack> */}
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0 }}>
          <Typography variant="body2" fontWeight="bold">
            EMI Amount:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ₹{rupeeFormat(calculateEMI())}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            Total Interest:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ₹{rupeeFormat(calculateTotalInterest())}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            Total Amount:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            ₹{rupeeFormat(calculateTotalAmount())}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 1, mb: 1 }}
        >
          <Typography variant="body2" fontWeight="bold">
            Interest % of Total Payment:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {calculateInterestPercentage()}%
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
          aria-controls="emi-breakdown-content"
          id="emi-breakdown-header"
        >
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            EMI Breakdown by Year
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2, ml: -2, mr: -2, mt: -3, height: 300 }}>
            <AgChartsReact options={chartOptions} />
          </Box>
          <TableContainer component={Paper}>
            <Table
              size="small"
              stickyHeader
              sx={{
                minWidth: '100%',
                '& .MuiTableCell-root': { whiteSpace: 'nowrap' }
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      padding: '6px 8px',
                      width: '40px',
                      maxWidth: '40px'
                    }}
                  >
                    Year
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '120px' }}
                  >
                    Principal (₹)
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '120px' }}
                  >
                    Interest (₹)
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
                {calculateYearlyEMIBreakdown().map((row) => (
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
                      {rupeeFormat(Math.round(row.totalPrincipal))}
                    </TableCell>
                    <TableCell align="right" style={{ padding: '6px 8px' }}>
                      {rupeeFormat(Math.round(row.totalInterest))}
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
      <Accordion
        sx={{ mt: 2, mb: 0 }}
        TransitionProps={{ unmountOnExit: false }}
        expanded={tenureComparisonAccordionExpanded}
        onChange={() =>
          setTenureComparisonAccordionExpanded(
            !tenureComparisonAccordionExpanded
          )
        }
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="tenure-comparison-content"
          id="tenure-comparison-header"
        >
          <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Loan Tenure Comparison Analysis
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography
            variant="body2"
            sx={{ mb: 2, mt: -2, color: 'text.secondary' }}
          >
            Compare how different loan tenures affect your EMI amount and total
            interest paid. Shorter tenures mean higher EMIs but lower total
            interest.
          </Typography>

          {/* EMI Comparison Chart */}
          <Box sx={{ mb: 2, ml: -3, mr: -2, mt: 0, height: 300 }}>
            <AgChartsReact options={emiComparisonChartOptions} />
          </Box>

          {/* Principal vs Interest Stacked Chart */}
          <Box sx={{ mb: -5, ml: -3, mr: -2, mt: 0, height: 350 }}>
            <AgChartsReact options={tenureComparisonChartOptions} />
          </Box>
          <TableContainer component={Paper}>
            <Table size="small" sx={{ minWidth: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tenure</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    EMI Amount
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Total Interest
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Total Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {generateTenureComparisonData().map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: row.isUserTenure
                        ? isDark
                          ? 'rgba(255, 107, 53, 0.1)'
                          : 'rgba(255, 107, 53, 0.05)'
                        : 'inherit',
                      fontWeight: row.isUserTenure ? 'bold' : 'normal'
                    }}
                  >
                    <TableCell>
                      {row.tenureShort}
                      {row.isUserTenure ? ' (Current)' : ''}
                    </TableCell>
                    <TableCell align="right">₹{rupeeFormat(row.emi)}</TableCell>
                    <TableCell align="right">
                      ₹{rupeeFormat(row.totalInterest)}
                    </TableCell>
                    <TableCell align="right">
                      ₹{rupeeFormat(row.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>{' '}
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
              <Table
                size="small"
                sx={{ '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}
              >
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
                    <TableCell style={{ padding: '6px 8px', width: '60px' }}>
                      Rate
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '70px' }}>
                      Tenure
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '90px' }}>
                      EMI
                    </TableCell>
                    <TableCell style={{ padding: '6px 8px', width: '100px' }}>
                      Interest Paid
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
                        <TableCell>₹{rupeeFormat(calc.amount)}</TableCell>
                        <TableCell>{calc.interestRate}%</TableCell>
                        <TableCell>{calc.tenure} mo</TableCell>
                        <TableCell>₹{rupeeFormat(calc.emi)}</TableCell>
                        <TableCell>
                          ₹{rupeeFormat(calc.totalInterest)}
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
                        calc.breakdown && (
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
                                <Table
                                  size="small"
                                  sx={{
                                    minWidth: '100%',
                                    '& .MuiTableCell-root': {
                                      whiteSpace: 'nowrap'
                                    }
                                  }}
                                >
                                  <TableHead>
                                    <TableRow>
                                      <TableCell
                                        style={{
                                          padding: '6px 8px',
                                          width: '40px',
                                          maxWidth: '40px'
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
                                        Principal(₹)
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        style={{
                                          padding: '6px 8px',
                                          width: '120px'
                                        }}
                                      >
                                        Interest(₹)
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        style={{
                                          padding: '6px 8px',
                                          width: '120px'
                                        }}
                                      >
                                        Balance(₹)
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {calc.breakdown.map((row) => (
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
                                            Math.round(row.totalPrincipal)
                                          )}
                                        </TableCell>
                                        <TableCell
                                          align="right"
                                          style={{ padding: '6px 8px' }}
                                        >
                                          {rupeeFormat(
                                            Math.round(row.totalInterest)
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
                                    ))}
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
      <Markdown path="/markdown/emi.md"></Markdown>
    </Box>
  );
};

export default EMICalculator;
