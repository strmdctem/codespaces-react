import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material';

const PercentTextField = ({
  value,
  onChange,
  placeholder = 'Enter rate',
  label = '% p.a',
  showButtons = true,
  min = 0,
  max = 50,
  step = 1,
  ...textFieldProps
}) => {
  const commonLabel = '% p.a';
  const handleIncrement = () => {
    const currentValue = Number(value || 0);
    const newValue = Math.min(currentValue + step, max);
    onChange({ target: { value: newValue } });
  };

  const handleDecrement = () => {
    const currentValue = Number(value || 0);
    const newValue = Math.max(currentValue - step, min);
    onChange({ target: { value: newValue } });
  };

  return (
    <TextField
      size="small"
      fullWidth
      type="number"
      variant="outlined"
      value={value || ''}
      onChange={onChange}
      sx={{
        '& .MuiOutlinedInput-root': {
          height: 40
        }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {showButtons ? (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <IconButton size="small" onClick={handleIncrement}>
                  <KeyboardArrowUpIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleDecrement}>
                  <KeyboardArrowDownIcon fontSize="small" />
                </IconButton>
                <Typography variant="caption">{commonLabel}</Typography>
              </Stack>
            ) : (
              <Typography variant="caption">{commonLabel}</Typography>
            )}
          </InputAdornment>
        )
      }}
      inputProps={{
        min,
        max,
        step
      }}
      {...textFieldProps}
    />
  );
};

export default PercentTextField;
