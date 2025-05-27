import CloseIcon from '@mui/icons-material/Close';
import {
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ToWords } from 'to-words';
import { rupeeFormat } from '../utils';

const toWords = new ToWords({
  converterOptions: {
    currency: true,
    ignoreZeroCurrency: true,
    doNotAddOnly: true
  }
});

export default function EMICalculatorForm({ onChange, interestRate = 10 }) {
  const [calcState, setCalcState] = useState(() => {
    // Try to get saved state from localStorage
    const savedState = localStorage.getItem('emiCalculatorState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Convert total months into years and months
        const totalMonths = parsedState.tenure || 60;
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        return {
          amount: parsedState.amount || 1000000,
          years: years,
          months: months,
          tenure: totalMonths, // Keep the total for backward compatibility
          interestRate: parsedState.interestRate || interestRate
        };
      } catch (error) {
        console.error('Error parsing saved calculator state:', error);
      }
    }

    // Default state if nothing in localStorage
    return {
      amount: 1000000, // Default loan amount (10 lakhs)
      years: 5, // Default 5 years
      months: 0, // Default 0 additional months
      tenure: 60, // Default tenure in months (5 years)
      interestRate: interestRate // Default interest rate
    };
  }); // Convert amount to slider position (0-100 scale)
  const amountToSliderPosition = (amount) => {
    // Handle invalid or empty values
    if (!amount || amount === '' || isNaN(amount) || amount < 100000) return 0;

    if (amount <= 5000000) {
      // Up to 50 lakhs
      // 0-40 position for 1-50 lakhs (1 lakh steps)
      return ((amount - 100000) / 4900000) * 40;
    } else if (amount <= 10000000) {
      // 50 lakhs to 1 crore
      // 40-70 position for 50 lakhs to 1 crore (5 lakh steps)
      const excessAmount = amount - 5000000;
      const rangeSize = 5000000; // 50 lakhs range
      return 40 + (excessAmount / rangeSize) * 30;
    } else {
      // 70-100 position for 1 crore to 10 crore (50 lakh steps)
      const excessAmount = amount - 10000000;
      const maxExcess = 90000000; // 9 crores (10cr - 1cr)
      return Math.min(100, 70 + (excessAmount / maxExcess) * 30); // Cap at 100
    }
  };
  // Convert slider position to actual amount
  const sliderPositionToAmount = (position) => {
    if (position <= 40) {
      // 0-40 position maps to 1-50 lakhs with 1 lakh steps
      const amount = 100000 + (position / 40) * 4900000; // Start from 1 lakh
      return Math.round(amount / 100000) * 100000; // Round to nearest 1 lakh
    } else if (position <= 70) {
      // 40-70 position maps to 50 lakhs to 1 crore with 5 lakh steps
      const excessPosition = position - 40;
      const excessAmount = (excessPosition / 30) * 5000000; // 50 lakhs range
      const amount = 5000000 + excessAmount;
      return Math.round(amount / 500000) * 500000; // Round to nearest 5 lakh
    } else {
      // 70-100 position maps to 1 crore to 10 crore with 50 lakh steps
      const excessPosition = position - 70;
      const excessAmount = (excessPosition / 30) * 90000000; // 9 crores
      const amount = 10000000 + excessAmount;
      return Math.round(amount / 5000000) * 5000000; // Round to nearest 50 lakh
    }
  };
  const handleAmountChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]+/g, '');
    if ((newValue >= 100000 && newValue <= 1000000000) || newValue === '') {
      // Updated to support 10 crores with minimum 1 lakh
      setCalcState((prevState) => ({ ...prevState, amount: Number(newValue) }));
    }
  };

  const handleAmountSliderChange = (event, newValue) => {
    // Convert slider position to actual amount using dynamic step logic
    const actualAmount = sliderPositionToAmount(newValue);
    setCalcState((prevState) => ({
      ...prevState,
      amount: actualAmount
    }));
  };

  const handleAmountClear = () => {
    setCalcState((prevState) => ({ ...prevState, amount: '' }));
  };
  const handleYearsChange = (event) => {
    const years = parseInt(event.target.value, 10);
    // If years is 30, set months to 0
    const months = years === 30 ? 0 : calcState.months;
    const totalMonths = years * 12 + months;

    setCalcState((prevState) => ({
      ...prevState,
      years: years,
      months: months,
      tenure: totalMonths
    }));
  };

  const handleMonthsChange = (event) => {
    const months = parseInt(event.target.value, 10);
    const totalMonths = calcState.years * 12 + months;
    setCalcState((prevState) => ({
      ...prevState,
      months: months,
      tenure: totalMonths
    }));
  };

  const handleInterestRateChange = (event) => {
    const value = event.target.value;
    // Allow decimal interest rates
    if (value === '' || (value >= 0 && value <= 50)) {
      setCalcState((prevState) => ({ ...prevState, interestRate: value }));
    }
  };

  const handleInterestRateSliderChange = (event, newValue) => {
    setCalcState((prevState) => ({
      ...prevState,
      interestRate: newValue
    }));
  };

  const inWords = (value) => {
    return value ? toWords.convert(value) : '';
  };
  useEffect(() => {
    // Save to localStorage whenever calcState changes
    try {
      localStorage.setItem('emiCalculatorState', JSON.stringify(calcState));
    } catch (error) {
      console.error('Error saving calculator state to localStorage:', error);
    }

    const handler = setTimeout(() => {
      onChange(calcState);
    }, 10);

    return () => clearTimeout(handler);
  }, [calcState, onChange]);

  const formatSliderValue = (value) => {
    if (value < 12) {
      return `${value} month${value > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(value / 12);
      const months = value % 12;
      let yearText = `${years} year${years > 1 ? 's' : ''}`;
      let monthText =
        months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '';
      return `${yearText}${months > 0 ? ' ' + monthText : ''}`;
    }
  };

  const format = (value) => {
    return value ? rupeeFormat(value) : value;
  };
  return (
    <Stack
      spacing={2.5}
      sx={{ p: 1, pt: 2, paddingBottom: 2 }}
      className="calc-form"
    >
      {' '}
      {/* Loan Amount field */}
      <Stack spacing={1}>
        <Stack direction="row" alignItems="top" spacing={1}>
          <label
            className="calc-label"
            style={{ whiteSpace: 'nowrap', minWidth: '90px' }}
          >
            Loan Amount:
          </label>
          <div style={{ width: '100%' }}>
            <Stack>
              <TextField
                size="small"
                fullWidth
                type="text"
                variant="outlined"
                placeholder=""
                value={format(calcState.amount)}
                onChange={handleAmountChange}
                sx={{
                  '&  .MuiOutlinedInput-input': {
                    marginLeft: '-15px'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <label>₹</label>
                    </InputAdornment>
                  ),
                  endAdornment: calcState.amount ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear"
                        onClick={handleAmountClear}
                      >
                        <CloseIcon fontSize="small" color="disabled" />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
              />
              <div className="text-converted">{inWords(calcState.amount)}</div>
            </Stack>
          </div>
        </Stack>
        {/* Full width slider */}{' '}
        <Slider
          aria-label="Amount"
          value={amountToSliderPosition(calcState.amount) || 0}
          step={1}
          min={0}
          max={100}
          onChange={handleAmountSliderChange}
          sx={{ marginTop: '-8px !important' }}
        />
      </Stack>{' '}
      {/* Interest Rate field */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={1}>
          <label
            className="calc-label"
            style={{ whiteSpace: 'nowrap', minWidth: '90px' }}
          >
            Interest Rate:
          </label>
          <div style={{ width: '100%' }}>
            <TextField
              size="small"
              fullWidth
              type="number"
              variant="outlined"
              placeholder="Enter interest rate"
              value={calcState.interestRate || 0}
              onChange={handleInterestRateChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </div>
        </Stack>
        {/* Full width slider */}
        <Slider
          aria-label="Interest Rate"
          value={calcState.interestRate || 0}
          step={0.5}
          min={1}
          max={30}
          onChange={handleInterestRateSliderChange}
          sx={{ marginTop: '4px !important' }}
        />
      </Stack>
      {/* Tenure field */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={1}>
          <label
            className="calc-label"
            style={{ whiteSpace: 'nowrap', minWidth: '90px' }}
          >
            Loan Tenure:
          </label>
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <FormControl size="small" sx={{ width: '50%' }}>
              <Select
                value={calcState.years}
                onChange={handleYearsChange}
                displayEmpty
                variant="outlined"
                size="small"
              >
                {[...Array(31).keys()].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year} {year === 1 ? 'Year' : 'Years'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{ width: '50%' }}
              disabled={calcState.years === 30}
            >
              <Select
                value={calcState.years === 30 ? 0 : calcState.months}
                onChange={handleMonthsChange}
                displayEmpty
                variant="outlined"
                size="small"
              >
                {[...Array(12).keys()].map((month) => (
                  <MenuItem key={month} value={month}>
                    {month} {month === 1 ? 'Month' : 'Months'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
        <Typography variant="caption" color="textSecondary" sx={{ pl: 14 }}>
          Total loan term: {formatSliderValue(calcState.tenure)}
        </Typography>{' '}
      </Stack>
      {/* Reset button */}
      {/* <Stack direction="row" justifyContent="flex-end" sx={{ mt: 0 }}>
        <Typography
          variant="body2"
          color="primary"
          sx={{
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
          onClick={resetCalculator}
        >
          Reset to defaults
        </Typography>
      </Stack> */}
    </Stack>
  );
}
