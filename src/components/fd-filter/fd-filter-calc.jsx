import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

export default function FDFilterCalc({ value, onChange }) {
  const handleChange = (event) => {
    const newValue = event.target.value;
    (newValue > 0 || newValue == false) && onChange(newValue);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <TextField
      size="small"
      type="number"
      variant="outlined"
      placeholder="Amount"
      value={value}
      onChange={handleChange}
      sx={{
        width: '46%',
        '& .MuiOutlinedInput-root': { paddingX: '4px' },
        '&  .MuiOutlinedInput-input': {
          paddingY: '7px',
          paddingX: '18px',
          marginLeft: '-20px'
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <CalculateOutlinedIcon fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment
            position="end"
            sx={{ position: 'absolute', right: '-2px' }}
          >
            <IconButton onClick={handleClear}>
              <CloseIcon fontSize="small" color="disabled" />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
}
