import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { Button, Paper, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
export default function Home({ isDarkMode }) {
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const videoElements = [videoRef1.current, videoRef2.current];

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const videoElement = entry.target;
        if (entry.isIntersecting) {
          if (videoElement === videoRef1.current && !hasScrolled) {
            return; // Do not play the first video if the user hasn't scrolled
          }
          videoElement.play();
        } else {
          videoElement.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.8 // Adjust this value as needed
    });

    videoElements.forEach((videoElement) => {
      if (videoElement) {
        observer.observe(videoElement);
      }
    });

    const handleScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      videoElements.forEach((videoElement) => {
        if (videoElement) {
          observer.unobserve(videoElement);
        }
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolled]);
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0}>
        <Typography variant="subtitle1" className="home-intro" sx={{ mt: 0 }}>
          Assisting Indians to <label>Compare, Calculate and Optimize</label>
          &nbsp;their Savings with comprehensive calculator, screener, insights
          and the latest interest rates from 30+ Banks and NBFCs across the
          country.
        </Typography>
      </Paper>
      <br />
      <Stack gap={3}>
        <Paper elevation={2}>
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
        <Paper elevation={2}>
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
        <Paper elevation={2}>
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
      <Stack>
        <Typography
          variant="h6"
          sx={{
            fontSize: 16,
            fontWeight: 'bold'
          }}
        >
          <Link to={`/fixed-deposit`} className="menu-link">
            Fixed Deposit Screener
          </Link>
        </Typography>
        <Typography variant="body2">
          Compare the latest fixed deposit rates from leading banks and NBFCs to
          find the best options for your savings.
        </Typography>
        <img
          src="fd-screener-2.jpg"
          style={{ padding: '20px', paddingRight: '30px' }}
        />
        <Typography
          variant="h6"
          sx={{
            fontSize: 16,
            fontWeight: 'bold'
          }}
        >
          <Link to={`/fixed-deposit/calculator`} className="menu-link">
            Fixed Deposit Calculator
          </Link>
        </Typography>
        <Typography variant="body2">
          Utilize our precise calculators to discover the best returns on your
          investments.
        </Typography>
        <img
          src="fd-calculator.jpg"
          style={{ padding: '20px', paddingRight: '30px' }}
        />
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
      <img src="/Stats.svg" className="stats-img" alt="Insight 1" />
    </Box>
  );
}
