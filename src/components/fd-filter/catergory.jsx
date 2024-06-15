import { FormControl, ToggleButton, ToggleButtonGroup, } from '@mui/material';

export default function CategoryFilter({ value, onChange }) {

    const handleChange = (event, newValue) => onChange(newValue);

    return (
        <ToggleButtonGroup exclusive size="small" color="primary" value={value} onChange={handleChange}>
            <ToggleButton value={false} >
                General
            </ToggleButton>
            <ToggleButton value={true} >
                Senior
            </ToggleButton>
        </ToggleButtonGroup>
    );
}