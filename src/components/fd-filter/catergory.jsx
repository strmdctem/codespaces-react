import * as React from 'react';
import Switch from '@mui/material/Switch';
import { FormControl, Typography } from '@mui/material';

export default function CategoryFilter({ value, onChange }) {

    const handleChange = (event, newValue) => onChange(newValue);

    return (
        <FormControl sx={{ m: 2, flexDirection: 'row' }}>
            <Typography sx={{ marginTop: '6px', marginRight: '4px' }}>General</Typography>
            <Switch checked={value} onChange={handleChange} />
            <Typography sx={{ marginTop: '6px', marginLeft: '4px' }}>Senior</Typography>
        </FormControl>
    );
}