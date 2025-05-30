import { FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { Link } from 'react-router-dom';
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
      {isMobile() ? (
        <MobileFilter filters={filters} onChange={handleChange} />
      ) : (
        <WebFilter filters={filters} onChange={handleChange} />
      )}
    </>
  );
}

function WebFilter({ filters, onChange }) {
  const handleChange = (filterName) => (value) => {
    onChange(filterName, value);
  };
  return (
    <Stack direction="column">
      <Stack direction="row">
        <FormControl sx={{ m: 2 }}>
          <FDFilterScheme
            value={filters.scheme}
            onChange={handleChange('scheme')}
          />
        </FormControl>
        <FormControl sx={{ m: 2 }}>
          <FDFilterCategory
            value={filters.category}
            onChange={handleChange('category')}
          />
        </FormControl>

        <Filter filters={filters} onChange={onChange} />
      </Stack>
      <Stack direction="row" sx={{ width: '50%' }}>
        <FormControl sx={{ width: '100%', m: 2 }}>
          <FDFilterSearch
            value={filters.search}
            onChange={handleChange('search')}
          />
        </FormControl>
        <FormControl sx={{ width: '100%', m: 2 }}>
          <FDFilterCalc value={filters.calc} onChange={handleChange('calc')} />
        </FormControl>
      </Stack>
    </Stack>
  );
}

function MobileFilter({ filters, onChange }) {
  return (
    <>
      <MobileTopFIlter id="#el-2" filters={filters} onChange={onChange} />
      <MobileBottomFilter id="#el-2" filters={filters} onChange={onChange} />
    </>
  );
}

function MobileTopFIlter({ filters, onChange }) {
  const handleChange = (filterName) => (value) => {
    onChange(filterName, value);
  };

  const stackProps = {
    direction: 'row',
    spacing: 2,
    justifyContent: 'center',
    sx: { my: 2, px: 1, width: '100%' }
  };

  return (
    <Box>
      <Stack {...stackProps}>
        <FDFilterScheme
          sx={{ display: 'grid', gridTemplateColumns: '1fr', width: '46%' }}
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
      <Box sx={{ p: 2 }}>
        <FDFilterBanks
          value={filters.bankNames}
          onChange={handleChange('bankNames')}
        />
      </Box>
    </>
  );
}

function MobileBottomFilter({ filters, onChange }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }}>
      <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer}>
        <FilterButton name="Filter" onClick={toggleDrawer}></FilterButton>
        <Filter filters={filters} onChange={onChange} />
      </Drawer>
      {
        <Button
          size="small"
          fullWidth
          variant="text"
          sx={{
            color: 'inherit',
            background: 'inherit',
            fontStyle: 'italic',
            fontSize: '0.8rem'
          }}
        >
          Last updated on: 30-05-2025 &nbsp;&nbsp;&nbsp;&nbsp;
          <Link className="disclaimer-link" to={`/disclaimer`}>
            *Disclaimer
          </Link>
        </Button>
      }
      <DrawerButton onClick={toggleDrawer} />
    </Box>
  );
}

function DrawerButton({ onClick }) {
  return (
    <Stack direction="row">
      {/* <FilterButton name="preferences"></FilterButton> */}
      {/* <FilterButton name="c & c"></FilterButton> */}
      <FilterButton name="Filter" onClick={onClick}></FilterButton>
    </Stack>
  );
}

function FilterButton({ name, onClick }) {
  return (
    <Button
      size="meidum"
      variant="contained"
      fullWidth
      color="inherit"
      onClick={onClick}
      sx={{
        borderRadius: 0
      }}
    >
      {name}
    </Button>
  );
}
