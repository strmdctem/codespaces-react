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

// PPF Investment limits per frequency (yearly max is 150,000)
const PPF_LIMITS = {
  monthly: 12500, // 150,000 / 12
  quarterly: 37500, // 150,000 / 4
  'half-yearly': 75000, // 150,000 / 2
  yearly: 150000 // Maximum yearly limit
};

export default function PPFCalculatorForm({ onChange }) {
  const [calcState, setCalcState] = useState(() => {
    // Try to get saved state from localStorage
    const savedState = localStorage.getItem('ppfCalculatorState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        return {
          investmentAmount: parsedState.investmentAmount || 12500,
          interestRate: 7.1, // Current PPF rate
          years: parsedState.years || 15,
          months: parsedState.months || 0,
          tenure: parsedState.tenure || 180, // Total months (15 years - PPF minimum)
          frequency: parsedState.frequency || 'monthly'
        };
      } catch (error) {
        console.error('Error parsing saved calculator state:', error);
      }
    }

    // Default state if nothing in localStorage
    return {
      investmentAmount: 12500, // Default investment amount (monthly max)
      interestRate: 7.1, // Current PPF interest rate
      years: 15, // PPF minimum lock-in period
      months: 0, // Default additional months
      tenure: 180, // Total months (15 years)
      frequency: 'monthly' // Default frequency
    };
  });

  // Configuration for PPF calculator slider
  const ppfSliderConfig = {
    minAmount: 500, // PPF minimum: ₹500
    midAmount: 10000, // First threshold: ₹10k
    maxAmount: 50000, // Second threshold: ₹50k
    topAmount: 150000, // Max: ₹1.5 lakh (yearly)
    firstStepSize: 500, // ₹500 steps in first tier
    secondStepSize: 1000, // ₹1k steps in second tier
    thirdStepSize: 5000 // ₹5k steps in third tier
  };

  // Validate and adjust investment amount based on frequency
  const validateAndAdjustAmount = (amount, frequency) => {
    const maxAmount = PPF_LIMITS[frequency];
    if (amount > maxAmount) {
      return maxAmount;
    }
    return amount;
  };

  const handleInvestmentChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]+/g, '');
    const amount = newValue === '' ? '' : Number(newValue);

    if (newValue === '' || amount >= 0) {
      const validatedAmount =
        amount === ''
          ? ''
          : validateAndAdjustAmount(amount, calcState.frequency);
      setCalcState((prevState) => ({
        ...prevState,
        investmentAmount: validatedAmount
      }));
    }
  };

  const handleInvestmentSliderChange = (event, newValue) => {
    // Convert slider position to actual amount using shared utility
    const actualAmount = sliderPositionToAmount(newValue, ppfSliderConfig);
    const validatedAmount = validateAndAdjustAmount(
      actualAmount,
      calcState.frequency
    );
    setCalcState((prevState) => ({
      ...prevState,
      investmentAmount: validatedAmount
    }));
  };

  const handleInvestmentClear = () => {
    setCalcState((prevState) => ({ ...prevState, investmentAmount: '' }));
  };

  const handleYearsChange = (event) => {
    const years = parseInt(event.target.value, 10);
    // PPF minimum is 15 years, if exactly 15 years, set months to 0
    const months = years === 15 ? 0 : calcState.months;
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
    if (value === '' || (value >= 0 && value <= 20)) {
      setCalcState((prevState) => ({
        ...prevState,
        interestRate: value
      }));
    }
  };

  const handleInterestRateSliderChange = (event, newValue) => {
    setCalcState((prevState) => ({
      ...prevState,
      interestRate: newValue
    }));
  };

  const handleFrequencyChange = (event) => {
    const newFrequency = event.target.value;
    // Validate current amount against new frequency limits
    const validatedAmount = validateAndAdjustAmount(
      calcState.investmentAmount,
      newFrequency
    );

    setCalcState((prevState) => ({
      ...prevState,
      frequency: newFrequency,
      investmentAmount: validatedAmount
    }));
  };
  // const resetCalculator = () => {
  //   const defaultState = {
  //     investmentAmount: 12500,
  //     interestRate: 7.1,
  //     years: 15,
  //     months: 0,
  //     tenure: 180,
  //     frequency: 'monthly'
  //   };
  //   localStorage.removeItem('ppfCalculatorState');
  //   setCalcState(defaultState);
  // };

  const inWords = (value) => {
    return value ? toWords.convert(value) : '';
  };

  useEffect(() => {
    // Save to localStorage whenever calcState changes
    try {
      localStorage.setItem('ppfCalculatorState', JSON.stringify(calcState));
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

  const getMaxAmountForFrequency = () => {
    return PPF_LIMITS[calcState.frequency];
  };

  return (
    <Stack
      spacing={2.5}
      sx={{ p: 1, pt: 2, paddingBottom: 2 }}
      className="calc-form"
    >
      <Stack spacing={1}>
        <Stack direction="row" alignItems="top" spacing={2}>
          <label
            className="calc-label"
            style={{ whiteSpace: 'nowrap', minWidth: '90px' }}
          >
            PPF Amount:
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
          aria-label="PPF Amount"
          value={
            amountToSliderPosition(
              calcState.investmentAmount,
              ppfSliderConfig
            ) || 0
          }
          step={0.1}
          min={0}
          max={100}
          onChange={handleInvestmentSliderChange}
          sx={{ marginTop: '-8px !important' }}
        />
        <Typography variant="caption" color="textSecondary" sx={{ pl: 1 }}>
          Maximum per {calcState.frequency}: ₹
          {rupeeFormat(getMaxAmountForFrequency())}
          (Yearly limit: ₹1,50,000)
        </Typography>
      </Stack>

      {/* PPF Frequency field */}
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <label
            className="calc-label"
            style={{ whiteSpace: 'nowrap', minWidth: '90px' }}
          >
            Frequency:
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

      {/* Interest Rate field */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={4}>
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
                endAdornment: (
                  <InputAdornment position="end">% p.a.</InputAdornment>
                )
              }}
            />
          </div>
        </Stack>
        {/* Full width slider */}
        <Slider
          aria-label="Interest Rate"
          value={calcState.interestRate || 0}
          step={0.1}
          min={4}
          max={15}
          onChange={handleInterestRateSliderChange}
          sx={{ marginTop: '4px !important' }}
        />
      </Stack>

      {/* Investment Duration field */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={1}>
          <label
            className="calc-label"
            style={{ whiteSpace: 'nowrap', minWidth: '90px' }}
          >
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
                {[...Array(36).keys()].map((year) => {
                  const yearValue = year + 15; // PPF minimum is 15 years
                  return (
                    <MenuItem key={yearValue} value={yearValue}>
                      {yearValue} {yearValue === 1 ? 'Year' : 'Years'}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{ width: '50%' }}
              disabled={calcState.years === 15}
            >
              <Select
                value={calcState.years === 15 ? 0 : calcState.months}
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
          Total investment period: {formatSliderValue(calcState.tenure)}
          {calcState.tenure < 180 && ' (Min: 15 years for PPF)'}
        </Typography>
      </Stack>
    </Stack>
  );
}
