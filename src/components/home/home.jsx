import { Paper, Typography } from '@mui/material';
import Box from '@mui/material/Box';

export default function Home() {
  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={1} sx={{ p: 2, mt: 1, mb: 1 }}>
        <Typography variant="h5" className="home-intro">
          <label className="home-intro-logo">FinRates</label>:{' '}
          <label>For any financial rates</label>
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1 }}>
          Assisting Indians to compare, save and grow their savings with the
          tools, details and latest Interest rates from 30+ banks and NBFCs
          across the country.
        </Typography>
      </Paper>
      <Typography
        className="home-heading"
        variant="h6"
        sx={{
          mt: 3,
          mb: 2,
          fontSize: 18,
          fontWeight: 'bold',
          color: 'theme.primary'
        }}
      >
        Fixed Deposit Rates
      </Typography>
      <div className="video-cnt">
        <video width="100%" height="auto" autoPlay muted loop playsInline>
          <source src="finrates-1.mp4" type="video/mp4"></source>
        </video>
      </div>
    </Box>
  );
}
