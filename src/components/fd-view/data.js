import rates from '../../data/rates.json';

const bankNames = [];

export const getData = (filter) => {
  bankNames.length = 0;

  const filteredByType = rates.filter(item => filter.bankTypes.includes(item.type));

  filteredByType.forEach(item => bankNames.push(item.name));
  bankNames.sort();

  const finalFiltered = (filter.bankNames.length === 0 ?
    filteredByType : filteredByType.filter(item => filter.bankNames.includes(item.name)));

  return finalFiltered.map((item) => {
    const rates = item.rates.main.reduce((acc, rate) => {
      const key = `${rate.start}-${rate.end}`;
      let { min, max } = rate;
      if (filter.category) {
        min = rate.seniorMin;
        max = rate.seniorMax;
      }
      acc[key] = min === max ? min : `${min} - ${max}`;
      acc[key] = acc[key] || undefined
      return acc;
    }, {});

    return {
      abb: item.abb,
      name: item.name,
      type: item.type,
      ...rates,
    };
  });
}

export const getBankNames = () => bankNames;

export default getData;