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

export default function SIPCalculatorForm({ onChange }) {
  const [calcState, setCalcState] = useState(() => {
    // Try to get saved state from localStorage
    const savedState = localStorage.getItem('sipCalculatorState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        return {
          investmentAmount: parsedState.investmentAmount || 10000,
          expectedReturnRate: parsedState.expectedReturnRate || 12,
          years: parsedState.years || 10,
          months: parsedState.months || 0,
          tenure: parsedState.tenure || 120, // Total months (10 years)
          frequency: parsedState.frequency || 'monthly' // Default frequency
        };
      } catch (error) {
        console.error('Error parsing saved calculator state:', error);
      }
    }

    // Default state if nothing in localStorage
    return {
      investmentAmount: 10000, // Default investment amount
      expectedReturnRate: 12, // Default expected return rate in %
      years: 10, // Default years
      months: 0, // Default additional months
      tenure: 120, // Total months (10 years)
      frequency: 'monthly' // Default frequency
    };
  });

  // Configuration for SIP calculator slider
  const sipSliderConfig = {
    minAmount: 1000, // Min: 1k
    midAmount: 50000, // First threshold: 50k
    maxAmount: 100000, // Second threshold: 1 lakh
    topAmount: 1000000, // Max: 10 lakh
    firstStepSize: 1000, // 1k steps in first tier
    secondStepSize: 5000, // 5k steps in second tier
    thirdStepSize: 50000 // 50k steps in third tier
  };
  const handleInvestmentChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]+/g, '');
    if (newValue === '' || (newValue >= 0 && newValue <= 1000000)) {
      // Allow empty values or amounts up to 10 lakhs (no minimum for textbox)
      setCalcState((prevState) => ({
        ...prevState,
        investmentAmount: newValue === '' ? '' : Number(newValue)
      }));
    }
  };

  const handleInvestmentSliderChange = (event, newValue) => {
    // Convert slider position to actual amount using shared utility
    const actualAmount = sliderPositionToAmount(newValue, sipSliderConfig);
    setCalcState((prevState) => ({
      ...prevState,
      investmentAmount: actualAmount
    }));
  };

  const handleInvestmentClear = () => {
    setCalcState((prevState) => ({ ...prevState, investmentAmount: '' }));
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

  const handleReturnRateChange = (event) => {
    const value = event.target.value;
    // Allow decimal return rates
    if (value === '' || (value >= 0 && value <= 50)) {
      setCalcState((prevState) => ({
        ...prevState,
        expectedReturnRate: value
      }));
    }
  };

  const handleReturnRateSliderChange = (event, newValue) => {
    setCalcState((prevState) => ({
      ...prevState,
      expectedReturnRate: newValue
    }));
  };
  const handleFrequencyChange = (event) => {
    setCalcState((prevState) => ({
      ...prevState,
      frequency: event.target.value
    }));
  };

  const inWords = (value) => {
    return value ? toWords.convert(value) : '';
  };

  useEffect(() => {
    // Save to localStorage whenever calcState changes
    try {
      localStorage.setItem('sipCalculatorState', JSON.stringify(calcState));
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

  // Common label styles
  const labelStyle = {
    whiteSpace: 'nowrap',
    minWidth: '100px',
    textAlign: 'left'
  };

  const labelStyleWithPadding = {
    ...labelStyle,
    paddingTop: '8px'
  };
  return (
    <Stack
      spacing={2.5}
      sx={{ p: 0, pt: 1, paddingBottom: 2 }}
      className="calc-form"
    >
      <Stack spacing={1}>
        <Stack direction="row" alignItems="top" spacing={2}>
          <label className="calc-label" style={labelStyleWithPadding}>
            SIP Amount:
          </label>
          <div style={{ width: '100%' }}>
            <Stack>
              <TextField
                size="small"
                fullWidth
                type="text"
                variant="outlined"
                placeholder=""
                value={format(calcState.investmentAmount)}
                onChange={handleInvestmentChange}
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
                  endAdornment: calcState.investmentAmount ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear"
                        onClick={handleInvestmentClear}
                      >
                        <CloseIcon fontSize="small" color="disabled" />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
              />
              <div className="text-converted">
                {inWords(calcState.investmentAmount)}
              </div>
            </Stack>
          </div>
        </Stack>
        {/* Full width slider */}
        <Slider
          aria-label="SIP Amount"
          value={
            amountToSliderPosition(
              calcState.investmentAmount,
              sipSliderConfig
            ) || 0
          }
          step={0.1}
          min={0}
          max={100}
          onChange={handleInvestmentSliderChange}
          sx={{ marginTop: '-8px !important' }}
        />
      </Stack>

      {/* SIP Frequency field */}
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <label className="calc-label" style={labelStyle}>
            SIP Frequency:
          </label>
          <div style={{ width: '100%' }}>
            <FormControl size="small" fullWidth>
              <Select
                value={calcState.frequency}
                onChange={handleFrequencyChange}
                displayEmpty
                variant="outlined"
                size="small"
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="half-yearly">Half-Yearly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Stack>
      </Stack>

      {/* Expected Return Rate field */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={4}>
          <label className="calc-label" style={labelStyle}>
            Expected Return:
          </label>
          <div style={{ width: '100%' }}>
            <TextField
              size="small"
              fullWidth
              type="number"
              variant="outlined"
              placeholder="Enter expected return rate"
              value={calcState.expectedReturnRate || 0}
              onChange={handleReturnRateChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">% per annum</InputAdornment>
                )
              }}
            />
          </div>
        </Stack>
        {/* Full width slider */}
        <Slider
          aria-label="Expected Return Rate"
          value={calcState.expectedReturnRate || 0}
          step={0.5}
          min={1}
          max={30}
          onChange={handleReturnRateSliderChange}
          sx={{ marginTop: '4px !important' }}
        />
      </Stack>

      {/* Investment Duration field */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={1}>
          <label className="calc-label" style={labelStyle}>
            Duration:
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
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ textAlign: 'right' }}
        >
          Total investment period: {formatSliderValue(calcState.tenure)}
        </Typography>
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
