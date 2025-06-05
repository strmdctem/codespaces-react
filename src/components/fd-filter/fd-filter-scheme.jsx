import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { alpha, useTheme } from '@mui/material/styles';

export default function FDFilterScheme({ value, onChange, sx }) {
  const theme = useTheme();

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size="small" sx={sx} color="primary" fullWidth>
      <Select
        value={value}
        onChange={handleChange}
        size="small"
        IconComponent={ExpandMoreIcon}
        sx={{
          '& .MuiOutlinedInput-root': {
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.04)})`,
            border: `1.5px solid ${alpha(theme.palette.primary.main, 0.4)}`,
            borderRadius: 2,
            fontWeight: 600,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.06)})`,
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.25)}`,
              transform: 'translateY(-1px)'
            },
            '&.Mui-focused': {
              borderColor: theme.palette.primary.main,
              boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.08)})`
            }
          },
          '& .MuiSelect-select': {
            color: theme.palette.primary.main,
            fontWeight: 600,
            padding: '8px 14px'
          },
          '& .MuiSelect-icon': {
            color: theme.palette.primary.main,
            transition: 'transform 0.2s ease-in-out',
            fontSize: '1.4rem'
          },
          '&.Mui-expanded .MuiSelect-icon': {
            transform: 'rotate(180deg)'
          }
        }}
      >
        {' '}
        <MenuItem value="highest-rates" sx={{ fontWeight: 500 }}>
          Highest Rates
        </MenuItem>
        <MenuItem value="specific-tenures" sx={{ fontWeight: 500 }}>
          Specific Tenures
        </MenuItem>
        <MenuItem value="all" sx={{ fontWeight: 500 }}>
          All Rates
        </MenuItem>
      </Select>
    </FormControl>
  );
}
