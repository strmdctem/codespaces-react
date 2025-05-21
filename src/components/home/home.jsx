import { LaunchOutlined } from '@mui/icons-material';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { Paper, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import SocialMediaLinks from '../social-media-links/social-media-links';
import { isMobile } from '../utils';

// const FDInsights = lazy(() => import('../fd-insights/fd-insights'));

export default function Home({ isDarkMode }) {
  // const { ref, inView } = useInView({
  //   threshold: 0.1,
  //   triggerOnce: true
  // });

  return (
    <Box
      sx={{
        px: isMobile() ? 3 : '25%',
        py: 3
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
          in India. Use Our FD Screener and Calculator to Compare Rates,
          Calculate Returns, and select the Best Fixed Deposit Schemes for
          maximizing your savings. Explore our financial calculators, including
          SIP, EMI, and Goal Calculators with detailed breakdown tables,
          interactive charts, and the ability to save and compare multiple
          scenarios.
        </Typography>
      </Paper>
      <br />
      <Stack gap={3}>
        <Paper>
          <Link
            to={`/fixed-deposit`}
            aria-label="Check Latest Fixed Deposit Rates of All Banks"
            title="Check Latest Fixed Deposit Rates of All Banks"
          >
            <Button
              className="home-button"
              variant="contained"
              fullWidth
              component="h2"
              sx={{ textTransform: 'initial' }}
            >
              <TableChartOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              Fixed Deposit Screener - All Rates
            </Button>
          </Link>
        </Paper>
        <Paper>
          <Link
            to={`/fixed-deposit/calculator`}
            aria-label="Fixed Deposit Calculator"
            title="Fixed Deposit Calculator"
          >
            <Button
              className="home-button"
              variant="contained"
              component="h2"
              fullWidth
              sx={{ textTransform: 'initial' }}
            >
              <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              Fixed Deposit - Calculate & Compare
            </Button>
          </Link>
        </Paper>
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
              sx={{ textTransform: 'initial' }}
            >
              <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              Interest Calculator - Save & Compare
            </Button>
          </Link>
        </Paper>{' '}
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
              sx={{ textTransform: 'initial' }}
            >
              <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              EMI Calculator - Plan & Compare
            </Button>
          </Link>
        </Paper>
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
              sx={{ textTransform: 'initial' }}
            >
              <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              SIP Calculator - Invest & Compare
            </Button>
          </Link>
        </Paper>
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
              sx={{ textTransform: 'initial' }}
            >
              <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              Goal Calculator - Plan Your Targets
            </Button>
          </Link>
        </Paper>
      </Stack>
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
            Explore our FD Screener to find the most current FD rates for 2025.
            Easily compare rates from leading banks and NBFCs, calculate
            returns, and utilize advanced filters to find the most suitable FD
            schemes for growing your savings.
          </Typography>
          <Paper sx={{ px: 2, paddingTop: 1, mt: 1, mb: 4 }}>
            {isDarkMode ? (
              <img
                src="insights/fd-screener-dark.avif"
                alt="Latest Fixed Deposit Interest Rates"
                width="100%"
                height="auto"
              />
            ) : (
              <img
                src="insights/fd-screener-1.avif"
                alt="Latest Fixed Deposit Interest Rates"
                width="350"
                height="315"
                style={isMobile() ? { height: 'auto', width: '100%' } : {}}
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
              aria-label="Fixed Deposit Calculator"
              title="Calculate and compare fixed deposit rates"
            >
              Fixed Deposit Calculator
              <LaunchOutlined fontSize="small" sx={{ mx: 0.5 }} />
            </Link>
          </Typography>
          <Typography variant="body1" component="h3">
            Our advanced FD Calculator is designed to assist you in calculating
            your returns and comparing both returns and interest rates from
            various banks.
          </Typography>
          <Paper sx={{ px: 2, py: 1, mt: 1, mb: 4 }}>
            {isDarkMode ? (
              <img
                src="insights/fd-calculator-dark.avif"
                alt="FD Calculator"
                width="100%"
                height="auto"
              />
            ) : (
              <img
                src="insights/fd-calculator-1.avif"
                alt="FD Calculator"
                width="350"
                height="330"
                style={isMobile() ? { height: 'auto', width: '100%' } : {}}
              />
            )}{' '}
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
            Plan your investments with our SIP Calculator. Easily adjust amount,
            expected returns, tenure, and frequency to see how your investments
            grow over time. View detailed year-by-year breakdowns with
            interactive charts and tables, track total investment versus wealth
            gained, and save multiple scenarios for quick comparison—all
            calculations are stored locally for future reference.
          </Typography>{' '}
          <Paper sx={{ px: 2, paddingTop: 1, mt: 1, mb: 4 }}>
            <Stack direction={isMobile() ? 'column' : 'row'} spacing={2}>
              <Box>
                <img
                  src="insights/sip-calc-1.png"
                  alt="SIP Calculator"
                  width={isMobile() ? '100%' : '250'}
                  height="auto"
                  style={{ marginBottom: isMobile() ? '16px' : 0 }}
                />
              </Box>
              <Box>
                <img
                  src="insights/sip-calc-2.png"
                  alt="SIP Calculator - Dark Mode"
                  width={isMobile() ? '100%' : '250'}
                  height="auto"
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
            Our EMI Calculator helps you plan your loan repayments with
            precision. Calculate your monthly installments, understand the
            interest costs, and see a detailed year-by-year breakdown of your
            loan repayment schedule.
          </Typography>
          <Paper sx={{ px: 2, paddingTop: 1, mt: 1, mb: 4 }}>
            <Stack direction={isMobile() ? 'column' : 'row'} spacing={2}>
              <Box>
                <img
                  src="insights/emi-calc-1.png"
                  alt="EMI Calculator"
                  width={isMobile() ? '100%' : '250'}
                  height="auto"
                  style={{ marginBottom: isMobile() ? '16px' : 0 }}
                />
              </Box>
              <Box>
                <img
                  src="insights/emi-calc-2.png"
                  alt="EMI Calculator - Dark Mode"
                  width={isMobile() ? '100%' : '250'}
                  height="auto"
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
            </Link>          </Typography>          <Typography variant="body1" component="h3">
            Set and achieve your financial goals with our powerful Goal Calculator. Input your target amount and timeline, and instantly see how much you need to invest monthly. Explore different return rates, visualize year-by-year progress with interactive charts, and adjust parameters to create your optimal savings plan. Save and compare multiple scenarios to find the perfect investment strategy for your future needs.
          </Typography>
          <Paper sx={{ px: 2, paddingTop: 1, mt: 1, mb: 4 }}>
            <Stack direction={isMobile() ? 'column' : 'row'} spacing={2}>
              <Box>
                <img
                  src="insights/goal-calc-1.png"
                  alt="Goal Calculator"
                  width={isMobile() ? '100%' : '250'}
                  height="auto"
                  style={{ marginBottom: isMobile() ? '16px' : 0 }}
                />
              </Box>
              <Box>
                <img
                  src="insights/goal-calc-2.png"
                  alt="Goal Calculator - Dark Mode"
                  width={isMobile() ? '100%' : '250'}
                  height="auto"
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
      {/* <br /> */}
      <footer>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          <Link to={`/contact-us`} className="menu-link">
            Contact us
          </Link>
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Have questions or suggestions?&nbsp;
          <Link to={`/contact-us`}>Reach out to us</Link>.
        </Typography>
        <SocialMediaLinks />
      </footer>
    </Box>
  );
}
