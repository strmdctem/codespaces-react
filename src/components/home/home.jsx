import { CompareArrowsOutlined, LaunchOutlined } from '@mui/icons-material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import SocialMediaLinks from '../social-media-links/social-media-links';
import { isMobile } from '../utils';

// const FDInsights = lazy(() => import('../fd-insights/fd-insights'));

export default function Home({ isDarkMode }) {
  // const { ref, inView } = useInView({
  //   threshold: 0.1,
  //   triggerOnce: true
  // });

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        px: isMobile() ? 2 : '25%',
        py: 2
      }}
    >
      <Paper elevation={0}>
        <Typography
          variant="subtitle1"
          component="h2"
          className="home-title"
          color="primary"
          fontWeight="bold"
          sx={{ mt: -1 }}
        >
          Compare, Calculate, and Optimize.
        </Typography>
        <Typography variant="body1" component="h1" className="home-intro">
          Check the Latest Fixed Deposit Interest Rates from Top Banks and NBFCs
          in India. Use the FD Screener and Calculator to Compare Rates and
          Returns. All financial calculators, including SIP, EMI, and Goal
          Calculators, feature interactive charts and detailed breakdown tables
          for saving and comparing scenarios.
        </Typography>
      </Paper>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6}>
          <Paper>
            <Link
              to={`/fixed-deposit`}
              aria-label="Check Latest Fixed Deposit Rates of All Banks"
              title="Check Latest Fixed Deposit Rates of All Banks"
            >
              <Button
                className="home-button"
                variant="contained"
                component="h2"
                fullWidth
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <TableChartOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                FD Screener
              </Button>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Paper>
            <Link
              to={`/fixed-deposit/comparator`}
              aria-label="Fixed Deposit Comparator and Calculator"
              title="Fixed Deposit Comparator - Calculate and Compare FD Returns"
            >
              <Button
                className="home-button"
                variant="contained"
                component="h2"
                fullWidth
                sx={{
                  textTransform: 'initial',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <CompareArrowsOutlined fontSize="small" sx={{ mr: 1 }} />
                FD Comparator
              </Button>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Paper>
            <Link
              to={`/calculators/sip-calculator`}
              aria-label="SIP Calculator"
              title="SIP Calculator - Plan Your Mutual Fund Investments"
            >
              <Button
                className="home-button"
                variant="contained"
                component="h2"
                fullWidth
                sx={{
                  textTransform: 'initial',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <TrendingUpOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                SIP Calculator
              </Button>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Paper>
            <Link
              to={`/calculators/emi-calculator`}
              aria-label="EMI Calculator"
              title="EMI Calculator - Calculate Loan EMIs and Compare"
            >
              <Button
                className="home-button"
                variant="contained"
                component="h2"
                fullWidth
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <AccountBalanceIcon fontSize="small" sx={{ mr: 1, mt: -0.5 }} />
                EMI Calculator
              </Button>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Paper>
            <Link
              to={`/calculators/goal-calculator`}
              aria-label="Goal Calculator"
              title="Goal Calculator - Plan Your Financial Goals"
            >
              <Button
                className="home-button"
                variant="contained"
                component="h2"
                fullWidth
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {' '}
                <TrackChangesOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                Goal Calculator
              </Button>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Paper>
            <Link
              to={`/calculators/interest-calculator`}
              aria-label="Interest Calculator"
              title="Interest Calculator - Save and Compare"
            >
              <Button
                className="home-button"
                variant="contained"
                component="h2"
                fullWidth
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <PercentOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                Interest Calc...
              </Button>
            </Link>
          </Paper>
        </Grid>
      </Grid>
      <br />
      <Stack sx={{ mt: 1 }} direction={isMobile() ? 'column' : 'row'}>
        <Stack width={isMobile() ? '100%' : '50%'}>
          <Typography
            variant="subtitle1"
            component="h2"
            color="primary"
            sx={{ fontWeight: 'bold' }}
            className="home-title"
          >
            <Link
              to={`/fixed-deposit`}
              className="menu-link"
              aria-label="Fixed Deposit Screener - All Rates"
              title="View all fixed deposit rates"
            >
              Fixed Deposit Screener - All Rates
              <LaunchOutlined fontSize="small" sx={{ mx: 0.5 }} />
            </Link>
          </Typography>
          <Typography variant="body1" component="h3">
            The FD Screener displays the latest fixed deposit rates from top
            banks and NBFCs. It helps in comparing rates and calculating
            potential returns.
          </Typography>
          <Paper sx={{ px: 2, paddingTop: 1, mt: 1, mb: 4 }}>
            {isDarkMode ? (
              <img
                src="insights/fd-screener-dark.avif"
                alt="Latest Fixed Deposit Interest Rates"
                title="FD Screener"
                width="100%"
                height="auto"
                onDoubleClick={() => navigate('/fixed-deposit')}
              />
            ) : (
              <img
                src="insights/fd-screener-1.avif"
                alt="Latest Fixed Deposit Interest Rates"
                title="FD Screener"
                width="350"
                height="315"
                style={isMobile() ? { height: 'auto', width: '100%' } : {}}
                onDoubleClick={() => navigate('/fixed-deposit')}
              />
            )}
          </Paper>
        </Stack>
        <Stack width={isMobile() ? '100%' : '50%'}>
          <Typography
            variant="subtitle1"
            component="h2"
            color="primary"
            sx={{ fontWeight: 'bold' }}
            className="home-title"
          >
            <Link
              to={`/fixed-deposit/calculator`}
              className="menu-link"
              aria-label="Fixed Deposit Comparator and Calculator"
              title="Calculate and Compare fixed deposit rates"
            >
              FD Comparator and Calculator
              <LaunchOutlined fontSize="small" sx={{ mx: 0.5 }} />
            </Link>
          </Typography>
          <Typography variant="body1" component="h3">
            The FD Comparator calculates and compares fixed deposit interest
            based on rates of various banks, assisting in selecting the best
            option.
          </Typography>
          <Paper sx={{ px: 2, py: 1, mt: 1, mb: 4 }}>
            {isDarkMode ? (
              <img
                src="insights/fd-calculator-dark.avif"
                alt="Fixed Deposit Comparator"
                title="FD Comparator"
                width="100%"
                height="auto"
                onDoubleClick={() => navigate('/fixed-deposit/comparator')}
              />
            ) : (
              <img
                src="insights/fd-calculator-1.avif"
                alt="Fixed Deposit Comparator"
                title="FD Comparator"
                width="350"
                height="330"
                style={isMobile() ? { height: 'auto', width: '100%' } : {}}
                onDoubleClick={() => navigate('/fixed-deposit/comparator')}
              />
            )}
          </Paper>
        </Stack>
      </Stack>
      <Stack sx={{ mt: 3 }} direction={isMobile() ? 'column' : 'row'}>
        <Stack width={isMobile() ? '100%' : '50%'}>
          <Typography
            variant="subtitle1"
            component="h2"
            color="primary"
            sx={{ fontWeight: 'bold' }}
            className="home-title"
          >
            <Link
              to={`/calculators/sip-calculator`}
              className="menu-link"
              aria-label="SIP Calculator"
              title="Calculate SIP investment growth"
            >
              SIP Calculator
              <LaunchOutlined fontSize="small" sx={{ mx: 0.5 }} />
            </Link>
          </Typography>
          <Typography variant="body1" component="h3">
            The SIP Calculator provides insights into investment growth by
            adjusting the amount, expected returns, tenure, and frequency.
          </Typography>
          <Paper sx={{ px: 2, paddingTop: 1, mt: 1, mb: 4 }}>
            <Stack direction={isMobile() ? 'column' : 'row'} spacing={2}>
              <Box>
                <img
                  src="insights/sip-calc-1.png"
                  alt="SIP Calculator"
                  title="SIP Calculator"
                  width={isMobile() ? '100%' : '250'}
                  height="auto"
                  style={{ marginBottom: isMobile() ? '16px' : 0 }}
                  onDoubleClick={() => navigate('/calculators/sip-calculator')}
                />
              </Box>
              <Box>
                <img
                  src="insights/sip-calc-2.png"
                  alt="SIP Calculator"
                  title="SIP Calculator"
                  width={isMobile() ? '100%' : '250'}
                  height="auto"
                  onDoubleClick={() => navigate('/calculators/sip-calculator')}
                />
              </Box>
            </Stack>
          </Paper>
        </Stack>
        <Stack sx={{ mt: 3 }} width={isMobile() ? '100%' : '50%'}>
          <Typography
            variant="subtitle1"
            component="h2"
            color="primary"
            sx={{ fontWeight: 'bold' }}
            className="home-title"
          >
            <Link
              to={`/calculators/emi-calculator`}
              className="menu-link"
              aria-label="EMI Calculator"
              title="Calculate loan EMIs"
            >
              EMI Calculator
              <LaunchOutlined fontSize="small" sx={{ mx: 0.5 }} />
            </Link>
          </Typography>
          <Typography variant="body1" component="h3">
            The EMI Calculator calculates monthly loan repayments, interest
            costs, and repayment schedules.
          </Typography>
          <Paper sx={{ px: 2, paddingTop: 1, mt: 1, mb: 4 }}>
            <Stack direction={isMobile() ? 'column' : 'row'} spacing={2}>
              <Box>
                <img
                  src="insights/emi-calc-1.png"
                  alt="EMI Calculator"
                  title="EMI Calculator"
                  width={isMobile() ? '100%' : '250'}
                  height="auto"
                  style={{ marginBottom: isMobile() ? '16px' : 0 }}
                  onDoubleClick={() => navigate('/calculators/emi-calculator')}
                />
              </Box>
              <Box>
                <img
                  src="insights/emi-calc-2.png"
                  alt="EMI Calculator"
                  title="EMI Calculator"
                  width={isMobile() ? '100%' : '250'}
                  height="auto"
                  onDoubleClick={() => navigate('/calculators/emi-calculator')}
                />
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
      <Stack sx={{ mt: 3, mb: 3 }} direction={isMobile() ? 'column' : 'row'}>
        <Stack width={isMobile() ? '100%' : '50%'}>
          <Typography
            variant="subtitle1"
            component="h2"
            color="primary"
            sx={{ fontWeight: 'bold' }}
            className="home-title"
          >
            <Link
              to={`/calculators/goal-calculator`}
              className="menu-link"
              aria-label="Goal Calculator"
              title="Calculate investments needed for your financial goals"
            >
              Goal Calculator
              <LaunchOutlined fontSize="small" sx={{ mx: 0.5 }} />
            </Link>
          </Typography>
          <Typography variant="body1" component="h3">
            The Goal Calculator calculates the required monthly savings based on
            the target amount and timeline.
          </Typography>
          <Paper sx={{ px: 2, paddingTop: 1, mt: 1, mb: 4 }}>
            <Stack direction={isMobile() ? 'column' : 'row'} spacing={2}>
              <Box>
                <img
                  src="insights/goal-calc-1.png"
                  alt="Goal Calculator"
                  title="Goal Calculator"
                  width={isMobile() ? '100%' : '250'}
                  height="auto"
                  style={{ marginBottom: isMobile() ? '16px' : 0 }}
                  onDoubleClick={() => navigate('/calculators/goal-calculator')}
                />
              </Box>
              <Box>
                <img
                  src="insights/goal-calc-2.png"
                  alt="Goal Calculator"
                  title="Goal Calculator"
                  width={isMobile() ? '100%' : '250'}
                  height="auto"
                  onDoubleClick={() => navigate('/calculators/goal-calculator')}
                />
              </Box>
            </Stack>
          </Paper>
        </Stack>
        <Stack width={isMobile() ? '100%' : '50%'}>
          {/* Reserved for future calculator */}
        </Stack>
      </Stack>
      {/* <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        Insights
      </Typography>
      <Paper ref={ref} sx={{ px: 2, mt: 1, py: 0, mb: 3, minHeight: '240px' }}>
        {inView && (
          <Suspense>
            <FDInsights />
          </Suspense>
        )}
      </Paper> */}
      {/* <br /> */}{' '}
      <footer>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap'
          }}
        >
          <Link to={`/about-us`}>About Us</Link>
          <Link to={`/privacy-policy`}>Privacy Policy</Link>
          <Link to={`/disclaimer`}>Disclaimer</Link>
          <Link to={`/contact-us`}>Contact us</Link>
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
          Have questions or suggestions?&nbsp;
          <Link to={`/contact-us`}>Reach out to us</Link>.
        </Typography>
        <SocialMediaLinks />
      </footer>
    </Box>
  );
}
