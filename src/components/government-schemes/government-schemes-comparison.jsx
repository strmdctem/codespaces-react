import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
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
import { useState } from 'react';
import { isMobile } from '../utils';

const governmentSchemes = [
  // Long-term and Tax-saving Investment Schemes
  {
    id: 1,
    name: 'Public Provident Fund (PPF)',
    category: 'Tax Saving',
    tags: ['Tax Saving', 'Long Term'],
    returnsType: 'Fixed',
    interestRate: '7.1%',
    compounding: 'Annual',
    tenure: '15 yrs (extendable)',
    eligibility: 'Resident Indians',
    minInvestment: '₹500/year',
    maxInvestment: '₹1.5 lakh/year',
    taxBenefit: '80C + tax-free interest',
    payoutMode: 'On maturity',
    liquidity: 'Partial after 7 yrs',
    loanFacility: 'Yes',
    riskLevel: 'Low',
    launchYear: '1968',
    highlights: [
      'Tax-free returns',
      'Government backed',
      'Long-term wealth creation'
    ],
    description:
      'A long-term savings scheme with attractive interest rates and tax benefits.'
  },
  {
    id: 2,
    name: 'National Savings Certificate (NSC)',
    category: 'Tax Saving',
    tags: ['Tax Saving', 'Medium Term'],
    returnsType: 'Fixed',
    interestRate: '7.7%',
    compounding: 'Annual',
    tenure: '5 yrs',
    eligibility: 'Resident Indians',
    minInvestment: '₹1,000',
    maxInvestment: 'No upper limit',
    taxBenefit: '80C + interest taxable (reinvested)',
    payoutMode: 'On maturity',
    liquidity: 'Not permitted',
    loanFacility: 'Yes (Pledge)',
    riskLevel: 'Low',
    launchYear: '1950s',
    highlights: ['Fixed returns', 'Government guarantee', 'Simple investment'],
    description: 'A fixed-income investment scheme with guaranteed returns.'
  },
  {
    id: 3,
    name: 'Kisan Vikas Patra (KVP)',
    category: 'Savings',
    tags: ['Savings', 'Long Term'],
    returnsType: 'Fixed',
    interestRate: '7.5%',
    compounding: 'Annual',
    tenure: '115 months (~9 yrs 7 mo.)',
    eligibility: 'Resident Indians (18+)',
    minInvestment: '₹1,000',
    maxInvestment: 'No upper limit',
    taxBenefit: 'No deduction, interest taxable',
    payoutMode: 'On maturity',
    liquidity: 'After 2.5 years',
    loanFacility: 'No',
    riskLevel: 'Low',
    launchYear: '1988',
    highlights: ['Money doubles', 'Government backed', 'No maximum limit'],
    description:
      'Savings certificate that doubles your money in about 10 years.'
  },
  {
    id: 4,
    name: 'RBI Floating Rate Bonds',
    category: 'Savings',
    tags: ['Savings', 'Long Term', 'Half-yearly Payout'],
    returnsType: 'Fixed (Floating)',
    interestRate: '8.05%',
    compounding: 'Half-yearly',
    tenure: '7 yrs',
    eligibility: 'Resident Indians',
    minInvestment: '₹1,000',
    maxInvestment: 'No upper limit',
    taxBenefit: 'No deduction, interest taxable',
    payoutMode: 'Half-yearly',
    liquidity: 'Only for seniors (after 6 yrs)',
    loanFacility: 'No',
    riskLevel: 'Low',
    launchYear: '2020',
    highlights: ['RBI backed', 'Floating interest', '6-month reset'],
    description:
      'Government bonds with floating interest rates reset every 6 months.'
  },

  // Retirement & Pension Schemes
  {
    id: 5,
    name: 'Employee Provident Fund (EPF)',
    category: 'Retirement',
    tags: ['Retirement', 'Tax Saving', 'Long Term'],
    returnsType: 'Partly Market',
    interestRate: '8.15%',
    compounding: 'Annual',
    tenure: 'Until retirement',
    eligibility: 'Salaried employees (EPFO)',
    minInvestment: '% of salary (12%)',
    maxInvestment: 'Based on salary',
    taxBenefit: '80C + tax-free (if held 5+ yrs)',
    payoutMode: 'On maturity',
    liquidity: 'After 5 yrs continuous service',
    loanFacility: 'Partial',
    riskLevel: 'Low',
    launchYear: '1952',
    highlights: [
      'Employer contribution',
      'Higher interest rate',
      'Retirement corpus'
    ],
    description: 'Mandatory retirement savings scheme for salaried employees.'
  },
  {
    id: 6,
    name: 'National Pension Scheme (NPS)',
    category: 'Retirement',
    tags: ['Retirement', 'Tax Saving', 'Long Term', 'Market Linked'],
    returnsType: 'Market-linked',
    interestRate: '~9–12% avg.',
    compounding: 'NA',
    tenure: 'Till age 60 (extendable to 70)',
    eligibility: 'Indian citizens (18–70 yrs)',
    minInvestment: '₹1,000/year',
    maxInvestment: 'No upper limit',
    taxBenefit: '80C + ₹50k u/s 80CCD(1B); 60% withdrawal tax-free',
    payoutMode: 'Pension',
    liquidity: 'Partial after 3 yrs',
    loanFacility: 'No',
    riskLevel: 'Moderate',
    launchYear: '2004/2009',
    highlights: [
      'Market-linked returns',
      'Additional tax benefits',
      'Flexible investment'
    ],
    description:
      'Market-linked pension scheme with additional tax benefits under 80CCD(1B).'
  },
  {
    id: 7,
    name: 'Atal Pension Yojana (APY)',
    category: 'Retirement',
    tags: ['Retirement', 'Long Term', 'Low Premium'],
    returnsType: 'Fixed',
    interestRate: 'Guaranteed pension',
    compounding: 'NA',
    tenure: 'Till age 60',
    eligibility: 'Indian citizens (18–40 yrs)',
    minInvestment: '₹42/month',
    maxInvestment: '₹1,454/month',
    taxBenefit: '80CCD(1); pension taxable',
    payoutMode: 'Pension',
    liquidity: 'Only under special cases',
    loanFacility: 'No',
    riskLevel: 'Low',
    launchYear: '2015',
    highlights: [
      'Guaranteed pension',
      'Government co-contribution',
      'Affordable premiums'
    ],
    description:
      'Pension scheme for unorganized sector workers with government backing.'
  },
  {
    id: 8,
    name: 'Senior Citizens Savings Scheme (SCSS)',
    category: 'Senior Citizens',
    tags: ['Senior Citizens', 'Tax Saving', 'Quarterly Payout'],
    returnsType: 'Fixed',
    interestRate: '8.2%',
    compounding: 'Quarterly',
    tenure: '5 yrs (extendable by 3 yrs)',
    eligibility: 'Senior citizens (60+ yrs)',
    minInvestment: '₹1,000',
    maxInvestment: '₹30 lakh',
    taxBenefit: '80C deduction; interest taxable',
    payoutMode: 'Quarterly',
    liquidity: 'After 1 yr with penalty',
    loanFacility: 'No',
    riskLevel: 'Low',
    launchYear: '2004',
    highlights: [
      'High interest rate',
      'Quarterly payouts',
      'Senior citizen focused'
    ],
    description:
      'High-interest savings scheme specifically designed for senior citizens.'
  },
  {
    id: 9,
    name: 'Pradhan Mantri Vaya Vandana Yojana (PMVVY)',
    category: 'Senior Citizens',
    tags: ['Senior Citizens', 'Monthly Payout'],
    returnsType: 'Fixed',
    interestRate: '7.4%',
    compounding: 'Monthly',
    tenure: '10 yrs',
    eligibility: 'Senior citizens (60+ yrs)',
    minInvestment: 'Variable',
    maxInvestment: '₹15 lakh',
    taxBenefit: 'No deduction; pension taxable',
    payoutMode: 'Monthly',
    liquidity: 'Allowed in special cases',
    loanFacility: 'No',
    riskLevel: 'Low',
    launchYear: '2017',
    highlights: [
      'Monthly pension',
      'Government guarantee',
      'Senior citizen benefit'
    ],
    description:
      'Monthly pension scheme for senior citizens with guaranteed returns.'
  },

  // Women & Girl Child Schemes
  {
    id: 10,
    name: 'Sukanya Samriddhi Yojana (SSY)',
    category: 'Women & Child',
    tags: ['Women & Child', 'Tax Saving', 'Long Term'],
    returnsType: 'Fixed',
    interestRate: '8.0%',
    compounding: 'Annual',
    tenure: '21 yrs (partial at 18 yrs)',
    eligibility: 'Girl child below 10 yrs',
    minInvestment: '₹250/year',
    maxInvestment: '₹1.5 lakh/year',
    taxBenefit: '80C + tax-free interest',
    payoutMode: 'On maturity',
    liquidity: 'After age 18 (up to 50%)',
    loanFacility: 'No',
    riskLevel: 'Low',
    launchYear: '2015',
    highlights: [
      'Highest interest rate',
      'For girl child',
      'Triple tax benefit'
    ],
    description:
      'Special savings scheme for the girl child with highest interest rates.'
  },
  {
    id: 11,
    name: 'Mahila Samman Savings Certificate (MSSC)',
    category: 'Women & Child',
    tags: ['Women & Child', 'Medium Term'],
    returnsType: 'Fixed',
    interestRate: '7.5%',
    compounding: 'Quarterly',
    tenure: '2 yrs',
    eligibility: 'Women residents',
    minInvestment: '₹1,000',
    maxInvestment: '₹2 lakh',
    taxBenefit: 'No deduction; interest taxable',
    payoutMode: 'On maturity',
    liquidity: 'Partial withdrawal allowed',
    loanFacility: 'No',
    riskLevel: 'Low',
    launchYear: '2023',
    highlights: ['Women-focused', 'Short tenure', 'Recent launch'],
    description:
      'Short-term savings certificate specifically designed for women.'
  }
];

