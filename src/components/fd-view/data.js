import rates from '../../data/rates.json';

const bankNames = [];

export const getData = (filter) => {
  bankNames.length = 0;

  const filteredByType = rates.filter(item => filter.bankTypes.includes(item.type));

  filteredByType.forEach(item => bankNames.push(item.name));
  bankNames.sort();

  const finalFiltered = (filter.bankNames.length === 0 ? filteredByType : filteredByType.filter(item => filter.bankNames.includes(item.name)))
    .sort((a, b) => a.name.localeCompare(b.name));

  return finalFiltered.map((item) => {
    const rates = item.rates.main.reduce((acc, rate) => {
      const key = `${rate.start}-${rate.end}`;
      acc[key] = !filter.category ? rate.general : rate.senior;
      acc.max = !filter.category ? rate.max : rate.senior_max;
      return acc;
    }, {});

    return {
      abb: item.abb,
      key: item.key,
      name: item.name,
      type: item.type,
      ...rates,
    };
  });
}

export const getBankNames = () => bankNames;

export default getData;