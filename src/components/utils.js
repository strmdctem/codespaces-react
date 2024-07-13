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

const rupeeFormat = (value) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export function calculateFd(tenureInDays, principalAmount, annualInterestRate) {
  tenureInDays = Number(tenureInDays);
  principalAmount = Number(principalAmount);
  annualInterestRate = Number(annualInterestRate) / 100;
  const tenureInYears = tenureInDays / 365.25;
  const timesCompoundedPerYear = 4; // Quarterly compounding

  let amountAccumulated =
    principalAmount *
    Math.pow(
      1 + annualInterestRate / timesCompoundedPerYear,
      timesCompoundedPerYear * tenureInYears
    );

  amountAccumulated = amountAccumulated - principalAmount;

  return {
    value: amountAccumulated,
    formattedValue: rupeeFormat(Math.round(amountAccumulated).toString())
  };
}
