import * as React from 'react';
import { useState, useEffect } from 'react';
import BankTypesFilter from './bank-type';
import BankNamesFilter from './bank-names';
import TenureFilter from './tenure';
import './filter.css';
import CategoryFilter from './catergory';
import { defaultValues } from './default-values';
import { Drawer, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { isMobile } from '../utils';
import FDSchemeSelector from './scheme';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import FilterSearch from './filter-search';
import FilterCalc from './filter-calc';

export default function FDFilter({ onChange }) {
  const [filters, setFilters] = useState({ ...defaultValues });

  const handleChange = (filterName, value) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [filterName]: value };
      onChange(newFilters);
      return newFilters;
    });
  };

  const DrawerButton = () => (
    <Button size="large" variant="contained" fullWidth onClick={toggleDrawer}
      sx={{ borderRadius: 0 }}>
      Filter
    </Button>
  );

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    isMobile() ? (
      <>
        <CommonFilter filters={filters} onChange={handleChange} />
        <Box sx={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }}>
          <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer}>
            <DrawerButton />
            <Filter filters={filters} onChange={handleChange} />
          </Drawer>
          <DrawerButton />
        </Box>
      </>
    ) : (
      <>
        <CommonFilter filters={filters} onChange={handleChange} />
        <Filter filters={filters} onChange={handleChange} />
      </>
    )
  );
}

function CommonFilter({ filters, onChange }) {

  const handleChange = (filterName) => (value) => {
    onChange(filterName, value);
  }
  return (
    <Box>
      <Stack direction="row" spacing={2} justifyContent={'center'} sx={{ my: 1 }}>
        <FDSchemeSelector value={filters.scheme} onChange={handleChange('scheme')} />
        <CategoryFilter value={filters.category} onChange={handleChange('category')} />
      </Stack>
      <Stack direction="row" spacing={2} sx={{ m: 1, mx: 2 }}>
        <FilterSearch value={filters.search} onChange={handleChange('search')} />
        <FilterCalc value={filters.calc} onChange={handleChange('calc')} />
      </Stack>
    </Box>
  );
};

function Filter({ filters, onChange }) {
  const handleChange = (filterName) => (value) => {
    onChange(filterName, value);
  }
  return (
    <>
      <TenureFilter value={filters.tenureCategories} onChange={handleChange('tenureCategories')} />
      <BankTypesFilter value={filters.bankTypes} onChange={handleChange('bankTypes')} />
      <BankNamesFilter value={filters.bankNames} onChange={handleChange('bankNames')} />
    </>
  );

};