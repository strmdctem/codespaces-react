import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export default function CategoryFilter({ value, onChange }) {
  const handleChange = (event, newValue) => {
    newValue !== null && onChange(newValue);
  };

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      color="primary"
      value={value}
      onChange={handleChange}
      sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '46%' }}
    >
      <ToggleButton value={false} sx={{ padding: 0.5 }}>
        General
      </ToggleButton>
      <ToggleButton value={true} sx={{ padding: 0.5 }}>
        Senior
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
