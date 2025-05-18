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
import { useEffect, useState } from 'react';
import FDCalculatorForm from '../fd-calculator/fd-calculator-form';
import { calculateFd, rupeeFormat } from '../utils';

const InterestCalculator = () => {
  const [calcState, setCalcState] = useState({
    amount: 100000,
    interestRate: 8,
    tenure: 24
  });
  const [compoundingFrequency, setCompoundingFrequency] = useState(1); // Default to yearly (1)
  const [savedCalculations, setSavedCalculations] = useState([]);

  useEffect(() => {
    // Load saved calculations from localStorage on component mount
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
        p: 2,
        maxWidth: 600,
        margin: '0 auto',
        border: '1px solid #ddd',
        borderRadius: 2
      }}
    >
      <Typography variant="h6" sx={{ mb: 0 }} color="primary">
        Interest Calculator
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
        <Typography variant="body1" fontWeight="bold">
          Total Interest:
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          ₹{calculateInterest()}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Typography variant="body1" fontWeight="bold">
          Total Amount (Principal + Interest):
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          ₹{calculateTotalAmount()}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Typography variant="body1" fontWeight="bold">
          Total Return Percent:
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {calculateTotalPercentage()}%
        </Typography>
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

      {savedCalculations.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 1, mb: 2 }} color="primary">
            Saved Calculations
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell>Tenure</TableCell>
                  <TableCell>Interest</TableCell>
                  <TableCell>Return</TableCell>
                  <TableCell>Compounding</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedCalculations.map((calc, index) => (
                  <TableRow key={calc.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>₹{rupeeFormat(calc.amount)}</TableCell>
                    <TableCell>{calc.interestRate}%</TableCell>
                    <TableCell>{calc.tenure} mo</TableCell>
                    <TableCell>₹{rupeeFormat(calc.interest)}</TableCell>
                    <TableCell>{calc.totalPercentage}%</TableCell>
                    <TableCell>{calc.compoundingFrequency}</TableCell>
                    <TableCell>{calc.date}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteCalculation(calc.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default InterestCalculator;
