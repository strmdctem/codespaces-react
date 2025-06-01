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
import { rupeeFormat } from '../utils';

const toWords = new ToWords({
  converterOptions: {
    currency: true,
    ignoreZeroCurrency: true,
    doNotAddOnly: true
  }
});

const LoanVsInvestmentForm = ({ onChange }) => {
  const [formData, setFormData] = useState({
    loanAmount: 5000000, // Outstanding loan amount (50 lakhs)
    currentEMI: 45000, // Current EMI
    loanInterestRate: 8.5, // Loan interest rate
    remainingTenure: 120, // Remaining tenure in months (10 years)
    extraAmount: 20000, // Extra amount available monthly
    investmentReturn: 12, // Expected investment return %
    prepaymentFrequency: 'monthly' // monthly, yearly
  });
  // Calculate EMI based on loan amount, rate, and tenure
  const calculateEMI = (principal, annualRate, tenureMonths) => {
    if (
      !principal ||
      !annualRate ||
      !tenureMonths ||
      principal <= 0 ||
      annualRate <= 0 ||
      tenureMonths <= 0
    ) {
      return 0;
    }

    const monthlyRate = annualRate / 12 / 100;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return Math.round(emi);
  }; // Calculate required EMI and existing overpayment
  const requiredEMI = calculateEMI(
    formData.loanAmount,
    formData.loanInterestRate,
    formData.remainingTenure
  );
  const existingOverpayment = formData.currentEMI - requiredEMI;

  // Track if EMI has been manually modified
  const [emiManuallyModified, setEmiManuallyModified] = useState(false);

  useEffect(() => {
    // Auto-update EMI when loan parameters change, unless user has manually modified it
    const newRequiredEMI = calculateEMI(
      formData.loanAmount,
      formData.loanInterestRate,
      formData.remainingTenure
    );

    if (!emiManuallyModified && newRequiredEMI > 0) {
      setFormData((prev) => ({
        ...prev,
        currentEMI: newRequiredEMI
      }));
    }
  }, [
    formData.loanAmount,
    formData.loanInterestRate,
    formData.remainingTenure,
    emiManuallyModified
  ]);
  useEffect(() => {
    // Include calculated insights in the data passed to parent
    onChange({
      ...formData,
      requiredEMI,
      existingOverpayment,
      totalPrepayment: Math.max(0, existingOverpayment + formData.extraAmount)
    });
  }, [formData, requiredEMI, existingOverpayment, onChange]);
  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    const numericValue = parseFloat(value.replace(/[^0-9.]+/g, '')) || 0;

    // Track if EMI was manually modified
    if (field === 'currentEMI') {
      setEmiManuallyModified(true);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleSliderChange = (field) => (event, newValue) => {
    // Track if EMI was manually modified via slider
    if (field === 'currentEMI') {
      setEmiManuallyModified(true);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: newValue
    }));
  };
  const handleClear = (field) => () => {
    if (field === 'currentEMI') {
      setEmiManuallyModified(false);
      setFormData((prev) => ({
        ...prev,
        [field]: requiredEMI
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const format = (value) => {
    return value ? rupeeFormat(value) : value;
  };

  const inWords = (value) => {
    return value ? toWords.convert(value) : '';
  };

  // Common label styles
  const labelStyle = {
    whiteSpace: 'nowrap',
    minWidth: '115px',
    textAlign: 'left'
  };

  const labelStyleWithPadding = {
    ...labelStyle,
    paddingTop: '8px'
  };

  return (
    <Stack
      spacing={2.5}
      sx={{ p: 0, pt: 1, paddingBottom: 2 }}
      className="calc-form"
    >
      {/* Outstanding Loan Amount field */}
      <Stack spacing={1}>
        <Stack direction="row" alignItems="top" spacing={2}>
          <label className="calc-label" style={labelStyleWithPadding}>
            Loan Amount:
          </label>
          <div style={{ width: '100%' }}>
            <Stack>
              <TextField
                size="small"
                fullWidth
                type="text"
                variant="outlined"
                placeholder=""
                value={format(formData.loanAmount)}
                onChange={handleInputChange('loanAmount')}
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
                  endAdornment: formData.loanAmount ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear"
                        onClick={handleClear('loanAmount')}
                      >
                        <CloseIcon fontSize="small" color="disabled" />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
              />
              <div className="text-converted">
                {inWords(formData.loanAmount)}
              </div>
            </Stack>
          </div>
        </Stack>
        {/* Full width slider */}
        <Slider
          aria-label="Loan Amount"
          value={formData.loanAmount || 0}
          step={100000}
          min={100000}
          max={50000000}
          onChange={handleSliderChange('loanAmount')}
          sx={{ marginTop: '-8px !important', height: '1px' }}
        />
      </Stack>
      {/* Loan Interest Rate field */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={2}>
          <label className="calc-label" style={labelStyle}>
            Loan Interest Rate:
          </label>
          <div style={{ width: '100%' }}>
            <TextField
              size="small"
              fullWidth
              type="number"
              variant="outlined"
              placeholder="Enter loan interest rate"
              value={formData.loanInterestRate || 0}
              onChange={handleInputChange('loanInterestRate')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">% per annum</InputAdornment>
                )
              }}
            />
          </div>
        </Stack>
        {/* Full width slider */}
        <Slider
          aria-label="Loan Interest Rate"
          value={formData.loanInterestRate || 0}
          step={0.1}
          min={5}
          max={20}
          onChange={handleSliderChange('loanInterestRate')}
          sx={{ marginTop: '4px !important', height: '1px' }}
        />
      </Stack>
      {/* Current EMI field */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={2}>
          <label className="calc-label" style={labelStyle}>
            Remaining Tenure:
          </label>
          <div style={{ width: '100%' }}>
            <Typography variant="body2">
              {Math.round(formData.remainingTenure / 12)} years (
              {formData.remainingTenure} months)
            </Typography>
          </div>
        </Stack>
        {/* Full width slider */}
        <Slider
          aria-label="Remaining Tenure"
          value={formData.remainingTenure || 0}
          step={12}
          min={12}
          max={360}
          onChange={handleSliderChange('remainingTenure')}
          sx={{ marginTop: '-8px !important', height: '1px' }}
        />
      </Stack>
      <Stack spacing={1}>
        <Stack direction="row" alignItems="top" spacing={2}>
          <label className="calc-label" style={labelStyleWithPadding}>
            Current EMI:
          </label>
          <div style={{ width: '100%' }}>
            <Stack>
              <TextField
                size="small"
                fullWidth
                type="text"
                variant="outlined"
                placeholder={`Default: ₹${rupeeFormat(requiredEMI)}`}
                value={format(formData.currentEMI)}
                onChange={handleInputChange('currentEMI')}
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
                  endAdornment: (
                    <InputAdornment position="end">
                      {emiManuallyModified && requiredEMI > 0 && (
                        <IconButton
                          aria-label="reset to calculated EMI"
                          onClick={() => {
                            setEmiManuallyModified(false);
                            setFormData((prev) => ({
                              ...prev,
                              currentEMI: requiredEMI
                            }));
                          }}
                          title={`Reset to calculated EMI: ₹${rupeeFormat(requiredEMI)}`}
                          sx={{ marginRight: formData.currentEMI ? 0 : 1 }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontSize: '10px', color: '#1976d2' }}
                          >
                            Auto
                          </Typography>
                        </IconButton>
                      )}
                      {formData.currentEMI ? (
                        <IconButton
                          aria-label="clear"
                          onClick={handleClear('currentEMI')}
                        >
                          <CloseIcon fontSize="small" color="disabled" />
                        </IconButton>
                      ) : null}
                    </InputAdornment>
                  )
                }}
              />
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ textAlign: 'left' }}
              >
                {inWords(formData.currentEMI)}
              </Typography>
            </Stack>
          </div>
        </Stack>
        {/* Full width slider */}
        <Slider
          aria-label="Current EMI"
          value={formData.currentEMI || 0}
          step={1000}
          min={1000}
          max={500000}
          onChange={handleSliderChange('currentEMI')}
          sx={{ marginTop: '-8px !important', height: '1px' }}
        />
      </Stack>
      {/* EMI Insights */}
      {requiredEMI > 0 && (
        <Stack
          spacing={0.5}
          sx={{
            bgcolor: 'action.hover',
            p: 2,
            borderRadius: 1
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            EMI Analysis:
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Required EMI: <strong>₹{rupeeFormat(requiredEMI)}</strong>
          </Typography>
          {existingOverpayment > 0 && (
            <Typography variant="body2" sx={{ color: 'success.main' }}>
              Existing overpayment:
              <strong>₹{rupeeFormat(existingOverpayment)}</strong>
            </Typography>
          )}
          {existingOverpayment < 0 && (
            <Typography variant="body2" sx={{ color: 'error.main' }}>
              Underpayment:
              <strong>₹{rupeeFormat(Math.abs(existingOverpayment))}</strong>
            </Typography>
          )}
        </Stack>
      )}
      {/* Prepayment Strategy Section */}
      {(existingOverpayment > 0 || formData.extraAmount > 0) && (
        <Stack
          spacing={0.5}
          sx={{
            bgcolor: 'action.hover',
            p: 2,
            borderRadius: 1
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            Prepayment Strategy:
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Total prepayment:
            <strong>
              ₹
              {rupeeFormat(
                Math.max(0, existingOverpayment + formData.extraAmount)
              )}
            </strong>
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontStyle: 'italic' }}
          >
            {existingOverpayment > 0 && formData.extraAmount > 0
              ? `₹${rupeeFormat(existingOverpayment)} (from current EMI) + ₹${rupeeFormat(formData.extraAmount)} (additional) = ₹${rupeeFormat(existingOverpayment + formData.extraAmount)}`
              : existingOverpayment > 0
                ? 'From existing EMI overpayment'
                : 'From additional monthly amount'}
          </Typography>
        </Stack>
      )}
      {/* Remaining Tenure field */}
      {/* Extra Amount field */}
      <Stack spacing={1}>
        <Stack direction="row" alignItems="top" spacing={2}>
          <label className="calc-label" style={labelStyleWithPadding}>
            Extra Amount:
          </label>
          <div style={{ width: '100%' }}>
            <Stack>
              <TextField
                size="small"
                fullWidth
                type="text"
                variant="outlined"
                placeholder=""
                value={format(formData.extraAmount)}
                onChange={handleInputChange('extraAmount')}
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
                  endAdornment: formData.extraAmount ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear"
                        onClick={handleClear('extraAmount')}
                      >
                        <CloseIcon fontSize="small" color="disabled" />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
              />
              <div className="text-converted">
                {inWords(formData.extraAmount)}
              </div>
            </Stack>
          </div>
        </Stack>
        {/* Full width slider */}
        <Slider
          aria-label="Extra Amount"
          value={formData.extraAmount || 0}
          step={1000}
          min={1000}
          max={100000}
          onChange={handleSliderChange('extraAmount')}
          sx={{ marginTop: '-8px !important', height: '1px' }}
        />
      </Stack>
      {/* Investment Return Rate field */}
      <Stack spacing={1}>
        <Stack direction="row" spacing={2}>
          <label className="calc-label" style={labelStyle}>
            Investment Return:
          </label>
          <div style={{ width: '100%' }}>
            <TextField
              size="small"
              fullWidth
              type="number"
              variant="outlined"
              placeholder="Enter expected investment return"
              value={formData.investmentReturn || 0}
              onChange={handleInputChange('investmentReturn')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">% per annum</InputAdornment>
                )
              }}
            />
          </div>
        </Stack>
        {/* Full width slider */}
        <Slider
          aria-label="Investment Return"
          value={formData.investmentReturn || 0}
          step={0.5}
          min={6}
          max={25}
          onChange={handleSliderChange('investmentReturn')}
          sx={{ marginTop: '4px !important', height: '1px' }}
        />
      </Stack>
      {/* Investment Strategy Section */}
      {formData.extraAmount > 0 && formData.investmentReturn > 0 && (
        <Stack
          spacing={0.5}
          sx={{
            bgcolor: 'action.hover',
            p: 2,
            borderRadius: 1
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            Investment Strategy:
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Monthly investment:
            <strong>₹{rupeeFormat(formData.extraAmount)}</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Expected annual return:
            <strong>{formData.investmentReturn}%</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Investment horizon:
            <strong>{Math.round(formData.remainingTenure / 12)} years</strong>
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontStyle: 'italic' }}
          >
            Compounding annually with monthly contributions
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default LoanVsInvestmentForm;
