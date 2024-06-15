import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { FormControl, ToggleButton, ToggleButtonGroup } from '@mui/material';

export default function FDSchemeSelector({ value, onChange }) {

    const handleChange = (event, newValue) => {
        onChange(newValue);
    };

    return (
        <ToggleButtonGroup exclusive size="small" color="primary" value={value} onChange={handleChange}>
            <ToggleButton value="Regular" sx={{ px: 3 }}>
                Regular
            </ToggleButton>
            <ToggleButton value="Special" sx={{ px: 2 }}>
                Special
            </ToggleButton>
        </ToggleButtonGroup>
    );
}