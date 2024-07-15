import CloseIcon from '@mui/icons-material/Close';
import {
  IconButton,
  InputAdornment,
  Slider,
  Stack,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import { ToWords } from 'to-words';
import FDFilterBanks from '../fd-filter/fd-filter-banks';
import { rupeeFormat } from '../utils';

const toWords = new ToWords({
  converterOptions: {
    currency: true,
    ignoreZeroCurrency: true,
    doNotAddOnly: true
  }
});

export default function FDCalculatorForm({ onChange }) {
  const [calcState, setCalcState] = useState({
    amount: '500000',
    banks: [
      'Suryoday Bank',
      'ICICI Bank',
      'State Bank of India',
      'AU Small Finance Bank'
    ],
    tenure: 18
  });

  const handleAmountChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]+/g, '');
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

    const inWords = (value) => {
    return value ? toWords.convert(value) : '';
  }

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

    const format = (value) => {
    console.log('value', value);
    return value ? rupeeFormat(value) : value;
  }

  return (
    <Stack spacing={1} sx={{ p: 1, paddingBottom: 2 }} className='calc-form'>
      <label className="calc-label-1"> Fixed Deposit Calculator</label>
      <Stack direction="row" alignItems="center" spacing={3} sx={{paddingBottom: 2 }}>
        <label className="calc-label"> Amount:</label>
        <div style={{width: '100%'}}>
                  <TextField
          size="small"
          fullWidth
          type="text"
          variant="outlined"
          placeholder="Amount"
          value={format(calcState.amount)}
          onChange={handleAmountChange}
          sx={{
        '&  .MuiOutlinedInput-input': {
          marginLeft: '-15px'
        }
      }}
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
        <div class='text-converted'>{inWords(calcState.amount)}</div>
        </div>
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
