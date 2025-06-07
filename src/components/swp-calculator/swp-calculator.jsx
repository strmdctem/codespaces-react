import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
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
  const [hasScrolledToTable, setHasScrolledToTable] = useState(false);

  const referenceTableRef = useRef(null);

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
  }; // Calculate total withdrawals based on frequency and tenure
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
  }; // Calculate when the corpus will be exhausted (within selected duration)
  const calculateExhaustionPeriod = () => {
    const {
      initialInvestment,
      withdrawalAmount,
      expectedReturnRate,
      frequency,
      tenure
    } = calcState;

    if (
      !initialInvestment ||
      !withdrawalAmount ||
      !expectedReturnRate ||
      !tenure
    )
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

    // Month-by-month calculation until exhaustion or selected duration ends
    while (currentBalance > 0 && month < tenure) {
      month++;

      // Apply monthly growth
      currentBalance = currentBalance * (1 + monthlyRate);

      // Withdraw on appropriate intervals
      const shouldWithdraw = month % intervalMonths === 0;
      if (shouldWithdraw && currentBalance > 0) {
        const actualWithdrawal = Math.min(withdrawalAmount, currentBalance);
        currentBalance = Math.max(0, currentBalance - actualWithdrawal);
      }

      // Check if exhausted within the selected duration
      if (currentBalance <= 0) {
        return month;
      }
    }
    return null; // Not exhausted within selected duration
  }; // Calculate year-by-year SWP breakdown
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
      // Apply monthly growth first (only if balance is positive)
      const growthForMonth =
        currentBalance > 0 ? currentBalance * monthlyRate : 0;
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

      // Continue for full tenure even after balance reaches zero
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

      if (monthsInYear.length === 0) continue; // Continue to next year even if no months

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

      // Continue for full tenure even after balance reaches zero
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

    const monthlyBreakdown = []; // Calculate month-by-month breakdown
    for (let month = 1; month <= tenure; month++) {
      // Apply monthly growth first (only if balance is positive)
      const growthForMonth =
        currentBalance > 0 ? currentBalance * monthlyRate : 0;
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

      // Continue for full tenure even after balance reaches zero
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

      if (monthsInYear.length === 0) continue; // Continue to next year even if no months

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

      yearlyBreakdown.push(yearData); // Continue for full tenure even after balance reaches zero
    }

    return yearlyBreakdown;
  };

  // Calculate actual withdrawals made (based on year-by-year breakdown)
  const calculateActualWithdrawalsMade = () => {
    const breakdown = calculateYearlySWPBreakdown();
    return breakdown.reduce((sum, row) => sum + row.withdrawalInYear, 0);
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
  }; // Generate chart data for withdrawal visualization
  const generateWithdrawalChartData = () => {
    const yearlyBreakdown = calculateYearlySWPBreakdown();
    const exhaustionPeriod = calculateExhaustionPeriod();
    const exhaustionYear = exhaustionPeriod
      ? Math.ceil(exhaustionPeriod / 12)
      : null;

    let cumulativeWithdrawals = 0;
    let cumulativeRequired = 0;

    return yearlyBreakdown.map((row, index) => {
      cumulativeWithdrawals += row.withdrawalInYear;

      // Calculate required withdrawals up to this year
      const { withdrawalAmount, frequency } = calcState;
      let withdrawalsPerYear = 12; // Default monthly

      switch (frequency) {
        case 'quarterly':
          withdrawalsPerYear = 4;
          break;
        case 'half-yearly':
          withdrawalsPerYear = 2;
          break;
        case 'yearly':
          withdrawalsPerYear = 1;
          break;
        default: // monthly
          withdrawalsPerYear = 12;
      }

      cumulativeRequired += withdrawalAmount * withdrawalsPerYear;

      const isExhaustionYear = exhaustionYear && row.year === exhaustionYear;
      const isLastYear = index === yearlyBreakdown.length - 1;

      return {
        year: `Year ${row.year}`,
        annualWithdrawals: row.withdrawalInYear,
        cumulativeWithdrawals: cumulativeWithdrawals,
        totalRequired: cumulativeRequired,
        remainingBalance: row.remainingBalance,
        isExhaustionYear: isExhaustionYear,
        isLast: isLastYear,
        exhaustionYear: exhaustionYear
      };
    });
  };
  const chartOptions = {
    data: generateChartData(),
    theme: isDark ? 'ag-material-dark' : 'ag-material',
    title: {
      text: 'SWP Withdrawal vs Remaining Balance'
    },
    subtitle: {
      text: 'Year-by-Year Balance Depletion'
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
          placement: 'outside-end',
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
  const withdrawalChartOptions = {
    data: generateWithdrawalChartData(),
    theme: isDark ? 'ag-material-dark' : 'ag-material',
    title: {
      text: 'Annual & Cumulative Withdrawals vs Required'
    },
    subtitle: {
      text: 'Withdrawal Pattern & Corpus Depletion Analysis'
    },
    series: [
      {
        type: 'column',
        xKey: 'year',
        yKey: 'annualWithdrawals',
        yName: 'Annual Withdrawals',
        fill: '#4caf50',
        tooltip: {
          renderer: function ({ datum }) {
            const annual = Math.round(datum.annualWithdrawals).toLocaleString(
              'en-IN'
            );
            const cumulative = Math.round(
              datum.cumulativeWithdrawals
            ).toLocaleString('en-IN');
            const required = Math.round(datum.totalRequired).toLocaleString(
              'en-IN'
            );
            const remaining = Math.round(datum.remainingBalance).toLocaleString(
              'en-IN'
            );
            let content = `
              <b>Annual Withdrawals:</b> ₹${annual}<br>
              <b>Total Withdrawn:</b> ₹${cumulative}<br>
              <b>Required Till ${datum.year}:</b> ₹${required}<br>
              <b>Remaining Balance:</b> ₹${remaining}
            `;

            if (datum.isExhaustionYear) {
              content += `<br><b style="color: #ff5722;">⚠️ Corpus Depleted!</b>`;
            }

            return {
              content: content,
              title: `${datum.year}`,
              titleFontWeight: 'bold'
            };
          }
        }
      },
      {
        type: 'line',
        xKey: 'year',
        yKey: 'cumulativeWithdrawals',
        yName: 'Total Withdrawn',
        stroke: '#9c27b0',
        strokeWidth: 3,
        marker: {
          fill: '#9c27b0',
          size: 6
        },
        tooltip: {
          renderer: function ({ datum }) {
            const annual = Math.round(datum.annualWithdrawals).toLocaleString(
              'en-IN'
            );
            const cumulative = Math.round(
              datum.cumulativeWithdrawals
            ).toLocaleString('en-IN');
            const required = Math.round(datum.totalRequired).toLocaleString(
              'en-IN'
            );
            let content = `
              <b>Total Withdrawn:</b> ₹${cumulative}<br>
              <b>Annual Withdrawals:</b> ₹${annual}<br>
              <b>Required Till ${datum.year}:</b> ₹${required}
            `;

            if (datum.isExhaustionYear) {
              content += `<br><b style="color: #ff5722;">⚠️ Money Runs Out Here!</b>`;
            }
            return {
              content: content,
              title: `${datum.year}`,
              titleFontWeight: 'bold'
            };
          }
        }
      },
      {
        type: 'line',
        xKey: 'year',
        yKey: 'annualWithdrawals',
        yName: 'Yearly Withdrawals',
        stroke: '#2196f3',
        strokeWidth: 2,
        marker: {
          fill: '#2196f3',
          size: 4
        },
        tooltip: {
          renderer: function ({ datum }) {
            const annual = Math.round(datum.annualWithdrawals).toLocaleString(
              'en-IN'
            );
            const cumulative = Math.round(
              datum.cumulativeWithdrawals
            ).toLocaleString('en-IN');
            const remaining = Math.round(datum.remainingBalance).toLocaleString(
              'en-IN'
            );

            let content = `
              <b>Yearly Withdrawals:</b> ₹${annual}<br>
              <b>Total Withdrawn:</b> ₹${cumulative}<br>
              <b>Remaining Balance:</b> ₹${remaining}
            `;

            if (datum.isExhaustionYear) {
              content += `<br><b style="color: #ff5722;">⚠️ Corpus Depleted!</b>`;
            }

            return {
              content: content,
              title: `${datum.year} - Yearly Line`,
              titleFontWeight: 'bold'
            };
          }
        }
      },
      {
        type: 'line',
        xKey: 'year',
        yKey: 'totalRequired',
        yName: 'Target Withdrawals',
        stroke: '#ff9800',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        marker: {
          enabled: false
        },
        label: {
          formatter: (params) => {
            if (!params.datum.isLast) {
              return '';
            }
            const total = params.datum.totalRequired;

            // Format in lakhs and crores
            if (total >= 10000000) {
              return `Target: ${(total / 10000000).toFixed(2)} cr`;
            } else if (total >= 100000) {
              return `Target: ${(total / 100000).toFixed(2)} lac`;
            } else {
              return `Target: ₹${Math.round(total).toLocaleString('en-IN')}`;
            }
          },
          placement: 'outside-end',
          color: '#ff9800',
          fontWeight: 'bold'
        },
        tooltip: {
          renderer: function ({ datum }) {
            const required = Math.round(datum.totalRequired).toLocaleString(
              'en-IN'
            );
            const cumulative = Math.round(
              datum.cumulativeWithdrawals
            ).toLocaleString('en-IN');

            return {
              content: `
                <b>Required Till ${datum.year}:</b> ₹${required}<br>
                <b>Withdrawn So Far:</b> ₹${cumulative}<br>
                <b>Shortfall:</b> ₹${Math.round(datum.totalRequired - datum.cumulativeWithdrawals).toLocaleString('en-IN')}
              `,
              title: `${datum.year} - Target Line`,
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
  }; // Generate sustainability timeline data for comparing different withdrawal amounts
  const generateSustainabilityTimelineData = () => {
    const { initialInvestment, expectedReturnRate, frequency } = calcState;
    if (!initialInvestment || !expectedReturnRate) return [];

    const currentWithdrawal = calcState.withdrawalAmount || 0;
    const scenarios = [];

    // Test different withdrawal amounts (50% to 150% of current withdrawal)
    const withdrawalMultipliers = [0.5, 0.75, 1.0, 1.25, 1.5];

    withdrawalMultipliers.forEach((multiplier) => {
      const testWithdrawal = currentWithdrawal * multiplier;
      if (testWithdrawal <= 0) return;

      // Calculate sustainability duration for this withdrawal amount
      let currentBalance = initialInvestment;
      const monthlyRate = expectedReturnRate / 100 / 12;
      let month = 1;
      const maxMonths = 1200; // 100 years maximum

      // Determine withdrawal frequency
      let intervalMonths = 1; // Default monthly
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
        default:
          intervalMonths = 1;
      }

      while (currentBalance > 0 && month <= maxMonths) {
        // Apply growth
        const growthForMonth =
          currentBalance > 0 ? currentBalance * monthlyRate : 0;
        currentBalance = currentBalance + growthForMonth;

        // Withdraw on appropriate intervals
        const shouldWithdraw = month % intervalMonths === 0;
        if (shouldWithdraw && currentBalance > 0) {
          const withdrawalForMonth = Math.min(testWithdrawal, currentBalance);
          currentBalance = Math.max(0, currentBalance - withdrawalForMonth);
        }

        if (currentBalance <= 0) break;
        month++;
      }

      const sustainabilityYears = Math.floor(month / 12);
      let status, color;

      if (month > maxMonths) {
        status = 'Sustainable (50+ years)';
        color = '#4caf50'; // Green
      } else if (sustainabilityYears >= 30) {
        status = `Sustainable (${sustainabilityYears} years)`;
        color = '#4caf50'; // Green
      } else if (sustainabilityYears >= 15) {
        status = `Moderate (${sustainabilityYears} years)`;
        color = '#ff9800'; // Orange
      } else {
        status = `Limited (${sustainabilityYears} years)`;
        color = '#f44336'; // Red
      }

      // Special color for current withdrawal scenario
      if (multiplier === 1.0) {
        color = '#ff9800'; // Orange for current scenario
      }

      scenarios.push({
        withdrawalAmount: Math.round(testWithdrawal),
        withdrawalLabel: `₹${Math.round(testWithdrawal).toLocaleString('en-IN')}`,
        multiplier: multiplier,
        sustainabilityYears: sustainabilityYears,
        sustainabilityMonths: month,
        status: status,
        color: color,
        isCurrent: multiplier === 1.0
      });
    });

    return scenarios.sort((a, b) => a.withdrawalAmount - b.withdrawalAmount);
  };
  // Configuration options for the sustainability timeline chart
  const sustainabilityChartOptions = {
    data: generateSustainabilityTimelineData(),
    theme: isDark ? 'ag-material-dark' : 'ag-material',
    title: {
      text: 'Corpus Sustainability Timeline',
      fontSize: 16,
      fontWeight: 'bold'
    },
    subtitle: {
      text: 'How Different Withdrawal Amounts Affect Corpus Longevity',
      fontSize: 12
    },
    series: [
      {
        type: 'bar',
        direction: 'horizontal',
        xKey: 'withdrawalLabel',
        yKey: 'sustainabilityYears',
        yName: 'Sustainability (Years)',
        fill: function (params) {
          // Use the color from the data
          return params.datum.color;
        },
        tooltip: {
          renderer: function ({ datum }) {
            const multiplierText =
              datum.multiplier === 1.0
                ? ' (Current)'
                : datum.multiplier < 1.0
                  ? ' (Lower)'
                  : ' (Higher)';

            return {
              content: `
                <b>Withdrawal Amount:</b> ${datum.withdrawalLabel}${multiplierText}<br>
                <b>Sustainability:</b> ${datum.status}<br>
                <b>Duration:</b> ${datum.sustainabilityYears} years
              `,
              title: `Withdrawal Scenario ${(datum.multiplier * 100).toFixed(0)}%`,
              titleFontWeight: 'bold'
            };
          }
        },
        label: {
          formatter: (params) => {
            if (params.datum.sustainabilityYears >= 50) {
              return '50+ years';
            }
            return `${params.datum.sustainabilityYears}y`;
          },
          placement: 'outside-end',
          fontWeight: 'bold',
          fontSize: 11
        }
      }
    ],
    axes: [
      {
        type: 'category',
        position: 'left',
        label: {
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      {
        type: 'number',
        position: 'bottom',
        label: {
          formatter: ({ value }) => {
            if (value >= 50) {
              return '50+';
            }
            return `${value}y`;
          },
          fontSize: 11
        },
        title: {
          text: 'Sustainability Duration (Years)',
          fontSize: 12
        }
      }
    ],
    legend: {
      enabled: false
    }
  };
  // Calculate maximum sustainability duration (how long corpus can last with current withdrawals)
  const calculateMaxSustainabilityDuration = () => {
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

    // Calculate annual withdrawal rate vs annual growth rate
    const annualWithdrawals = withdrawalAmount * (12 / intervalMonths);
    const annualGrowthRate = expectedReturnRate / 100;
    const sustainabilityRatio =
      annualWithdrawals / initialInvestment / annualGrowthRate;

    // If sustainability ratio <= 1, it's truly sustainable (growth >= withdrawals)
    if (sustainabilityRatio <= 1) {
      return 'infinite'; // Truly sustainable
    }

    // Otherwise calculate actual exhaustion period
    let currentBalance = initialInvestment;
    let month = 0;
    const maxMonths = 1200; // Max 100 years to check

    // Month-by-month calculation until exhaustion
    while (currentBalance > 0 && month < maxMonths) {
      month++;

      // Apply monthly growth
      currentBalance = currentBalance * (1 + monthlyRate);

      // Withdraw on appropriate intervals
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

    // If we reach here without exhaustion, it means very long sustainability
    return maxMonths;
  };

  // Calculate total withdrawals required based on frequency and tenure
  const calculateTotalWithdrawalsRequired = () => {
    const { withdrawalAmount, frequency, tenure } = calcState;
    if (!withdrawalAmount || !tenure) return 0;

    let withdrawalsPerYear = 12; // Default monthly
    switch (frequency) {
      case 'quarterly':
        withdrawalsPerYear = 4;
        break;
      case 'half-yearly':
        withdrawalsPerYear = 2;
        break;
      case 'yearly':
        withdrawalsPerYear = 1;
        break;
      default:
        withdrawalsPerYear = 12;
    }

    const totalYears = tenure / 12;
    return withdrawalAmount * withdrawalsPerYear * totalYears;
  };

  // Calculate total growth/returns earned
  const calculateTotalGrowth = () => {
    const breakdown = calculateYearlySWPBreakdown();
    return breakdown.reduce((sum, row) => sum + row.growthInYear, 0);
  };
  // Calculate withdrawal coverage ratio (how much of required withdrawals were actually made)
  const calculateWithdrawalCoverageRatio = () => {
    const totalRequired = calculateTotalWithdrawalsRequired();
    const totalActual = calculateActualWithdrawalsMade();
    if (totalRequired === 0) return 100;
    return (totalActual / totalRequired) * 100;
  };
  // Calculate average annual return percentage
  const calculateAverageAnnualReturn = () => {
    const { initialInvestment, tenure } = calcState;
    if (!initialInvestment || !tenure) return 0;

    const totalGrowth = calculateTotalGrowth();
    const years = tenure / 12;

    if (years === 0 || initialInvestment === 0) return 0;
    return (totalGrowth / (initialInvestment * years)) * 100;
  };
  // Calculate net effective return (considering withdrawals impact)
  const calculateNetEffectiveReturn = () => {
    const { initialInvestment, tenure } = calcState;
    if (!initialInvestment || !tenure) return 0;

    const totalWithdrawals = calculateActualWithdrawalsMade();
    const remainingBalance = calculateRemainingBalance();
    const totalValue = totalWithdrawals + remainingBalance;

    const years = tenure / 12;
    if (years === 0) return 0;

    // CAGR calculation: ((Final Value / Initial Value) ^ (1/years)) - 1
    const cagr = Math.pow(totalValue / initialInvestment, 1 / years) - 1;
    return cagr * 100;
  };

  // Calculate total shortfall amount (difference between required and actual withdrawals)
  const calculateTotalShortfall = () => {
    const totalRequired = calculateTotalWithdrawalsRequired();
    const totalActual = calculateActualWithdrawalsMade();
    const shortfall = totalRequired - totalActual;
    return Math.max(0, shortfall); // Return 0 if no shortfall (when actual >= required)
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
        {/* Enhanced Summary Section */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1.5, fontWeight: 'bold', color: 'primary.main' }}
          >
            Summary Results
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="body2">Total Withdrawals Required:</Typography>
            <Typography variant="body2" fontWeight="bold">
              ₹{rupeeFormat(calculateTotalWithdrawalsRequired())}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="body2">Actual Withdrawals Made:</Typography>
            <Typography variant="body2" fontWeight="bold">
              ₹{rupeeFormat(calculateActualWithdrawalsMade())}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="body2">Withdrawal Coverage:</Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              color={
                calculateWithdrawalCoverageRatio() >= 100
                  ? '#00bfa5'
                  : 'warning.main'
              }
            >
              {calculateWithdrawalCoverageRatio().toFixed(1)}%
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="body2">Total Shortfall Amount:</Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              color={calculateTotalShortfall() > 0 ? 'error.main' : '#00bfa5'}
            >
              {calculateTotalShortfall() > 0
                ? `₹${rupeeFormat(calculateTotalShortfall())}`
                : '₹0'}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="body2">Total Growth Earned:</Typography>
            <Typography variant="body2" fontWeight="bold" color="#00bfa5">
              ₹{rupeeFormat(calculateTotalGrowth())}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="body2">Final Remaining Balance:</Typography>
            <Typography variant="body2" fontWeight="bold">
              ₹{rupeeFormat(calculateRemainingBalance()) || 0}
            </Typography>
          </Stack>

          {/* <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="body2">
              Net Effective Return (CAGR):
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="info.main">
              {calculateNetEffectiveReturn().toFixed(2)}%
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="body2">Annual Growth Rate:</Typography>
            <Typography variant="body2" fontWeight="bold" color="info.main">
              {calculateAverageAnnualReturn().toFixed(2)}%
            </Typography>
          </Stack> */}
        </Box>
        {(() => {
          const exhaustionPeriod = calculateExhaustionPeriod();
          if (exhaustionPeriod) {
            return (
              <Alert
                severity="warning"
                variant="outlined"
                sx={{ mb: 1, py: 0 }}
              >
                <Typography variant="body2" fontWeight="bold">
                  Corpus Exhausted In: {formatDuration(exhaustionPeriod)}
                </Typography>
              </Alert>
            );
          }
          const maxDuration = calculateMaxSustainabilityDuration();

          return (
            <Stack spacing={0.5} sx={{ mb: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  p: 0,
                  borderColor: 'success.light',
                  borderRadius: 1
                }}
              >
                <Typography variant="body1" fontWeight="bold" color="#00bfa5">
                  ✅ Corpus Status:
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="#00bfa5">
                  Sustainable
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  p: 0,
                  borderColor: 'success.light',
                  borderRadius: 1
                }}
              >
                <Typography variant="body2" color="#00bfa5">
                  Can sustain for:
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="#00bfa5">
                  {maxDuration === 'infinite'
                    ? 'Indefinitely (growth > withdrawals)'
                    : maxDuration === 1200
                      ? '100+ years'
                      : formatDuration(maxDuration)}
                </Typography>
              </Stack>
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
          <Box sx={{ mb: 2, ml: -2, pr: 2, mt: 2, height: 300 }}>
            <AgChartsReact options={withdrawalChartOptions} />
          </Box>
          <Box sx={{ mb: 2, ml: -2, pr: 2, mt: 2, height: 300 }}>
            <AgChartsReact options={sustainabilityChartOptions} />
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
                    Withdrawals(₹)
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '120px' }}
                  >
                    Growth(₹)
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ padding: '6px 8px', width: '120px' }}
                  >
                    Balance(₹)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  const breakdown = calculateYearlySWPBreakdown();
                  // Filter out empty years (where withdrawals, growth, and balance are all 0)
                  const filteredBreakdown = breakdown.filter(
                    (row) =>
                      row.withdrawalInYear > 0 ||
                      row.growthInYear > 0 ||
                      row.remainingBalance > 0
                  );
                  const totalWithdrawals = filteredBreakdown.reduce(
                    (sum, row) => sum + row.withdrawalInYear,
                    0
                  );
                  const totalGrowth = filteredBreakdown.reduce(
                    (sum, row) => sum + row.growthInYear,
                    0
                  );

                  return (
                    <>
                      {filteredBreakdown.map((row) => (
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
                            {rupeeFormat(Math.round(row.withdrawalInYear))}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ padding: '6px 8px' }}
                          >
                            {rupeeFormat(Math.round(row.growthInYear))}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ padding: '6px 8px' }}
                          >
                            {rupeeFormat(Math.round(row.remainingBalance))}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredBreakdown.length > 0 && (
                        <TableRow
                          sx={{
                            backgroundColor: 'action.hover',
                            fontWeight: 'bold'
                          }}
                        >
                          <TableCell
                            style={{
                              padding: '6px 8px',
                              width: '40px',
                              maxWidth: '40px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                          >
                            Total
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ padding: '6px 8px', fontWeight: 'bold' }}
                          >
                            {rupeeFormat(Math.round(totalWithdrawals))}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ padding: '6px 8px', fontWeight: 'bold' }}
                          >
                            {rupeeFormat(Math.round(totalGrowth))}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ padding: '6px 8px', fontWeight: 'bold' }}
                          >
                            -
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })()}
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
                                    {(() => {
                                      const breakdown =
                                        calculatedBreakdowns[calc.id];
                                      // Filter out empty years (where withdrawals, growth, and balance are all 0)
                                      const filteredBreakdown =
                                        breakdown.filter(
                                          (row) =>
                                            row.withdrawalInYear > 0 ||
                                            row.growthInYear > 0 ||
                                            row.remainingBalance > 0
                                        );
                                      const totalWithdrawals =
                                        filteredBreakdown.reduce(
                                          (sum, row) =>
                                            sum + row.withdrawalInYear,
                                          0
                                        );
                                      const totalGrowth =
                                        filteredBreakdown.reduce(
                                          (sum, row) => sum + row.growthInYear,
                                          0
                                        );
                                      return (
                                        <>
                                          {filteredBreakdown.map((row) => (
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
                                                    row.withdrawalInYear
                                                  )
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
                                                  Math.round(
                                                    row.remainingBalance
                                                  )
                                                )}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                          {filteredBreakdown.length > 0 && (
                                            <TableRow
                                              sx={{
                                                backgroundColor: 'action.hover',
                                                fontWeight: 'bold'
                                              }}
                                            >
                                              <TableCell
                                                style={{
                                                  padding: '6px 8px',
                                                  width: '40px',
                                                  maxWidth: '40px',
                                                  textAlign: 'center',
                                                  fontWeight: 'bold'
                                                }}
                                              >
                                                Total
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                style={{
                                                  padding: '6px 8px',
                                                  fontWeight: 'bold'
                                                }}
                                              >
                                                {rupeeFormat(
                                                  Math.round(totalWithdrawals)
                                                )}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                style={{
                                                  padding: '6px 8px',
                                                  fontWeight: 'bold'
                                                }}
                                              >
                                                {rupeeFormat(
                                                  Math.round(totalGrowth)
                                                )}
                                              </TableCell>
                                              <TableCell
                                                align="right"
                                                style={{
                                                  padding: '6px 8px',
                                                  fontWeight: 'bold'
                                                }}
                                              >
                                                -
                                              </TableCell>
                                            </TableRow>
                                          )}
                                        </>
                                      );
                                    })()}
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
