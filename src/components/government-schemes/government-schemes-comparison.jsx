import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from '@mui/material';
import { useMemo, useState } from 'react';
import { isMobile } from '../utils';

const governmentSchemes = [
  // Long-term and Tax-saving Investment Schemes
  {
    id: 1,
    name: 'Public Provident Fund (PPF)',
    category: 'Tax Saving',
    tags: ['Tax Saving', 'Long Term', 'No Tax on Interest'],
    returnsType: 'Fixed',
    interestRate: '7.1%',
    compounding: 'Annual',
    tenure: '15 yrs (extendable)',
    eligibility: 'Resident Indians',
    minInvestment: '₹500/year',
    maxInvestment: '₹1.5 lakh/year',
    taxFreeInterest: true,
    taxDeduction: true,
    payoutMode: 'On maturity',
    liquidity: 'Partial after 7 yrs',
    riskLevel: 'Low',
    launchYear: '1968',
    description:
      'A long-term savings scheme with attractive interest rates and tax benefits.',
    purpose: 'Long-term wealth creation',
    idealFor: 'Retirement planning'
  },
  {
    id: 2,
    name: 'National Savings Certificate (NSC)',
    category: 'Tax Saving',
    tags: ['Tax Saving', 'Medium Term', 'Fixed Returns'],
    returnsType: 'Fixed',
    interestRate: '7.7%',
    compounding: 'Annual',
    tenure: '5 yrs',
    eligibility: 'Resident Indians',
    minInvestment: '₹1,000',
    maxInvestment: 'No upper limit',
    taxFreeInterest: false,
    taxDeduction: true,
    payoutMode: 'On maturity',
    liquidity: 'Not permitted',
    riskLevel: 'Low',
    launchYear: '1950s',
    description: 'A fixed-income investment scheme with guaranteed returns.',
    purpose: 'Tax-saving with guaranteed returns',
    idealFor: 'Medium-term goals with tax benefits'
  },
  {
    id: 3,
    name: 'Kisan Vikas Patra (KVP)',
    category: 'Savings',
    tags: ['Savings', 'Long Term', 'Money Doubling'],
    returnsType: 'Fixed',
    interestRate: '7.5%',
    compounding: 'Annual',
    tenure: '115 months (~9 yrs 7 mo.)',
    eligibility: 'Resident Indians (18+)',
    minInvestment: '₹1,000',
    maxInvestment: 'No upper limit',
    taxFreeInterest: false,
    taxDeduction: false,
    payoutMode: 'On maturity',
    liquidity: 'After 2.5 years',
    riskLevel: 'Low',
    launchYear: '1988',
    description:
      'Savings certificate that doubles your money in about 10 years.',
    purpose: 'Money doubling scheme',
    idealFor: 'Long-term savings without tax benefits'
  },
  {
    id: 4,
    name: 'RBI Floating Rate Bonds',
    category: 'Savings',
    tags: ['Savings', 'Long Term', 'Regular Income', 'Floating Rate'],
    returnsType: 'Fixed (Floating)',
    interestRate: '8.05%',
    compounding: 'Half-yearly',
    tenure: '7 yrs',
    eligibility: 'Resident Indians',
    minInvestment: '₹1,000',
    maxInvestment: 'No upper limit',
    taxFreeInterest: false,
    taxDeduction: false,
    payoutMode: 'Half-yearly',
    liquidity: 'Only for seniors (after 6 yrs)',
    riskLevel: 'Low',
    launchYear: '2020',
    description:
      'Government bonds with floating interest rates reset every 6 months.',
    purpose: 'Regular income with inflation protection',
    idealFor: 'Regular income seekers'
  },

  // Retirement & Pension Schemes
  {
    id: 5,
    name: 'Employee Provident Fund (EPF)',
    category: 'Retirement',
    tags: ['Retirement', 'Tax Saving', 'Long Term', 'Employer Contribution'],
    returnsType: 'Partly Market',
    interestRate: '8.15%',
    compounding: 'Annual',
    tenure: 'Until retirement',
    eligibility: 'Salaried employees (EPFO)',
    minInvestment: '% of salary (12%)',
    maxInvestment: 'Based on salary',
    taxFreeInterest: true,
    taxDeduction: true,
    payoutMode: 'On maturity',
    liquidity: 'After 5 yrs continuous service',
    riskLevel: 'Low',
    launchYear: '1952',
    description: 'Mandatory retirement savings scheme for salaried employees.',
    purpose: 'Retirement corpus building',
    idealFor: 'Salaried employees'
  },
  {
    id: 6,
    name: 'National Pension Scheme (NPS)',
    category: 'Retirement',
    tags: [
      'Retirement',
      'Tax Saving',
      'Long Term',
      'Market Linked',
      'Additional Tax Benefits'
    ],
    returnsType: 'Market-linked',
    interestRate: '~9–12% avg.',
    compounding: 'NA',
    tenure: 'Till age 60 (extendable to 70)',
    eligibility: 'Indian citizens (18–70 yrs)',
    minInvestment: '₹1,000/year',
    maxInvestment: 'No upper limit',
    taxFreeInterest: true,
    taxDeduction: true,
    payoutMode: 'Pension',
    liquidity: 'Partial after 3 yrs',
    riskLevel: 'Moderate',
    launchYear: '2004/2009',
    description:
      'Market-linked pension scheme with additional tax benefits under 80CCD(1B).',
    purpose: 'Long-term retirement planning',
    idealFor: 'Long-term retirement with market exposure'
  },
  {
    id: 7,
    name: 'Atal Pension Yojana (APY)',
    category: 'Retirement',
    tags: ['Retirement', 'Long Term', 'Low Premium', 'Guaranteed Pension'],
    returnsType: 'Fixed',
    interestRate: 'Guaranteed pension',
    compounding: 'NA',
    tenure: 'Till age 60',
    eligibility: 'Indian citizens (18–40 yrs)',
    minInvestment: '₹42/month',
    maxInvestment: '₹1,454/month',
    taxFreeInterest: false,
    taxDeduction: true,
    payoutMode: 'Pension',
    liquidity: 'Only under special cases',
    riskLevel: 'Low',
    launchYear: '2015',
    description:
      'Pension scheme for unorganized sector workers with government backing.',
    purpose: 'Guaranteed pension for unorganized sector',
    idealFor: 'Unorganized sector workers'
  },
  {
    id: 8,
    name: 'Senior Citizens Savings Scheme (SCSS)',
    category: 'Senior Citizens',
    tags: ['Senior Citizens', 'Tax Saving', 'Regular Income', 'High Returns'],
    returnsType: 'Fixed',
    interestRate: '8.2%',
    compounding: 'Quarterly',
    tenure: '5 yrs (extendable by 3 yrs)',
    eligibility: 'Senior citizens (60+ yrs)',
    minInvestment: '₹1,000',
    maxInvestment: '₹30 lakh',
    taxFreeInterest: false,
    taxDeduction: true,
    payoutMode: 'Quarterly',
    liquidity: 'After 1 yr with penalty',
    riskLevel: 'Low',
    launchYear: '2004',
    description:
      'High-interest savings scheme specifically designed for senior citizens.',
    purpose: 'Regular income for senior citizens',
    idealFor: 'Senior citizens seeking regular income'
  },
  {
    id: 9,
    name: 'Pradhan Mantri Vaya Vandana Yojana (PMVVY)',
    category: 'Senior Citizens',
    tags: ['Senior Citizens', 'Regular Income', 'Guaranteed Returns'],
    returnsType: 'Fixed',
    interestRate: '7.4%',
    compounding: 'Monthly',
    tenure: '10 yrs',
    eligibility: 'Senior citizens (60+ yrs)',
    minInvestment: 'Variable',
    maxInvestment: '₹15 lakh',
    taxFreeInterest: false,
    taxDeduction: false,
    payoutMode: 'Monthly',
    liquidity: 'Allowed in special cases',
    riskLevel: 'Low',
    launchYear: '2017',
    description:
      'Monthly pension scheme for senior citizens with guaranteed returns.',
    purpose: 'Monthly income for senior citizens',
    idealFor: 'Senior citizens needing monthly income'
  },

  // Women & Girl Child Schemes
  {
    id: 10,
    name: 'Sukanya Samriddhi Yojana (SSY)',
    category: 'Women & Child',
    tags: [
      'Women & Child',
      'Tax Saving',
      'Long Term',
      'Highest Returns',
      'No Tax on Interest'
    ],
    returnsType: 'Fixed',
    interestRate: '8.0%',
    compounding: 'Annual',
    tenure: '21 yrs (partial at 18 yrs)',
    eligibility: 'Girl child below 10 yrs',
    minInvestment: '₹250/year',
    maxInvestment: '₹1.5 lakh/year',
    taxFreeInterest: true,
    taxDeduction: true,
    payoutMode: 'On maturity',
    liquidity: 'After age 18 (up to 50%)',
    loanFacility: 'No',
    riskLevel: 'Low',
    launchYear: '2015',
    description:
      'Special savings scheme for the girl child with highest interest rates.',
    purpose: 'Girl child education and marriage',
    idealFor: 'Parents of girl child'
  },
  {
    id: 11,
    name: 'Mahila Samman Savings Certificate (MSSC)',
    category: 'Women & Child',
    tags: ['Women & Child', 'Medium Term', 'Women Empowerment'],
    returnsType: 'Fixed',
    interestRate: '7.5%',
    compounding: 'Quarterly',
    tenure: '2 yrs',
    eligibility: 'Women residents',
    minInvestment: '₹1,000',
    maxInvestment: '₹2 lakh',
    taxFreeInterest: false,
    taxDeduction: false,
    payoutMode: 'On maturity',
    liquidity: 'Partial withdrawal allowed',
    loanFacility: 'No',
    riskLevel: 'Low',
    launchYear: '2023',
    description:
      'Short-term savings certificate specifically designed for women.',
    purpose: 'Women empowerment and financial inclusion',
    idealFor: 'Women seeking short-term investment'
  },
  {
    id: 12,
    name: 'Post Office Fixed Deposit (POFD)',
    category: 'Savings',
    tags: ['Savings', 'Fixed Deposit', 'Post Office'],
    returnsType: 'Fixed',
    interestRate: '6.9% – 7.5%',
    compounding: 'Quarterly',
    tenure: '1, 2, 3, 5 yrs',
    eligibility: 'Resident Indians',
    minInvestment: '₹1,000',
    maxInvestment: 'No upper limit',
    taxFreeInterest: false,
    taxDeduction: '5-yr FD eligible for 80C',
    payoutMode: 'On maturity',
    liquidity: 'Premature withdrawal allowed (with penalty)',
    riskLevel: 'Low',
    launchYear: '1981',
    description:
      'Government-backed fixed deposit scheme with multiple tenure options.',
    purpose: 'Safe savings with fixed returns',
    idealFor: 'For safe and guaranteed returns'
  }
];

