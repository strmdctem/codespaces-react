import * as React from 'react';
import Switch from '@mui/material/Switch';
import { FormControl, Typography } from '@mui/material';

export default function CategoryFilter() {
    return (
        <FormControl sx={{ m: 1, width: 300, flexDirection: 'row' }}>
            <Typography sx={{ marginTop: '6px', marginRight: '4px' }}>General</Typography>
            <Switch display="inline" />
            <Typography sx={{ marginTop: '6px', marginLeft: '4px' }}>Senior</Typography>
        </FormControl>
    );
}