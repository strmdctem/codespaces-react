import * as React from 'react';
import { useState } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function FDSchemeSelector({ onChange }) {
    const [selectedChip, setSelectedChip] = useState("Regular");

    const handleClick = (label) => {
        setSelectedChip(label);
        onChange(label);
    };

    const getVariant = (chip) => selectedChip === chip ? "default" : "outlined";

    const regularVariant = getVariant("Regular");
    const specialVariant = getVariant("Special");

    return (
        <Stack direction="row" spacing={2} sx={{ m: 1 }}>
            <Chip sx={{ p: 2 }} color="primary"
                label="Regular"
                onClick={() => handleClick("Regular")}
                variant={regularVariant}
            />
            <Chip sx={{ p: 2 }} color="primary"
                label="Special"
                onClick={() => handleClick("Special")}
                variant={specialVariant}
            />
        </Stack>
    );
}