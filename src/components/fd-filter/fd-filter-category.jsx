import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { FD_CATEGORIES } from './fd-filter-constants';

export default function FDFilterCategory({ value, onChange }) {
  const handleChange = (event, newValue) => {
    newValue !== null && onChange(newValue);
  };

  return (
    <ToggleButtonGroup
      exclusive
      color="primary"
      value={value}
      onChange={handleChange}
      sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '46%' }}
    >
      {FD_CATEGORIES.map(({ value, label }) => (
        <ToggleButton key={value} value={value} sx={{ padding: 0.5 }}>
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
