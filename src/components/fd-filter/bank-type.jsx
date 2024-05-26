import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControl from '@mui/material/FormControl';

export default function BankTypeFilter({ value, onChange }) {

  const handleChange = (event, newValue) => onChange(newValue);

  return (
    <FormControl variant="filled" sx={{ m: 1, width: 300 }}>
      <ToggleButtonGroup size="small" value={value} onChange={handleChange}>
        <ToggleButton value="nationalized">
          Nationalized
        </ToggleButton>
        <ToggleButton value="private">
          Private
        </ToggleButton>
        <ToggleButton value="nbfc">
          NBFC
        </ToggleButton>
      </ToggleButtonGroup>
    </FormControl>
  );
}