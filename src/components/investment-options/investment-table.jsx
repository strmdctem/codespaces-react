import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

const InvestmentTable = ({ options = [] }) => {
  // Helper functions
  const formatReturnRange = (expectedReturns) => {
    if (!expectedReturns) return 'Variable';
    const { min, max } = expectedReturns;
    return min === max ? `~${min}%` : `~${min}–${max}%`;
  };
  const formatHoldingPeriod = (idealHoldingPeriod) => {
    if (!idealHoldingPeriod) return 'Flexible';
    const { min, max, unit } = idealHoldingPeriod;

    // Convert everything to days first for consistent comparison
    let minDays, maxDays;
    if (unit === 'days') {
      minDays = min;
      maxDays = max;
    } else if (unit === 'months') {
      minDays = min * 30;
      maxDays = max * 30;
    } else if (unit === 'years') {
      minDays = min * 365;
      maxDays = max * 365;
    }

    // Helper function to format a single value
    const formatSinglePeriod = (days) => {
      if (days === 1) return '1 day';
      if (days < 7) return `${days} days`;
      if (days === 7) return '1 week';
      if (days < 30) return `${Math.round(days / 7)} weeks`;
      if (days === 30) return '1 month';
      if (days < 365) {
        const months = Math.round(days / 30);
        return months === 1 ? '1 month' : `${months} months`;
      }
      const years = Math.round(days / 365);
      return years === 1 ? '1 year' : `${years} years`;
    };

    // If min and max are the same
    if (minDays === maxDays) {
      return formatSinglePeriod(minDays);
    }

    // Format min and max periods
    const minFormatted = formatSinglePeriod(minDays);
    const maxFormatted = formatSinglePeriod(maxDays);

    return `${minFormatted} to ${maxFormatted}`;
  };

  const formatExamples = (examples) => {
    if (!examples || examples.length === 0) return 'N/A';
    return examples.slice(0, 2).join(', ');
  };

  // Helper function to format investment modes
  const formatInvestmentModes = (modes) => {
    if (!modes || !Array.isArray(modes) || modes.length === 0) return 'N/A';

    // If only one mode, return it directly
    if (modes.length === 1) return modes[0];

    // If multiple modes, join with " & "
    return modes.join(' & ');
  };
  return (
    <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
      <Table size="small" sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ fontWeight: 'bold', minWidth: 60, textAlign: 'center' }}
            >
              #
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>
              Investment Option
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>
              Taxation
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>
              Expected Returns
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>
              Risk
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
              Ideal Holding Period
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
              Withdrawal Speed
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>
              Exit Load
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>
              Volatility
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>
              SIP or Lumpsum?
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
              Partial Withdrawal
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
              Return Consistency
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>
              Suitable For
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>
              Invests In
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>
              Good Things
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>
              Things to Note
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>
              Examples
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {options.map((option, index) => (
            <TableRow key={option.id} hover>
              <TableCell
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: 'primary.main'
                }}
              >
                {index + 1}
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  {option.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {option.taxation || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  color="primary.main"
                  fontWeight={500}
                >
                  {formatReturnRange(option.expectedReturns)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={option.riskLevel}
                  size="small"
                  color={
                    option.riskLevel?.toLowerCase() === 'none'
                      ? 'success'
                      : option.riskLevel?.toLowerCase().includes('very low')
                        ? 'info'
                        : option.riskLevel?.toLowerCase().includes('low')
                          ? 'primary'
                          : option.riskLevel?.toLowerCase().includes('moderate')
                            ? 'warning'
                            : 'error'
                  }
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatHoldingPeriod(option.idealHoldingPeriod)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {option.withdrawalSpeed || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {option.exitLoad || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {option.volatility || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatInvestmentModes(option.investmentMode)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {option.partialWithdrawal || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {option.returnConsistency || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {option.whoShouldConsider || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {option.whatItInvestsIn || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="success.main">
                  {option.goodThings || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="warning.main">
                  {option.thingsToNote || 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatExamples(option.examples)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {options.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No investment options found matching your criteria.
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default InvestmentTable;