const categories = [
  'All',
  'Medium Term',
  'Long Term',
  'Market Linked',
  'Tax Saving',
  'Savings',
  'Retirement',
  'Senior Citizens',
  'Women & Child'
];

const GovernmentSchemesComparison = () => {
  const theme = useTheme();
  const isMobileDevice = isMobile();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSchemes, setSelectedSchemes] = useState([]);
  const filteredSchemes =
    selectedCategory === 'All'
      ? governmentSchemes
      : governmentSchemes.filter(
          (scheme) =>
            scheme.category === selectedCategory ||
            scheme.tags.includes(selectedCategory)
        );
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
      {/* Category Filter */}
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
        <CardContent sx={{ p: 3 }}>
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
              {selectedSchemes.length > 0
                ? 'Compare Schemes'
                : 'Filter by Category'}
            </Typography>
            {/* Clear Button */}
            {selectedSchemes.length > 0 && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => setSelectedSchemes([])}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  minWidth: 'auto',
                  px: 2
                }}
              >
                Clear
              </Button>
            )}
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1.5 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                color={selectedCategory === category ? 'primary' : 'default'}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                sx={{
                  borderRadius: 3,
                  fontWeight: selectedCategory === category ? 600 : 500,
                  px: 1,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                  },
                  ...(selectedCategory === category && {
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
                      Min Investment
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell key={scheme.id} align="center">
                        {scheme.minInvestment}
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
                      Max Investment
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell key={scheme.id} align="center">
                        {scheme.maxInvestment}
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
                      Tax Benefit
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell key={scheme.id} align="center">
                        {scheme.taxBenefit}
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
                      Loan Facility
                    </TableCell>
                    {getSelectedSchemeData().map((scheme) => (
                      <TableCell key={scheme.id} align="center">
                        <Chip
                          label={scheme.loanFacility}
                          size="small"
                          color={
                            scheme.loanFacility === 'Yes'
                              ? 'success'
                              : 'default'
                          }
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
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
                  {/* Tags */}
                  <Box sx={{ mb: 2 }}>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      flexWrap="wrap"
                      sx={{ gap: 0.5 }}
                    >
                      {scheme.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.75rem',
                            height: 24,
                            borderRadius: 2,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.05
                            ),
                            borderColor: alpha(theme.palette.primary.main, 0.2),
                            color: theme.palette.primary.main
                          }}
                        />
                      ))}
                    </Stack>
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
                            Min Investment
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.secondary.main
                            }}
                          >
                            {scheme.minInvestment}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.warning.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
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
                            Risk Level
                          </Typography>
                          <Chip
                            label={scheme.riskLevel}
                            size="small"
                            color={getRiskColor(scheme.riskLevel)}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  <Accordion
                    elevation={0}
                    sx={{
                      '&:before': { display: 'none' },
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                      '&.Mui-expanded': {
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.primary.main
                        }}
                      >
                        View Detailed Information
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0 }}>
                      <Divider sx={{ mb: 2 }} />
                      {/* Key Highlights */}
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 1.5
                          }}
                        >
                          Key Highlights
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ gap: 1 }}
                        >
                          {scheme.highlights.map((highlight, index) => (
                            <Chip
                              key={index}
                              label={highlight}
                              size="small"
                              variant="filled"
                              color="primary"
                              sx={{
                                fontWeight: 500,
                                borderRadius: 2,
                                fontSize: '0.75rem'
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                      {/* Additional Details */}
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
                            Tax Benefit:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {scheme.taxBenefit}
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
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.secondary
                            }}
                          >
                            Loan Facility:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {scheme.loanFacility}
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
                        <Grid item xs={12}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.secondary
                            }}
                          >
                            Max Investment:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {scheme.maxInvestment}
                          </Typography>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
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
              No schemes match the selected &quot;{selectedCategory}&quot;
              category. Try selecting a different category to view available
              schemes.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setSelectedCategory('All')}
              sx={{
                mt: 3,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                py: 1
              }}
            >
              View All Schemes
            </Button>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default GovernmentSchemesComparison;
