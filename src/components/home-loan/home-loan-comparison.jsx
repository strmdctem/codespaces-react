import {
  AccountBalance as BankIcon,
  CalculateOutlined as CalculateIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import homeLoanRatesData from '../../data/home-loan-rates.json';
import usePageInfo from '../page-info/use-page-info';
import SvgIcon from '../svg-icon/svg-icon';

// EMI Calculation utility
const calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / (12 * 100);
  const numberOfPayments = tenure * 12;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  return Math.round(emi);
};

// Format currency utility
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Global EMI Calculator Component
const GlobalEMICalculator = ({ onCalculationChange }) => {
  const theme = useTheme();
  const [loanAmount, setLoanAmount] = useState(5000000); // 50 lakhs default
  const [tenure, setTenure] = useState(20); // 20 years default

  useEffect(() => {
    onCalculationChange({ loanAmount, tenure });
  }, [loanAmount, tenure, onCalculationChange]);
  const loanAmountMarks = [
    { value: 1000000, label: '₹10L' },
    { value: 5000000, label: '₹50L' },
    { value: 10000000, label: '₹1Cr' },
    { value: 20000000, label: '₹2Cr' },
    { value: 30000000, label: '₹3Cr' }
  ];

  const tenureMarks = [
    { value: 5, label: '5Y' },
    { value: 15, label: '15Y' },
    { value: 25, label: '25Y' },
    { value: 30, label: '30Y' }
  ];

  return (
    <Card
      sx={{
        mb: 4,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
        background: `linear-gradient(145deg, ${alpha(theme.palette.info.main, 0.05)}, ${alpha(theme.palette.info.main, 0.1)})`,
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {' '}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          {/* Info Counter */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.5,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            <CalculateIcon
              sx={{
                fontSize: 16
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600
              }}
            >
              EMI Reference Calculator
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom variant="subtitle2" fontWeight="medium">
              Loan Amount: {formatCurrency(loanAmount)}
            </Typography>{' '}
            <Slider
              value={loanAmount}
              onChange={(e, value) => setLoanAmount(value)}
              min={1000000}
              max={30000000}
              step={100000}
              marks={loanAmountMarks}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => formatCurrency(value)}
            />
          </Grid>{' '}
          <Grid item xs={12} md={6}>
            <Typography gutterBottom variant="subtitle2" fontWeight="medium">
              Tenure: {tenure} years
            </Typography>
            <Slider
              value={tenure}
              onChange={(e, value) => setTenure(value)}
              min={5}
              max={30}
              step={1}
              marks={tenureMarks}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Bank Card Component
const BankCard = ({ bank, emiDetails }) => {
  const theme = useTheme();

  const effectiveRate = bank.minRate; // Use base rate without any discounts
  const emi = calculateEMI(
    emiDetails.loanAmount,
    effectiveRate,
    emiDetails.tenure
  );
  const totalAmount = emi * emiDetails.tenure * 12;
  const totalInterest = totalAmount - emiDetails.loanAmount;
  return (
    <Card
      elevation={1}
      sx={{
        height: '100%',
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        background: theme.palette.background.paper,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {' '}
        {/* Bank Header Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            mb: 2
          }}
        >
          <SvgIcon className="logo-full" accessKey={bank.key} />
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              ml: 1.5
            }}
          >
            {bank.name}
          </Typography>
        </Box>
        {/* Bank Information Tags */}
        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            spacing={0.5}
            flexWrap="wrap"
            sx={{ gap: 0.5 }}
          >
            {' '}
            {bank.womenDiscount && (
              <Chip
                label={`Women ${bank.womenDiscount}%`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  height: 24,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                  borderColor: alpha(theme.palette.secondary.main, 0.2),
                  color: theme.palette.secondary.main,
                  fontWeight: 500
                }}
              />
            )}
            {bank.prepaymentAllowed && (
              <Chip
                label="Prepayment"
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  height: 24,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.success.main, 0.05),
                  borderColor: alpha(theme.palette.success.main, 0.2),
                  color: theme.palette.success.main,
                  fontWeight: 500
                }}
              />
            )}{' '}
            {bank.cibilDiscount && (
              <Chip
                label="CIBIL Discount"
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  height: 24,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.warning.main, 0.05),
                  borderColor: alpha(theme.palette.warning.main, 0.2),
                  color: theme.palette.warning.main,
                  fontWeight: 500
                }}
              />
            )}
          </Stack>
        </Box>
        {/* Bank Key Metrics */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            {' '}
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  textAlign: 'center',
                  minHeight: '64px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Interest Rate
                </Typography>{' '}
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    fontSize: '1.0rem'
                  }}
                >
                  {bank.minRate}% - {bank.maxRate}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  textAlign: 'center',
                  minHeight: '64px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Max Tenure
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.info.main,
                    fontWeight: 700,
                    fontSize: '1.0rem'
                  }}
                >
                  {bank.maxTenure / 12} Years
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* Calculation Results Section */}
        <Divider sx={{ mb: 2 }} />
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 1.5
          }}
        >
          Your Calculation Results
        </Typography>
        {/* EMI Highlight */}
        <Box
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.success.main, 0.05),
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Monthly EMI
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.success.main,
              fontWeight: 700,
              fontSize: '1.5rem'
            }}
          >
            {formatCurrency(emi)}
          </Typography>
        </Box>
        {/* Financial Summary */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.05),
                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                textAlign: 'center'
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Total Interest
              </Typography>{' '}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.warning.main
                }}
              >
                {formatCurrency(totalInterest)}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.warning.main,
                  fontWeight: 500,
                  fontSize: '0.7rem'
                }}
              >
                ({((totalInterest / emiDetails.loanAmount) * 100).toFixed(1)}%)
              </Typography>
            </Box>
          </Grid>{' '}
          <Grid item xs={6}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.info.main, 0.05),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                textAlign: 'center'
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Total Amount
              </Typography>{' '}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.info.main
                }}
              >
                {formatCurrency(totalAmount)}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.info.main,
                  fontWeight: 500,
                  fontSize: '0.7rem'
                }}
              >
                ({((totalAmount / emiDetails.loanAmount) * 100).toFixed(1)}%)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Main Component
