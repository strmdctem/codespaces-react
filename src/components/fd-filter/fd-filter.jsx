import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Drawer from '@mui/material/Drawer';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from '../utils';
import FDFilterBankTypes from './fd-filter-bank-types';
import FDFilterBanks from './fd-filter-banks';
import FDFilterCalc from './fd-filter-calc';
import FDFilterCategory from './fd-filter-category';
import FDFilterScheme from './fd-filter-scheme';
import FDFilterSearch from './fd-filter-search';
import FDFilterTenures from './fd-filter-tenures';

// Import CSS for animations and styles
import './fd-filter.css';

// Icons
import TuneIcon from '@mui/icons-material/Tune';

export default function FDFilter({ onChange, value }) {
  const [filters, setFilters] = useState({ ...value });

  // Sync filters when parent value changes (e.g., from URL)
  useEffect(() => {
    setFilters({ ...value });
  }, [value]);

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
        <ModernMobileFilter filters={filters} onChange={handleChange} />
      ) : (
        <ModernWebFilter filters={filters} onChange={handleChange} />
      )}
    </>
  );
}

// Enhanced Web Filter with Card Design
function ModernWebFilter({ filters, onChange }) {
  const theme = useTheme();

  const handleChange = (filterName) => (value) => {
    onChange(filterName, value);
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.02)})`,
        overflow: 'visible'
      }}
    >
      {' '}
      <CardContent sx={{ p: 2 }}>
        {/* Compact Primary Filters Row */}
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={6} md={2.3}>
            <FDFilterScheme
              value={filters.scheme}
              onChange={handleChange('scheme')}
              sx={{
                borderRadius: 2,
                animation: 'subtle-pulse 3s ease-in-out infinite'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={1.8}>
            <FDFilterCategory
              value={filters.category}
              onChange={handleChange('category')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.3}>
            <FDFilterSearch
              value={filters.search}
              onChange={handleChange('search')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.3}>
            <FDFilterCalc
              value={filters.calc}
              onChange={handleChange('calc')}
            />
          </Grid>
          <Grid item xs={12} md={3.3}>
            <FDFilterTenures
              value={filters.tenureCategories}
              onChange={handleChange('tenureCategories')}
            />
          </Grid>
        </Grid>{' '}
        {/* Secondary Filters Row */}
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <FDFilterBankTypes
                value={filters.bankTypes}
                onChange={handleChange('bankTypes')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FDFilterBanks
                value={filters.bankNames}
                onChange={handleChange('bankNames')}
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

// Enhanced Mobile Filter with Floating Action Button
function ModernMobileFilter({ filters, onChange }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <ModernMobileTopFilter filters={filters} onChange={onChange} />
      <ModernMobileBottomFilter
        filters={filters}
        onChange={onChange}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
    </>
  );
}

// Redesigned Mobile Top Filter
function ModernMobileTopFilter({ filters, onChange }) {
  const theme = useTheme();

  const handleChange = (filterName) => (value) => {
    onChange(filterName, value);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        mx: 1,
        my: 1,
        borderRadius: 2,
        overflow: 'hidden',
        background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.02)})`
      }}
    >
      <Box sx={{ p: 1.5 }}>
        {/* Primary row with scheme and category */}
        <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
          <Grid item xs={6}>
            <FDFilterScheme
              value={filters.scheme}
              onChange={handleChange('scheme')}
              sx={{
                borderRadius: 2,
                animation: 'subtle-pulse 3s ease-in-out infinite'
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FDFilterCategory
              value={filters.category}
              onChange={handleChange('category')}
            />
          </Grid>{' '}
        </Grid>
        {/* Secondary row with search and calculator */}
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <FDFilterSearch
              value={filters.search}
              onChange={handleChange('search')}
            />
          </Grid>
          <Grid item xs={6}>
            <FDFilterCalc
              value={filters.calc}
              onChange={handleChange('calc')}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

// Redesigned Mobile Bottom Filter with FAB-style button
function ModernMobileBottomFilter({
  filters,
  onChange,
  drawerOpen,
  setDrawerOpen
}) {
  const theme = useTheme();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleChange = (filterName) => (value) => {
    onChange(filterName, value);
  };

  // Count active filters
  const activeFiltersCount = [
    filters.tenureCategories?.length < 3 ? 1 : 0,
    filters.bankTypes?.length < 4 ? 1 : 0,
    filters.bankNames?.length > 0 ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  return (
    <>
      {/* Floating Action Button */}
      <Fade in={true}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
            zIndex: 1000
          }}
        >
          <IconButton
            onClick={toggleDrawer}
            sx={{
              width: 56,
              height: 56,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              boxShadow: theme.shadows[8],
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                transform: 'scale(1.1)',
                boxShadow: theme.shadows[12]
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <TuneIcon />
              {activeFiltersCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.error.main,
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {activeFiltersCount}
                </Box>
              )}
            </Box>
          </IconButton>
        </Box>
      </Fade>{' '}
      {/* Enhanced Drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={toggleDrawer}
        elevation={8}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '80vh',
            background: theme.palette.background.paper
          }
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.02)})`
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Advanced Filters
            </Typography>
            <Button
              onClick={toggleDrawer}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Done
            </Button>
          </Stack>
        </Box>
        {/* Drawer Content */}
        <Box sx={{ p: 2 }}>
          <Stack spacing={2.5}>
            {/* Tenure Categories */}
            <Box>
              <FDFilterTenures
                value={filters.tenureCategories}
                onChange={handleChange('tenureCategories')}
              />
            </Box>

            {/* Bank Types */}
            <Box>
              <FDFilterBankTypes
                value={filters.bankTypes}
                onChange={handleChange('bankTypes')}
              />
            </Box>

            {/* Specific Banks */}
            <Box>
              <FDFilterBanks
                value={filters.bankNames}
                onChange={handleChange('bankNames')}
              />
            </Box>
          </Stack>
        </Box>
      </Drawer>
      {/* Bottom Info Bar */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          zIndex: 999,
          background: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <Button
          size="small"
          fullWidth
          variant="text"
          sx={{
            color: 'text.secondary',
            fontStyle: 'italic',
            fontSize: '0.75rem',
            py: 1
          }}
        >
          Last updated: 05-06-2025 &nbsp;&nbsp;
          <Link
            to="/disclaimer"
            style={{
              color: 'inherit',
              textDecoration: 'underline'
            }}
          >
            *Disclaimer
          </Link>
        </Button>
      </Box>
    </>
  );
}
