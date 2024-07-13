import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function FDFilterScheme({ value, onChange, sx }) {
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
      sx={sx}
    >
      <ToggleButton value="Regular" sx={{ padding: 0.5 }}>
        Regular
      </ToggleButton>
      <ToggleButton value="Special" sx={{ padding: 0.5 }}>
        Special
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
