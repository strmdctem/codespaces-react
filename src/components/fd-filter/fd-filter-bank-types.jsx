import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { BANK_TYPES } from './fd-filter-constants';

export default function FDFilterBankTypes({ value, onChange }) {
  const handleChange = (event, newValue) => onChange(newValue);

  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      sx={{ m: 2 }}
      value={value}
      onChange={handleChange}
    >
      {BANK_TYPES.map(({ value, label }) => (
        <ToggleButton key={value} value={value}>
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
