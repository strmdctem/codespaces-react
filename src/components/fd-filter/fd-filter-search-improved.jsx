import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { alpha, useTheme } from '@mui/material/styles';

export default function FDFilterSearchImproved({ value, onChange }) {
  const theme = useTheme();

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <TextField
      variant="outlined"
      placeholder="Search banks (e.g., SBI, HDFC, Bajaj)"
      value={value}
      spellCheck={false}
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect="off"
      onChange={handleChange}
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main
          }
        },
        '& .MuiOutlinedInput-input': {
          padding: '12px 14px',
          fontSize: '0.875rem'
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon
              fontSize="small"
              sx={{ color: theme.palette.text.secondary }}
            />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton
              onClick={handleClear}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: theme.palette.error.main,
                  backgroundColor: alpha(theme.palette.error.main, 0.04)
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
}
