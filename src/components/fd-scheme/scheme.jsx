import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { FormControl, ToggleButton, ToggleButtonGroup } from '@mui/material';

export default function FDSchemeSelector({ onChange }) {

    const [value, setValue] = useState("Regular");

    const handleChange = (event, newValue) => {
        setValue(newValue); // Set the state variable
        onChange(newValue);
    };

    return (
        <Stack direction="row" sx={{ m: 1 }}>
            <FormControl variant="filled">
                <ToggleButtonGroup exclusive size="small" color="primary" value={value} onChange={handleChange}>
                    <ToggleButton value="Regular" sx={{ px: 2 }}>
                        Regular
                    </ToggleButton>
                    <ToggleButton value="Special" sx={{ px: 2 }}>
                        Special
                    </ToggleButton>
                </ToggleButtonGroup>
            </FormControl>
        </Stack>
    );
}