import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

export default function FilterSearch({ value, onChange }) {
    const handleChange = (event) => {
        onChange(event.target.value);
    }

    const handleClear = () => {
        onChange('');
    }

    return (
        <TextField size="small" variant="outlined" placeholder='sbi hdfc bajaj'
            value={value} onChange={handleChange}
            sx={{ '& .MuiOutlinedInput-root': { paddingX: '10px' } }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
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