const HomeLoanComparison = () => {
  const theme = useTheme();

  usePageInfo({
    title: 'Home Loan Comparison - Compare Interest Rates Across Banks',
    description:
      'Compare home loan interest rates, EMI calculations, and features across all major banks. Find the best home loan deals with our comprehensive comparison tool.'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [emiCalculation, setEmiCalculation] = useState({
    loanAmount: 5000000,
    tenure: 20
  });
  const [sortBy, setSortBy] = useState('emi'); // emi, rate, bank
  const [viewMode, setViewMode] = useState('cards'); // cards, table

  // Filter and sort banks
  const filteredAndSortedBanks = useMemo(() => {
    let filtered = homeLoanRatesData.filter((bank) =>
      bank.name.toLowerCase().includes(searchTerm.toLowerCase())
    ); // Sort based on selection
    filtered.sort((a, b) => {
      if (sortBy === 'emi') {
        // Use base rates for EMI calculation
        const emiA = calculateEMI(
          emiCalculation.loanAmount,
          a.minRate,
          emiCalculation.tenure
        );
        const emiB = calculateEMI(
          emiCalculation.loanAmount,
          b.minRate,
          emiCalculation.tenure
        );
        return emiA - emiB;
      } else if (sortBy === 'rate') {
        return a.minRate - b.minRate;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    return filtered;
  }, [searchTerm, sortBy, emiCalculation]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          Home Loan Comparison
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={2}>
          Compare rates across all major banks with our smart EMI calculator
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          flexWrap="wrap"
        >
          <Chip
            icon={<BankIcon />}
            label={`${homeLoanRatesData.length} Banks`}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<CalculateIcon />}
            label="Live EMI Calculator"
            color="info"
            variant="outlined"
          />
          <Chip
            icon={<TrendingUpIcon />}
            label="Best Rates"
            color="success"
            variant="outlined"
          />
        </Stack>
      </Box>

      {/* Global EMI Calculator */}
      <GlobalEMICalculator onCalculationChange={setEmiCalculation} />

      {/* Search and Filters */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.6)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search banks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="emi">Lowest EMI</MenuItem>
                <MenuItem value="rate">Interest Rate</MenuItem>
                <MenuItem value="bank">Bank Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>View</InputLabel>
              <Select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                label="View"
              >
                <MenuItem value="cards">Cards</MenuItem>
                <MenuItem value="table">Table</MenuItem>
              </Select>
            </FormControl>{' '}
          </Grid>
        </Grid>
      </Paper>

      {/* Bank Cards Grid */}
      {viewMode === 'cards' ? (
        <Grid container spacing={3}>
          {filteredAndSortedBanks.map((bank) => (
            <Grid item xs={12} sm={6} lg={4} key={bank.key}>
              {' '}
              <BankCard bank={bank} emiDetails={emiCalculation} />
            </Grid>
          ))}
        </Grid>
      ) : (
        // Table View
        <Card
          elevation={1}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            background: theme.palette.background.paper
          }}
        >
          <CardContent sx={{ px: 0, py: 1 }}>
            <TableContainer
              component={Paper}
              sx={{
                p: 0,
                overflowX: 'auto',
                '& .MuiTable-root': {
                  '@media (max-width: 600px)': {
                    minWidth: '700px'
                  }
                }
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        padding: '6px 8px',
                        width: '120px',
                        fontWeight: 'bold'
                      }}
                    >
                      Bank
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        padding: '6px 8px',
                        width: '100px',
                        fontWeight: 'bold'
                      }}
                    >
                      Interest Rate
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        padding: '6px 8px',
                        width: '120px',
                        fontWeight: 'bold'
                      }}
                    >
                      Monthly EMI
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        padding: '6px 8px',
                        width: '120px',
                        fontWeight: 'bold'
                      }}
                    >
                      Total Interest
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        padding: '6px 8px',
                        width: '120px',
                        fontWeight: 'bold'
                      }}
                    >
                      Total Amount
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        padding: '6px 8px',
                        width: '100px',
                        fontWeight: 'bold'
                      }}
                    >
                      Max Tenure
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        padding: '6px 8px',
                        width: '120px',
                        fontWeight: 'bold'
                      }}
                    >
                      Features
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAndSortedBanks.map((bank) => {
                    const effectiveRate = bank.minRate;
                    const emi = calculateEMI(
                      emiCalculation.loanAmount,
                      effectiveRate,
                      emiCalculation.tenure
                    );
                    const totalAmount = emi * emiCalculation.tenure * 12;
                    const totalInterest =
                      totalAmount - emiCalculation.loanAmount;
                    return (
                      <TableRow key={bank.key}>
                        {' '}
                        {/* Bank Name */}
                        <TableCell
                          sx={{ padding: '6px 8px', whiteSpace: 'nowrap' }}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <SvgIcon
                              className="logo-full"
                              accessKey={bank.key}
                            />
                            {bank.name}
                          </Box>
                        </TableCell>
                        {/* Interest Rate */}
                        <TableCell
                          align="center"
                          style={{ padding: '6px 8px' }}
                        >
                          {effectiveRate.toFixed(2)}%
                        </TableCell>
                        {/* Monthly EMI */}
                        <TableCell
                          align="center"
                          style={{ padding: '6px 8px' }}
                        >
                          {formatCurrency(emi)}
                        </TableCell>{' '}
                        {/* Total Interest */}
                        <TableCell
                          align="center"
                          style={{ padding: '6px 8px' }}
                        >
                          {formatCurrency(totalInterest)}
                        </TableCell>{' '}
                        {/* Total Amount */}
                        <TableCell
                          align="center"
                          style={{ padding: '6px 8px' }}
                        >
                          {formatCurrency(totalAmount)}
                        </TableCell>{' '}
                        {/* Max Tenure */}
                        <TableCell
                          align="center"
                          style={{ padding: '6px 8px' }}
                        >
                          {bank.maxTenure / 12} Years
                        </TableCell>{' '}
                        {/* Features */}
                        <TableCell
                          align="center"
                          style={{ padding: '6px 8px' }}
                        >
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="center"
                            flexWrap="wrap"
                            sx={{ gap: 0.5 }}
                          >
                            {bank.womenDiscount > 0 && (
                              <Chip
                                label={`Women -${bank.womenDiscount}%`}
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            )}
                            {bank.cibilDiscount && (
                              <Chip
                                label="CIBIL Discount"
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default HomeLoanComparison;
