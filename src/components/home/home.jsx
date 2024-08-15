import { Paper, Stack, Typography } from '@mui/material';
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
        <Typography
          variant="subtitle1"
          className="home-intro"
          sx={{ mt: 0, fontStyle: 'italic' }}
        >
          Assisting Indians to <label>Compare, Calculate and Optimize</label>
          &nbsp;their Savings with comprehensive calculator, screener, insights
          and the latest interest rates from 30+ Banks and NBFCs across the
          country.
        </Typography>
      </Paper>
      <br />
      <Stack gap={2}>
        <Paper elevation={1}>FD Screener - All Rates</Paper>
        <Paper elevation={1}>FD - Calculate & Compare</Paper>
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
      <Typography
        className="home-heading"
        variant="h6"
        sx={{
          mt: 3,
          fontSize: 18,
          fontWeight: 'bold'
        }}
      >
        Fixed Deposit
      </Typography>
      <Link className="home-link" to="/fixed-deposit">
        Rates Table
      </Link>
      <Typography
        variant="subtitle1"
        sx={{
          mb: 1
        }}
      >
        Compare the latest fixed deposit rates from leading banks and NBFCs to
        find the best options for your savings.Lorem Ipsum is simply dummy text
        of the printing and typesetting industry.
      </Typography>
      <Stack className="video-cnt">
        <video
          ref={videoRef1}
          key={isDarkMode ? 'dark' : 'light'}
          width="100%"
          height="auto"
          muted
          loop
          playsInline
        >
          <source
            src={
              isDarkMode
                ? 'video-screener-dark.mp4'
                : 'video-screener-light.mp4'
            }
            type="video/mp4"
          />
        </video>
      </Stack>
      <Link className="home-link" to="/fixed-deposit/calculator">
        Calculator
      </Link>
      <Typography
        variant="subtitle1"
        sx={{
          mt: 0,
          mb: 2
        }}
      >
        Utilize our precise calculators to discover the best returns on your
        investments.Lorem Ipsum has been the industry&rsquo;s standard dummy
        text ever since the 1500s.
      </Typography>
      <div className="video-cnt-1">
        <video
          ref={videoRef2}
          key={isDarkMode ? 'dark' : 'light'}
          width="100%"
          height="auto"
          muted
          loop
          playsInline
        >
          <source
            src={isDarkMode ? 'video-calc-dark.mp4' : 'video-calc-light.mp4'}
            type="video/mp4"
          />
        </video>
      </div>
    </Box>
  );
}