// User-centric filter categories based on requirements
const quickFilters = [
  {
    id: 'short-term',
    label: '≤5 Years',
    description: 'Short-term investment options',
    filters: {
      tenureYears: { max: 5 }
    }
  },
  {
    id: 'medium-term',
    label: '>5 & ≤10 Years',
    description: 'Medium-term investment options',
    filters: {
      tenureYears: { min: 5, max: 10 }
    }
  },
  {
    id: 'long-term',
    label: '10+ Years',
    description: 'Long-term investment options',
    filters: {
      tenureYears: { min: 10 }
    }
  },
  {
    id: 'tax-free-interest',
    label: 'Tax-Free Interest',
    description: 'Interest earnings are completely tax-free',
    filters: {
      taxFreeInterest: true
    }
  },
  {
    id: 'retirement',
    label: 'Retirement',
    description: 'Schemes for retirement planning',
    filters: {
      categories: ['Retirement']
    }
  },
  {
    id: 'senior-citizen',
    label: 'Senior Citizen',
    description: 'Special schemes for senior citizens',
    filters: {
      categories: ['Senior Citizens']
    }
  },
  {
    id: 'women-child',
    label: 'Women & Child',
    description: 'Schemes for women and girl child',
    filters: {
      categories: ['Women & Child']
    }
  },
  {
    id: 'partial-withdrawal',
    label: 'Partial Withdrawal',
    description: 'Allows partial withdrawal before maturity',
    filters: {
      partialWithdrawal: true
    }
  }
];

