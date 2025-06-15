import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
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
import SIPCalculatorForm from './sip-calculator-form';

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

const SIPCalculator = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [calcState, setCalcState] = useState({
    investmentAmount: 10000, // Default investment amount
    expectedReturnRate: 12, // Default expected return rate
    tenure: 120, // Default tenure in months (10 years)
    frequency: 'monthly', // Default frequency
    // Advanced mode fields
    calculatorMode: 'basic', // 'basic', 'stepup', or 'advanced'
    stepUpPercentage: 0, // Annual SIP increase percentage
    initialInvestment: 0, // One-time initial investment
    inflationRate: 0 // Inflation rate for real returns calculation
  });
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [expandedCalculationIds, setExpandedCalculationIds] = useState([]);
  const [mainAccordionExpanded, setMainAccordionExpanded] = useState(true);
  const [returnRateAccordionExpanded, setReturnRateAccordionExpanded] =
    useState(true);
  const [sipComparisonAccordionExpanded, setSipComparisonAccordionExpanded] =
    useState(true);
  const [calculatedBreakdowns, setCalculatedBreakdowns] = useState({});
  const [hasScrolledToTable, setHasScrolledToTable] = useState(false);

  const referenceTableRef = useRef(null);

  usePageInfo({
    title: 'SIP Calculator',
    description:
      'FinRates SIP Calculator helps you plan your investments with ease. Adjust investment amount, expected return rate, tenure, and frequency to explore wealth growth. Visualize year-by-year breakdowns with interactive charts and table, analyze investment vs returns, track total wealth, and save multiple scenarios for comparison. Make informed investment decisions with our comprehensive SIP analysis tools.'
  });

  useEffect(() => {
    // Load Saved References from localStorage on component mount
    const saved = localStorage.getItem('savedSIPCalculations');
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
  }, []);

  const handleCalcChange = (state) => {
    setCalcState(state);
  }; // Calculate future value using the SIP formula: M = P × ({[1 + i]^n – 1} / i)
  const calculateFutureValue = () => {
    const {
      investmentAmount,
      expectedReturnRate,
      tenure,
      frequency,
      calculatorMode,
      stepUpPercentage,
      initialInvestment
    } = calcState;

    if (!investmentAmount || !expectedReturnRate || !tenure) return 0;

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
    } // Convert yearly interest rate to rate per period (decimal)
    const ratePerPeriod =
      Math.pow(1 + expectedReturnRate / 100, 1 / periodsPerYear) - 1;

    // Basic mode calculation (unchanged from original)
    if (
      calculatorMode === 'basic' ||
      (!stepUpPercentage && calculatorMode !== 'advanced')
    ) {
      const futureValue =
        investmentAmount *
        ((Math.pow(1 + ratePerPeriod, numberOfInvestments) - 1) /
          ratePerPeriod) *
        (1 + ratePerPeriod);

      // Only add initial investment growth in advanced mode
      if (calculatorMode === 'advanced' && initialInvestment) {
        const initialGrowth =
          initialInvestment * Math.pow(1 + ratePerPeriod, numberOfInvestments);
        return isNaN(futureValue) ? 0 : Math.round(futureValue + initialGrowth);
      }

      return isNaN(futureValue) ? 0 : Math.round(futureValue);
    }

    // Step-up and Advanced mode calculation with step-up SIP
    let totalFutureValue = 0;
    const stepUpRate = stepUpPercentage / 100;

    // Calculate year by year for step-up SIP
    const totalYears = Math.ceil(tenure / 12);

    for (let year = 0; year < totalYears; year++) {
      // Calculate SIP amount for this year (step-up applied annually)
      const yearSIPAmount = investmentAmount * Math.pow(1 + stepUpRate, year);

      // Calculate how many periods in this year
      const remainingMonths = tenure - year * 12;
      const periodsInThisYear = Math.min(12, remainingMonths);

      // Convert to actual number of investments based on frequency
      let investmentsInYear;
      switch (frequency) {
        case 'quarterly':
          investmentsInYear = Math.ceil(periodsInThisYear / 3);
          break;
        case 'half-yearly':
          investmentsInYear = Math.ceil(periodsInThisYear / 6);
          break;
        case 'yearly':
          investmentsInYear = periodsInThisYear >= 12 ? 1 : 0;
          break;
        default: // monthly
          investmentsInYear = periodsInThisYear;
      } // For each investment in this year
      for (let investment = 0; investment < investmentsInYear; investment++) {
        // Calculate the actual period index based on frequency
        let periodsSinceStart;
        switch (frequency) {
          case 'quarterly':
            periodsSinceStart = year * 4 + investment;
            break;
          case 'half-yearly':
            periodsSinceStart = year * 2 + investment;
            break;
          case 'yearly':
            periodsSinceStart = year + investment;
            break;
          default: // monthly
            periodsSinceStart = year * 12 + investment;
        }

        const remainingPeriodsForThisInvestment =
          numberOfInvestments - periodsSinceStart;

        if (remainingPeriodsForThisInvestment > 0) {
          const futureValueOfThisInvestment =
            yearSIPAmount *
            Math.pow(1 + ratePerPeriod, remainingPeriodsForThisInvestment);
          totalFutureValue += futureValueOfThisInvestment;
        }
      }
    }

    // Add initial investment growth if present
    const initialGrowth = initialInvestment
      ? initialInvestment * Math.pow(1 + ratePerPeriod, numberOfInvestments)
      : 0;
    return isNaN(totalFutureValue)
      ? 0
      : Math.round(totalFutureValue + initialGrowth);
  };

  const calculateTotalInvestment = () => {
    const {
      investmentAmount,
      tenure,
      frequency,
      calculatorMode,
      stepUpPercentage,
      initialInvestment
    } = calcState;

    if (!investmentAmount || !tenure) return 0;

    // Calculate number of investments based on frequency
    let numberOfInvestments = tenure;
    let periodsPerYear = 12;

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

    // Basic mode calculation (unchanged from original)
    if (
      calculatorMode === 'basic' ||
      (!stepUpPercentage && calculatorMode !== 'advanced')
    ) {
      const totalSIPInvestment = Math.round(
        investmentAmount * numberOfInvestments
      );

      // Only add initial investment in advanced mode
      if (calculatorMode === 'advanced' && initialInvestment) {
        return totalSIPInvestment + initialInvestment;
      }

      return totalSIPInvestment;
    }

    // Step-up and Advanced mode calculation with step-up SIP
    let totalInvestment = 0;
    const stepUpRate = stepUpPercentage / 100;
    const totalYears = Math.ceil(tenure / 12);

    // Calculate total investment year by year
    for (let year = 0; year < totalYears; year++) {
      // Calculate SIP amount for this year (step-up applied annually)
      const yearSIPAmount = investmentAmount * Math.pow(1 + stepUpRate, year);

      // Calculate how many periods in this year
      const remainingMonths = tenure - year * 12;
      const periodsInThisYear = Math.min(12, remainingMonths);

      // Convert to actual number of investments based on frequency
      let investmentsInYear;
      switch (frequency) {
        case 'quarterly':
          investmentsInYear = Math.ceil(periodsInThisYear / 3);
          break;
        case 'half-yearly':
          investmentsInYear = Math.ceil(periodsInThisYear / 6);
          break;
        case 'yearly':
          investmentsInYear = periodsInThisYear >= 12 ? 1 : 0;
          break;
        default: // monthly
          investmentsInYear = periodsInThisYear;
      }

      totalInvestment += yearSIPAmount * investmentsInYear;
    }

    // Add initial investment
    const totalInitialInvestment = initialInvestment || 0;
    return Math.round(totalInvestment + totalInitialInvestment);
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
  }; // Calculate year-by-year SIP breakdown
  const calculateYearlySIPBreakdown = () => {
    const { investmentAmount, expectedReturnRate, tenure, frequency } =
      calcState;
    if (!investmentAmount || !expectedReturnRate || !tenure) return [];

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
        runningInvestment += investmentAmount;

        // Calculate interest for this period
        const interestForPeriod = runningValue * ratePerPeriod;

        // Add this period's investment and interest to running value
        runningValue += investmentAmount + interestForPeriod;

        monthlyBreakdown.push({
          month,
          investment: investmentAmount,
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

      // For the last month, ensure it exactly matches the value from calculateFutureValue
      // to avoid any rounding discrepancies
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

      // Calculate absolute returns for this year
      const absoluteReturn =
        lastMonthInYear.totalInvestment > 0
          ? ((lastMonthInYear.totalValue - lastMonthInYear.totalInvestment) /
              lastMonthInYear.totalInvestment) *
            100
          : 0;

      const yearData = {
        year: year + 1,
        investmentInYear: monthsInYear.length * investmentAmount,
        interestInYear: monthsInYear.reduce((sum, m) => sum + m.interest, 0),
        totalInvestment: lastMonthInYear.totalInvestment,
        totalValue: Math.round(lastMonthInYear.totalValue),
        absoluteReturn: absoluteReturn
      };

      yearlyBreakdown.push(yearData);
    }

    return yearlyBreakdown;
  }; // Calculate breakdown for a saved calculation
  const calculateBreakdownForSavedCalc = (calculation) => {
    const {
      investmentAmount,
      expectedReturnRate,
      tenure,
      futureValue,
      frequency = 'monthly'
    } = calculation;
    if (!investmentAmount || !expectedReturnRate || !tenure) return [];

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
        runningInvestment += investmentAmount;

        // Calculate interest for this period
        const interestForPeriod = runningValue * ratePerPeriod;

        // Add this period's investment and interest to running value
        runningValue += investmentAmount + interestForPeriod;

        monthlyBreakdown.push({
          month,
          investment: investmentAmount,
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

      // For the last month, ensure it exactly matches the stored future value
      // to avoid any rounding discrepancies
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

      // Calculate absolute returns for this year
      const absoluteReturn =
        lastMonthInYear.totalInvestment > 0
          ? ((lastMonthInYear.totalValue - lastMonthInYear.totalInvestment) /
              lastMonthInYear.totalInvestment) *
            100
          : 0;

      const yearData = {
        year: year + 1,
        investmentInYear: monthsInYear.length * investmentAmount,
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
    const newCalculation = {
      id: Date.now(), // Use timestamp as unique ID
      investmentAmount: calcState.investmentAmount,
      expectedReturnRate: calcState.expectedReturnRate,
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
      'savedSIPCalculations',
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
      'savedSIPCalculations',
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
  // Generate chart data for SIP breakdown visualization
  const generateChartData = () => {
    const yearlyBreakdown = calculateYearlySIPBreakdown();
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
  // Configuration options for the SIP chart
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
        yName: 'Estimated Returns',
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

  // Generate data for Return Rate Comparison chart
  const generateReturnRateComparisonData = () => {
    const { tenure, frequency } = calcState;
    const baseAmount = calcState.investmentAmount;
    const currentReturnRate = calcState.expectedReturnRate;
    if (!baseAmount || !currentReturnRate || !tenure) return [];

    // Create return rates array including user's current rate
    const baseReturnRates = [6, 8, 10, 12, 14, 16];
    const returnRatesSet = new Set([...baseReturnRates, currentReturnRate]);
    const returnRates = Array.from(returnRatesSet).sort((a, b) => a - b);

    const comparisonData = [];

    returnRates.forEach((returnRate) => {
      // Calculate number of investments based on frequency
      let numberOfInvestments = tenure;
      let periodsPerYear = 12;

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
        default:
          periodsPerYear = 12;
          numberOfInvestments = tenure;
      }

      const ratePerPeriod =
        Math.pow(1 + returnRate / 100, 1 / periodsPerYear) - 1;

      const futureValue =
        baseAmount *
        ((Math.pow(1 + ratePerPeriod, numberOfInvestments) - 1) /
          ratePerPeriod) *
        (1 + ratePerPeriod);

      const totalInvestment = baseAmount * numberOfInvestments;
      const returns = futureValue - totalInvestment;

      comparisonData.push({
        returnRate: `${returnRate}%`,
        returnRateValue: returnRate,
        totalInvestment: Math.round(totalInvestment),
        returns: Math.round(returns),
        finalAmount: Math.round(futureValue),
        color:
          returnRate === currentReturnRate
            ? '#3f51b5' // Current rate in primary blue
            : returnRate < currentReturnRate
              ? '#f44336' // Lower rates in red
              : '#4caf50' // Higher rates in green
      });
    });

    return comparisonData;
  };

  // Configuration options for the Return Rate Comparison chart
  const returnRateComparisonChartOptions = {
    data: generateReturnRateComparisonData(),
    theme: isDark ? 'ag-material-dark' : 'ag-material',
    series: [
      {
        type: 'bar',
        xKey: 'returnRate',
        yKey: 'finalAmount',
        yName: 'Final Amount',
        // Use a function to set color: highlight current in blue, others in a lighter blue
        fill: '#1976d2',
        tooltip: {
          renderer: function ({ datum }) {
            const totalInvestment =
              datum.totalInvestment.toLocaleString('en-IN');
            const returns = datum.returns.toLocaleString('en-IN');
            const finalAmount = datum.finalAmount.toLocaleString('en-IN');

            return {
              content: `
                <b>Return Rate:</b> ${datum.returnRate}<br>
                <b>Total Investment:</b> ₹${totalInvestment}<br>
                <b>Returns:</b> ₹${returns}<br>
                <b>Final Amount:</b> ₹${finalAmount}
              `,
              title: `Expected Return: ${datum.returnRate}`,
              titleFontWeight: 'bold'
            };
          }
        },
        label: {
          formatter: (params) => {
            const amount = params.datum.finalAmount;
            // Format in lakhs and crores
            if (amount >= 10000000) {
              return `₹${(amount / 10000000).toFixed(1)}Cr`;
            } else if (amount >= 100000) {
              return `₹${(amount / 100000).toFixed(1)}L`;
            } else {
              return `₹${Math.round(amount / 1000)}K`;
            }
          },
          placement: 'outside-end',
          color: '#000080',
          fontWeight: 'bold'
        }
      }
    ],
    legend: { enabled: false },
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'Expected Return Rate', fontWeight: 'bold' }
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Final Amount (₹)', fontWeight: 'bold' },
        label: {
          formatter: ({ value }) => {
            if (value >= 10000000) {
              return `₹${(value / 10000000).toFixed(1)}Cr`;
            } else if (value >= 100000) {
              return `₹${(value / 100000).toFixed(1)}L`;
            } else {
              return `₹${Math.round(value / 1000)}K`;
            }
          }
        }
      }
    ]
  };

  // Generate data for SIP Amount Comparison chart
  const generateSIPAmountComparisonData = () => {
    const { expectedReturnRate, tenure, frequency } = calcState;
    const baseAmount = calcState.investmentAmount;

    if (!baseAmount || !expectedReturnRate || !tenure) return [];

    const multipliers = [0.5, 0.75, 1.0, 1.25, 1.5];
    const comparisonData = [];

    multipliers.forEach((multiplier) => {
      const sipAmount = baseAmount * multiplier;

      // Calculate number of investments based on frequency
      let numberOfInvestments = tenure;
      let periodsPerYear = 12;

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
        default:
          periodsPerYear = 12;
          numberOfInvestments = tenure;
      }

      const ratePerPeriod =
        Math.pow(1 + expectedReturnRate / 100, 1 / periodsPerYear) - 1;

      const futureValue =
        sipAmount *
        ((Math.pow(1 + ratePerPeriod, numberOfInvestments) - 1) /
          ratePerPeriod) *
        (1 + ratePerPeriod);

      const totalInvestment = sipAmount * numberOfInvestments;
      const returns = futureValue - totalInvestment;
      comparisonData.push({
        sipAmount: `₹${rupeeFormat(sipAmount)}`,
        sipAmountShort:
          sipAmount >= 100000
            ? `₹${(sipAmount / 100000).toFixed(1)}L`
            : sipAmount >= 1000
              ? `₹${(sipAmount / 1000).toFixed(0)}K`
              : `₹${sipAmount}`,
        percentage: `${Math.round(multiplier * 100)}%`,
        totalInvestment: Math.round(totalInvestment),
        returns: Math.round(returns),
        finalAmount: Math.round(futureValue),
        color:
          multiplier === 1.0
            ? '#3f51b5' // Current amount in primary blue
            : multiplier < 1.0
              ? '#3f51b5' // Lower amounts in red
              : '#3f51b5' // Higher amounts in green
      });
    });

    return comparisonData;
  };
  // Configuration options for the SIP Amount Comparison chart
  const sipAmountComparisonChartOptions = {
    data: generateSIPAmountComparisonData(),
    theme: isDark ? 'ag-material-dark' : 'ag-material',
    series: [
      {
        type: 'bar',
        xKey: 'sipAmountShort',
        yKey: 'finalAmount',
        yName: 'Final Amount',
        fill: '#3f51b5',
        tooltip: {
          renderer: function ({ datum }) {
            const totalInvestment =
              datum.totalInvestment.toLocaleString('en-IN');
            const returns = datum.returns.toLocaleString('en-IN');
            const finalAmount = datum.finalAmount.toLocaleString('en-IN');

            return {
              content: `
                <b>SIP Amount:</b> ${datum.sipAmount}<br>
                <b>Total Investment:</b> ₹${totalInvestment}<br>
                <b>Returns:</b> ₹${returns}<br>
                <b>Final Amount:</b> ₹${finalAmount}
              `,
              title: `${datum.percentage} of Current SIP`,
              titleFontWeight: 'bold'
            };
          }
        },
        label: {
          formatter: (params) => {
            const amount = params.datum.finalAmount;
            // Format in lakhs and crores
            if (amount >= 10000000) {
              return `₹${(amount / 10000000).toFixed(1)}Cr`;
            } else if (amount >= 100000) {
              return `₹${(amount / 100000).toFixed(1)}L`;
            } else {
              return `₹${Math.round(amount / 1000)}K`;
            }
          },
          placement: 'outside-end',
          color: '#000080',
          fontWeight: 'bold'
        }
      }
    ],
    legend: { enabled: false },
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'SIP Amount', fontWeight: 'bold' }
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Final Amount (₹)', fontWeight: 'bold' },
        label: {
          formatter: ({ value }) => {
            if (value >= 10000000) {
              return `₹${(value / 10000000).toFixed(1)}Cr`;
            } else if (value >= 100000) {
              return `₹${(value / 100000).toFixed(1)}L`;
            } else {
              return `₹${Math.round(value / 1000)}K`;
            }
          }
        }
      }
    ]
  };
  const calculateRealReturns = () => {
    const { calculatorMode, inflationRate, expectedReturnRate, tenure } =
      calcState;

    // Only calculate real returns in advanced mode with inflation rate
    if (calculatorMode !== 'advanced' || !inflationRate) {
      return {
        realWealthGained: calculateWealthGained(),
        realTotalWealth: calculateTotalWealth(),
        effectiveReturnRate: expectedReturnRate
      };
    }

    // Calculate real return rate for reference
    const realReturnRate =
      ((1 + expectedReturnRate / 100) / (1 + inflationRate / 100) - 1) * 100;

    // Get nominal values first
    const nominalTotalWealth = calculateTotalWealth();
    const totalInvestment = calculateTotalInvestment();

    // Calculate inflation factor for the entire period
    const years = tenure / 12;
    const inflationFactor = Math.pow(1 + inflationRate / 100, years);

    // Adjust nominal wealth for purchasing power
    const realTotalWealth = nominalTotalWealth / inflationFactor;
    const realWealthGained = realTotalWealth - totalInvestment;

    // Calculate actual effective annual return rate in real terms
    const actualEffectiveRate =
      years > 0
        ? (Math.pow(realTotalWealth / totalInvestment, 1 / years) - 1) * 100
        : 0;

    return {
      realWealthGained: Math.round(realWealthGained),
      realTotalWealth: Math.round(realTotalWealth),
      effectiveReturnRate: Number(actualEffectiveRate.toFixed(2))
    };
  }; // Calculate standard SIP results (without step-up or initial investment)
  const calculateStandardSIPResults = () => {
    const { investmentAmount, expectedReturnRate, tenure, frequency } =
      calcState;

    if (!investmentAmount || !expectedReturnRate || !tenure) {
      return {
        totalInvestment: 0,
        returns: 0,
        finalAmount: 0
      };
    }

    // Calculate using the EXACT SAME logic as the main calculator
    let numberOfInvestments = tenure;
    let periodsPerYear = 12;

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
      default:
        periodsPerYear = 12;
        numberOfInvestments = tenure;
    }

    // Use the SAME rate calculation as main calculator
    const ratePerPeriod =
      Math.pow(1 + expectedReturnRate / 100, 1 / periodsPerYear) - 1;

    // Standard SIP formula (same as used in main calculation for basic mode)
    const futureValue =
      investmentAmount *
      ((Math.pow(1 + ratePerPeriod, numberOfInvestments) - 1) / ratePerPeriod) *
      (1 + ratePerPeriod);

    const totalInvestment = investmentAmount * numberOfInvestments;
    const returns = futureValue - totalInvestment;

    return {
      totalInvestment: Math.round(totalInvestment),
      returns: Math.round(returns),
      finalAmount: Math.round(futureValue)
    };
  };

  // Calculate the benefit of advanced features
  const calculateAdvancedBenefit = () => {
    const standardResults = calculateStandardSIPResults();
    const advancedResults = {
      totalInvestment: calculateTotalInvestment(),
      returns: calculateWealthGained(),
      finalAmount: calculateTotalWealth()
    };

    const additionalReturns =
      advancedResults.finalAmount - standardResults.finalAmount;
    const percentageIncrease =
      standardResults.finalAmount > 0
        ? (additionalReturns / standardResults.finalAmount) * 100
        : 0;
    return {
      additionalReturns: Math.round(additionalReturns),
      percentageIncrease: Number(percentageIncrease.toFixed(1))
    };
  };

  // Calculate the benefit of step-up features
  const calculateStepUpBenefit = () => {
    const standardResults = calculateStandardSIPResults();

    // Temporarily set mode to stepup to get step-up results
    const originalMode = calcState.calculatorMode;
    const stepUpResults = {
      totalInvestment: calculateTotalInvestment(),
      returns: calculateWealthGained(),
      finalAmount: calculateTotalWealth()
    };

    const additionalReturns =
      stepUpResults.finalAmount - standardResults.finalAmount;
    const percentageIncrease =
      standardResults.finalAmount > 0
        ? (additionalReturns / standardResults.finalAmount) * 100
        : 0;

    return {
      additionalReturns: Math.round(additionalReturns),
      percentageIncrease: Number(percentageIncrease.toFixed(1))
    };
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
          SIP Calculator
        </Typography>{' '}
        <SIPCalculatorForm onChange={handleCalcChange} />{' '}
        {/* Enhanced Results Summary */}
        <Box sx={{ mt: 2, mb: 2 }}>
          {calcState.calculatorMode === 'stepup' &&
          calcState.stepUpPercentage > 0 ? (
            /* Comparative Results for Step-up Mode */
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ mb: 2, color: 'primary.main' }}
              >
                Comparison Summary
              </Typography>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}
              >
                {/* Standard SIP Card */}
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
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
                    >
                      Standard SIP
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          Total Investment:
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          ₹
                          {rupeeFormat(
                            calculateStandardSIPResults().totalInvestment
                          )}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Returns Earned:</Typography>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="success.main"
                        >
                          ₹{rupeeFormat(calculateStandardSIPResults().returns)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Final Amount:</Typography>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="primary.main"
                        >
                          ₹
                          {rupeeFormat(
                            calculateStandardSIPResults().finalAmount
                          )}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Total Return %:</Typography>
                        <Typography variant="body2" fontWeight="600">
                          {calculateStandardSIPResults().totalInvestment > 0
                            ? (
                                (calculateStandardSIPResults().returns /
                                  calculateStandardSIPResults()
                                    .totalInvestment) *
                                100
                              ).toFixed(2)
                            : '0'}
                          %
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Step-up SIP Card */}
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
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: 'text.primary' }}
                      >
                        Step-up SIP
                      </Typography>
                      <Chip
                        label={`+${calculateStepUpBenefit().percentageIncrease}% more`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Stack>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          Total Investment:
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          ₹{rupeeFormat(calculateTotalInvestment())}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Returns Earned:</Typography>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="success.main"
                        >
                          ₹{rupeeFormat(calculateWealthGained())}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Final Amount:</Typography>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="primary.main"
                        >
                          ₹{rupeeFormat(calculateTotalWealth())}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Total Return %:</Typography>
                        <Typography variant="body2" fontWeight="600">
                          {calculateAbsoluteReturns()}%
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          mt: 1,
                          pt: 1,
                          borderTop: `1px solid ${theme.palette.divider}`
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Additional Benefit:
                          </Typography>
                          <Typography
                            variant="caption"
                            fontWeight="600"
                            color="success.main"
                          >
                            ₹
                            {rupeeFormat(
                              calculateStepUpBenefit().additionalReturns
                            )}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          ) : calcState.calculatorMode === 'advanced' &&
            (calcState.stepUpPercentage > 0 ||
              calcState.initialInvestment > 0) ? (
            /* Comparative Results for Advanced Mode */
            <Box>
              {' '}
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{ mb: 2, color: 'primary.main' }}
              >
                Comparison Summary
              </Typography>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}
              >
                {/* Standard SIP Card - Full Width */}
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
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}
                    >
                      Standard SIP
                    </Typography>{' '}
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          Total Investment:
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          ₹
                          {rupeeFormat(
                            calculateStandardSIPResults().totalInvestment
                          )}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Returns Earned:</Typography>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="success.main"
                        >
                          ₹{rupeeFormat(calculateStandardSIPResults().returns)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Final Amount:</Typography>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="primary.main"
                        >
                          ₹
                          {rupeeFormat(
                            calculateStandardSIPResults().finalAmount
                          )}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Total Return %:</Typography>
                        <Typography variant="body2" fontWeight="600">
                          {calculateStandardSIPResults().totalInvestment > 0
                            ? (
                                (calculateStandardSIPResults().returns /
                                  calculateStandardSIPResults()
                                    .totalInvestment) *
                                100
                              ).toFixed(2)
                            : '0'}
                          %
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Advanced SIP Card - Full Width */}
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
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: 'text.primary' }}
                      >
                        Advanced SIP
                      </Typography>
                      <Chip
                        label={`+${calculateAdvancedBenefit().percentageIncrease}% more`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Stack>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          Total Investment:
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          ₹{rupeeFormat(calculateTotalInvestment())}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Returns Earned:</Typography>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="success.main"
                        >
                          ₹{rupeeFormat(calculateWealthGained())}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Final Amount:</Typography>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="primary.main"
                        >
                          ₹{rupeeFormat(calculateTotalWealth())}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Total Return %:</Typography>
                        <Typography variant="body2" fontWeight="600">
                          {calculateAbsoluteReturns()}%
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          mt: 1,
                          pt: 1,
                          borderTop: `1px solid ${theme.palette.divider}`
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Additional Benefit:
                          </Typography>
                          <Typography
                            variant="caption"
                            fontWeight="600"
                            color="success.main"
                          >
                            ₹
                            {rupeeFormat(
                              calculateAdvancedBenefit().additionalReturns
                            )}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          ) : (
            /* Standard Results - Single Mode */
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 0 }}
              >
                <Typography variant="body2">Total Investment:</Typography>
                <Typography variant="body1">
                  ₹{rupeeFormat(calculateTotalInvestment())}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 1 }}
              >
                <Typography variant="body2">Returns Earned:</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="success.main"
                >
                  ₹{rupeeFormat(calculateWealthGained())}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 1 }}
              >
                <Typography variant="body2">Final Amount:</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="primary.main"
                >
                  ₹{rupeeFormat(calculateTotalWealth())}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 1 }}
              >
                <Typography variant="body2">Total Return %:</Typography>
                <Typography variant="body1">
                  {calculateAbsoluteReturns()}%
                </Typography>
              </Stack>
            </Box>
          )}{' '}
          {/* Advanced Mode - Additional Details */}
          {calcState.calculatorMode === 'advanced' && (
            <Box sx={{ mt: 2 }}>
              {/* Inflation-Adjusted Returns */}
              {calcState.inflationRate > 0 && (
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: 'background.default',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Inflation-Adjusted Returns:
                  </Typography>{' '}
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ pl: 1 }}
                      >
                        Returns Earned:
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ₹{rupeeFormat(calculateRealReturns().realWealthGained)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ pl: 1 }}
                      >
                        Final Amount:
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ₹{rupeeFormat(calculateRealReturns().realTotalWealth)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ pl: 1 }}
                      >
                        Total Return %:
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(() => {
                          const realReturns = calculateRealReturns();
                          const totalInvestment = calculateTotalInvestment();
                          return totalInvestment > 0
                            ? (
                                (realReturns.realWealthGained /
                                  totalInvestment) *
                                100
                              ).toFixed(2)
                            : '0';
                        })()}
                        %
                      </Typography>
                    </Stack>

                    {/* <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ pl: 1 }}
                      >
                        Effective Return Rate:
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {calculateRealReturns().effectiveReturnRate}% (after{' '}
                        {calcState.inflationRate}% inflation)
                      </Typography>
                    </Stack> */}
                  </Stack>
                </Box>
              )}
            </Box>
          )}{' '}
        </Box>{' '}
        {calcState.calculatorMode !== 'basic' && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <AlertTitle>Features Coming Soon</AlertTitle>
              <Typography variant="body2">
                Features like Save & Compare scenarios and detailed SIP
                breakdown by year are currently available only in Standard mode.
                These features will be coming soon to Step-up and Advanced mode.
              </Typography>
            </Alert>
          </Box>
        )}
        {calcState.calculatorMode === 'basic' && (
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
        )}
      </Box>
      <Box sx={{ mt: 3, mb: 0 }}>
        {calcState.calculatorMode === 'basic' && (
          <>
            <Accordion
              sx={{ mt: 3, mb: 0 }}
              TransitionProps={{ unmountOnExit: false }}
              expanded={mainAccordionExpanded}
              onChange={() => setMainAccordionExpanded(!mainAccordionExpanded)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="sip-breakdown-content"
                id="sip-breakdown-header"
              >
                <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  SIP Breakdown by Year
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
                      {calculateYearlySIPBreakdown().map((row) => (
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
                            {rupeeFormat(Math.round(row.totalInvestment))}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ padding: '6px 8px' }}
                          >
                            {rupeeFormat(Math.round(row.interestInYear))}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ padding: '6px 8px' }}
                          >
                            {rupeeFormat(Math.round(row.totalValue))}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ padding: '6px 8px' }}
                          >
                            {row.absoluteReturn.toFixed(2)}%
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
              expanded={returnRateAccordionExpanded}
              onChange={() =>
                setReturnRateAccordionExpanded(!returnRateAccordionExpanded)
              }
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="return-rate-comparison-content"
                id="return-rate-comparison-header"
              >
                <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Return Rate Sensitivity Analysis
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 0, ml: -3, mr: -2, mt: -3, height: 350 }}>
                  <AgChartsReact options={returnRateComparisonChartOptions} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    mt: -6,
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  Compare how different expected return rates (6%, 8%, 10%, 12%,
                  14%, 16%) including yours affect your final corpus.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{ mt: 2, mb: 0 }}
              TransitionProps={{ unmountOnExit: false }}
              expanded={sipComparisonAccordionExpanded}
              onChange={() =>
                setSipComparisonAccordionExpanded(
                  !sipComparisonAccordionExpanded
                )
              }
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="sip-comparison-content"
                id="sip-comparison-header"
              >
                <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  SIP Amount Comparison
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 0, ml: -3, mr: -2, mt: -3, height: 350 }}>
                  <AgChartsReact options={sipAmountComparisonChartOptions} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    mt: -6,
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  Compare how different SIP amounts (50%, 75%, 100%, 125%, 150%
                  of current) affect your final corpus. The current SIP amount
                  is in the center.
                </Typography>
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
                  <Typography
                    variant="h6"
                    sx={{ mt: 1, mb: 2 }}
                    color="primary"
                  >
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
                          <TableCell
                            style={{ padding: '6px 8px', width: '100px' }}
                          >
                            Investment
                          </TableCell>
                          <TableCell
                            style={{ padding: '6px 8px', width: '60px' }}
                          >
                            Return
                          </TableCell>
                          <TableCell
                            style={{ padding: '6px 8px', width: '70px' }}
                          >
                            Frequency
                          </TableCell>
                          <TableCell
                            style={{ padding: '6px 8px', width: '70px' }}
                          >
                            Duration
                          </TableCell>
                          <TableCell
                            style={{ padding: '6px 8px', width: '100px' }}
                          >
                            Final Amount
                          </TableCell>
                          <TableCell
                            style={{ padding: '6px 8px', width: '100px' }}
                          >
                            Wealth Gain
                          </TableCell>
                          <TableCell
                            style={{ padding: '6px 8px', width: '70px' }}
                          >
                            TotalPercent
                          </TableCell>
                          <TableCell
                            style={{ padding: '6px 8px', width: '80px' }}
                          >
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
                                        transform:
                                          expandedCalculationIds.includes(
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
                              <TableCell>{calc.expectedReturnRate}%</TableCell>
                              <TableCell>
                                {getInvestmentPeriodText(
                                  calc.frequency || 'monthly'
                                )}
                              </TableCell>
                              <TableCell>
                                {formatDuration(calc.tenure)}
                              </TableCell>
                              <TableCell>
                                ₹{rupeeFormat(calc.futureValue)}
                              </TableCell>
                              <TableCell>
                                ₹{rupeeFormat(calc.wealthGained)}
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
                                      <Table
                                        size="small"
                                        sx={{ minWidth: '100%' }}
                                      >
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
                                                    Math.round(
                                                      row.totalInvestment
                                                    )
                                                  )}
                                                </TableCell>
                                                <TableCell
                                                  align="right"
                                                  style={{ padding: '6px 8px' }}
                                                >
                                                  {rupeeFormat(
                                                    Math.round(
                                                      row.interestInYear
                                                    )
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
                                                  {row.absoluteReturn.toFixed(
                                                    2
                                                  )}
                                                  %
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
          </>
        )}
      </Box>

      <Markdown path="/markdown/sip.md"></Markdown>
    </Box>
  );
};

export default SIPCalculator;
