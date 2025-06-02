import { ArrowForward, CompareArrowsOutlined } from '@mui/icons-material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BalanceIcon from '@mui/icons-material/Balance';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
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
  Typography,
  useTheme
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import SocialMediaLinks from '../social-media-links/social-media-links';
import { isMobile } from '../utils';

// const FDInsights = lazy(() => import('../fd-insights/fd-insights'));

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();

  const calculatorCards = [
    {
      title: 'FD Highest Rates',
      description:
        'Compare latest fixed deposit rates from top banks and NBFCs in India',
      icon: <TableChartOutlinedIcon />,
      link: '/fixed-deposit',
      category: 'Popular',
      color: 'primary'
    },
    {
      title: 'FD Comparator',
      description:
        'Calculate and compare returns from different fixed deposit schemes',
      icon: <CompareArrowsOutlined />,
      link: '/fixed-deposit/comparator',
      category: 'Popular',
      color: 'secondary'
    },
    {
      title: 'SIP Calculator',
      description:
        'Plan your mutual fund investments with systematic investment planning',
      icon: <TrendingUpOutlinedIcon />,
      link: '/calculators/sip-calculator',
      category: 'Investment',
      color: 'success'
    },
    {
      title: 'EMI Calculator',
      description:
        'Calculate loan EMIs, interest costs, and repayment schedules',
      icon: <AccountBalanceIcon />,
      link: '/calculators/emi-calculator',
      category: 'Loans',
      color: 'info'
    },
    {
      title: 'Goal Calculator',
      description:
        'Plan your financial goals with required monthly savings calculations',
      icon: <TrackChangesOutlinedIcon />,
      link: '/calculators/goal-calculator',
      category: 'Planning',
      color: 'warning'
    },
    {
      title: 'Interest Calculator',
      description:
        'Calculate compound and simple interest for various investment scenarios',
      icon: <PercentOutlinedIcon />,
      link: '/calculators/interest-calculator',
      category: 'Basic',
      color: 'error'
    },
    {
      title: 'PPF Calculator',
      description:
        'Calculate Public Provident Fund returns and maturity amounts',
      icon: <AccountBalanceWalletIcon />,
      link: '/calculators/ppf-calculator',
      category: 'Tax Saving',
      color: 'primary'
    },
    {
      title: 'STP Calculator',
      description: 'Optimize systematic transfer plans between mutual funds',
      icon: <InsightsOutlinedIcon />,
      link: '/calculators/stp-calculator',
      category: 'Advanced',
      color: 'secondary'
    },
    {
      title: 'SWP Calculator',
      description: 'Plan systematic withdrawals from your investment portfolio',
      icon: <InsightsOutlinedIcon />,
      link: '/calculators/swp-calculator',
      category: 'Advanced',
      color: 'success'
    },
    {
      title: 'Prepay vs Invest',
      description:
        'Compare loan prepayment benefits against investment returns',
      icon: <BalanceIcon />,
      link: '/calculators/loan-prepay-vs-investment-calculator',
      category: 'Decision',
      color: 'info'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 8,
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
          variant={isMobile() ? 'h3' : 'h2'}
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
          variant={isMobile() ? 'body1' : 'h6'}
          component="h2"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}
        >
          Your comprehensive financial planning platform with latest interest
          rates from top banks and NBFCs in India. Use our advanced calculators
          with interactive charts and detailed analysis for informed financial
          decisions.
        </Typography>
        <Stack
          direction={isMobile() ? 'column' : 'row'}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button
            component={Link}
            to="/fixed-deposit"
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
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
            Explore FD Rates
          </Button>
          <Button
            component={Link}
            to="/calculators/sip-calculator"
            variant="outlined"
            size="large"
            endIcon={<ArrowForward />}
            sx={{ px: 4, py: 1.5 }}
          >
            Start Calculating
          </Button>
        </Stack>
      </Box>
      {/* Features Grid */}
      <Typography
        variant="h4"
        component="h2"
        textAlign="center"
        sx={{ mb: 1, fontWeight: 600 }}
      >
        Financial Tools & Calculators
      </Typography>
      <Typography
        variant="body1"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
      >
        Choose from our comprehensive suite of financial tools, screeners and
        calculators designed to help you make informed investment decisions
      </Typography>
      <Grid container spacing={3}>
        {calculatorCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Card
              elevation={isMobile() ? 2 : 1}
              sx={{
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                transition: 'all 0.3s ease-in-out',
                background: isMobile()
                  ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.02)})`
                  : theme.palette.background.paper,
                boxShadow: isMobile()
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
                      boxShadow: isMobile()
                        ? `inset 0 1px 3px ${alpha(theme.palette.common.black, 0.1)}, 0 1px 2px ${alpha(theme.palette[card.color].main, 0.2)}`
                        : 'none',
                      border: isMobile()
                        ? `1px solid ${alpha(theme.palette[card.color].main, 0.2)}`
                        : 'none'
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Chip
                    label={card.category}
                    size="small"
                    color={card.color}
                    variant="outlined"
                  />
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
                      ...(isMobile() && {
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
          direction={isMobile() ? 'column' : 'row'}
          spacing={isMobile() ? 1 : 3}
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
          Have questions or suggestions?
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
