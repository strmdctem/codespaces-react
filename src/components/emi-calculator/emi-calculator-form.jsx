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
        return {
          amount: parsedState.amount || 1000000,
          tenure: parsedState.tenure || 60,
          interestRate: parsedState.interestRate || interestRate
        };
      } catch (error) {
        console.error('Error parsing saved calculator state:', error);
      }
    }

    // Default state if nothing in localStorage
    return {
      amount: 1000000, // Default loan amount (10 lakhs)
      tenure: 60, // Default tenure in months (5 years)
      interestRate: interestRate // Default interest rate
    };
  });

  const handleAmountChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]+/g, '');
    if ((newValue >= 0 && newValue <= 100000000) || newValue === '') {
      setCalcState((prevState) => ({ ...prevState, amount: Number(newValue) }));
    }
  };

  const handleAmountSliderChange = (event, newValue) => {
    let roundedValue = Math.round(newValue / 100000) * 100000;
    if (roundedValue < 100000) {
      roundedValue = 100000;
    }
    setCalcState((prevState) => ({
      ...prevState,
      amount: roundedValue
    }));
  };

  const handleAmountClear = () => {
    setCalcState((prevState) => ({ ...prevState, amount: '' }));
  };

  const handleTenureChange = (event, newValue) => {
    setCalcState((prevState) => ({ ...prevState, tenure: newValue }));
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

  const resetCalculator = () => {
    const defaultState = {
      amount: 1000000,
      tenure: 60,
      interestRate: interestRate
    };
    localStorage.removeItem('emiCalculatorState');
    setCalcState(defaultState);
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
      sx={{ p: 1, pt: 2, paddingBottom: 3 }}
      className="calc-form"
    >
      {' '}
      {/* Loan Amount field */}
      <Stack spacing={1}>
        <Stack direction="row" alignItems="top" spacing={2}>
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
        {/* Full width slider */}
        <Slider
          aria-label="Amount"
          value={calcState.amount}
          step={100000}
          min={100000}
          max={10000000}
          onChange={handleAmountSliderChange}
        />
      </Stack>{' '}
      {/* Interest Rate field */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={3}>
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
          step={0.25}
          min={1}
          max={20}
          onChange={handleInterestRateSliderChange}
        />
      </Stack>{' '}
      {/* Tenure field */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={3}>
          <label
            className="calc-label"
            style={{ whiteSpace: 'nowrap', minWidth: '90px' }}
          >
            Loan Tenure:
          </label>
          <div style={{ width: '100%' }}>
            <Typography variant="body2">
              {formatSliderValue(calcState.tenure)}
            </Typography>
          </div>
        </Stack>
        {/* Full width slider */}
        <Slider
          aria-label="Loan Tenure"
          value={calcState.tenure}
          valueLabelDisplay="off"
          step={1}
          min={12}
          max={360}
          onChange={handleTenureChange}
        />
      </Stack>
    </Stack>
  );
}
