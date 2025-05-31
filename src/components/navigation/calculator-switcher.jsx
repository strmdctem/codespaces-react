import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EMICalculator from '../emi-calculator/emi-calculator';
import GoalCalculator from '../goal-calculator/goal-calculator';
import InterestCalculator from '../interest-calculator/interest-calculator';
import PPFCalculator from '../ppf/ppf-calculator';
import SIPCalculator from '../sip-calculator/sip-calculator';

function CalculatorTabLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState('1');
  // Set initial tab based on URL path
  useEffect(() => {
    if (location.pathname.includes('/sip-calculator')) {
      setValue('1'); // SIP Calculator tab
    } else if (location.pathname.includes('/emi-calculator')) {
      setValue('2'); // EMI Calculator tab
    } else if (location.pathname.includes('/goal-calculator')) {
      setValue('3'); // Goal Calculator tab
    } else if (location.pathname.includes('/ppf-calculator')) {
      setValue('4'); // PPF Calculator tab
    } else if (location.pathname.includes('/interest-calculator')) {
      setValue('5'); // Interest Calculator tab
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Navigate to appropriate URL based on tab selection
    if (newValue === '1') {
      navigate('/calculators/sip-calculator');
    } else if (newValue === '2') {
      navigate('/calculators/emi-calculator');
    } else if (newValue === '3') {
      navigate('/calculators/goal-calculator');
    } else if (newValue === '4') {
      navigate('/calculators/ppf-calculator');
    } else if (newValue === '5') {
      navigate('/calculators/interest-calculator');
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
            <Tab
              component="h2"
              label="SIP"
              value="1"
              aria-selected="true"
              aria-label="SIP Calculator for Systematic Investment Planning"
            />
            <Tab
              component="h2"
              label="EMI"
              value="2"
              aria-label="EMI Calculator for Loan Planning"
            />
            <Tab
              component="h2"
              label="Goal"
              value="3"
              aria-label="Goal Calculator for Financial Planning"
            />
            <Tab
              component="h2"
              label="PPF"
              value="4"
              aria-label="PPF Calculator for Public Provident Fund"
            />
            <Tab
              component="h2"
              label="Interest"
              value="5"
              aria-label="Interest Calculator for Fixed Deposits"
            />
          </TabList>
        </Box>
        <TabPanel sx={{ p: 0, pt: 1 }} value="1">
          <SIPCalculator />
        </TabPanel>
        <TabPanel sx={{ p: 0, pt: 1 }} value="2">
          <EMICalculator />
        </TabPanel>
        <TabPanel sx={{ p: 0, pt: 1 }} value="3">
          <GoalCalculator />
        </TabPanel>
        <TabPanel sx={{ p: 0, pt: 1 }} value="4">
          <PPFCalculator />
        </TabPanel>
        <TabPanel sx={{ p: 0, pt: 1 }} value="5">
          <InterestCalculator />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default function CalculatorSwitcher() {
  return <CalculatorTabLayout />;
}
