import rates from '../../data/rates.json';

export const bankNames = [];

export const fdData = rates.map((item) => {
    bankNames.push(item.abb);
    const rates = item.rates.main.reduce((acc, rate) => {
      const key = `${rate.start}-${rate.end}`;
      acc[key] = rate.general;
      return acc;
    }, {});

    return {
      name: item.abb,
      key: item.key,
      type: item.type,
      ...rates,
    };
  });

  export default fdData;