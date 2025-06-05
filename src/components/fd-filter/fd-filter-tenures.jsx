import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function FDFilterTenures({ value, onChange }) {
  const handleChange = (event, newValue) => {
    newValue.length && onChange(newValue);
  };

  return (
    <ToggleButtonGroup
      size="small"
      color="primary"
      value={value}
      onChange={handleChange}
    >
      <ToggleButton value="1">&lt;= 1 Year</ToggleButton>
      <ToggleButton value="2">1 - 2 Years</ToggleButton>
      <ToggleButton value="3">2 Years +</ToggleButton>
    </ToggleButtonGroup>
  );
}
