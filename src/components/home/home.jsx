import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { Button, Paper, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
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
              variant="outlined"
              fullWidth
              sx={{ textTransform: 'initial', borderColor: '#e0e0e0' }}
            >
              <TableChartOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              Fixed Deposit Screener - All Rates
            </Button>
          </Link>
        </Paper>
        <Paper>
          <Link to={`/fixed-deposit/calculator`}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ textTransform: 'initial', borderColor: '#e0e0e0' }}
            >
              <CalculateOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              Fixed Deposit - Calculate & Compare
            </Button>
          </Link>
        </Paper>
        <Paper>
          <Link to={`/fixed-deposit/calculator`}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ textTransform: 'initial', borderColor: '#e0e0e0' }}
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
        <Paper sx={{ px: 2, py: 1, mt: 1, mb: 4 }}>
          <img src="fd-screener-2.jpg" style={{ width: '100%' }} />
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
        <Paper sx={{ px: 2, py: 1, mt: 1, mb: 3 }}>
          <img src="fd-calculator.jpg" style={{ width: '100%' }} />
        </Paper>
      </Stack>
      <div className="carousel">
        <div className="carousel-inner">
          <div className="carousel-item">
            <img src="/insight-1.svg" alt="Insight 1" />
          </div>
          <div className="carousel-item">
            <img src="/Insights_Private.svg" alt="Insight 2" />
          </div>
          <div className="carousel-item">
            <img src="/Insights_NBFC.svg" alt="Insight 2" />
          </div>
        </div>
      </div>
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
          alignItems: 'center'
        }}
      >
        <img src="stats-2.svg" alt="Insight 1" />
      </Paper>
    </Box>
  );
}
