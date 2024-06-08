import rates from '../../data/rates.json';
import bankRates from '../../data/bank-rates.json';

const bankNames = [];

export const getData = (filter) => {
  bankNames.length = 0;

  const filteredByType = rates.filter(item => filter.bankTypes.includes(item.type));

  filteredByType.forEach(item => bankNames.push(item.name));
  bankNames.sort();

  const finalFiltered = (filter.bankNames.length === 0 ?
    filteredByType : filteredByType.filter(item => filter.bankNames.includes(item.name)));

  const allMaxRates = new Set();
  finalFiltered.forEach(item => {
    item.rates.main.forEach(rate => {
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
  console.log("top5Rates", top5Rates);

  const finalRecords = finalFiltered.map((item) => {
    const rates = item.rates.main.reduce((acc, rate) => {
      const key = `${rate.start}-${rate.end}`;
      let { min, max } = rate;
      if (filter.category) {
        min = rate.seniorMin;
        max = rate.seniorMax;
      }
      acc[key] = min === max ? min : `${min} - ${max}`;
      acc[key] = acc[key] || undefined
      if (top5Rates.includes(max)) {
        acc[`${key}_isTop`] = true;
      }
      return acc;
    }, {});

    return {
      abb: item.abb,
      name: item.name,
      type: item.type,
      ...rates,
    };
  });

  return finalRecords;
}

export const getBankNames = () => bankNames;

export const getSpecialData = (filter) => {

  const filteredByType = rates.filter(item => filter.bankTypes.includes(item.type));

  const finalFiltered = (filter.bankNames.length === 0 ?
    filteredByType : filteredByType.filter(item => filter.bankNames.includes(item.name)));

  const allMaxRates = new Set();
  finalFiltered.forEach(item => {
    item.rates.special?.forEach(rate => {
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
  console.log("Special top5Rates", top5Rates, uniqueMaxRates);

  const finalRecords = finalFiltered
    .filter(item => item.rates.special)
    .map((item) => {
      const rates = item.rates.special.reduce((acc, rate) => {
        acc.rate = filter.category ? rate.seniorMax : rate.max;
        if (top5Rates.includes(acc.rate)) {
          acc.isTop = true;
        }
        acc.tenure = rate.end;
        acc.schemeName = rate.schemeName;
        return acc;
      }, {});

      return {
        abb: item.abb,
        name: item.name,
        type: item.type,
        ...rates,
      };
    });

  return finalRecords;
}

export const getBankRates = (name) => {
  const bank = bankRates.find(item => item.name === name);
  if (!bank) {
    return [];
  }
  const finalRecords = bank.rates.main
    .map((rate) => {
      return {
        tenure: rate.displayLabel,
        general: rate.general,
        senior: rate.senior
      };
    });

  return finalRecords;
}

export default getData;