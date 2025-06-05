import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { FD_CATEGORIES } from './fd-filter-constants';

export default function FDFilterCategory({ value, onChange }) {
  const handleChange = (event, newValue) => {
    newValue !== null && onChange(newValue);
  };

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      color="primary"
      value={value}
      onChange={handleChange}
      fullWidth
      sx={{
        '& .MuiToggleButton-root': {
          flex: 1,
          border: '1px solid rgba(0, 0, 0, 0.12)',
          '&:not(:last-of-type)': {
            borderRight: '1px solid rgba(0, 0, 0, 0.12)'
          }
        }
      }}
    >
      {FD_CATEGORIES.map(({ value, label }) => (
        <ToggleButton key={value} value={value}>
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
