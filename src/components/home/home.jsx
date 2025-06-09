import { ArrowForward, CompareArrowsOutlined } from '@mui/icons-material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BalanceIcon from '@mui/icons-material/Balance';
import GridViewIcon from '@mui/icons-material/GridView';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import StarIcon from '@mui/icons-material/Star';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
  alpha,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SocialMediaLinks from '../social-media-links/social-media-links';
import { useIsMobileHook } from '../utils';

// const FDInsights = lazy(() => import('../fd-insights/fd-insights'));

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useIsMobileHook();
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped', 'grid', or 'popular'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const calculatorCards = [
    {
      title: 'Loan Rate Change Calculator',
      description:
        'Analyze impact of interest rate changes on your existing loans',
      icon: <CompareArrowsOutlined />,
      link: '/calculators/loan-rate-change-calculator',
      category: 'Loans',
      color: 'info',
      isPopular: true,
      popularRank: 1
    },
    {
      title: 'Home Loan Comparison',
      description:
        'Compare home loan interest rates, EMIs, and features across banks',
      icon: <HomeWorkOutlinedIcon />,
      link: '/home-loan/comparison',
      category: 'Loans',
      color: 'primary',
      isPopular: true,
      popularRank: 2
    },
    {
      title: 'EMI Calculator',
      description:
        'Calculate loan EMIs, interest costs, and repayment schedules',
      icon: <AccountBalanceIcon />,
      link: '/calculators/emi-calculator',
      category: 'Loans',
      color: 'info',
      isPopular: false
    },
    {
      title: 'Prepay vs Invest',
      description:
        'Compare loan prepayment benefits against investment returns',
      icon: <BalanceIcon />,
      link: '/calculators/loan-prepay-vs-investment-calculator',
      category: 'Loans',
      color: 'info',
      isPopular: false
    },
    {
      title: 'FD Comparator',
      description:
        'Calculate and compare returns from different fixed deposit schemes',
      icon: <CompareArrowsOutlined />,
      link: '/fixed-deposit/comparator',
      category: 'Fixed Deposit',
      color: 'secondary',
      isPopular: true,
      popularRank: 3
    },
    {
      title: 'FD Highest Rates',
      description:
        'Compare latest fixed deposit rates from top banks and NBFCs in India',
      icon: <TableChartOutlinedIcon />,
      link: '/fixed-deposit',
      category: 'Fixed Deposit',
      color: 'primary',
      isPopular: true,
      popularRank: 4
    },
    {
      title: 'FD Tenure Rates',
      description:
        'View and compare fixed deposit interest rates for specific tenures across banks',
      icon: <TableChartOutlinedIcon />,
      link: '/fixed-deposit/view/specific-tenures',
      category: 'Fixed Deposit',
      color: 'success',
      isPopular: false
    },
    {
      title: 'FD Calculator',
      description:
        'Calculate fixed deposit maturity and interest for specific banks and tenures',
      icon: <TableChartOutlinedIcon />,
      link: '/fixed-deposit/state-bank-of-india',
      category: 'Fixed Deposit',
      color: 'info',
      isPopular: false
    },
    {
      title: 'Government Schemes',
      description:
        'Compare popular government investment schemes and tax-saving options',
      icon: <AccountBalanceIcon />,
      link: '/government-schemes/comparison',
      category: 'Government Schemes',
      color: 'warning',
      isPopular: true,
      popularRank: 5
    },
    {
      title: 'Investment Options Analyzer',
      description:
        'Compare and analyze parking & investment options beyond equities',
      icon: <InsightsOutlinedIcon />,
      link: '/investment-options',
      category: 'Advanced',
      color: 'primary',
      isPopular: true,
      popularRank: 6
    },
    {
      title: 'PPF Calculator',
      description:
        'Calculate Public Provident Fund returns and maturity amounts',
      icon: <AccountBalanceWalletIcon />,
      link: '/calculators/ppf-calculator',
      category: 'Government Schemes',
      color: 'primary',
      isPopular: false
    },
    {
      title: 'SIP Calculator',
      description:
        'Plan your mutual fund investments with systematic investment planning',
      icon: <TrendingUpOutlinedIcon />,
      link: '/calculators/sip-calculator',
      category: 'Advanced',
      color: 'success',
      isPopular: false
    },
    {
      title: 'STP Calculator',
      description: 'Optimize systematic transfer plans between mutual funds',
      icon: <InsightsOutlinedIcon />,
      link: '/calculators/stp-calculator',
      category: 'Advanced',
      color: 'secondary',
      isPopular: false
    },
    {
      title: 'SWP Calculator',
      description: 'Plan systematic withdrawals from your investment portfolio',
      icon: <InsightsOutlinedIcon />,
      link: '/calculators/swp-calculator',
      category: 'Advanced',
      color: 'success',
      isPopular: false
    },
    {
      title: 'Goal Calculator',
      description:
        'Plan your financial goals with required monthly savings calculations',
      icon: <TrackChangesOutlinedIcon />,
      link: '/calculators/goal-calculator',
      category: 'Advanced',
      color: 'warning',
      isPopular: false
    },
    {
      title: 'Interest Calculator',
      description:
        'Calculate compound and simple interest for various investment scenarios',
      icon: <PercentOutlinedIcon />,
      link: '/calculators/interest-calculator',
      category: 'Advanced',
      color: 'error',
      isPopular: false
    }
  ];

  // Group cards by category
  const groupedCards = calculatorCards.reduce((groups, card) => {
    const category = card.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(card);
    return groups;
  }, {});

  // Get all unique categories for filtering
  const categories = [
    'all',
    ...new Set(calculatorCards.map((card) => card.category))
  ]; // Filter cards based on selected category and view mode
  const filteredCards = (() => {
    if (viewMode === 'popular') {
      return calculatorCards.filter((card) => Boolean(card.isPopular));
    }

    return selectedCategory === 'all'
      ? calculatorCards
      : calculatorCards.filter((card) => card.category === selectedCategory);
  })();

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const renderCardGrid = (cards, title = null) => (
    <Box sx={{ mb: title ? 4 : 0 }}>
      {title && (
        <Typography
          variant="h5"
          component="h3"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: theme.palette.primary.main,
            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            pb: 1
          }}
        >
          {title}
        </Typography>
      )}
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            lg={4}
            key={`${card.title}-${card.category}-${index}`}
          >
            <Card
              elevation={isMobile ? 2 : 1}
              sx={{
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                transition: 'all 0.3s ease-in-out',
                background: isMobile
                  ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.02)})`
                  : theme.palette.background.paper,
                boxShadow: isMobile
                  ? `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`
                  : theme.shadows[1],
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                  borderColor: theme.palette.primary.main
                },
                '&:active': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6]
                },
                cursor: 'pointer'
              }}
              onClick={() => navigate(card.link)}
            >
              <CardContent
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette[card.color].main, 0.1),
                      color: theme.palette[card.color].main,
                      mr: 2,
                      boxShadow: isMobile
                        ? `inset 0 1px 3px ${alpha(theme.palette.common.black, 0.1)}, 0 1px 2px ${alpha(theme.palette[card.color].main, 0.2)}`
                        : 'none',
                      border: isMobile
                        ? `1px solid ${alpha(theme.palette[card.color].main, 0.2)}`
                        : 'none'
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
                    <Chip
                      label={card.category}
                      size="small"
                      color={card.color}
                      variant="outlined"
                    />
                    {Boolean(card.isPopular) && (
                      <Chip
                        label="Popular"
                        size="small"
                        variant="outlined"
                        icon={<StarIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          fontWeight: 600,
                          borderColor: '#4f46e5',
                          color: '#4f46e5',
                          backgroundColor: 'transparent',
                          '& .MuiChip-icon': {
                            color: '#4f46e5'
                          },
                          '& .MuiChip-label': {
                            color: '#4f46e5',
                            fontWeight: 600
                          },
                          '&:hover': {
                            borderColor: '#3730a3',
                            color: '#3730a3',
                            backgroundColor: alpha('#4f46e5', 0.04),
                            '& .MuiChip-icon': {
                              color: '#3730a3'
                            },
                            '& .MuiChip-label': {
                              color: '#3730a3'
                            }
                          }
                        }}
                      />
                    )}
                  </Stack>
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: 600, flex: 0 }}
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ flex: 1, lineHeight: 1.6 }}
                >
                  {card.description}
                </Typography>
                <CardActions sx={{ p: 0, pt: 2 }}>
                  <Button
                    component={Link}
                    to={card.link}
                    endIcon={<ArrowForward />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 500,
                      ...(isMobile && {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.12)
                        }
                      })
                    }}
                  >
                    Get Started
                  </Button>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
          py: 6,
          px: 2,
          background:
            'linear-gradient(90deg, rgba(0, 0, 128, 0.1), rgba(6, 182, 212, 0.1))',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Typography
          variant={isMobile ? 'h4' : 'h2'}
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(90deg, #000080, #06b6d4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Compare, Calculate, and Optimize
        </Typography>
        <Typography
          variant={isMobile ? 'body1' : 'h6'}
          component="h2"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}
        >
          Check latest interest rates from top banks and NBFCs in India.
          Financial Tools, screeners and calculators are designed with detailed
          analysis and interactive charts to help you make informed investment
          decisions
        </Typography>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button
            component={Link}
            to="/calculators/loan-rate-change-calculator"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: { xs: 0.5, sm: 4 },
              py: 1.5,
              background: 'linear-gradient(135deg, #1e40af, #0891b2)',
              color: 'white',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(30, 64, 175, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8, #0e7490)',
                boxShadow: '0 6px 20px rgba(30, 64, 175, 0.4)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Loan Rate change impact
          </Button>
          <Button
            component={Link}
            to="/home-loan/comparison"
            variant="outlined"
            size="large"
            endIcon={<ArrowForward />}
            sx={{ px: { xs: 0.5, sm: 4 }, py: 1.5 }}
          >
            Explore Home Loan Rates
          </Button>
        </Stack>
      </Box>
      {/* Features Grid */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          component="h2"
          textAlign="center"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          Financial Tools & Calculators
        </Typography>
        {/* View Controls */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 4,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            gap: 2
          }}
        >
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: 2,
                px: 2,
                py: 0.5,
                textTransform: 'none',
                fontWeight: 500
              }
            }}
          >
            <ToggleButton value="grid">
              <GridViewIcon sx={{ mr: 1, fontSize: 18 }} />
              All
            </ToggleButton>
            <ToggleButton value="grouped">
              <ViewListIcon sx={{ mr: 1, fontSize: 18 }} />
              Grouped
            </ToggleButton>
            <ToggleButton value="popular">
              <StarIcon sx={{ mr: 1, fontSize: 18 }} />
              Popular
            </ToggleButton>
          </ToggleButtonGroup>
          {viewMode === 'grid' && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                flexWrap: 'wrap',
                justifyContent: 'center',
                '& > *': { mb: 1 }
              }}
            >
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category === 'all' ? 'All' : category}
                  onClick={() => handleCategoryChange(category)}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  variant={
                    selectedCategory === category ? 'filled' : 'outlined'
                  }
                  sx={{
                    cursor: 'pointer',
                    mb: 1,
                    textTransform: 'capitalize',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>
        {/* Content */}
        {viewMode === 'grouped' ? (
          <Box>
            {Object.entries(groupedCards)
              .sort(([a], [b]) => {
                // Define custom order: Fixed Deposit, Loans, Government Schemes, Advanced
                const order = [
                  'Loans',
                  'Fixed Deposit',
                  'Government Schemes',
                  'Advanced'
                ];
                const indexA = order.indexOf(a);
                const indexB = order.indexOf(b);

                // If both categories are in the order array, sort by their position
                if (indexA !== -1 && indexB !== -1) {
                  return indexA - indexB;
                }

                // If only one category is in the order array, prioritize it
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;

                // If neither category is in the order array, sort alphabetically
                return a.localeCompare(b);
              })
              .map(([category, cards]) => (
                <Box key={category}>{renderCardGrid(cards, category)}</Box>
              ))}
          </Box>
        ) : viewMode === 'popular' ? (
          <Box>
            <Typography
              variant="h5"
              component="h3"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: theme.palette.primary.main,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                pb: 1
              }}
            >
              ⭐ Popular and Trending
            </Typography>
            {renderCardGrid(
              [...filteredCards].sort(
                (a, b) => (a.popularRank ?? 999) - (b.popularRank ?? 999)
              )
            )}
          </Box>
        ) : (
          renderCardGrid(filteredCards)
        )}
      </Box>
      {/* Features Section */}
      <Box sx={{ mt: 10, mb: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          sx={{ mb: 6, fontWeight: 600 }}
        >
          Why Choose Our Platform?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
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
                  mb: 2
                }}
              >
                <TableChartOutlinedIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                Latest Data
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time interest rates and financial data from top banks and
                NBFCs across India
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                  mx: 'auto',
                  mb: 2
                }}
              >
                <CompareArrowsOutlined sx={{ fontSize: 40 }} />
              </Box>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                Smart Comparisons
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Advanced comparison tools with interactive charts and detailed
                breakdown analysis
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  mx: 'auto',
                  mb: 2
                }}
              >
                <InsightsOutlinedIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                Informed Decisions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Make confident financial decisions with comprehensive
                calculations and projections
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ my: 6 }} />
      {/* Footer */}
      <Box component="footer" sx={{ textAlign: 'center' }}>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={isMobile ? 1 : 3}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Link to="/about-us" style={{ textDecoration: 'none' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              About Us
            </Typography>
          </Link>
          <Link to="/privacy-policy" style={{ textDecoration: 'none' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              Privacy Policy
            </Typography>
          </Link>
          <Link to="/disclaimer" style={{ textDecoration: 'none' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              Disclaimer
            </Typography>
          </Link>
          <Link to="/contact-us" style={{ textDecoration: 'none' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ '&:hover': { color: 'primary.main' } }}
            >
              Contact Us
            </Typography>
          </Link>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Have questions or suggestions?&nbsp;
          <Link
            to="/contact-us"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            Reach out to us
          </Link>
        </Typography>
        <SocialMediaLinks />
      </Box>
    </Container>
  );
}
