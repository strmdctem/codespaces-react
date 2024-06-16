import bankRates from '../../data/bank-rates.json';
import rates from '../../data/rates.json';
import { calculateFd, search } from '../utils';

let bankNames = [];

export const getBankNames = () => bankNames;

function filterData(filter, isSpecial = false) {
  let filteredRecords = rates.filter((item) =>
    filter.bankTypes.includes(item.type)
  );

  bankNames = filteredRecords.map((item) => item.name).sort();

  filteredRecords =
    filter.bankNames.length === 0
      ? filteredRecords
      : filteredRecords.filter((item) => filter.bankNames.includes(item.name));

  if (filter.search) {
    filteredRecords = filteredRecords.filter((item) =>
      search(filter.search, item)
    );
  }

  const allMaxRates = new Set(
    filteredRecords
      .flatMap((item) => (!isSpecial ? item.rates.main : item.rates.special))
      .filter((rate) => rate)
      .filter((rate) => filter.tenureCategories.includes(rate.tenureCategory))
      .map((rate) => (filter.category ? rate.seniorMax : rate.max))
  );

  // Sort and select top 5
  const top5Rates = Array.from(allMaxRates)
    .sort((a, b) => parseFloat(b) - parseFloat(a))
    .slice(0, 5);

  return { filteredRecords, top5Rates };
}

export const getData = (filter) => {
  const { filteredRecords, top5Rates } = filterData(filter);

  const finalRecords = filteredRecords.map((item) => {
    let rates = {};
    for (let rate of item.rates.main) {
      const key = `${rate.start}-${rate.end}`;
      let { min, max } = rate;
      if (filter.category) {
        min = rate.seniorMin;
        max = rate.seniorMax;
      }
      if (filter.calc && max) {
        rates[key] = calculateFd(rate.end, filter.calc, max);
      } else {
        rates[key] = min === max ? min : `${min} - ${max}`;
      }
      rates[key] = rates[key] || undefined;
      rates[`${key}_max`] = max || undefined;

      if (top5Rates.includes(max)) {
        rates[`${key}_isTop`] = true;
      }
    }

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

export const getSpecialData = (filter) => {
  const { filteredRecords, top5Rates } = filterData(filter, true);
  console.log('top5Rates special', top5Rates);
  const finalRecords = [];

  for (let item of filteredRecords) {
    if (!item.rates.special) continue;

    for (let rate of item.rates.special) {
      if (!filter.tenureCategories.includes(rate.tenureCategory)) continue;
      const displayRate = filter.category ? rate.seniorMax : rate.max;
      const calc = filter.calc
        ? calculateFd(rate.end, filter.calc, displayRate)
        : undefined;
      let record = {
        abb: item.abb,
        name: item.name,
        type: item.type,
        key: item.key,
        rate: displayRate,
        calc: calc,
        isTop: top5Rates.includes(displayRate),
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
