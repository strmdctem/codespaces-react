import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function FDFilterScheme({ value, onChange, sx }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size="small" sx={sx} color="primary">
      <Select value={value} onChange={handleChange} size="small">
        <MenuItem value="Highest">Highest Rates</MenuItem>
        <MenuItem value="Special">Special Schemes</MenuItem>
        <MenuItem value="specific">Specific Tenures</MenuItem>
        <MenuItem value="Regular">All Rates</MenuItem>
      </Select>
    </FormControl>
  );
}
