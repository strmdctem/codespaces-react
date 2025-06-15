import CloseIcon from '@mui/icons-material/Close';
import {
  IconButton,
  InputAdornment,
  Slider,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ToWords } from 'to-words';
import PercentTextField from '../common/PercentTextField';
import TenureField from '../common/TenureField';
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
          tenureInputMode: parsedState.tenureInputMode || 'years-months', // Default to years-months
          interestRate: parsedState.interestRate || interestRate
        };
      } catch (error) {
        console.error('Error parsing saved calculator state:', error);
      }
    } // Default state if nothing in localStorage
    return {
      amount: 1000000, // Default loan amount (10 lakhs)
      years: 5, // Default 5 years
      months: 0, // Default 0 additional months
      tenure: 60, // Default tenure in months (5 years)
      tenureInputMode: 'years-months', // 'years-months' or 'months-only'
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
    if (newValue === '' || (newValue >= 0 && newValue <= 100000000)) {
      // Allow empty values or amounts up to 10 crores (no minimum for textbox)
      setCalcState((prevState) => ({
        ...prevState,
        amount: newValue === '' ? '' : Number(newValue)
      }));
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

  const handleTotalMonthsChange = (event) => {
    const totalMonths = parseInt(event.target.value, 10) || 0;

    // Validate maximum tenure (30 years = 360 months)
    const validatedMonths = Math.min(totalMonths, 360);
    const years = Math.floor(validatedMonths / 12);
    const months = validatedMonths % 12;

    setCalcState((prevState) => ({
      ...prevState,
      years: years,
      months: months,
      tenure: validatedMonths
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

  const format = (value) => {
    return value ? rupeeFormat(value) : value;
  }; // Common label styles
  const labelStyle = {
    whiteSpace: 'nowrap',
    minWidth: '90px',
    textAlign: 'left'
  };
  const labelStyleWithPadding = {
    ...labelStyle,
    paddingTop: '8px'
  };

  return (
    <Stack
      spacing={4}
      sx={{ p: 0, pt: 1, paddingBottom: 6 }}
      className="calc-form"
    >
      {/* Loan Amount field */}
      <Stack spacing={1}>
        <Stack direction="row" alignItems="top" spacing={2}>
          <label className="calc-label" style={labelStyleWithPadding}>
            Loan Amount:
          </label>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ width: '100%' }}
          >
            <Stack sx={{ width: '90%' }}>
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
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 1,
                  minHeight: '32px', // Fixed minimum height to prevent layout shifts
                  lineHeight: 1.2,
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  maxWidth: '100%'
                }}
              >
                {inWords(calcState.amount)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        {/* Full width slider */}
        <Slider
          aria-label="Amount"
          value={amountToSliderPosition(calcState.amount, emiSliderConfig) || 0}
          step={0.1}
          min={0}
          max={100}
          onChange={handleAmountSliderChange}
          sx={{ marginTop: '-8px !important', marginBottom: '-8px !important' }}
        />
      </Stack>
      {/* Interest Rate field */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={2}>
          <label className="calc-label" style={labelStyle}>
            Interest Rate:
          </label>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ width: '100%' }}
          >
            {' '}
            <Stack sx={{ width: '90%' }}>
              <PercentTextField
                value={calcState.interestRate}
                onChange={handleInterestRateChange}
                placeholder="Enter interest rate"
                label="% p.a"
                min={0}
                max={50}
                step={0.5}
              />
            </Stack>
          </Stack>{' '}
        </Stack>
      </Stack>{' '}
      {/* Tenure field */}
      <Stack spacing={1} sx={{ mt: 1 }}>
        <Stack direction="row" spacing={2}>
          <label className="calc-label" style={labelStyle}>
            Loan Tenure:
          </label>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ width: '100%' }}
          >
            <TenureField
              years={calcState.years}
              months={calcState.months}
              totalMonths={calcState.tenure}
              onYearsChange={handleYearsChange}
              onMonthsChange={handleMonthsChange}
              onTotalMonthsChange={handleTotalMonthsChange}
              defaultInputMode={calcState.tenureInputMode}
              maxYears={30}
              maxMonths={360}
              label="Total loan term"
              sx={{ width: '100%' }}
            />
          </Stack>
        </Stack>
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
