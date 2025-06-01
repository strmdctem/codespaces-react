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

export default function STPCalculatorForm({ onChange }) {
  const [calcState, setCalcState] = useState(() => {
    // Try to get saved state from localStorage
    const savedState = localStorage.getItem('stpCalculatorState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        return {
          initialInvestment: parsedState.initialInvestment || 2500000, // Default 5 lakhs
          transferAmount: parsedState.transferAmount || 25000, // Default 25k
          sourceReturnRate: parsedState.sourceReturnRate || 7, // Conservative fund return
          targetReturnRate: parsedState.targetReturnRate || 12, // Equity fund return
          years: parsedState.years || 5, // Default years
          months: parsedState.months || 0, // Default additional months
          tenure: parsedState.tenure || 60, // Total months (5 years)
          frequency: parsedState.frequency || 'monthly' // Default frequency
        };
      } catch (error) {
        console.error('Error parsing saved calculator state:', error);
      }
    }

    // Default state if nothing in localStorage
    return {
      initialInvestment: 2500000, // Default 5 lakhs
      transferAmount: 25000, // Default 25k
      sourceReturnRate: 7, // Conservative fund return in %
      targetReturnRate: 12, // Equity fund return in %
      years: 10, // Default years
      months: 0, // Default additional months
      tenure: 120, // Total months (5 years)
      frequency: 'monthly' // Default frequency
    };
  });
  // Configuration for STP calculator sliders
  const initialInvestmentSliderConfig = {
    minAmount: 50000, // Min: 50k
    midAmount: 5000000, // First threshold: 50 lakh
    maxAmount: 10000000, // Second threshold: 1 crore
    topAmount: 100000000, // Max: 10 crore
    firstStepSize: 50000, // 50k steps in first tier
    secondStepSize: 500000, // 5 lakh steps in second tier
    thirdStepSize: 5000000 // 50 lakh steps in third tier
  };

  const transferAmountSliderConfig = {
    minAmount: 1000, // Min: 1k
    midAmount: 50000, // First threshold: 50k
    maxAmount: 100000, // Second threshold: 1 lakh
    topAmount: 500000, // Max: 5 lakh
    firstStepSize: 1000, // 1k steps in first tier
    secondStepSize: 5000, // 5k steps in second tier
    thirdStepSize: 25000 // 25k steps in third tier
  };
  const handleInitialInvestmentChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]+/g, '');
    if (newValue === '' || (newValue >= 0 && newValue <= 100000000)) {
      setCalcState((prevState) => ({
        ...prevState,
        initialInvestment: newValue === '' ? '' : Number(newValue)
      }));
    }
  };

  const handleInitialInvestmentSliderChange = (event, newValue) => {
    const actualAmount = sliderPositionToAmount(
      newValue,
      initialInvestmentSliderConfig
    );
    setCalcState((prevState) => ({
      ...prevState,
      initialInvestment: actualAmount
    }));
  };

  const handleInitialInvestmentClear = () => {
    setCalcState((prevState) => ({ ...prevState, initialInvestment: '' }));
  };

  const handleTransferAmountChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]+/g, '');
    if (newValue === '' || (newValue >= 0 && newValue <= 500000)) {
      setCalcState((prevState) => ({
        ...prevState,
        transferAmount: newValue === '' ? '' : Number(newValue)
      }));
    }
  };

  const handleTransferAmountSliderChange = (event, newValue) => {
    const actualAmount = sliderPositionToAmount(
      newValue,
      transferAmountSliderConfig
    );
    setCalcState((prevState) => ({
      ...prevState,
      transferAmount: actualAmount
    }));
  };

  const handleTransferAmountClear = () => {
    setCalcState((prevState) => ({ ...prevState, transferAmount: '' }));
  };

  const handleYearsChange = (event) => {
    const years = parseInt(event.target.value, 10);
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

  const handleSourceReturnRateChange = (event) => {
    const value = event.target.value;
    if (value === '' || (value >= 0 && value <= 30)) {
      setCalcState((prevState) => ({
        ...prevState,
        sourceReturnRate: value
      }));
    }
  };

  const handleSourceReturnRateSliderChange = (event, newValue) => {
    setCalcState((prevState) => ({
      ...prevState,
      sourceReturnRate: newValue
    }));
  };

  const handleTargetReturnRateChange = (event) => {
    const value = event.target.value;
    if (value === '' || (value >= 0 && value <= 30)) {
      setCalcState((prevState) => ({
        ...prevState,
        targetReturnRate: value
      }));
    }
  };

  const handleTargetReturnRateSliderChange = (event, newValue) => {
    setCalcState((prevState) => ({
      ...prevState,
      targetReturnRate: newValue
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
      localStorage.setItem('stpCalculatorState', JSON.stringify(calcState));
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
    minWidth: '130px',
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
      {/* Initial Investment field */}
      <Stack spacing={1}>
        <Stack direction="row" alignItems="top" spacing={2}>
          <label className="calc-label" style={labelStyleWithPadding}>
            Initial Investment:
          </label>
          <div style={{ width: '100%' }}>
            <Stack>
              <TextField
                size="small"
                fullWidth
                type="text"
                variant="outlined"
                placeholder=""
                value={format(calcState.initialInvestment)}
                onChange={handleInitialInvestmentChange}
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
                  endAdornment: calcState.initialInvestment ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear"
                        onClick={handleInitialInvestmentClear}
                      >
                        <CloseIcon fontSize="small" color="disabled" />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
              />
              <div className="text-converted">
                {inWords(calcState.initialInvestment)}
              </div>
            </Stack>
          </div>
        </Stack>
        <Slider
          aria-label="Initial Investment"
          value={
            amountToSliderPosition(
              calcState.initialInvestment,
              initialInvestmentSliderConfig
            ) || 0
          }
          step={0.1}
          min={0}
          max={100}
          onChange={handleInitialInvestmentSliderChange}
          sx={{ marginTop: '-8px !important' }}
        />
      </Stack>

      {/* Transfer Amount field */}
      <Stack spacing={1}>
        <Stack direction="row" alignItems="top" spacing={2}>
          <label className="calc-label" style={labelStyleWithPadding}>
            Transfer Amount:
          </label>
          <div style={{ width: '100%' }}>
            <Stack>
              <TextField
                size="small"
                fullWidth
                type="text"
                variant="outlined"
                placeholder=""
                value={format(calcState.transferAmount)}
                onChange={handleTransferAmountChange}
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
                  endAdornment: calcState.transferAmount ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear"
                        onClick={handleTransferAmountClear}
                      >
                        <CloseIcon fontSize="small" color="disabled" />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
              />
              <div className="text-converted">
                {inWords(calcState.transferAmount)}
              </div>
            </Stack>
          </div>
        </Stack>
        <Slider
          aria-label="Transfer Amount"
          value={
            amountToSliderPosition(
              calcState.transferAmount,
              transferAmountSliderConfig
            ) || 0
          }
          step={0.1}
          min={0}
          max={100}
          onChange={handleTransferAmountSliderChange}
          sx={{ marginTop: '-8px !important' }}
        />
      </Stack>

      {/* STP Frequency field */}
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <label className="calc-label" style={labelStyle}>
            STP Frequency:
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

      {/* Source Fund Return Rate field */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={4}>
          <label className="calc-label" style={labelStyle}>
            Source Fund Return:
          </label>
          <div style={{ width: '100%' }}>
            <TextField
              size="small"
              fullWidth
              type="number"
              variant="outlined"
              placeholder="Enter source fund return rate"
              value={calcState.sourceReturnRate || 0}
              onChange={handleSourceReturnRateChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">% per annum</InputAdornment>
                )
              }}
            />
          </div>
        </Stack>
        <Slider
          aria-label="Source Fund Return Rate"
          value={calcState.sourceReturnRate || 0}
          step={0.5}
          min={1}
          max={20}
          onChange={handleSourceReturnRateSliderChange}
          sx={{ marginTop: '4px !important' }}
        />
      </Stack>

      {/* Target Fund Return Rate field */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={4}>
          <label className="calc-label" style={labelStyle}>
            Target Fund Return:
          </label>
          <div style={{ width: '100%' }}>
            <TextField
              size="small"
              fullWidth
              type="number"
              variant="outlined"
              placeholder="Enter target fund return rate"
              value={calcState.targetReturnRate || 0}
              onChange={handleTargetReturnRateChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">% per annum</InputAdornment>
                )
              }}
            />
          </div>
        </Stack>
        <Slider
          aria-label="Target Fund Return Rate"
          value={calcState.targetReturnRate || 0}
          step={0.5}
          min={5}
          max={30}
          onChange={handleTargetReturnRateSliderChange}
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
                {[...Array(21).keys()].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year} {year === 1 ? 'Year' : 'Years'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{ width: '50%' }}
              disabled={calcState.years === 20}
            >
              <Select
                value={calcState.years === 20 ? 0 : calcState.months}
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
          Total transfer period: {formatSliderValue(calcState.tenure)}
        </Typography>
      </Stack>
    </Stack>
  );
}
