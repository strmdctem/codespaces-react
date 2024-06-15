import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { FormControl, ToggleButton, ToggleButtonGroup } from '@mui/material';

export default function FDSchemeSelector({ value, onChange }) {

    const handleChange = (event, newValue) => {
        newValue !== null && onChange(newValue);
    };

    return (
        <ToggleButtonGroup exclusive size="small"
            color="primary" value={value} onChange={handleChange}
            sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '46%' }}>
            <ToggleButton value="Regular" sx={{ padding: 0.5 }}>
                Regular
            </ToggleButton>
            <ToggleButton value="Special" sx={{ padding: 0.5 }}>
                Special
            </ToggleButton>
        </ToggleButtonGroup>
    );
}