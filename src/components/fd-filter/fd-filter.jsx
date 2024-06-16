import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { isMobile } from '../utils';
import FDFilterBankTypes from './fd-filter-bank-types';
import FDFilterBanks from './fd-filter-banks';
import FDFilterCalc from './fd-filter-calc';
import FDFilterCategory from './fd-filter-category';
import { DEFAULT_VALUES } from './fd-filter-constants';
import FDFilterScheme from './fd-filter-scheme';
import FDFilterSearch from './fd-filter-search';
import FDFilterTenures from './fd-filter-tenures';

export default function FDFilter({ onChange }) {
  const [filters, setFilters] = useState({ ...DEFAULT_VALUES });

  const handleChange = (filterName, value) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [filterName]: value };
      onChange(newFilters);
      return newFilters;
    });
  };

  return (
    <>
      <CommonFilter filters={filters} onChange={handleChange} />
      {isMobile() ? (
        <BottomFilter filters={filters} onChange={handleChange} />
      ) : (
        <Filter filters={filters} onChange={handleChange} />
      )}
    </>
  );
}

function CommonFilter({ filters, onChange }) {
  const handleChange = (filterName) => (value) => {
    onChange(filterName, value);
  };

  const stackProps = {
    direction: 'row',
    spacing: 2,
    justifyContent: 'center',
    sx: { my: 1 }
  };

  return (
    <Box>
      <Stack {...stackProps}>
        <FDFilterScheme
          value={filters.scheme}
          onChange={handleChange('scheme')}
        />
        <FDFilterCategory
          value={filters.category}
          onChange={handleChange('category')}
        />
      </Stack>
      <Stack {...stackProps}>
        <FDFilterSearch
          value={filters.search}
          onChange={handleChange('search')}
        />
        <FDFilterCalc value={filters.calc} onChange={handleChange('calc')} />
      </Stack>
    </Box>
  );
}

function Filter({ filters, onChange }) {
  const handleChange = (filterName) => (value) => {
    onChange(filterName, value);
  };
  return (
    <>
      <FDFilterTenures
        value={filters.tenureCategories}
        onChange={handleChange('tenureCategories')}
      />
      <FDFilterBankTypes
        value={filters.bankTypes}
        onChange={handleChange('bankTypes')}
      />
      <FDFilterBanks
        value={filters.bankNames}
        onChange={handleChange('bankNames')}
      />
    </>
  );
}

function BottomFilter({ filters, onChange }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }}>
      <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer}>
        <DrawerButton onClick={toggleDrawer} />
        <Filter filters={filters} onChange={onChange} />
      </Drawer>
      <DrawerButton onClick={toggleDrawer} />
    </Box>
  );
}

function DrawerButton({ onClick }) {
  return (
    <Button
      size="medium"
      variant="contained"
      fullWidth
      onClick={onClick}
      sx={{ borderRadius: 0 }}
    >
      Filter
    </Button>
  );
}
