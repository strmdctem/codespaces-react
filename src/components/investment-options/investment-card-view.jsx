import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  alpha,
  useTheme
} from '@mui/material';

const InvestmentCardView = ({ options }) => {
  const theme = useTheme();

  // Helper function to get risk color
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'None':
        return {
          bg: alpha(theme.palette.info.main, 0.1),
          color: theme.palette.info.main,
          border: theme.palette.info.main
        };
      case 'Very Low':
        return {
          bg: alpha('#0891b2', 0.1),
          color: '#0891b2',
          border: '#0891b2'
        };
      case 'Very Low to Low':
        return {
          bg: alpha('#0891b2', 0.1),
          color: '#0891b2',
          border: '#0891b2'
        };
      case 'Low':
      case 'Low to Moderate':
        return {
          bg: alpha('#059669', 0.1),
          color: '#059669',
          border: '#059669'
        };
      case 'Moderate':
        return {
          bg: alpha('#f59e0b', 0.1),
          color: '#f59e0b',
          border: '#f59e0b'
        };
      case 'Moderate to High':
      case 'High':
        return {
          bg: alpha('#dc2626', 0.1),
          color: '#dc2626',
          border: '#dc2626'
        };
      default:
        return {
          bg: alpha(theme.palette.grey[500], 0.1),
          color: theme.palette.grey[500],
          border: theme.palette.grey[500]
        };
    }
  };

  // Helper function to format returns
  const formatReturns = (returns) => {
    if (!returns) return 'N/A';
    if (returns.min === returns.max) return `${returns.min}%`;
    return `${returns.min}-${returns.max}%`;
  };

  // Helper function to format holding period
  const formatHoldingPeriod = (period) => {
    if (!period) return 'N/A';
    const { min, max, unit } = period;

    if (min === max) {
      return `${min} ${unit}`;
    }

    if (unit === 'days') {
      if (min === 1 && max === 7) return '1 day - 1 week';
      if (min === 7 && max === 30) return '1 week - 1 month';
      if (min === 30 && max === 90) return '1-3 months';
      if (min === 90 && max === 180) return '3-6 months';
      if (min === 180 && max === 365) return '6 months - 1 year';
    }

    return `${min}-${max} ${unit}`;
  };

  return (
    <Grid container spacing={3}>
      {options.map((option) => {
        const riskColors = getRiskColor(option.riskLevel);

        return (
          <Grid item xs={12} sm={6} lg={4} key={option.id}>
            {' '}
            <Card
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                border: `2px solid ${alpha(riskColors.color, 0.6)}`,
                borderRadius: 3,
                background: theme.palette.background.paper,
                position: 'relative',
                overflow: 'visible',
                boxShadow: `0 4px 12px ${alpha(riskColors.color, 0.4)}, 0 0 0 1px ${alpha(riskColors.color, 0.3)}`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  border: `2px solid ${alpha(riskColors.color, 0.8)}`,
                  boxShadow: `0 8px 25px ${alpha(riskColors.color, 0.6)}, 0 0 0 2px ${alpha(riskColors.color, 0.4)}`
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {' '}
                {/* Top Section - Name Only */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      lineHeight: 1.3
                    }}
                  >
                    {option.name}
                  </Typography>
                </Box>{' '}
                {/* Key Metrics Grid - Following Table Column Order */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Taxation
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, fontSize: '0.8rem' }}
                      >
                        {option.taxation}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Expected Returns
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.success.main
                        }}
                      >
                        {formatReturns(option.expectedReturns)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Risk
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.8rem',
                          color: riskColors.color
                        }}
                      >
                        {option.riskLevel}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Ideal Holding Period
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, fontSize: '0.8rem' }}
                      >
                        {formatHoldingPeriod(option.idealHoldingPeriod)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Withdrawal Speed
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, fontSize: '0.8rem' }}
                      >
                        {option.withdrawalSpeed}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Exit Load
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, fontSize: '0.8rem' }}
                      >
                        {option.exitLoad || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Volatility
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, fontSize: '0.8rem' }}
                      >
                        {option.volatility || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>{' '}
                  <Grid item xs={6}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        SIP or Lumpsum?
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, fontSize: '0.8rem' }}
                      >
                        {option.investmentMode || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Return Consistency
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, fontSize: '0.8rem' }}
                      >
                        {option.returnConsistency}
                      </Typography>
                    </Box>
                  </Grid>{' '}
                  <Grid item xs={6}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Invests In
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, fontSize: '0.8rem' }}
                      >
                        {option.whatItInvestsIn || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>{' '}
                {/* Additional Information */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.4, mb: 1 }}
                  >
                    <strong>Suitable For:</strong> {option.whoShouldConsider}
                  </Typography>

                  {option.goodThings && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.4, mb: 1 }}
                    >
                      <strong>Good Things:</strong> {option.goodThings}
                    </Typography>
                  )}

                  {option.thingsToNote && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.4, mb: 1 }}
                    >
                      <strong>Things to Note:</strong> {option.thingsToNote}
                    </Typography>
                  )}

                  {option.examples && option.examples.length > 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.4 }}
                    >
                      <strong>Examples:</strong>{' '}
                      {option.examples.slice(0, 2).join(', ')}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default InvestmentCardView;
