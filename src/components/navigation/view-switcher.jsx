import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import FDView from '../fd-view/view';

export default function ViewSwitcher() {
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
            <Tab label="Goverment Schemes" value="5" />
          </TabList>
        </Box>
        <TabPanel sx={{ p: 0 }} value="1">
          <FDView />
        </TabPanel>
        <TabPanel value="2">Home Loan</TabPanel>
        <TabPanel value="3">Car Loan</TabPanel>
        <TabPanel value="4">Two-wheeler Loan</TabPanel>
        <TabPanel value="5">Goverment Schemes</TabPanel>
      </TabContext>
    </Box>
  );
}
