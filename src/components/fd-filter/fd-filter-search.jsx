import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

export default function FDFilterSearch({ value, onChange }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
  };
  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder="sbi hdfc bajaj"
      value={value}
      spellCheck={false}
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect="off"
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear}>
              <CloseIcon color="disabled" />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
}
