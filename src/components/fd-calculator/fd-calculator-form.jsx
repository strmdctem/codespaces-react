import CloseIcon from '@mui/icons-material/Close';
import {
  IconButton,
  InputAdornment,
  Slider,
  Stack,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import FDFilterBanks from '../fd-filter/fd-filter-banks';

export default function FDCalculatorForm({ onChange }) {
  const [calcState, setCalcState] = useState({
    amount: '500000',
    banks: [
      'Suryoday Bank',
      'ICICI Bank',
      'State Bank of India',
      'Bajaj Finance'
    ],
    tenure: 18
  });

  const handleAmountChange = (event) => {
    const newValue = event.target.value;
    if ((newValue > 0 && newValue <= 20000000) || newValue === '') {
      setCalcState((prevState) => ({ ...prevState, amount: newValue }));
    }
  };

  const handleAmountClear = () => {
    setCalcState((prevState) => ({ ...prevState, amount: '' }));
  };

  const handleBanksChange = (value) => {
    value.length <= 5 &&
      setCalcState((prevState) => ({ ...prevState, banks: value }));
  };

  const handleTenureChange = (event) => {
    setCalcState((prevState) => ({ ...prevState, tenure: event.target.value }));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      console.log(calcState);
      onChange(calcState);
    }, 10);

    return () => clearTimeout(handler);
  }, [calcState]);

  const formatSliderValue = (value) => {
    if (value < 12) {
      return `${value} month${value > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(value / 12);
      const months = value % 12;
      let yearText = `${years} year${years > 1 ? 's' : ''}`;
      let monthText =
        months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '';
      return `${yearText}${months > 0 ? ' ' + monthText : ''}`;
    }
  };

  return (
    <Stack spacing={1} sx={{ p: 1 }}>
      <label className="calc-label-1"> Fixed Deposit Calculator</label>
      <Stack direction="row" alignItems="center" spacing={3}>
        <label className="calc-label"> Amount:</label>
        <TextField
          size="small"
          fullWidth
          type="number"
          variant="outlined"
          placeholder="Amount"
          value={calcState.amount}
          onChange={handleAmountChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <label>₹</label>
              </InputAdornment>
            ),
            endAdornment: calcState.amount && (
              <InputAdornment position="end">
                <IconButton onClick={handleAmountClear}>
                  <CloseIcon fontSize="small" color="disabled" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Stack>
      <br />
      <Stack direction="row" alignItems="center" spacing={4}>
        <label className="calc-label">Tenure:</label>
        <Slider
          value={calcState.tenure}
          valueLabelDisplay="on"
          valueLabelFormat={formatSliderValue}
          step={1}
          min={1}
          max={60}
          onChange={handleTenureChange}
        />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={4}>
        <label className="calc-label">Banks:</label>
        <FDFilterBanks value={calcState.banks} onChange={handleBanksChange} />
      </Stack>
    </Stack>
  );
}
