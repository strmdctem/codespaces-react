import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import FDCalculatorForm from '../fd-calculator/fd-calculator-form';

const InterestCalculator = () => {
  const [calcState, setCalcState] = useState({
    amount: 100000,
    interestRate: 10,
    tenure: 24
  });

  const handleCalcChange = (state) => {
    setCalcState(state);
  };

  const calculateInterest = () => {
    const { amount, interestRate, tenure } = calcState;
    if (amount && interestRate && tenure) {
      return ((amount * interestRate * tenure) / 100).toFixed(2);
    }
    return 0;
  };

  const calculateTotalAmount = () => {
    const { amount } = calcState;
    return parseFloat(amount) + parseFloat(calculateInterest());
  };

  const calculateTotalPercentage = () => {
    const { interestRate, tenure } = calcState;
    return (interestRate * tenure).toFixed(2);
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 600,
        margin: '0 auto',
        border: '1px solid #ddd',
        borderRadius: 2
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }} color="primary">
        Interest Calculator
      </Typography>
      <FDCalculatorForm
        onChange={handleCalcChange}
        showBankSelector={false}
        showInterestSelector={true}
        interestRate={calcState.interestRate}
      />
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
          Total Percentage:
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {calculateTotalPercentage()}%
        </Typography>
      </Stack>
    </Box>
  );
};

export default InterestCalculator;
