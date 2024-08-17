import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import { useRoutes } from 'react-router-dom';
import FDBankView from '../fd-bank-view/fd-bank-view';
import FDCalculator from '../fd-calculator/fd-calculator';
import FDView from '../fd-view/fd-view';

function TabLayout() {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
            <Tab label="Fixed Deposits" value="1" />
            <Tab label="Home Loan" value="2" />
            <Tab label="Car Loan" value="3" />
            <Tab label="Two-wheeler Loan" value="4" />
            <Tab label="Government Schemes" value="5" />
          </TabList>
        </Box>
        <TabPanel sx={{ p: 0 }} value="1">
          <FDView />
        </TabPanel>
        <TabPanel value="2">Coming soon...</TabPanel>
        <TabPanel value="3">Coming soon...</TabPanel>
        <TabPanel value="4">Coming soon...</TabPanel>
        <TabPanel value="5">Coming soon...</TabPanel>
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
        { path: 'calculator', element: <FDCalculator /> },
        { path: ':bankName', element: <FDBankView /> }
      ]
    }
  ]);

  return routes;
}
