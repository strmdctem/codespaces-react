import { Box, Container, Typography, alpha, useTheme } from '@mui/material';
import Markdown from '../markdown/Markdown';
import usePageInfo from '../page-info/use-page-info';
import { useIsMobileHook } from '../utils';

const ArbitrageFund = () => {
  const theme = useTheme();
  const isMobile = useIsMobileHook();

  // Set page info for SEO
  usePageInfo({
    title: 'Arbitrage Fund - Investment Guide',
    description:
      'Complete guide to Arbitrage Funds - understanding how they work, benefits, risks, and investment strategies.'
  });

  return (
    <Box sx={{ width: '100%', px: 0, py: 3 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
          py: { xs: 4, md: 4 },
          px: 2,
          mx: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          component="h1"
          gutterBottom
        >
          Arbitrage Fund Investment Guide
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Everything you need to know about Arbitrage Funds - how they work,
          benefits, risks, and investment strategies
        </Typography>
      </Box>

      {/* Markdown Content */}
      <Container maxWidth="lg" sx={{ px: 0, mx: 'auto' }}>
        <Markdown path="/markdown/arbitrage-fund.md" />
      </Container>
    </Box>
  );
};

export default ArbitrageFund;
