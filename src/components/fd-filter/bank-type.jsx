import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControl from '@mui/material/FormControl';

export default function BankTypesFilter({ value, onChange }) {
  const handleChange = (event, newValue) => onChange(newValue);

  return (
    <FormControl variant="filled" sx={{ m: 2 }}>
      <ToggleButtonGroup
        size="small"
        color="primary"
        value={value}
        onChange={handleChange}
      >
        <ToggleButton value="Public">Nationalized</ToggleButton>
        <ToggleButton value="Private">Private</ToggleButton>
        <ToggleButton value="NBFC">NBFC</ToggleButton>
      </ToggleButtonGroup>
    </FormControl>
  );
}
