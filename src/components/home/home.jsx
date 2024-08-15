import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { Button, Paper, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import FDInsights from '../fd-insights/fd-insights';
export default function Home({ isDarkMode }) {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0}>
        <Typography variant="subtitle1" className="home-intro" sx={{ mt: -1 }}>
          Assisting Indians to <label>Compare, Calculate and Optimize</label>
          &nbsp;their Savings with comprehensive calculator, screener, insights
          and the latest interest rates from 30+ Banks and NBFCs across the
          country.
        </Typography>
      </Paper>
      <br />
      <Stack gap={3}>
        <Paper>
          <Link to={`/fixed-deposit`}>
            <Button
              className="home-button"
              variant="outlined"
              fullWidth
              sx={{ textTransform: 'initial' }}
            >
              <TableChartOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              Fixed Deposit Screener - All Rates
            </Button>
          </Link>
        </Paper>
        <Paper>
          <Link to={`/fixed-deposit/calculator`}>
            <Button
              className="home-button"
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ textTransform: 'initial' }}
            >
              <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              Fixed Deposit - Calculate & Compare
            </Button>
          </Link>
        </Paper>
        <Paper>
          <Link to={`/fixed-deposit/calculator`}>
            <Button
              className="home-button"
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ textTransform: 'initial' }}
            >
              Dummy option - any suggestions?
            </Button>
          </Link>
        </Paper>
      </Stack>
      <br />
      <Stack sx={{ mt: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          <Link to={`/fixed-deposit`} className="menu-link">
            Fixed Deposit Screener
          </Link>
        </Typography>
        <Typography variant="body1">
          Compare the latest fixed deposit rates from leading banks and NBFCs to
          find the best options for your savings.
        </Typography>
        <Paper sx={{ px: 2, paddingTop: 1, mt: 1, mb: 4 }}>
          {isDarkMode ? (
            <img src="fd-screener-dark.jpg" style={{ width: '100%' }} />
          ) : (
            <img src="fd-screener.jpg" style={{ width: '100%' }} />
          )}
        </Paper>

        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          <Link to={`/fixed-deposit/calculator`} className="menu-link">
            Fixed Deposit Calculator
          </Link>
        </Typography>
        <Typography variant="body1">
          Utilize our precise calculators to discover the best returns on your
          investments.
        </Typography>
        <Paper sx={{ px: 2, py: 1, mt: 1, mb: 4 }}>
          {isDarkMode ? (
            <img src="fd-calculator-dark.jpg" style={{ width: '100%' }} />
          ) : (
            <img src="fd-calculator.jpg" style={{ width: '100%' }} />
          )}
        </Paper>
      </Stack>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        Insights
      </Typography>
      <Paper sx={{ px: 2, mt: 1, py: 0, mb: 3 }}>
        <FDInsights></FDInsights>
      </Paper>
      <br />
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        Why FinRates?
      </Typography>
      <Paper
        sx={{
          mx: 2,
          my: 2,
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <img src="stats-1.svg" alt="Insight 1" />
      </Paper>
      <Paper
        sx={{
          mx: 2,
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4
        }}
      >
        <img src="stats-2.svg" alt="Insight 1" />
      </Paper>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        <Link to={`/contact-us`} className="menu-link">
          Contact us
        </Link>
      </Typography>
      <Typography variant="body1">
        Have questions or suggestions? Reach out to us&nbsp;
        <Link to={`/contact-us`}>here</Link>.
      </Typography>
    </Box>
  );
}