const GovernmentSchemesComparison = () => {
  const theme = useTheme();
  const isMobileDevice = isMobile();
  const [selectedSchemes, setSelectedSchemes] = useState([]);
  const [activeQuickFilters, setActiveQuickFilters] = useState([]); // Enhanced filtering logic with union for year filters
  const filteredSchemes = useMemo(() => {
    let filtered = [...governmentSchemes];

    if (activeQuickFilters.length > 0) {
      // Separate year-based filters from other filters
      const yearFilters = activeQuickFilters.filter((id) =>
        ['short-term', 'medium-term', 'long-term'].includes(id)
      );
      const otherFilters = activeQuickFilters.filter(
        (id) => !['short-term', 'medium-term', 'long-term'].includes(id)
      );

      // Apply year filters with OR logic (union)
      if (yearFilters.length > 0) {
        filtered = filtered.filter((scheme) => {
          // Extract years from tenure string
          const tenureStr = scheme.tenure.toLowerCase();
          let years = 0;

          if (tenureStr.includes('yrs') || tenureStr.includes('years')) {
            const yearMatch = tenureStr.match(/(\d+)\s*(yrs?|years?)/);
            if (yearMatch) {
              years = parseInt(yearMatch[1]);
            }
          } else if (
            tenureStr.includes('months') ||
            tenureStr.includes('mo.')
          ) {
            const monthMatch = tenureStr.match(/(\d+)\s*(months?|mo\.)/);
            if (monthMatch) {
              years = parseInt(monthMatch[1]) / 12;
            }
          } else if (
            tenureStr.includes('retirement') ||
            tenureStr.includes('age 60')
          ) {
            years = 30; // Assume long-term for retirement schemes
          }

          // Check if scheme matches ANY of the selected year filters
          return yearFilters.some((filterId) => {
            const quickFilter = quickFilters.find((f) => f.id === filterId);
            if (quickFilter?.filters?.tenureYears) {
              const qf = quickFilter.filters.tenureYears;

              if (qf.min !== undefined && qf.max !== undefined) {
                return years > qf.min && years <= qf.max;
              } else if (qf.min !== undefined) {
                return years >= qf.min;
              } else if (qf.max !== undefined) {
                return years <= qf.max;
              }
            }
            return false;
          });
        });
      }

      // Apply other filters with AND logic (intersection)
      otherFilters.forEach((filterId) => {
        const quickFilter = quickFilters.find((f) => f.id === filterId);
        if (quickFilter?.filters) {
          const { filters: qf } = quickFilter;

          if (qf.taxFreeInterest !== undefined) {
            filtered = filtered.filter(
              (scheme) => scheme.taxFreeInterest === qf.taxFreeInterest
            );
          }
          if (qf.categories) {
            filtered = filtered.filter((scheme) =>
              qf.categories.includes(scheme.category)
            );
          }
          if (qf.partialWithdrawal) {
            filtered = filtered.filter(
              (scheme) =>
                scheme.liquidity.toLowerCase().includes('partial') ||
                scheme.liquidity.toLowerCase().includes('after') ||
                (scheme.liquidity.toLowerCase().includes('allowed') &&
                  !scheme.liquidity.toLowerCase().includes('not'))
            );
          }
        }
      });
    }
    return filtered;
  }, [activeQuickFilters]);
  const handleQuickFilterChange = (filterId) => {
    setActiveQuickFilters((prev) => {
      if (prev.includes(filterId)) {
        return prev.filter((id) => id !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };

  const handleResetQuickFilters = () => {
    setActiveQuickFilters([]);
  };

  const handleSchemeSelect = (schemeId) => {
    if (selectedSchemes.includes(schemeId)) {
      setSelectedSchemes(selectedSchemes.filter((id) => id !== schemeId));
    } else if (selectedSchemes.length < 11) {
      const isFirstSelection = selectedSchemes.length === 0;
      setSelectedSchemes([...selectedSchemes, schemeId]);

      // Auto-scroll to comparison table only when selecting the first scheme
      if (isFirstSelection) {
        setTimeout(() => {
          const element = document.getElementById('comparison-table');
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100); // Small delay to ensure state update and render
      }
    }
  };

  const getSelectedSchemeData = () => {
    return governmentSchemes.filter((scheme) =>
      selectedSchemes.includes(scheme.id)
    );
  };
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Very Low':
        return 'success';
      case 'Low':
        return 'info';
      case 'Medium':
      case 'Moderate':
        return 'warning';
      case 'High':
        return 'error';
      default:
        return 'default';
    }
  };
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 6,
          py: 4,
          px: 2,
          background:
            'linear-gradient(90deg, rgba(0, 0, 128, 0.1), rgba(6, 182, 212, 0.1))',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Typography
          variant={isMobileDevice ? 'h5' : 'h3'}
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(90deg, #000080, #06b6d4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobileDevice ? 0 : 2
          }}
        >
          <AccountBalanceIcon
            fontSize="large"
            sx={{
              color: theme.palette.primary.main,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
          Government Schemes Comparison
        </Typography>
        <Typography
          variant={isMobileDevice ? 'subtitle2' : 'h6'}
          component="h2"
          color="text.secondary"
          sx={{
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          Compare various government-backed investment and savings schemes with
          detailed analysis to make informed financial decisions.
        </Typography>
      </Box>
      {/* Quick Filter Chips */}
      <Card
        elevation={isMobileDevice ? 2 : 1}
        sx={{
          mb: 4,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          background: isMobileDevice
            ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.02)})`
            : theme.palette.background.paper
        }}
      >
        <CardContent sx={{ p: 1, py: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              🎯 Quick Filters
              <Chip
                label={`${filteredSchemes.length} found`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Typography>
            {activeQuickFilters.length > 0 && (
              <Button
                size="small"
                variant="outlined"
                onClick={handleResetQuickFilters}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  minWidth: 'auto',
                  px: 2
                }}
              >
                Reset
              </Button>
            )}
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
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
                  borderRadius: 3,
                  fontWeight: activeQuickFilters.includes(filter.id)
                    ? 600
                    : 500,
                  px: 1,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  },
                  ...(activeQuickFilters.includes(filter.id) && {
                    background: 'linear-gradient(135deg, #1e40af, #0891b2)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(30, 64, 175, 0.3)'
                  })
                }}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Selection Instructions */}
      <Alert
        severity="info"
        sx={{
          mb: 4,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          background: `linear-gradient(145deg, ${alpha(theme.palette.info.main, 0.05)}, ${alpha(theme.palette.info.main, 0.1)})`,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                💡 How to Compare Schemes:
              </Typography>
              {/* Selection Counter */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              >
                <CompareArrowsIcon
                  sx={{
                    fontSize: 16,
                    color: theme.palette.primary.main
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main
                  }}
                >
                  {selectedSchemes.length}/11 Selected
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2">
              Click the <strong>&quot;Select to Compare&quot;</strong> button on
              schemes to see a detailed side-by-side comparison.
              {selectedSchemes.length > 0 && (
                <span style={{ marginLeft: 8 }}>
                  <strong>{selectedSchemes.length}</strong> scheme
                  {selectedSchemes.length > 1 ? 's' : ''} currently selected.
                </span>
              )}
            </Typography>
          </Box>
          {selectedSchemes.length > 0 && (
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                const element = document.getElementById('comparison-table');
                if (element) {
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }}
              sx={{
                ml: 2,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 120
              }}
            >
              View Comparison
            </Button>
          )}
        </Box>
      </Alert>
      {/* Comparison Table */}
      {selectedSchemes.length > 0 && (
        <Card
          id="comparison-table"
          elevation={isMobileDevice ? 2 : 1}
          sx={{
            mb: 4,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            background: isMobileDevice
              ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.02)})`
              : theme.palette.background.paper
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                fontWeight: 600,
                mb: 3
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                }}
              >
                <CompareArrowsIcon />
              </Box>
              Detailed Comparison
            </Typography>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                '& .MuiTableHead-root': {
                  background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.1)})`
                }
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                      }}
                    >
                      Feature
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell
                        key={scheme.id}
                        align="center"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.primary.main
                        }}
                      >
                        {scheme.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{
                      '&:nth-of-type(odd)': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                      }}
                    >
                      Interest Rate
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell
                        key={scheme.id}
                        align="center"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.success.main
                        }}
                      >
                        {scheme.interestRate}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow
                    sx={{
                      '&:nth-of-type(even)': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                      }}
                    >
                      Tenure
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell key={scheme.id} align="center">
                        {scheme.tenure}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow
                    sx={{
                      '&:nth-of-type(odd)': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                      }}
                    >
                      Investment Range
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell key={scheme.id} align="center">
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {scheme.minInvestment}
                          <br />
                          <span style={{ opacity: 0.7 }}>
                            to {scheme.maxInvestment}
                          </span>
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow
                    sx={{
                      '&:nth-of-type(odd)': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                      }}
                    >
                      Tax Benefits
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell key={scheme.id} align="center">
                        {scheme.taxDeduction && scheme.taxFreeInterest
                          ? 'Deduction + Tax-free interest'
                          : scheme.taxDeduction
                            ? 'Tax deduction only'
                            : scheme.taxFreeInterest
                              ? 'Tax-free interest only'
                              : 'No tax benefits'}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow
                    sx={{
                      '&:nth-of-type(even)': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                      }}
                    >
                      Liquidity
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell key={scheme.id} align="center">
                        {scheme.liquidity}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow
                    sx={{
                      '&:nth-of-type(odd)': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                      }}
                    >
                      Risk Level
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell key={scheme.id} align="center">
                        <Chip
                          label={scheme.riskLevel}
                          size="small"
                          color={getRiskColor(scheme.riskLevel)}
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow
                    sx={{
                      '&:nth-of-type(even)': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                      }}
                    >
                      Returns Type
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell key={scheme.id} align="center">
                        {scheme.returnsType}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow
                    sx={{
                      '&:nth-of-type(odd)': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                      }}
                    >
                      Compounding
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell key={scheme.id} align="center">
                        {scheme.compounding}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow
                    sx={{
                      '&:nth-of-type(even)': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                      }}
                    >
                      Eligibility
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell key={scheme.id} align="center">
                        {scheme.eligibility}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow
                    sx={{
                      '&:nth-of-type(odd)': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                      }}
                    >
                      Payout Mode
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell key={scheme.id} align="center">
                        {scheme.payoutMode}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow
                    sx={{
                      '&:nth-of-type(odd)': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                      }}
                    >
                      Launch Year
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell key={scheme.id} align="center">
                        {scheme.launchYear}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
      {/* Schemes Grid */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          Available Schemes
          <Chip
            label={`${filteredSchemes.length} schemes`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        </Typography>
        <Grid container spacing={3}>
          {filteredSchemes.map((scheme) => (
            <Grid item xs={12} md={6} lg={4} key={scheme.id}>
              <Card
                elevation={isMobileDevice ? 2 : 1}
                sx={{
                  height: '100%',
                  border: selectedSchemes.includes(scheme.id) ? 2 : 1,
                  borderColor: selectedSchemes.includes(scheme.id)
                    ? 'primary.main'
                    : 'divider',
                  borderRadius: 3,
                  transition: 'all 0.3s ease-in-out',
                  background: isMobileDevice
                    ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.02)})`
                    : theme.palette.background.paper,
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  },
                  ...(selectedSchemes.includes(scheme.id) && {
                    background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.2)}`
                  })
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        flex: 1,
                        fontWeight: 600,
                        pr: 1
                      }}
                    >
                      {scheme.name}
                    </Typography>
                    <Chip
                      label={scheme.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{
                        fontWeight: 500,
                        borderRadius: 2
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      lineHeight: 1.5
                    }}
                  >
                    {scheme.description}
                  </Typography>
                  {/* Key Metrics */}
                  <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                            textAlign: 'center'
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                          >
                            Interest Rate
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              color: theme.palette.success.main,
                              fontWeight: 700,
                              fontSize: '1.1rem'
                            }}
                          >
                            {scheme.interestRate}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                            textAlign: 'center'
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                          >
                            Tenure
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.info.main
                            }}
                          >
                            {scheme.tenure}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.secondary.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                            textAlign: 'center'
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                          >
                            Investment Range
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.secondary.main,
                              fontSize: '0.8rem',
                              lineHeight: 1.2
                            }}
                          >
                            {scheme.minInvestment}
                            <br />
                            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                              to {scheme.maxInvestment}
                            </span>
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                          >
                            Interest Tax Status
                          </Typography>
                          <Chip
                            label={
                              scheme.taxFreeInterest ? 'Tax-Free' : 'Taxable'
                            }
                            size="small"
                            color={
                              scheme.taxFreeInterest ? 'success' : 'warning'
                            }
                            sx={{
                              fontWeight: 600,
                              ...(scheme.taxFreeInterest && {
                                bgcolor: theme.palette.success.main,
                                color: 'white'
                              })
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>{' '}
                  </Box>{' '}
                  {/* Additional Details */}
                  <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.secondary
                          }}
                        >
                          Eligibility:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {scheme.eligibility}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.secondary
                          }}
                        >
                          Tax Benefits:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {scheme.taxDeduction && scheme.taxFreeInterest
                            ? 'Tax deduction + Tax-free interest'
                            : scheme.taxDeduction
                              ? 'Tax deduction only'
                              : scheme.taxFreeInterest
                                ? 'Tax-free interest only'
                                : 'No tax benefits'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.secondary
                          }}
                        >
                          Returns Type:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {scheme.returnsType}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.secondary
                          }}
                        >
                          Compounding:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {scheme.compounding}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.secondary
                          }}
                        >
                          Payout Mode:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {scheme.payoutMode}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.secondary
                          }}
                        >
                          Liquidity:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {scheme.liquidity}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  {/* Toggle Selection Button */}
                  <Box
                    sx={{
                      mt: 3,
                      pt: 2,
                      borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}
                  >
                    <Button
                      variant={
                        selectedSchemes.includes(scheme.id)
                          ? 'contained'
                          : 'outlined'
                      }
                      size="small"
                      fullWidth
                      onClick={() => handleSchemeSelect(scheme.id)}
                      disabled={
                        !selectedSchemes.includes(scheme.id) &&
                        selectedSchemes.length >= 11
                      }
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        py: 1,
                        ...(selectedSchemes.includes(scheme.id)
                          ? {
                              // Selected state - filled button
                              bgcolor: theme.palette.success.main,
                              color: 'white',
                              border: `1px solid ${theme.palette.success.main}`,
                              '&:hover': {
                                bgcolor: theme.palette.success.dark,
                                transform: 'translateY(-1px)',
                                boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`
                              }
                            }
                          : {
                              // Unselected state - outlined button
                              borderColor: alpha(
                                theme.palette.primary.main,
                                0.2
                              ),
                              color: theme.palette.primary.main,
                              bgcolor: 'transparent',
                              '&:hover': {
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.08
                                ),
                                borderColor: theme.palette.primary.main,
                                transform: 'translateY(-1px)',
                                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`
                              }
                            }),
                        '&:disabled': {
                          borderColor: theme.palette.action.disabled,
                          color: theme.palette.action.disabled,
                          bgcolor: 'transparent',
                          transform: 'none',
                          boxShadow: 'none'
                        }
                      }}
                    >
                      {selectedSchemes.includes(scheme.id)
                        ? '✓ Selected'
                        : selectedSchemes.length >= 11
                          ? 'Maximum schemes selected'
                          : '+ Select to Compare'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {filteredSchemes.length === 0 && (
          <Card
            elevation={0}
            sx={{
              textAlign: 'center',
              py: 8,
              px: 4,
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 3,
              background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              mt: 4
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
              <SearchIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography
              variant="h5"
              color="text.primary"
              sx={{
                fontWeight: 600,
                mb: 1
              }}
            >
              No Schemes Found
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 400,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              No schemes match the selected filters. Try adjusting your filters
              or reset them to view available schemes.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleResetQuickFilters}
              sx={{
                mt: 3,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                py: 1
              }}
            >
              Reset Filters
            </Button>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default GovernmentSchemesComparison;
