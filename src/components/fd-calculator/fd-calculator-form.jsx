import CloseIcon from '@mui/icons-material/Close';
import {
  IconButton,
  InputAdornment,
  Slider,
  Stack,
  TextField,
  Typography
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

export default function FDCalculatorForm({
  onChange,
  showBankSelector = true,
  showInterestSelector = false,
  interestRate = 8
}) {
  const [calcState, setCalcState] = useState({
    amount: 100000,
    banks: ['ICICI Bank', 'State Bank of India', 'HDFC Bank', 'Bank of Baroda'],
    tenure: 24,
    interestRate: interestRate
  });

  const handleAmountChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9]+/g, '');
    if ((newValue >= 0 && newValue <= 10000000) || newValue === '') {
      setCalcState((prevState) => ({ ...prevState, amount: Number(newValue) }));
    }
  };

  const handleAmountSliderChange = (event, newValue) => {
    let roundedValue = Math.round(newValue / 100000) * 100000;
    if (roundedValue < 10000) {
      roundedValue = 10000;
    }
    setCalcState((prevState) => ({
      ...prevState,
      amount: roundedValue
    }));
  };

  const handleAmountClear = () => {
    setCalcState((prevState) => ({ ...prevState, amount: '' }));
  };

  const handleBanksChange = (value) => {
    setCalcState((prevState) => ({ ...prevState, banks: value }));
  };

  const handleTenureChange = (event) => {
    setCalcState((prevState) => ({ ...prevState, tenure: event.target.value }));
  };

  const inWords = (value) => {
    return value ? toWords.convert(value) : '';
  };

  useEffect(() => {
    const handler = setTimeout(() => {
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
    return value ? rupeeFormat(value) : value;
  };

  return (
    <Stack spacing={1} sx={{ p: 2, paddingBottom: 3 }} className="calc-form">
      <Stack direction="row" alignItems="top" spacing={2}>
        <label className="calc-label"> Amount:</label>
        <div style={{ width: '100%' }}>
          <Stack>
            <TextField
              size="small"
              fullWidth
              type="text"
              variant="outlined"
              placeholder=""
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
                endAdornment: calcState.amount ? (
                  <InputAdornment position="end">
                    <IconButton aria-label="clear" onClick={handleAmountClear}>
                      <CloseIcon fontSize="small" color="disabled" />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
            />
            <div className="text-converted">{inWords(calcState.amount)}</div>
            <Slider
              aria-label="Amount"
              value={calcState.amount}
              step={100000}
              min={10000}
              max={10000000}
              onChange={handleAmountSliderChange}
            />
          </Stack>
        </div>
      </Stack>
      {showInterestSelector && (
        <Stack direction="row" spacing={3}>
          <label className="calc-label">Interest:</label>
          <Stack style={{ width: '100%' }}>
            <TextField
              size="small"
              fullWidth
              type="number"
              variant="outlined"
              placeholder="Enter interest rate"
              value={calcState.interestRate || 0}
              onChange={(e) =>
                setCalcState((prevState) => ({
                  ...prevState,
                  interestRate: e.target.value
                }))
              }
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
            <Slider
              aria-label="Interest Rate"
              value={calcState.interestRate || 0}
              step={0.5}
              min={0}
              max={20}
              onChange={(e, newValue) =>
                setCalcState((prevState) => ({
                  ...prevState,
                  interestRate: newValue
                }))
              }
            />
          </Stack>
        </Stack>
      )}
      <Stack direction="row" spacing={3}>
        <label className="calc-label">Tenure:</label>
        <Stack style={{ width: '100%' }}>
          <Typography variant="body2">
            {formatSliderValue(calcState.tenure)}
          </Typography>
          <div>
            <Slider
              aria-label="Tenure"
              value={calcState.tenure}
              valueLabelDisplay="off"
              step={1}
              min={1}
              max={120}
              onChange={handleTenureChange}
            />
          </div>
        </Stack>
      </Stack>
      {showBankSelector && (
        <Stack direction="row" alignItems="center" spacing={3}>
          <label className="calc-label">Banks:</label>
          <FDFilterBanks value={calcState.banks} onChange={handleBanksChange} />
        </Stack>
      )}
    </Stack>
  );
}
