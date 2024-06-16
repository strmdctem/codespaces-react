import bankRates from '../../data/bank-rates.json';
import rates from '../../data/rates.json';

const bankNames = [];

const search = (searchValue, item) => {
  const values = Object.values(item).map((value) =>
    String(value)
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
  );
  let terms = searchValue.split(',');
  terms = terms.flatMap((value) => value.trim().split(/\s+/));
  terms = terms.map((term) => term.toLowerCase().replace(/[^\w\s]/g, ''));
  return terms.some((term) => values.some((value) => value.includes(term)));
};

function calculateFd(tenureInDays, principalAmount, annualInterestRate) {
  tenureInDays = Number(tenureInDays);
  principalAmount = Number(principalAmount);
  annualInterestRate = Number(annualInterestRate) / 100;
  const tenureInYears = tenureInDays / 365.25;
  const timesCompoundedPerYear = 4; // Quarterly compounding

  const amountAccumulated =
    principalAmount *
    Math.pow(
      1 + annualInterestRate / timesCompoundedPerYear,
      timesCompoundedPerYear * tenureInYears
    );

  return Math.round(amountAccumulated).toString();
}

export const getData = (filter) => {
  bankNames.length = 0;

  const filteredByType = rates.filter((item) =>
    filter.bankTypes.includes(item.type)
  );

  filteredByType.forEach((item) => bankNames.push(item.name));
  bankNames.sort();

  let finalFiltered =
    filter.bankNames.length === 0
      ? filteredByType
      : filteredByType.filter((item) => filter.bankNames.includes(item.name));

  if (filter.search) {
    finalFiltered = finalFiltered.filter((item) => search(filter.search, item));
  }

  const allMaxRates = new Set();
  finalFiltered.forEach((item) => {
    item.rates.main.forEach((rate) => {
      if (filter.tenureCategories.includes(rate.tenureCategory.toString())) {
        const max = filter.category ? rate.seniorMax : rate.max;
        allMaxRates.add(max);
      }
    });
  });

  // Sort and select top 5
  const uniqueMaxRates = Array.from(allMaxRates);
  uniqueMaxRates.sort((a, b) => b - a);
  const top5Rates = uniqueMaxRates.slice(0, 5);
  console.log('top5Rates', top5Rates);

  const finalRecords = finalFiltered.map((item) => {
    const rates = item.rates.main.reduce((acc, rate) => {
      const key = `${rate.start}-${rate.end}`;
      let { min, max } = rate;
      if (filter.category) {
        min = rate.seniorMin;
        max = rate.seniorMax;
      }
      acc[key] = min === max ? min : `${min} - ${max}`;
      acc[key] = acc[key] || undefined;
      acc[`${key}_max`] = max || undefined;
      if (filter.calc && acc[key] && max) {
        acc[`${key}_calc`] = calculateFd(rate.end, filter.calc, max);
        //console.log("calc", acc[`${key}_calc`]);
      }
      if (top5Rates.includes(max)) {
        acc[`${key}_isTop`] = true;
      }
      return acc;
    }, {});

    return {
      abb: item.abb,
      name: item.name,
      type: item.type,
      key: item.key,
      ...rates
    };
  });

  return finalRecords;
};

export const getBankNames = () => bankNames;

export const getSpecialData = (filter) => {
  const filteredByType = rates.filter((item) =>
    filter.bankTypes.includes(item.type)
  );

  let finalFiltered =
    filter.bankNames.length === 0
      ? filteredByType
      : filteredByType.filter((item) => filter.bankNames.includes(item.name));

  if (filter.search) {
    finalFiltered = finalFiltered.filter((item) => search(filter.search, item));
  }

  const allMaxRates = new Set();
  finalFiltered.forEach((item) => {
    item.rates.special?.forEach((rate) => {
      if (filter.tenureCategories.includes(rate.tenureCategory)) {
        const max = filter.category ? rate.seniorMax : rate.max;
        allMaxRates.add(max);
      }
    });
  });

  // Sort and select top 5
  let uniqueMaxRates = Array.from(allMaxRates);
  uniqueMaxRates = uniqueMaxRates.sort((a, b) => parseFloat(b) - parseFloat(a));
  const top5Rates = uniqueMaxRates.slice(0, 5);
  console.log('Special top5Rates', top5Rates, uniqueMaxRates);

  let finalRecords = [];

  for (let item of finalFiltered) {
    if (!item.rates.special) continue;

    for (let rate of item.rates.special) {
      if (!filter.tenureCategories.includes(rate.tenureCategory)) continue;

      let record = {
        abb: item.abb,
        name: item.name,
        type: item.type,
        key: item.key,
        rate: filter.category ? rate.seniorMax : rate.max,
        isTop: top5Rates.includes(rate.max),
        tenure: rate.end,
        schemeName: rate.schemeName
      };

      finalRecords.push(record);
    }
  }

  return finalRecords;
};

export const getBankRates = (name) => {
  const bank = bankRates.find((item) => item.name === name);
  if (!bank) {
    return [];
  }

  const rates = bank.rates.main.flatMap((rate) => [rate.general, rate.senior]);
  const uniqueRates = [...new Set(rates)];
  const top5Rates = uniqueRates.sort((a, b) => b - a).slice(0, 5);

  const finalRecords = bank.rates.main.map((rate) => {
    return {
      tenure: rate.displayLabel,
      general: rate.general,
      general_isTop: top5Rates.includes(rate.general),
      senior: rate.senior,
      senior_isTop: top5Rates.includes(rate.senior)
    };
  });

  return finalRecords;
};

export default getData;
