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

    if (unit === 'days') {
      // Handle mixed units: when min is in days but max spans years
      if (max > 365) {
        const minFormatted =
          min <= 30
            ? `${min} day${min > 1 ? 's' : ''}`
            : `${Math.round(min / 30)} month${Math.round(min / 30) > 1 ? 's' : ''}`;
        const maxYears = Math.round(max / 365);
        return `${minFormatted} to ${maxYears} year${maxYears > 1 ? 's' : ''}`;
      }

      if (max <= 7)
        return `${min} day${min > 1 ? 's' : ''} to ${max} day${max > 1 ? 's' : ''}`;
      if (max <= 30)
        return `${min} day${min > 1 ? 's' : ''} to ${max} day${max > 1 ? 's' : ''}`;
      if (max <= 90)
        return `${min} day${min > 1 ? 's' : ''} to ${Math.round(max / 30)} month${Math.round(max / 30) > 1 ? 's' : ''}`;
      if (max <= 365)
        return `${Math.round(min / 30)} to ${Math.round(max / 30)} months`;
    }
    if (unit === 'months') {
      if (max >= 12)
        return `${min} to ${Math.round(max / 12)} year${Math.round(max / 12) > 1 ? 's' : ''}`;
      return `${min} to ${max} months`;
    }
    if (unit === 'years') {
      return `${min} to ${max} years`;
    }
    return `${min}–${max} ${unit}`;
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
            </TableCell>{' '}
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
        </TableHead>{' '}
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
              </TableCell>{' '}
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
              </TableCell>{' '}
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
