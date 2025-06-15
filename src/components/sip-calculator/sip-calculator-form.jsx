import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ToWords } from 'to-words';
import PercentTextField from '../common/PercentTextField';
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
          frequency: parsedState.frequency || 'monthly', // Default frequency
          // Advanced mode fields with backward compatibility
          calculatorMode: parsedState.calculatorMode || 'basic',
          stepUpPercentage: parsedState.stepUpPercentage || 5,
          initialInvestment: parsedState.initialInvestment || 0,
          inflationRate: parsedState.inflationRate || 6
        };
      } catch (error) {
        console.error('Error parsing saved calculator state:', error);
      }
    } // Default state if nothing in localStorage
    return {
      investmentAmount: 10000, // Default investment amount
      expectedReturnRate: 12, // Default expected return rate in %
      years: 10, // Default years
      months: 0, // Default additional months
      tenure: 120, // Total months (10 years)
      frequency: 'monthly', // Default frequency
      // Advanced mode fields
      calculatorMode: 'basic',
      stepUpPercentage: 5,
      initialInvestment: 0,
      inflationRate: 6
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
        expectedReturnRate: value === '' ? '' : Number(value)
      }));
    }
  };
  const handleFrequencyChange = (event) => {
    setCalcState((prevState) => ({
      ...prevState,
      frequency: event.target.value
    }));
  };

  const handleCalculatorModeChange = (event) => {
    setCalcState((prevState) => ({
      ...prevState,
      calculatorMode: event.target.value
    }));
  };
  const handleStepUpPercentageChange = (event) => {
    const value = event.target.value;
    if (value === '' || (value >= 0 && value <= 50)) {
      setCalcState((prevState) => ({
        ...prevState,
        stepUpPercentage: value === '' ? '' : Number(value)
      }));
    }
  };

  const handleInitialInvestmentChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]+/g, '');
    if (newValue === '' || (newValue >= 0 && newValue <= 10000000)) {
      setCalcState((prevState) => ({
        ...prevState,
        initialInvestment: newValue === '' ? '' : Number(newValue)
      }));
    }
  };
  const handleInitialInvestmentClear = () => {
    setCalcState((prevState) => ({ ...prevState, initialInvestment: '' }));
  };
  const handleInflationRateChange = (event) => {
    const value = event.target.value;
    if (value === '' || (value >= 0 && value <= 25)) {
      setCalcState((prevState) => ({
        ...prevState,
        inflationRate: value === '' ? '' : Number(value)
      }));
    }
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
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 3, // Standard 24px spacing between major sections
        p: { xs: 0, sm: 0 }
      }}
    >
      {/* Calculator Mode Toggle - Full Width */}
      <Box sx={{ gridColumn: '1 / -1' }}>
        {' '}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'center',
            mb: 0 // No extra margin since main container handles spacing
          }}
        >
          <Chip
            label="Standard"
            variant={
              calcState.calculatorMode === 'basic' ? 'filled' : 'outlined'
            }
            color={calcState.calculatorMode === 'basic' ? 'primary' : 'default'}
            clickable
            onClick={() =>
              handleCalculatorModeChange({ target: { value: 'basic' } })
            }
            sx={{
              fontWeight:
                calcState.calculatorMode === 'basic' ? 'bold' : 'normal'
            }}
          />
          <Chip
            label="Step up"
            variant={
              calcState.calculatorMode === 'stepup' ? 'filled' : 'outlined'
            }
            color={
              calcState.calculatorMode === 'stepup' ? 'primary' : 'default'
            }
            clickable
            onClick={() =>
              handleCalculatorModeChange({ target: { value: 'stepup' } })
            }
            sx={{
              fontWeight:
                calcState.calculatorMode === 'stepup' ? 'bold' : 'normal'
            }}
          />
          <Chip
            label="Advanced"
            variant={
              calcState.calculatorMode === 'advanced' ? 'filled' : 'outlined'
            }
            color={
              calcState.calculatorMode === 'advanced' ? 'primary' : 'default'
            }
            clickable
            onClick={() =>
              handleCalculatorModeChange({ target: { value: 'advanced' } })
            }
            sx={{
              fontWeight:
                calcState.calculatorMode === 'advanced' ? 'bold' : 'normal'
            }}
          />{' '}
        </Box>
      </Box>{' '}
      {/* SIP Amount - Uses Grid for Perfect Alignment */}
      <Box sx={{ gridColumn: '1 / -1' }}>
        {' '}
        {/* Label and Input Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '130px 1fr', sm: '150px 1fr' },
            gap: 2,
            alignItems: 'center',
            mb: 2
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            SIP Amount:
          </Typography>{' '}
          <TextField
            size="small"
            fullWidth
            type="text"
            variant="outlined"
            placeholder=""
            value={format(calcState.investmentAmount)}
            onChange={handleInvestmentChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 40
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography>₹</Typography>
                </InputAdornment>
              ),
              endAdornment: calcState.investmentAmount ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear"
                    onClick={handleInvestmentClear}
                    size="small"
                  >
                    <CloseIcon fontSize="small" color="disabled" />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
          />
        </Box>{' '}
        {/* Amount in words - aligned with input field */}{' '}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: -1, // Standard spacing before slider
            ml: { xs: '138px', sm: '158px' }, // Label width + gap
            minHeight: '32px', // Fixed minimum height to prevent layout shifts
            lineHeight: 1.2,
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {inWords(calcState.investmentAmount)}
        </Typography>
        {/* Amount Slider - Full width exception */}
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
          sx={{ mb: -2 }}
          onChange={handleInvestmentSliderChange}
        />
      </Box>{' '}
      {/* SIP Frequency */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '130px 1fr', sm: '150px 1fr' },
          gap: 2,
          alignItems: 'center'
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          SIP Frequency:
        </Typography>{' '}
        <FormControl size="small" fullWidth>
          <Select
            value={calcState.frequency}
            onChange={handleFrequencyChange}
            displayEmpty
            variant="outlined"
            size="small"
            sx={{ height: 40 }}
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
            <MenuItem value="half-yearly">Half-Yearly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>{' '}
      {/* Expected Return Rate */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '130px 1fr', sm: '150px 1fr' },
          gap: 2,
          alignItems: 'center'
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          Expected Return:
        </Typography>{' '}
        <PercentTextField
          value={calcState.expectedReturnRate}
          onChange={handleReturnRateChange}
          placeholder="Enter expected return rate"
          label="% p.a"
          min={0}
          max={50}
          step={1}
        />
      </Box>{' '}
      {/* Duration */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '130px 1fr', sm: '150px 1fr' },
          gap: 2,
          alignItems: 'start'
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'medium', mt: 2 }}>
          Duration:
        </Typography>
        <Box>
          {' '}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel id="years-label">Years</InputLabel>{' '}
              <Select
                labelId="years-label"
                value={calcState.years}
                onChange={handleYearsChange}
                displayEmpty
                variant="outlined"
                size="small"
                label="Years"
                sx={{ height: 40 }}
              >
                {[...Array(31).keys()].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{ flex: 1 }}
              disabled={calcState.years === 30}
            >
              <InputLabel id="months-label">Months</InputLabel>{' '}
              <Select
                labelId="months-label"
                value={calcState.years === 30 ? 0 : calcState.months}
                onChange={handleMonthsChange}
                displayEmpty
                variant="outlined"
                size="small"
                label="Months"
                sx={{ height: 40 }}
              >
                {[...Array(12).keys()].map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>
      {/* Step-up and Advanced Fields */}
      {(calcState.calculatorMode === 'stepup' ||
        calcState.calculatorMode === 'advanced') && (
        <>
          {' '}
          {/* Section Header - Full Width */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 0, fontWeight: 'bold', color: 'primary.main' }}
            >
              {calcState.calculatorMode === 'stepup'
                ? 'Step-up Features'
                : 'Advanced Features'}
            </Typography>
          </Box>{' '}
          {/* Step-up SIP Percentage */}
          <Box>
            {' '}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '130px 1fr', sm: '150px 1fr' },
                gap: 2,
                alignItems: 'center',
                mb: 2
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                Annual Step-up:
              </Typography>{' '}
              <PercentTextField
                value={calcState.stepUpPercentage}
                onChange={handleStepUpPercentageChange}
                placeholder="0"
                label="% p.a."
                min={0}
                max={50}
                step={1}
              />{' '}
            </Box>
          </Box>
          {/* Advanced Mode Only Fields */}{' '}
          {calcState.calculatorMode === 'advanced' && (
            <>
              {' '}
              {/* Initial Investment */}
              <Box>
                {' '}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '130px 1fr', sm: '150px 1fr' },
                    gap: 2,
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Initial Lump Sum:
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    variant="outlined"
                    placeholder="Enter initial investment amount"
                    value={format(calcState.initialInvestment)}
                    onChange={handleInitialInvestmentChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                      endAdornment: calcState.initialInvestment ? (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="clear initial investment"
                            onClick={handleInitialInvestmentClear}
                            edge="end"
                            size="small"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }}
                  />
                </Box>{' '}
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mb: 1,
                    ml: { xs: '138px', sm: '158px' }
                  }}
                >
                  {inWords(calcState.initialInvestment)}
                </Typography>
              </Box>{' '}
              {/* Inflation Rate */}
              <Box>
                {' '}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '130px 1fr', sm: '150px 1fr' },
                    gap: 2,
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Inflation Rate:
                  </Typography>{' '}
                  <PercentTextField
                    value={calcState.inflationRate}
                    onChange={handleInflationRateChange}
                    placeholder="6"
                    label="% p.a"
                    min={0}
                    max={50}
                    step={1}
                  />
                </Box>{' '}
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}
