import * as React from 'react';
import { useState, useEffect } from 'react';
import BankTypesFilter from './bank-type';
import BankNamesFilter from './bank-names';
import TenureFilter from './tenure';
import './filter.css';
import CategoryFilter from './catergory';
import { defaultValues } from './default-values';
import { Drawer } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { isMobile } from '../utils';

export default function FDFilter({ onChange }) {
  const [filters, setFilters] = useState({ ...defaultValues });

  const handleChange = (filterName) => (value) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [filterName]: value };
      onChange(newFilters);
      return newFilters;
    });
  };

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  const Filter = () => (
    <>
      <TenureFilter value={filters.tenureCategories} onChange={handleChange('tenureCategories')} />
      <BankTypesFilter value={filters.bankTypes} onChange={handleChange('bankTypes')} />
      <BankNamesFilter value={filters.bankNames} onChange={handleChange('bankNames')} />
      <CategoryFilter value={filters.category} onChange={handleChange('category')} />
    </>
  );

  const DrawerButton = () => (
    <Button size="large" variant="contained" fullWidth onClick={toggleDrawer}
      sx={{ backgroundColor: "#1f272e", borderRadius: 0 }}>
      Filter
    </Button>
  );

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      {isMobile() ? (
        <Box sx={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1 }}>
          <Drawer anchor="bottom" open={drawerOpen}>
            <DrawerButton />
            <Filter />
          </Drawer>
          <Box>
            <DrawerButton />
          </Box>
        </Box>
      ) : (
        <Filter />
      )}
    </>
  );
}