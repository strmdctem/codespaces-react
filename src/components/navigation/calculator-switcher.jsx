import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EMICalculator from '../emi-calculator/emi-calculator';
import FDCalculator from '../fd-calculator/fd-calculator';
import GoalCalculator from '../goal-calculator/goal-calculator';
import InterestCalculator from '../interest-calculator/interest-calculator';
import PPFCalculator from '../ppf/ppf-calculator';
import SIPCalculator from '../sip-calculator/sip-calculator';
import STPCalculator from '../stp-calculator/stp-calculator';
import SWPCalculator from '../swp-calculator/swp-calculator';

// Calculator configuration to eliminate duplication
const CALCULATOR_CONFIG = [
  {
    id: '0',
    label: 'FD',
    path: '/fd-calculator',
    url: '/calculators/fd-calculator',
    ariaLabel: 'FD Calculator for Fixed Deposit Planning',
    component: FDCalculator
  },
  {
    id: '1',
    label: 'SIP',
    path: '/sip-calculator',
    url: '/calculators/sip-calculator',
    ariaLabel: 'SIP Calculator for Systematic Investment Planning',
    component: SIPCalculator
  },
  {
    id: '2',
    label: 'STP',
    path: '/stp-calculator',
    url: '/calculators/stp-calculator',
    ariaLabel: 'STP Calculator for Systematic Transfer Planning',
    component: STPCalculator
  },
  {
    id: '3',
    label: 'SWP',
    path: '/swp-calculator',
    url: '/calculators/swp-calculator',
    ariaLabel: 'SWP Calculator for Systematic Withdrawal Planning',
    component: SWPCalculator
  },
  {
    id: '4',
    label: 'EMI',
    path: '/emi-calculator',
    url: '/calculators/emi-calculator',
    ariaLabel: 'EMI Calculator for Loan Planning',
    component: EMICalculator
  },
  {
    id: '5',
    label: 'Goal',
    path: '/goal-calculator',
    url: '/calculators/goal-calculator',
    ariaLabel: 'Goal Calculator for Financial Planning',
    component: GoalCalculator
  },
  {
    id: '6',
    label: 'PPF',
    path: '/ppf-calculator',
    url: '/calculators/ppf-calculator',
    ariaLabel: 'PPF Calculator for Public Provident Fund',
    component: PPFCalculator
  },
  {
    id: '7',
    label: 'Interest',
    path: '/interest-calculator',
    url: '/calculators/interest-calculator',
    ariaLabel: 'Interest Calculator for Fixed Deposits',
    component: InterestCalculator
  }
];

function CalculatorTabLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper function to get tab ID from pathname
  const getTabFromPathname = (pathname) => {
    const calculator = CALCULATOR_CONFIG.find((calc) =>
      pathname.includes(calc.path)
    );
    return calculator ? calculator.id : '0'; // Default to FD if no match
  };

  // Initialize state based on current pathname to prevent flash
  const [value, setValue] = useState(() =>
    getTabFromPathname(location.pathname)
  );

  // Set tab based on URL path changes
  useEffect(() => {
    const newTab = getTabFromPathname(location.pathname);
    setValue(newTab);
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Navigate to appropriate URL based on tab selection
    const calculator = CALCULATOR_CONFIG.find((calc) => calc.id === newValue);
    if (calculator) {
      navigate(calculator.url);
    }
  };
  return (
    <Box sx={{ width: '100%' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {CALCULATOR_CONFIG.map((calculator, index) => (
              <Tab
                key={calculator.id}
                component="h2"
                label={calculator.label}
                value={calculator.id}
                aria-selected={index === 0 ? 'true' : undefined}
                aria-label={calculator.ariaLabel}
              />
            ))}
          </TabList>
        </Box>
        {CALCULATOR_CONFIG.map((calculator) => {
          const Component = calculator.component;
          return (
            <TabPanel
              key={calculator.id}
              sx={{ p: 0, pt: 1 }}
              value={calculator.id}
            >
              <Component />
            </TabPanel>
          );
        })}
      </TabContext>
    </Box>
  );
}

export default function CalculatorSwitcher() {
  return <CalculatorTabLayout />;
}
