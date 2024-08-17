import bankRates from '../../data/bank-rates.json';
import rates from '../../data/rates.json';
import { calculateFd, search } from '../utils';

let bankNames = [];

let bankMap = [];

export const getBankNames = () => {
  if (!bankNames.length) {
    bankNames = rates.map((item) => item.name).sort();
  }
  return bankNames;
};

export const getBankMap = () => {
  if (!bankMap.length) {
    bankMap = rates
      .map((item) => {
        return {
          name: item.name,
          key: item.key
        };
      })
      .sort();
  }
  return bankMap;
};

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
      .filter((rate) => rate)
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
        rates[key] = calculateFd(rate.end, filter.calc, max).formattedValue;
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
  const finalRecords = [];

  for (let item of filteredRecords) {
    if (!item.rates.special) continue;

    for (let rate of item.rates.special) {
      if (!filter.tenureCategories.includes(rate.tenureCategory)) continue;
      const displayRate = filter.category ? rate.seniorMax : rate.max;
      const { value, formattedValue } = filter.calc
        ? calculateFd(rate.end, filter.calc, displayRate)
        : { value: undefined, formattedValue: undefined };
      let record = {
        abb: item.abb,
        name: item.name,
        type: item.type,
        key: item.key,
        rate: displayRate,
        calc: formattedValue,
        calcValue: value,
        isTop: top5Rates.includes(displayRate),
        tenure: rate.end,
        schemeName: rate.schemeName
      };

      finalRecords.push(record);
    }
  }

  return finalRecords;
};

export const getBankViewData = (key, calc) => {
  const bank = bankRates.find((item) => item.key === key);
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
      general_interest: calculateFd(rate.end, calc, rate.general)
        .formattedValue,
      general_isTop: top5Rates.includes(rate.general),
      senior: rate.senior,
      senior_interest: calculateFd(rate.end, calc, rate.senior).formattedValue,
      senior_isTop: top5Rates.includes(rate.senior),
      end: rate.end,
      start: rate.start
    };
  });

  const bankViewData = {
    name: bank.name,
    key: bank.key,
    type: bank.type,
    description: bank.description,
    establishedSince: bank.establishedSince,
    protection: bank.protection,
    compounding: bank.compounding,
    rates: finalRecords
  };

  return bankViewData;
};

export function getCalcData(calcState) {
  const { amount, tenure, banks } = calcState;
  const tenureDays = Number(tenure) * 30;
  const calcData = [];

  for (const bankName of banks) {
    try {
      const bank = bankRates.find(
        (record) => record.name === bankName || record.key === bankName
      );
      const matchingRate = bank.rates.main.find(
        (rate) =>
          tenureDays >= parseInt(rate.start) && tenureDays <= parseInt(rate.end)
      );

      const generalCalc = calculateFd(tenureDays, amount, matchingRate.general);
      const seniorCalc = calculateFd(tenureDays, amount, matchingRate.senior);

      calcData.push({
        name: bankName,
        general: matchingRate.general,
        general_interest: generalCalc.formattedValue,
        general_value: generalCalc.value,
        senior: matchingRate.senior,
        senior_interest: seniorCalc.formattedValue,
        senior_value: seniorCalc.value,
        key: bank.key,
        abb: bank.key.substring(0, 6)
      });
    } catch (error) {
      console.info(
        `Error processing bank ${bankName}: ${error.message}`,
        tenure
      );
      // Handle the error as needed, e.g., continue to the next iteration
      continue;
    }
  }
  calcData.sort((a, b) => b.general_value - a.general_value);
  if (calcData.length >= 4) {
    calcData[0].isTop = true;
    calcData[1].isTop = true;
  } else if (calcData.length <= 3) {
    calcData[0].isTop = true;
  }
  console.log(calcData);
  return calcData;
}

export default getData;
