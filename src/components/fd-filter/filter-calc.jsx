import { IconButton, InputAdornment, TextField } from '@mui/material';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import CloseIcon from '@mui/icons-material/Close';

export default function FilterCalc({ value, onChange }) {
    const handleChange = (event) => {
        const value = event.target.value;
        onChange(event.target.value);
    }

    const handleClear = () => {
        onChange('');
    }

    return (
        <TextField size="small" type="number" variant="outlined" placeholder='calc: 5000'
            value={value} onChange={handleChange}
            sx={{ '& .MuiOutlinedInput-root': { paddingX: '10px' } }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <CalculateOutlinedIcon />
                    </InputAdornment>
                ),
                endAdornment: (
                    value && <InputAdornment position="end" sx={{ position: 'absolute', right: '-2px' }}>
                        <IconButton onClick={handleClear}>
                            <CloseIcon color="disabled" />
                        </IconButton>
                    </InputAdornment>
                ),
            }} />
    );
}