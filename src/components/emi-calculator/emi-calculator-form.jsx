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
import {
  amountToSliderPosition,
  sliderPositionToAmount
} from '../utils/slider-utils';

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
  });

  // Configuration for EMI calculator slider
  const emiSliderConfig = {
    minAmount: 100000, // Min: 1 lakh
    midAmount: 5000000, // First threshold: 50 lakhs
    maxAmount: 10000000, // Second threshold: 1 crore
    topAmount: 100000000, // Max: 10 crore
    firstStepSize: 100000, // 1 lakh steps in first tier
    secondStepSize: 500000, // 5 lakh steps in second tier
    thirdStepSize: 5000000 // 50 lakh steps in third tier
  };
  const handleAmountChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]+/g, '');
    if ((newValue >= 100000 && newValue <= 100000000) || newValue === '') {
      // Support up to 10 crores with minimum 1 lakh
      setCalcState((prevState) => ({ ...prevState, amount: Number(newValue) }));
    }
  };

  const handleAmountSliderChange = (event, newValue) => {
    // Convert slider position to actual amount using shared utility
    const actualAmount = sliderPositionToAmount(newValue, emiSliderConfig);
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
          value={amountToSliderPosition(calcState.amount, emiSliderConfig) || 0}
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
