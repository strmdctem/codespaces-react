import {
  ArrowForward,
  CompareArrows,
  FilterList,
  GridView,
  Info,
  Sort,
  TableChart,
  TrendingUp
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Markdown from '../markdown/markdown';
import usePageInfo from '../page-info/use-page-info';
import { useIsMobileHook } from '../utils';
import InvestmentCardView from './investment-card-view';
import { investmentOptions, quickFilters } from './investment-options-data';
import InvestmentTable from './investment-table';

export default function InvestmentOptionsAnalyzer() {
  const theme = useTheme();
  const isMobile = useIsMobileHook();
  const navigate = useNavigate();

  // Set page info for SEO
  usePageInfo({
    title: 'Investment Options Analyzer',
    description:
      'Where to Park or Invest Money Other Than Equities and Equity Mutual Funds?'
  });

  // State management
  const [viewMode, setViewMode] = useState('cards'); // 'table', 'cards', 'comparison'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeQuickFilters, setActiveQuickFilters] = useState([]); // Changed to array for multiple selection
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('risk'); // Default sort by risk
  // Sort options
  const sortOptions = [
    { value: 'returns', label: 'Returns (High to Low)' },
    { value: 'risk', label: 'Risk (Low to High)' },
    { value: 'holding-period', label: 'Holding Period (Short to Long)' },
    { value: 'withdrawal-speed', label: 'Withdrawal Speed (Fastest)' }
  ];
  // Helper function to get risk level numeric value for sorting
  const getRiskLevelValue = (riskLevel) => {
    const riskMap = {
      None: 0,
      'Very Low': 1,
      'Very Low to Low': 1.5,
      Low: 2,
      'Low to Moderate': 3,
      Moderate: 4,
      'Moderate to High': 5,
      High: 6
    };
    return riskMap[riskLevel] || 0;
  };

  // Helper function to get holding period in days for sorting
  const getHoldingPeriodInDays = (idealHoldingPeriod) => {
    if (!idealHoldingPeriod) return 0;
    const { min, unit } = idealHoldingPeriod;

    switch (unit) {
      case 'days':
        return min;
      case 'months':
        return min * 30;
      case 'years':
        return min * 365;
      default:
        return min;
    }
  }; // Helper function to get withdrawal speed numeric value
  const getWithdrawalSpeedValue = (withdrawalSpeed) => {
    if (!withdrawalSpeed) return 999;
    if (withdrawalSpeed.includes('Instant within hours')) return -1; // FDs get highest priority
    if (withdrawalSpeed.includes('Same day') || withdrawalSpeed.includes('T+0'))
      return 0;
    if (withdrawalSpeed.includes('Instant')) return 0;
    if (withdrawalSpeed.includes('next day') || withdrawalSpeed.includes('T+1'))
      return 1;
    if (withdrawalSpeed.includes('T+2')) return 2;
    if (withdrawalSpeed.includes('T+3')) return 3;
    return 999;
  };
  // Filter logic
  const filteredOptions = useMemo(() => {
    let filtered = [...investmentOptions];

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (option) => option.category === selectedCategory
      );
    }
    // Quick filters (multiple selection)
    if (activeQuickFilters.length > 0) {
      // Separate time-based filters and investment mode filters from other filters
      const timeBasedFilters = [
        '1-day-to-1-month',
        '1-month-to-6-months',
        '6-months-to-2-years',
        '2-years-plus'
      ];
      const investmentModeFilters = ['sip-preferred', 'lumpsum-preferred'];
      const partialWithdrawalFilters = ['partial-withdrawal'];

      const activeTimeFilters = activeQuickFilters.filter((id) =>
        timeBasedFilters.includes(id)
      );
      const activeInvestmentModeFilters = activeQuickFilters.filter((id) =>
        investmentModeFilters.includes(id)
      );
      const activePartialWithdrawalFilters = activeQuickFilters.filter((id) =>
        partialWithdrawalFilters.includes(id)
      );
      const activeOtherFilters = activeQuickFilters.filter(
        (id) =>
          !timeBasedFilters.includes(id) &&
          !investmentModeFilters.includes(id) &&
          !partialWithdrawalFilters.includes(id)
      );

      // Apply time-based filters with OR logic (union)
      if (activeTimeFilters.length > 0) {
        const timeFilteredOptions = [];

        activeTimeFilters.forEach((filterId) => {
          const quickFilter = quickFilters.find((f) => f.id === filterId);
          if (quickFilter?.filters) {
            const { filters: qf } = quickFilter;

            // Filter options that match this time filter
            const matchingOptions = filtered.filter((option) => {
              if (!option.idealHoldingPeriod) return false;

              // Convert holding period to days for comparison
              let holdingPeriodInDays;
              const { min, max, unit } = option.idealHoldingPeriod;

              if (unit === 'days') {
                holdingPeriodInDays = { min, max };
              } else if (unit === 'months') {
                holdingPeriodInDays = { min: min * 30, max: max * 30 };
              } else if (unit === 'years') {
                holdingPeriodInDays = { min: min * 365, max: max * 365 };
              } else {
                return false;
              }

              // Check if the holding period overlaps with the filter range
              if (
                qf.maxHoldingPeriod &&
                holdingPeriodInDays.min > qf.maxHoldingPeriod
              ) {
                return false;
              }
              if (
                qf.minHoldingPeriod &&
                holdingPeriodInDays.max < qf.minHoldingPeriod
              ) {
                return false;
              }

              return true;
            });

            // Add to union (avoid duplicates)
            matchingOptions.forEach((option) => {
              if (
                !timeFilteredOptions.find(
                  (existing) => existing.id === option.id
                )
              ) {
                timeFilteredOptions.push(option);
              }
            });
          }
        }); // Use the union of time-filtered options
        filtered = timeFilteredOptions;
      }

      // Apply investment mode filters with OR logic (union)
      if (activeInvestmentModeFilters.length > 0) {
        const modeFilteredOptions = [];

        activeInvestmentModeFilters.forEach((filterId) => {
          const quickFilter = quickFilters.find((f) => f.id === filterId);
          if (quickFilter?.filters) {
            const { filters: qf } = quickFilter;

            // Filter options that match this investment mode filter
            const matchingOptions = filtered.filter((option) => {
              if (
                !option.investmentMode ||
                !Array.isArray(option.investmentMode)
              )
                return false;

              if (qf.investmentModes) {
                // Check if any of the option's investment modes match the filter criteria
                return option.investmentMode.some((mode) =>
                  qf.investmentModes.includes(mode)
                );
              }

              return false;
            });

            // Add to union (avoid duplicates)
            matchingOptions.forEach((option) => {
              if (
                !modeFilteredOptions.find(
                  (existing) => existing.id === option.id
                )
              ) {
                modeFilteredOptions.push(option);
              }
            });
          }
        }); // Use the union of mode-filtered options
        filtered = modeFilteredOptions;
      } // Apply partial withdrawal filters with AND logic (intersection)
      activePartialWithdrawalFilters.forEach((filterId) => {
        const quickFilter = quickFilters.find((f) => f.id === filterId);
        if (quickFilter?.filters) {
          const { filters: qf } = quickFilter;

          // Filter options that match this partial withdrawal filter
          filtered = filtered.filter((option) => {
            if (qf.partialWithdrawal) {
              return qf.partialWithdrawal.includes(option.partialWithdrawal);
            }
            return true;
          });
        }
      });

      // Apply other filters with AND logic (intersection)
      activeOtherFilters.forEach((filterId) => {
        const quickFilter = quickFilters.find((f) => f.id === filterId);
        if (quickFilter?.filters) {
          const { filters: qf } = quickFilter;

          // Special case: if showAll is true, don't apply any category filters
          if (qf.showAll) {
            // For "Tax efficient ≤ 12 lacs" - show all options
            return; // Skip all other filtering for this filter
          }

          if (qf.categories) {
            filtered = filtered.filter((option) =>
              qf.categories.includes(option.category)
            );
          }
          if (qf.riskLevels) {
            filtered = filtered.filter((option) =>
              qf.riskLevels.includes(option.riskLevel)
            );
          }
          if (qf.withdrawalSpeed) {
            filtered = filtered.filter((option) =>
              qf.withdrawalSpeed.includes(option.withdrawalSpeed)
            );
          }
          if (qf.taxation) {
            filtered = filtered.filter((option) =>
              qf.taxation.includes(option.taxation)
            );
          }
          if (qf.investmentModes) {
            filtered = filtered.filter((option) => {
              if (
                !option.investmentMode ||
                !Array.isArray(option.investmentMode)
              )
                return false;
              // Check if any of the option's investment modes match the filter criteria
              return option.investmentMode.some((mode) =>
                qf.investmentModes.includes(mode)
              );
            });
          }
          if (qf.partialWithdrawal) {
            filtered = filtered.filter((option) =>
              qf.partialWithdrawal.includes(option.partialWithdrawal)
            );
          }
          if (qf.excludeIds) {
            filtered = filtered.filter(
              (option) => !qf.excludeIds.includes(option.id)
            );
          }
          if (qf.minReturns) {
            filtered = filtered.filter((option) => {
              if (!option.expectedReturns) return false;
              const avgReturn =
                (option.expectedReturns.min + option.expectedReturns.max) / 2;
              return avgReturn >= qf.minReturns;
            });
          }
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'returns': {
          const avgReturnA =
            (a.expectedReturns?.min + a.expectedReturns?.max) / 2 || 0;
          const avgReturnB =
            (b.expectedReturns?.min + b.expectedReturns?.max) / 2 || 0;
          return avgReturnB - avgReturnA; // High to Low
        }

        case 'risk':
          return (
            getRiskLevelValue(a.riskLevel) - getRiskLevelValue(b.riskLevel)
          ); // Low to High

        case 'holding-period':
          return (
            getHoldingPeriodInDays(a.idealHoldingPeriod) -
            getHoldingPeriodInDays(b.idealHoldingPeriod)
          ); // Short to Long

        case 'withdrawal-speed':
          return (
            getWithdrawalSpeedValue(a.withdrawalSpeed) -
            getWithdrawalSpeedValue(b.withdrawalSpeed)
          ); // Fastest first

        default:
          return 0;
      }
    });
    return filtered;
  }, [selectedCategory, activeQuickFilters, sortBy]); // Event handlers
  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };
  const handleQuickFilterChange = (filterId) => {
    setActiveQuickFilters((prev) => {
      if (prev.includes(filterId)) {
        // Remove filter if already active
        return prev.filter((id) => id !== filterId);
      } else {
        // Add filter if not active
        return [...prev, filterId];
      }
    });
    setSelectedCategory('All'); // Reset category when using quick filters
  };

  // Reset all quick filters
  const handleResetQuickFilters = () => {
    setActiveQuickFilters([]);
  };
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleOptionSelect = (optionId) => {
    setSelectedOptions((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      } else if (prev.length < 4) {
        return [...prev, optionId];
      } else {
        return prev;
      }
    });
  };

  const toggleFavorite = (optionId) => {
    setFavorites((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };
  return (
    <Box sx={{ width: '100%', px: 2, py: 3 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
          py: { xs: 4, md: 4 },
          px: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          component="h1"
          gutterBottom
        >
          Investment Options Analyzer
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Where to Park or Invest Money Other Than Equities and Equity Mutual
          Funds?
        </Typography>
      </Box>
      {/* Quick Filter Chips */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.02)})`
        }}
      >
        <CardContent sx={{ p: 2, px: 0.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mx: 2,
                mb: 1
              }}
            >
              <FilterList sx={{ fontSize: 20 }} />
              Quick Filters
              <Chip
                label={`${filteredOptions.length} found`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Typography>
            {/* Reset Button in Header */}
            {activeQuickFilters.length > 0 && (
              <Typography
                variant="body2"
                onClick={handleResetQuickFilters}
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': {
                    opacity: 0.7
                  }
                }}
              >
                🔄 Reset All
              </Typography>
            )}
          </Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            {quickFilters.map((filter) => (
              <Chip
                key={filter.id}
                label={filter.label}
                onClick={() => handleQuickFilterChange(filter.id)}
                color={
                  activeQuickFilters.includes(filter.id) ? 'primary' : 'default'
                }
                variant={
                  activeQuickFilters.includes(filter.id) ? 'filled' : 'outlined'
                }
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  px: 0,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  },
                  ...(activeQuickFilters.includes(filter.id) && {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: 'white',
                    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`
                  })
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>
      {/* View Controls and Results Count */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: 2,
            width: isMobile ? '100%' : 'auto'
          }}
        >
          {/* Sort Dropdown */}
          <FormControl
            size="small"
            sx={{ minWidth: 200, width: isMobile ? '100%' : 'auto' }}
          >
            <InputLabel id="sort-select-label">
              <Sort sx={{ mr: 1, fontSize: 18 }} />
              Sort by
            </InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortBy}
              onChange={handleSortChange}
              label="Sort by"
              sx={{
                borderRadius: 2,
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* View Mode Toggle */}
          <Box sx={{ width: isMobile ? '100%' : 'auto', mt: isMobile ? 1 : 0 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
              sx={{
                width: isMobile ? '100%' : 'auto',
                '& .MuiToggleButton-root': {
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  width: isMobile ? '100%' : 'auto'
                },
                display: isMobile ? 'flex' : undefined
              }}
              fullWidth={isMobile}
            >
              <ToggleButton value="cards">
                <GridView sx={{ mr: 1, fontSize: 18 }} />
                Cards
              </ToggleButton>
              <ToggleButton value="table">
                <TableChart sx={{ mr: 1, fontSize: 18 }} />
                Table
              </ToggleButton>
              {selectedOptions.length > 1 && (
                <ToggleButton value="comparison">
                  <CompareArrows sx={{ mr: 1, fontSize: 18 }} />
                  Compare
                </ToggleButton>
              )}
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Box>
      {/* Results Section */}
      {filteredOptions.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            textAlign: 'center',
            py: 8,
            px: 4,
            border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
            borderRadius: 3,
            background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.primary.main, 0.05)})`
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              mx: 'auto',
              mb: 3
            }}
          >
            <TrendingUp sx={{ fontSize: 40 }} />
          </Box>
          <Typography
            variant="h5"
            color="text.primary"
            sx={{ fontWeight: 600, mb: 1 }}
          >
            No Options Found
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 400, mx: 'auto', lineHeight: 1.6 }}
          >
            Try adjusting your filters or search criteria to find investment
            options that match your requirements.
          </Typography>
        </Card>
      ) : (
        <>
          {viewMode === 'cards' && (
            <InvestmentCardView
              options={filteredOptions}
              getCardActions={(option) => {
                // Show info icon for Arbitrage Fund
                if (option.name === 'Arbitrage Fund') {
                  return (
                    <Tooltip title="Learn more about Arbitrage Funds">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(
                            '/investment-options-analyzer/arbitrage-fund'
                          )
                        }
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        <Info fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  );
                }
                return null;
              }}
            />
          )}
          {viewMode === 'table' && (
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <InvestmentTable
                options={filteredOptions}
                selectedOptions={selectedOptions}
                favorites={favorites}
                onToggleSelect={handleOptionSelect}
                onToggleFavorite={toggleFavorite}
                onCompare={(option) => {
                  // Handle compare action - could open a modal or navigate
                  console.log('Compare option:', option);
                }}
                sortable={true}
                density="standard"
              />
            </Box>
          )}
          {viewMode === 'comparison' && selectedOptions.length > 1 && (
            <Alert
              severity="info"
              sx={{
                borderRadius: 3,
                mb: 3
              }}
            >
              Comparison view will be implemented in Phase 2
            </Alert>
          )}
        </>
      )}

      {/* Investment Guides Section */}
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 600,
            fontSize: '1.3rem',
            mb: 3,
            color: 'primary.main'
          }}
        >
          Detailed Investment Guides
        </Typography>

        <Card
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            mb: 4,
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.02)})`
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Box sx={{ flex: 1 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 0.5 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Arbitrage Fund Complete Guide
                  </Typography>
                  <Tooltip title="Click to read the complete arbitrage fund guide">
                    <IconButton
                      component={Link}
                      to="arbitrage-fund"
                      size="small"
                      sx={{
                        color: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.2
                          )
                        }
                      }}
                    >
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Learn about arbitrage funds - how they work, benefits, risks,
                  and investment strategies
                </Typography>
              </Box>
              <Button
                component={Link}
                to="arbitrage-fund"
                variant="outlined"
                endIcon={<ArrowForward />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  minWidth: 120
                }}
              >
                Read Guide
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Investment Options Guide Markdown */}
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, mb: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 600,
            fontSize: '1.3rem',
            mb: 2,
            mt: 4,
            color: 'primary.main'
          }}
        >
          Investment Options Explained & Guidance
        </Typography>
        <Markdown path="/markdown/investment-options-explained.md" />
      </Box>
    </Box>
  );
}
