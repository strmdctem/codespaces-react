import {
  Clear,
  ExpandLess,
  ExpandMore,
  FilterList,
  Refresh,
  Search,
  Security,
  TrendingUp
} from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useState } from 'react';

const InvestmentFilters = ({
  filters,
  onFiltersChange,
  options = [],
  quickFilters = [],
  onQuickFilter
}) => {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    advanced: false,
    range: false
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      categories: [],
      riskLevels: [],
      liquidityTypes: [],
      timeHorizons: [],
      returnRange: [0, 20],
      minInvestment: '',
      hasGuaranteedReturns: false,
      hasTaxBenefit: false,
      hasOnlineAccess: false
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories?.length > 0) count++;
    if (filters.riskLevels?.length > 0) count++;
    if (filters.liquidityTypes?.length > 0) count++;
    if (filters.timeHorizons?.length > 0) count++;
    if (filters.returnRange?.[0] > 0 || filters.returnRange?.[1] < 20) count++;
    if (filters.minInvestment) count++;
    if (filters.hasGuaranteedReturns) count++;
    if (filters.hasTaxBenefit) count++;
    if (filters.hasOnlineAccess) count++;
    return count;
  };

  // Extract unique values from options
  const categories = [
    ...new Set(options.map((opt) => opt.category).filter(Boolean))
  ];
  const riskLevels = [
    ...new Set(options.map((opt) => opt.riskLevel).filter(Boolean))
  ];
  const liquidityTypes = [
    ...new Set(options.map((opt) => opt.liquidity).filter(Boolean))
  ];
  const timeHorizons = [
    ...new Set(options.map((opt) => opt.timeHorizon).filter(Boolean))
  ];

  const filterSections = [
    {
      id: 'basic',
      title: 'Basic Filters',
      icon: <FilterList />,
      expanded: expandedSections.basic
    },
    {
      id: 'advanced',
      title: 'Advanced Options',
      icon: <Security />,
      expanded: expandedSections.advanced
    },
    {
      id: 'range',
      title: 'Return & Investment Range',
      icon: <TrendingUp />,
      expanded: expandedSections.range
    }
  ];
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        mb: 3
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
            {getActiveFilterCount() > 0 && (
              <Badge
                badgeContent={getActiveFilterCount()}
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    right: -8,
                    top: -8
                  }
                }}
              >
                <Box />
              </Badge>
            )}
          </Box>
          <Tooltip title="Clear all filters">
            <IconButton
              size="small"
              onClick={clearAllFilters}
              disabled={getActiveFilterCount() === 0}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': { color: theme.palette.primary.main }
              }}
            >
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Quick Filters */}
        {quickFilters.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1.5,
                fontWeight: 600,
                color: theme.palette.text.secondary
              }}
            >
              Quick Filters
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              {quickFilters.map((quickFilter) => (
                <Chip
                  key={quickFilter.id}
                  label={quickFilter.label}
                  icon={quickFilter.icon}
                  onClick={() => onQuickFilter(quickFilter)}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search investment options..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
            endAdornment: filters.search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => handleFilterChange('search', '')}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ mb: 3 }}
        />

        {/* Filter Sections */}
        {filterSections.map((section, index) => (
          <Box
            key={section.id}
            sx={{ mb: index < filterSections.length - 1 ? 2 : 0 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                p: 1,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
              onClick={() => toggleSection(section.id)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {section.icon}
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {section.title}
                </Typography>
              </Box>
              {section.expanded ? <ExpandLess /> : <ExpandMore />}
            </Box>

            <Collapse in={section.expanded}>
              <Box sx={{ pt: 2, pl: 1 }}>
                {/* Basic Filters */}
                {section.id === 'basic' && (
                  <Stack spacing={3}>
                    {/* Categories */}
                    <FormControl fullWidth size="small">
                      <InputLabel>Investment Categories</InputLabel>
                      <Select
                        multiple
                        value={filters.categories || []}
                        onChange={(e) =>
                          handleFilterChange('categories', e.target.value)
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={value.replace('_', ' ')}
                                size="small"
                                sx={{
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                  color: theme.palette.primary.main
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category.replace('_', ' ').toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Risk Levels */}
                    <FormControl fullWidth size="small">
                      <InputLabel>Risk Levels</InputLabel>
                      <Select
                        multiple
                        value={filters.riskLevels || []}
                        onChange={(e) =>
                          handleFilterChange('riskLevels', e.target.value)
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={value}
                                size="small"
                                sx={{
                                  bgcolor: alpha(
                                    theme.palette.warning.main,
                                    0.1
                                  ),
                                  color: theme.palette.warning.main
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {riskLevels.map((risk) => (
                          <MenuItem key={risk} value={risk}>
                            {risk}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Liquidity */}
                    <FormControl fullWidth size="small">
                      <InputLabel>Liquidity Types</InputLabel>
                      <Select
                        multiple
                        value={filters.liquidityTypes || []}
                        onChange={(e) =>
                          handleFilterChange('liquidityTypes', e.target.value)
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={value}
                                size="small"
                                sx={{
                                  bgcolor: alpha(theme.palette.info.main, 0.1),
                                  color: theme.palette.info.main
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {liquidityTypes.map((liquidity) => (
                          <MenuItem key={liquidity} value={liquidity}>
                            {liquidity}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                )}

                {/* Advanced Filters */}
                {section.id === 'advanced' && (
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={filters.hasGuaranteedReturns || false}
                          onChange={(e) =>
                            handleFilterChange(
                              'hasGuaranteedReturns',
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Guaranteed Returns"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={filters.hasTaxBenefit || false}
                          onChange={(e) =>
                            handleFilterChange(
                              'hasTaxBenefit',
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Tax Benefits Available"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={filters.hasOnlineAccess || false}
                          onChange={(e) =>
                            handleFilterChange(
                              'hasOnlineAccess',
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Online Access"
                    />

                    {/* Time Horizons */}
                    <FormControl fullWidth size="small">
                      <InputLabel>Time Horizons</InputLabel>
                      <Select
                        multiple
                        value={filters.timeHorizons || []}
                        onChange={(e) =>
                          handleFilterChange('timeHorizons', e.target.value)
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {selected.map((value) => (
                              <Chip
                                key={value}
                                label={value}
                                size="small"
                                sx={{
                                  bgcolor: alpha(
                                    theme.palette.success.main,
                                    0.1
                                  ),
                                  color: theme.palette.success.main
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      >
                        {timeHorizons.map((horizon) => (
                          <MenuItem key={horizon} value={horizon}>
                            {horizon}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                )}

                {/* Range Filters */}
                {section.id === 'range' && (
                  <Stack spacing={3}>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ mb: 2, fontWeight: 500 }}
                      >
                        Expected Returns Range (% p.a.)
                      </Typography>
                      <Slider
                        value={filters.returnRange || [0, 20]}
                        onChange={(e, value) =>
                          handleFilterChange('returnRange', value)
                        }
                        valueLabelDisplay="auto"
                        min={0}
                        max={20}
                        step={0.5}
                        marks={[
                          { value: 0, label: '0%' },
                          { value: 5, label: '5%' },
                          { value: 10, label: '10%' },
                          { value: 15, label: '15%' },
                          { value: 20, label: '20%' }
                        ]}
                        sx={{
                          color: theme.palette.primary.main,
                          '& .MuiSlider-thumb': {
                            '&:hover, &.Mui-focusVisible': {
                              boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.primary.main, 0.16)}`
                            }
                          }
                        }}
                      />
                    </Box>

                    <TextField
                      fullWidth
                      size="small"
                      label="Minimum Investment Amount"
                      value={filters.minInvestment || ''}
                      onChange={(e) =>
                        handleFilterChange('minInvestment', e.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        )
                      }}
                      placeholder="e.g., 1000, 5000, 10000..."
                    />
                  </Stack>
                )}
              </Box>
            </Collapse>

            {index < filterSections.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}

        {/* Reset Button */}
        {getActiveFilterCount() > 0 && (
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: `1px solid ${theme.palette.divider}`
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Refresh />}
              onClick={clearAllFilters}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                borderStyle: 'dashed',
                '&:hover': {
                  borderStyle: 'solid'
                }
              }}
            >
              Reset All Filters
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default InvestmentFilters;
