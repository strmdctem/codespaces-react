import rates from '../../data/rates.json';

export const bankNames = [];

export const getData = (filter) => {
  return rates
    .filter(item => filter.bankTypes.includes(item.type))
    .map((item) => {
      bankNames.push(item.abb);
      const rates = item.rates.main.reduce((acc, rate) => {
        const key = `${rate.start}-${rate.end}`;
        acc[key] = !filter.category ? rate.general : rate.senior;
        return acc;
      }, {});

      return {
        name: item.abb,
        key: item.key,
        type: item.type,
        ...rates,
      };
    });
}

export default getData;