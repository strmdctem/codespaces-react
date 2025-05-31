import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { rupeeFormat } from '../utils';

export default function FDFilterCalc({ value, onChange }) {
  const handleChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]+/g, '');
    ((newValue > 0 && newValue <= 20000000) || newValue == false) &&
      onChange(newValue);
  };

  const handleClear = () => {
    onChange('');
  };

  const format = (value) => {
    return value ? rupeeFormat(value) : value;
  };

  return (
    <>
      <TextField
        size="small"
        type="text"
        variant="outlined"
        placeholder="Amount"
        spellCheck={false}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        value={format(value)}
        onChange={handleChange}
        sx={{
          width: '46%',
          '& .MuiOutlinedInput-root': { paddingX: '4px' },
          '&  .MuiOutlinedInput-input': {
            paddingX: '18px',
            marginLeft: '-20px',
            paddingY: 1.2
          },
          '& label': {
            marginLeft: '5px'
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CalculateOutlinedIcon fontSize="small" />
              <label>₹</label>
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
    </>
  );
}
