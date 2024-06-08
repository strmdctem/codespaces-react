import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControl from '@mui/material/FormControl';

export default function TenureFilter({ value, onChange }) {

    const handleChange = (event, newValue) => onChange(newValue);

    return (
        <FormControl sx={{ m: 2 }}>
            <ToggleButtonGroup size="small" color="primary" value={value} onChange={handleChange}>
                <ToggleButton value="1">
                    &lt;= 1 Year
                </ToggleButton>
                <ToggleButton value="2">
                    1 - 2 Years
                </ToggleButton>
                <ToggleButton value="3">
                    2 Years +
                </ToggleButton>
            </ToggleButtonGroup>
        </FormControl>
    );
}