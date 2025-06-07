import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ToWords } from 'to-words';
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

const emiSliderConfig = {
  minAmount: 100000, // 1 lakh
  midAmount: 5000000, // 50 lakh
  maxAmount: 10000000, // 1 crore
  topAmount: 100000000, // 10 crore
  firstStepSize: 100000, // 1 lakh
  secondStepSize: 500000, // 5 lakh
  thirdStepSize: 5000000 // 50 lakh
};

export default function LoanRateChangeForm({ onChange, calcState }) {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    loanAmount: calcState?.loanAmount || 5000000,
    currentInterestRate: calcState?.currentInterestRate || 8,
    years: Math.floor((calcState?.remainingTenure || 240) / 12),
    months: (calcState?.remainingTenure || 240) % 12,
    remainingTenure: calcState?.remainingTenure || 240,
    newInterestRate: calcState?.newInterestRate || 7.5,
    currentEMI: calcState?.currentEMI || 0
  });

  // Calculate EMI helper function
  const calculateEMI = (principal, rate, tenure) => {
    if (!principal || !rate || !tenure) return 0;

    const monthlyRate = rate / 100 / 12;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);

    return Math.round(emi);
  };
  // Auto-calculate EMI when loan parameters change
  useEffect(() => {
    const autoEMI = calculateEMI(
      formData.loanAmount,
      formData.currentInterestRate,
      formData.remainingTenure
    );

    // Always update EMI when parameters change
    setFormData((prev) => ({
      ...prev,
      currentEMI: autoEMI
    }));
  }, [
    formData.loanAmount,
    formData.currentInterestRate,
    formData.remainingTenure
  ]);

  // Pass data to parent component
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    const numericValue = parseFloat(value.replace(/[^0-9.]+/g, '')) || 0;

    setFormData((prev) => ({
      ...prev,
      [field]: numericValue
    }));
  };
  const handleSliderChange = (field) => (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: newValue
    }));
  };

  const handleYearsChange = (event) => {
    const years = parseInt(event.target.value, 10);
    // If years is 30, set months to 0
    const months = years === 30 ? 0 : formData.months;
    const totalMonths = years * 12 + months;

    setFormData((prev) => ({
      ...prev,
      years: years,
      months: months,
      remainingTenure: totalMonths
    }));
  };

  const handleMonthsChange = (event) => {
    const months = parseInt(event.target.value, 10);
    const totalMonths = formData.years * 12 + months;
    setFormData((prev) => ({
      ...prev,
      months: months,
      remainingTenure: totalMonths
    }));
  };
  const handleClear = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === 'currentEMI'
          ? calculateEMI(
              prev.loanAmount,
              prev.currentInterestRate,
              prev.remainingTenure
            )
          : 0
    }));
  };

  const handleRateIncrement = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.min((prev[field] || 0) + 0.25, 50) // Max rate 50%
    }));
  };

  const handleRateDecrement = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max((prev[field] || 0) - 0.25, 0) // Min rate 0%
    }));
  };

  const format = (value) => {
    return value ? value.toLocaleString('en-IN') : '';
  };

  const inWords = (value) => {
    return value ? toWords.convert(value) : '';
  };

  const labelStyle = {
    minWidth: '90px',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'text.primary'
  };

  const labelStyleWithPadding = {
    ...labelStyle,
    paddingTop: '8px'
  };

  const handleAmountSliderChange = (event, newValue) => {
    const actualAmount = sliderPositionToAmount(newValue, emiSliderConfig);
    setFormData((prev) => ({
      ...prev,
      loanAmount: actualAmount
    }));
  };

  return (
    <Stack
      spacing={2.5}
      sx={{ p: 0, pt: 1, paddingBottom: 2, maxWidth: '500px' }}
      className="calc-form"
    >
      {/* Outstanding Loan Amount */}
      <Stack spacing={1}>
        <Stack direction="row" alignItems="top" spacing={2}>
          <label className="calc-label" style={labelStyleWithPadding}>
            Amount:
          </label>
          <Stack sx={{ width: '100%' }}>
            <TextField
              size="small"
              fullWidth
              type="text"
              variant="outlined"
              placeholder="Enter outstanding loan amount"
              value={format(formData.loanAmount)}
              onChange={handleInputChange('loanAmount')}
              sx={{ '& .MuiOutlinedInput-input': { marginLeft: '-15px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <label>₹</label>
                  </InputAdornment>
                ),
                endAdornment: formData.loanAmount ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear"
                      onClick={handleClear('loanAmount')}
                    >
                      <CloseIcon fontSize="small" color="disabled" />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
            />
            <Typography variant="caption" color="textSecondary">
              {inWords(formData.loanAmount)}
            </Typography>
          </Stack>
        </Stack>
        <Slider
          aria-label="Amount"
          value={
            amountToSliderPosition(formData.loanAmount, emiSliderConfig) || 0
          }
          step={0.1}
          min={0}
          max={100}
          onChange={handleAmountSliderChange}
          sx={{ marginTop: '-8px !important' }}
        />
      </Stack>
      {/* Current Interest Rate */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={2}>
          <label className="calc-label" style={labelStyle}>
            Current Rate:
          </label>
          <Stack sx={{ width: '100%' }}>
            <TextField
              size="small"
              fullWidth
              type="number"
              variant="outlined"
              placeholder="Enter current interest rate"
              value={formData.currentInterestRate || ''}
              onChange={handleInputChange('currentInterestRate')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <IconButton
                        size="small"
                        onClick={handleRateIncrement('currentInterestRate')}
                        sx={{ padding: '2px' }}
                      >
                        <KeyboardArrowUpIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={handleRateDecrement('currentInterestRate')}
                        sx={{ padding: '2px' }}
                      >
                        <KeyboardArrowDownIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        % per annum
                      </Typography>
                    </Stack>
                  </InputAdornment>
                )
              }}
            />
          </Stack>
        </Stack>
      </Stack>
      {/* New Interest Rate */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={2}>
          <label className="calc-label" style={labelStyle}>
            New Rate:
          </label>
          <Stack sx={{ width: '100%' }}>
            <TextField
              size="small"
              fullWidth
              type="number"
              variant="outlined"
              placeholder="Enter new reduced interest rate"
              value={formData.newInterestRate || ''}
              onChange={handleInputChange('newInterestRate')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <IconButton
                        size="small"
                        onClick={handleRateIncrement('newInterestRate')}
                        sx={{ padding: '2px' }}
                      >
                        <KeyboardArrowUpIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={handleRateDecrement('newInterestRate')}
                        sx={{ padding: '2px' }}
                      >
                        <KeyboardArrowDownIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        % per annum
                      </Typography>
                    </Stack>
                  </InputAdornment>
                )
              }}
            />
          </Stack>
        </Stack>
      </Stack>
      {/* Remaining Tenure */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={2}>
          <label className="calc-label" style={labelStyle}>
            Tenure:
          </label>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ width: '100%' }}
          >
            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
              <FormControl size="small" sx={{ width: '45%' }}>
                <Select
                  value={formData.years}
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
                sx={{ width: '45%' }}
                disabled={formData.years === 30}
              >
                <Select
                  value={formData.years === 30 ? 0 : formData.months}
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
        </Stack>
      </Stack>
      {/* Current EMI - Commented out for now */}
      {/* <Stack spacing={1}>
        <Stack direction="row" alignItems="top" spacing={2}>
          <label className="calc-label" style={labelStyleWithPadding}>
            Current EMI:
          </label>
          <Stack sx={{ width: '100%' }}>
            <TextField
              size="small"
              fullWidth
              type="text"
              variant="outlined"
              placeholder={`Auto-calculated: ₹${rupeeFormat(calculateEMI(formData.loanAmount, formData.currentInterestRate, formData.remainingTenure))}`}
              value={format(formData.currentEMI)}
              onChange={handleInputChange('currentEMI')}
              sx={{
                '& .MuiOutlinedInput-input': {
                  marginLeft: '-15px'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <label>₹</label>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {formData.currentEMI ? (
                      <IconButton
                        aria-label="clear"
                        onClick={handleClear('currentEMI')}
                      >
                        <CloseIcon fontSize="small" color="disabled" />
                      </IconButton>
                    ) : null}
                  </InputAdornment>
                )
              }}
            />
            <Typography variant="caption" color="textSecondary">
              {inWords(formData.currentEMI)}
            </Typography>
          </Stack>
        </Stack>
      </Stack> */}
      {/* Rate Reduction Summary */}
      {formData.currentInterestRate && formData.newInterestRate && (
        <Stack
          spacing={1}
          sx={{
            bgcolor: 'action.hover',
            p: 2,
            borderRadius: 1,
            mt: 1
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color="primary.main"
          >
            Loan Summary:
          </Typography>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Current EMI:</Typography>
            <Typography variant="body2" fontWeight="bold">
              ₹
              {format(
                formData.currentEMI ||
                  calculateEMI(
                    formData.loanAmount,
                    formData.currentInterestRate,
                    formData.remainingTenure
                  )
              )}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Rate Change:</Typography>
            <Typography variant="body2">
              <strong>{formData.currentInterestRate}%</strong> →
              <strong>{formData.newInterestRate}%</strong>
            </Typography>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
