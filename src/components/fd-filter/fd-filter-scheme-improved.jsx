import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

export default function FDFilterSchemeImproved({ value, onChange, sx }) {
  const theme = useTheme();

  const handleChange = (event) => {
    onChange(event.target.value);
  };
  const schemes = [
    {
      value: 'highest-rates',
      label: 'Highest Rates',
      description: 'Top performing FDs'
    },
    {
      value: 'specific-tenures',
      label: 'Specific Tenures',
      description: 'Customized tenure periods'
    },
    {
      value: 'all',
      label: 'All Rates',
      description: 'Complete rate comparison'
    }
  ];

  return (
    <FormControl size="small" sx={sx} color="primary" fullWidth>
      <Select
        value={value}
        onChange={handleChange}
        size="small"
        renderValue={(selected) => {
          const scheme = schemes.find((s) => s.value === selected);
          return scheme ? scheme.label : selected;
        }}
        sx={{
          borderRadius: 2,
          '& .MuiSelect-select': {
            color: theme.palette.primary.main,
            fontWeight: 600,
            py: 1.5
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.primary.main, 0.3)
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main
          }
        }}
      >
        {schemes.map((scheme) => (
          <MenuItem key={scheme.value} value={scheme.value}>
            <div>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {scheme.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {scheme.description}
              </Typography>
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
