import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import FDCalculatorForm from '../fd-calculator/fd-calculator-form';
import usePageInfo from '../page-info/use-page-info';
import { calculateFd, rupeeFormat } from '../utils';

const InterestCalculator = () => {
  const [calcState, setCalcState] = useState({
    amount: 100000,
    interestRate: 8,
    tenure: 24
  });
  const [compoundingFrequency, setCompoundingFrequency] = useState(1); // Default to yearly (1)
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [hasScrolledToTable, setHasScrolledToTable] = useState(false);
  const referenceTableRef = useRef(null);

  usePageInfo({
    title: 'Compounding Calculator',
    description:
      'FinRates Compounding Calculator helps you calculate interest earnings with ease. Adjust principal amount, interest rate, tenure, and compounding frequency to explore growth. Analyze total interest, final amount, and percentage returns. Save multiple scenarios for comparison and make informed financial decisions with our comprehensive interest analysis tools.'
  });

  useEffect(() => {
    // Load Saved References from localStorage on component mount
    const saved = localStorage.getItem('savedCalculations');
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
  }, []);

  const handleCalcChange = (state) => {
    setCalcState(state);
  };

  const handleCompoundingChange = (event) => {
    setCompoundingFrequency(event.target.value);
  };

  const formatNumber = (number) => {
    // Convert to number in case it's a string
    const num = Number(number);
    // If it's a whole number (no decimal part), return without decimals
    if (num % 1 === 0) return num.toString();
    // Otherwise return with decimal places but without trailing zeros
    return num.toString().replace(/\.?0+$/, '');
  };

  const calculateInterest = () => {
    const { amount, interestRate, tenure } = calcState;
    if (amount && interestRate && tenure) {
      // Calculate days from months
      const tenureInDays = tenure * 30;
      // Use the calculateFd utility with the selected compounding frequency
      const result = calculateFd(
        tenureInDays,
        amount,
        interestRate,
        compoundingFrequency
      );
      return formatNumber(result.value);
    }
    return 0;
  };

  const calculateTotalAmount = () => {
    const { amount } = calcState;
    const totalAmount = parseFloat(amount) + parseFloat(calculateInterest());
    return formatNumber(totalAmount);
  };

  const calculateTotalPercentage = () => {
    const { amount, interestRate, tenure } = calcState;
    if (!amount || !interestRate || !tenure) return '0';

    // Calculate total interest
    const interest = parseFloat(calculateInterest());
    // Calculate percentage return on principal
    const percentReturn = (interest / parseFloat(amount)) * 100;

    // Only apply toFixed if there's a decimal part
    return percentReturn % 1 === 0
      ? percentReturn.toString()
      : percentReturn.toFixed(2);
  };

  const saveCalculation = () => {
    const newCalculation = {
      id: Date.now(), // Use timestamp as unique ID
      amount: calcState.amount,
      interestRate: calcState.interestRate,
      tenure: calcState.tenure,
      compoundingFrequency: compoundingFrequency === 1 ? 'Yearly' : 'Quarterly',
      interest: calculateInterest(),
      totalAmount: calculateTotalAmount(),
      totalPercentage: calculateTotalPercentage(),
      date: new Date().toLocaleDateString()
    };
    const updatedCalculations = [...savedCalculations, newCalculation];
    setSavedCalculations(updatedCalculations);
    localStorage.setItem(
      'savedCalculations',
      JSON.stringify(updatedCalculations)
    );

    // Scroll to reference table on first save only
    if (!hasScrolledToTable && referenceTableRef.current) {
      setTimeout(() => {
        referenceTableRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        setHasScrolledToTable(true);
      }, 100); // Small delay to ensure the table is rendered
    }
  };

  const deleteCalculation = (id) => {
    const updatedCalculations = savedCalculations.filter(
      (calc) => calc.id !== id
    );
    setSavedCalculations(updatedCalculations);
    localStorage.setItem(
      'savedCalculations',
      JSON.stringify(updatedCalculations)
    );
  };

  return (
    <Box
      sx={{
        maxWidth: '1024px',
        mx: 'auto'
      }}
    >
      <Box
        sx={{
          p: 2,
          pb: 0,
          maxWidth: 400
        }}
      >
        <Typography
          variant="h1"
          sx={{
            mt: -1,
            mb: 1.5,
            fontWeight: 'bold',
            color: 'primary.main',
            borderBottom: '2px solid',
            borderColor: 'primary.main',
            paddingBottom: 1,
            fontSize: '1.1rem'
          }}
        >
          Compounding Calculator
        </Typography>
        <FDCalculatorForm
          onChange={handleCalcChange}
          showBankSelector={false}
          showInterestSelector={true}
          interestRate={calcState.interestRate}
          maxTenure={360}
        />
        <Stack direction="row" spacing={3} sx={{ mt: -1, mb: 4, mr: 2 }}>
          <label className="calc-label">Compounding:</label>
          <FormControl fullWidth size="small">
            <Select
              value={compoundingFrequency}
              onChange={handleCompoundingChange}
              displayEmpty
              variant="outlined"
              size="small"
              sx={{
                height: '32px',
                '.MuiSelect-select': {
                  paddingTop: '8px',
                  paddingBottom: '8px'
                }
              }}
            >
              <MenuItem value={1}>Yearly</MenuItem>
              <MenuItem value={4}>Quarterly</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
          <Typography variant="body1">Total Interest:</Typography>
          <Typography variant="body1">
            ₹{rupeeFormat(calculateInterest())}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body1">Total Amount:</Typography>
          <Typography variant="body1">
            ₹{rupeeFormat(calculateTotalAmount())}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body1">Total Return Percent:</Typography>
          <Typography variant="body1">{calculateTotalPercentage()}%</Typography>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          onClick={saveCalculation}
          fullWidth
        >
          Save for Reference
        </Button>
      </Box>
      <Box
        ref={referenceTableRef}
        sx={{
          p: 2,
          pt: 5,
          pb: 10
        }}
      >
        {savedCalculations.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 1, mb: 2 }} color="primary">
              Saved References
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ width: '20px', padding: '0px 4px' }}
                    ></TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>#</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Amount</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Rate</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Tenure</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      Interest
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Total %</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      Compounding
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      Saved Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {savedCalculations.map((calc, index) => (
                    <TableRow key={calc.id}>
                      <TableCell
                        sx={{
                          width: '20px',
                          padding: '0px 4px',
                          boxSizing: 'content-box'
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => deleteCalculation(calc.id)}
                          sx={{ padding: '2px' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        ₹{rupeeFormat(calc.amount)}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {calc.interestRate}%
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {calc.tenure} mo
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        ₹{rupeeFormat(calc.interest)}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {calc.totalPercentage}%
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {calc.compoundingFrequency}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {calc.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Box>
  );
};

export default InterestCalculator;
