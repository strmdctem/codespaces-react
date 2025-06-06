import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { Suspense, useEffect, useState } from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import FDBankView from '../fd-bank-view/fd-bank-view';
import FDCalculator from '../fd-calculator/fd-calculator';
import FDView from '../fd-view/fd-view';
import GovernmentSchemesComparison from '../government-schemes/government-schemes-comparison';
import Loading from '../loading/loading';
import PPFCalculator from '../ppf/ppf-calculator';

// const FDCalculator = lazy(() => import('../fd-calculator/fd-calculator'));
// const FDBankView = lazy(() => import('../fd-bank-view/fd-bank-view'));

function TabLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState('1');
  // Set initial tab based on URL path
  useEffect(() => {
    if (location.pathname.startsWith('/ppf')) {
      setValue('2'); // PPF tab
    } else if (location.pathname.startsWith('/fixed-deposit')) {
      setValue('1'); // Fixed Deposits tab
    } else if (location.pathname.startsWith('/government-schemes')) {
      setValue('5'); // Government Schemes tab
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue); // Navigate to appropriate URL based on tab selection
    if (newValue === '1') {
      navigate('/fixed-deposit');
    } else if (newValue === '2') {
      navigate('/ppf');
    } else if (newValue === '5') {
      navigate('/government-schemes/comparison');
    }
    // Add more navigation routes here for other tabs when they are implemented
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
              label="Fixed Deposits"
              value="1"
              aria-selected="true"
              aria-label="Fixed Deposit Interest Rates of All banks"
            />
            <Tab label="PPF" value="2" />
            <Tab label="Car Loan" value="3" />
            <Tab label="Two-wheeler Loan" value="4" />
            <Tab label="Government Schemes" value="5" />
            <Tab label="LIC" value="6" />
            <Tab label="Post Office" value="7" />
            <Tab label="Home Loan" value="8" />
            <Tab label="PF/EPF" value="9" />
            <Tab label="NPS" value="10" />
            <Tab label="SGB" value="11" />
          </TabList>
        </Box>
        <TabPanel sx={{ p: 0 }} value="1">
          <FDView />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value="2">
          <PPFCalculator />
        </TabPanel>
        <TabPanel value="3">Coming soon...</TabPanel>
        <TabPanel value="4">Coming soon...</TabPanel>
        <TabPanel value="5">
          <GovernmentSchemesComparison />
        </TabPanel>
        <TabPanel value="6">Coming soon...</TabPanel>
        <TabPanel value="7">Coming soon...</TabPanel>
        <TabPanel value="8">Coming soon...</TabPanel>
        <TabPanel value="9">Coming soon...</TabPanel>
        <TabPanel value="10">Coming soon...</TabPanel>
        <TabPanel value="11">Coming soon...</TabPanel>
      </TabContext>
    </Box>
  );
}

export default function ViewSwitcher() {
  const routes = useRoutes([
    {
      children: [
        {
          index: true,
          element: <TabLayout />
        },
        {
          path: 'view/:scheme',
          element: <TabLayout />
        },
        {
          path: 'calculator',
          element: (
            <Suspense fallback={<Loading />}>
              <FDCalculator />
            </Suspense>
          )
        },
        {
          path: 'comparator',
          element: (
            <Suspense fallback={<Loading />}>
              <FDCalculator />
            </Suspense>
          )
        },
        {
          path: 'comparison',
          element: (
            <Suspense fallback={<Loading />}>
              <GovernmentSchemesComparison />
            </Suspense>
          )
        },
        {
          path: ':bankName',
          element: (
            <Suspense fallback={<Loading />}>
              <FDBankView />
            </Suspense>
          )
        }
      ]
    }
  ]);

  return routes;
}
