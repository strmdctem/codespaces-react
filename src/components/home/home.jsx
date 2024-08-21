import { LaunchOutlined } from '@mui/icons-material';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { Paper, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { lazy, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const FDInsights = lazy(() => import('../fd-insights/fd-insights'));

export default function Home({ isDarkMode }) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0}>
        <Typography
          variant="subtitle1"
          component="h1"
          className="home-intro"
          color="primary"
          fontWeight="bold"
          sx={{ mt: -1 }}
        >
          Compare, Calculate, and Optimize.
        </Typography>
        <Typography variant="subtitle1" component="h2" className="home-intro">
          Assisting Indians with comprehensive calculators, screeners, insights,
          and the latest interest rates from over 30 banks and NBFCs across the
          country.
        </Typography>
      </Paper>
      <br />
      <Stack gap={3}>
        <Paper>
          <Link
            to={`/fixed-deposit`}
            aria-label="Fixed Deposit Screener - All Rates"
            title="View all fixed deposit rates"
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
            title="Calculate and compare fixed deposit rates"
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
      </Stack>
      <br />
      <Stack sx={{ mt: 1 }}>
        <Typography
          variant="body1"
          component="h2"
          color="primary"
          sx={{ fontWeight: 'bold' }}
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
        <Typography variant="body1">
          Compare the latest fixed deposit rates from leading banks and NBFCs to
          find the best options for your savings.
        </Typography>
        <Paper sx={{ px: 2, paddingTop: 1, mt: 1, mb: 4 }}>
          {isDarkMode ? (
            <img
              src="insights/fd-screener-dark.avif"
              alt="Fixed Deposit Screener"
              width="100%"
              height="auto"
            />
          ) : (
            <img
              src="insights/fd-screener-1.avif"
              alt="Fixed Deposit Screener"
              width="350"
              height="315"
              style={{ height: 'auto', width: '100%' }}
            />
          )}
        </Paper>

        <Typography
          variant="body1"
          component="h2"
          color="primary"
          sx={{ fontWeight: 'bold' }}
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
        <Typography variant="body1">
          Utilize our precise calculators to discover the best returns on your
          investments.
        </Typography>
        <Paper sx={{ px: 2, py: 1, mt: 1, mb: 4 }}>
          {isDarkMode ? (
            <img
              src="insights/fd-calculator-dark.avif"
              alt="Fixed Deposit Calculator"
              width="100%"
              height="auto"
            />
          ) : (
            <img
              src="insights/fd-calculator-1.avif"
              alt="Fixed Deposit Calculator"
              width="350"
              height="410"
              style={{ height: 'auto', width: '100%' }}
            />
          )}
        </Paper>
      </Stack>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        Insights
      </Typography>
      <Paper ref={ref} sx={{ px: 2, mt: 1, py: 0, mb: 3, minHeight: '240px' }}>
        {inView && (
          <Suspense>
            <FDInsights />
          </Suspense>
        )}
      </Paper>
      <br />
      <footer>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          <Link to={`/contact-us`} className="menu-link">
            Contact us
          </Link>
        </Typography>
        <Typography variant="body1">
          Have questions or suggestions?&nbsp;
          <Link to={`/contact-us`}>Reach out to us</Link>.
        </Typography>
      </footer>
    </Box>
  );
}
