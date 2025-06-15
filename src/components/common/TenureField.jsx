import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { useState } from 'react';

const TenureField = ({
  years,
  months,
  totalMonths,
  onYearsChange,
  onMonthsChange,
  onTotalMonthsChange,
  defaultInputMode = 'years-months',
  maxYears = 30,
  maxMonths = 360,
  showToggle = true,
  showTotal = false,
  label = 'Total loan term',
  ...props
}) => {
  const [tenureInputMode, setTenureInputMode] = useState(defaultInputMode);

  const handleTenureInputModeChange = (event, newMode) => {
    if (newMode !== null) {
      setTenureInputMode(newMode);
    }
  };

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

  const handleInternalYearsChange = (event) => {
    const newYears = parseInt(event.target.value, 10);
    const newMonths = newYears === maxYears ? 0 : months;
    const newTotalMonths = newYears * 12 + newMonths;

    onYearsChange && onYearsChange(event);
    onMonthsChange && onMonthsChange({ target: { value: newMonths } });
    onTotalMonthsChange &&
      onTotalMonthsChange({ target: { value: newTotalMonths } });
  };

  const handleInternalMonthsChange = (event) => {
    const newMonths = parseInt(event.target.value, 10);
    const newTotalMonths = years * 12 + newMonths;

    onMonthsChange && onMonthsChange(event);
    onTotalMonthsChange &&
      onTotalMonthsChange({ target: { value: newTotalMonths } });
  };

  const handleInternalTotalMonthsChange = (event) => {
    const newTotalMonths = Math.min(
      parseInt(event.target.value, 10) || 0,
      maxMonths
    );
    const newYears = Math.floor(newTotalMonths / 12);
    const newMonths = newTotalMonths % 12;

    onYearsChange && onYearsChange({ target: { value: newYears } });
    onMonthsChange && onMonthsChange({ target: { value: newMonths } });
    onTotalMonthsChange &&
      onTotalMonthsChange({ target: { value: newTotalMonths } });
  };

  return (
    <Stack direction="column" spacing={1} {...props}>
      {/* Tenure Input Mode Toggle */}
      {showToggle && (
        <Stack direction="row" justifyContent="flex-end">
          <ToggleButtonGroup
            value={tenureInputMode}
            exclusive
            onChange={handleTenureInputModeChange}
            size="small"
            sx={{
              mb: 1,
              width: '90%',
              '& .MuiToggleButton-root': {
                flex: 1,
                fontSize: '0.75rem',
                py: 0.5
              }
            }}
          >
            <ToggleButton value="years-months">Years + Months</ToggleButton>
            <ToggleButton value="months-only">Total Months</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      )}

      {/* Conditional Input Fields */}
      <Stack direction="row" justifyContent="flex-end">
        {tenureInputMode === 'years-months' ? (
          <Stack direction="row" spacing={1} sx={{ width: '90%' }}>
            <FormControl size="small" sx={{ width: '50%' }}>
              <InputLabel id="years-label">Years</InputLabel>
              <Select
                labelId="years-label"
                value={years}
                onChange={handleInternalYearsChange}
                displayEmpty
                variant="outlined"
                size="small"
                label="Years"
                sx={{ height: 40 }}
              >
                {[...Array(maxYears + 1).keys()].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{ width: '50%' }}
              disabled={years === maxYears}
            >
              <InputLabel id="months-label">Months</InputLabel>
              <Select
                labelId="months-label"
                value={years === maxYears ? 0 : months}
                onChange={handleInternalMonthsChange}
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
          </Stack>
        ) : (
          <Stack sx={{ width: '90%' }}>
            <TextField
              size="small"
              fullWidth
              type="number"
              variant="outlined"
              label="Total Months"
              placeholder="Enter total months"
              value={totalMonths || ''}
              onChange={handleInternalTotalMonthsChange}
              error={totalMonths > maxMonths}
              helperText={
                totalMonths > maxMonths
                  ? `Maximum tenure is ${maxYears} years (${maxMonths} months)`
                  : totalMonths > 0
                    ? `${Math.floor(totalMonths / 12)} years ${totalMonths % 12} months`
                    : ''
              }
              inputProps={{
                min: 1,
                max: maxMonths,
                step: 1
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 40
                }
              }}
            />
          </Stack>
        )}
      </Stack>

      {/* Total Display */}
      {showTotal && (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ textAlign: 'right' }}
        >
          {label}: {formatSliderValue(totalMonths)}
        </Typography>
      )}
    </Stack>
  );
};

export default TenureField;
