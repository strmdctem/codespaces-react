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
      key: item.key,
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
}

export const getBankRates = (name) => {
  const bank = bankRates.find(item => item.name === name);
  if (!bank) {
    return [];
  }

  const rates = bank.rates.main.flatMap(rate => [rate.general, rate.senior]);
  const uniqueRates = [...new Set(rates)];
  const top5Rates = uniqueRates.sort((a, b) => b - a).slice(0, 5);

  const finalRecords = bank.rates.main
    .map((rate) => {
      return {
        tenure: rate.displayLabel,
        general: rate.general,
        general_isTop: top5Rates.includes(rate.general),
        senior: rate.senior,
        senior_isTop: top5Rates.includes(rate.senior)
      };
    });

  return finalRecords;
}

export default getData;