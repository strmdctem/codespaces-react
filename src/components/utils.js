import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';

/* eslint-disable react-hooks/rules-of-hooks */
export function isMobile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return isMobile;
}

const normalize = (str) => str.toLowerCase().replace(/[^\w\s]/g, '');

export function search(searchValue, item) {
  const values = Object.values(item).map((value) => normalize(String(value)));
  const terms = searchValue
    .split(',')
    .flatMap((value) => value.trim().split(/\s+/))
    .map(normalize);
  return terms.some((term) => values.some((value) => value.includes(term)));
}

export const rupeeFormat = (value) => {
  if (!value) return '';
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export function calculateFd(
  tenureInDays,
  principalAmount,
  annualInterestRate,
  compoundingFrequency = 4
) {
  tenureInDays = Number(tenureInDays);
  principalAmount = Number(principalAmount);
  annualInterestRate = Number(annualInterestRate) / 100;
  const tenureInYears = tenureInDays / 365.25;
  const timesCompoundedPerYear = compoundingFrequency; // 4=Quarterly, 1=Annual

  let amountAccumulated =
    principalAmount *
    Math.pow(
      1 + annualInterestRate / timesCompoundedPerYear,
      timesCompoundedPerYear * tenureInYears
    );

  amountAccumulated = amountAccumulated - principalAmount;

  return {
    value: parseInt(amountAccumulated),
    formattedValue: rupeeFormat(Math.round(amountAccumulated).toString())
  };
}

export function getCompoundingFrequency(compounding) {
  if (compounding === 'Annually') {
    return 1;
  } else if (compounding === 'quarterly') {
    return 4;
  }
  return 4; // Default to quarterly
}
