import bankRates from '../../data/bank-rates.json';
import rates from '../../data/rates.json';
import { calculateFd, getCompoundingFrequency, search } from '../utils';

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

function getNewTopValues(records, keys) {
  const getTopNValues = (arr, n) => {
    return Array.from(new Set(arr.map(Number)))
      .sort((a, b) => b - a)
      .slice(0, n);
  };

  const topValues = {};

  keys.forEach((key) => {
    const values = records.map((record) => record[key]);
    topValues[key] = getTopNValues(values, 3);
  });

  // Update records with _isTop indicators
  const updatedRecords = records.map((record) => {
    const newRecord = { ...record };
    keys.forEach((key) => {
      if (topValues[key].includes(Number(record[key]))) {
        newRecord[`${key}_isNewTop`] = true;
      }
      const minKey = key.replace('_max', '_min');
      if (topValues[key].includes(Number(record[minKey]))) {
        newRecord[`${minKey}_isNewTop`] = true;
      }
    });
    return newRecord;
  });
  return updatedRecords;
}

export const getData = (filter) => {
  const { filteredRecords, top5Rates } = filterData(filter);
  let rateKeys;
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
        // Pass compoundingFrequency as 4 (quarterly, default) or 1 (annual) as needed
        rates[key] = calculateFd(rate.end, filter.calc, max).formattedValue;
      } else {
        rates[key] = min === max ? min : `${min} - ${max}`;
      }
      rates[key] = rates[key] || undefined;
      rates[`${key}_max`] = max || undefined;
      rates[`${key}_min`] = min || undefined;

      if (top5Rates.includes(max)) {
        rates[`${key}_isTop`] = true;
      }

      rateKeys =
        rates && Object.keys(rates).filter((key) => key.includes('max'));
    }

    return {
      abb: item.abb,
      name: item.name,
      type: item.type,
      key: item.key,
      ...rates
    };
  });

  const newRecords =
    (rateKeys && getNewTopValues(finalRecords, rateKeys)) || finalRecords;
  return newRecords;
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
  const compoundingFrequency = getCompoundingFrequency(bank.compounding);
  const finalRecords = bank.rates.main.map((rate) => {
    return {
      tenure: rate.displayLabel,
      general: rate.general,
      general_interest: calculateFd(
        rate.end,
        calc,
        rate.general,
        compoundingFrequency
      ).formattedValue,
      general_isTop: top5Rates.includes(rate.general),
      senior: rate.senior,
      senior_interest: calculateFd(
        rate.end,
        calc,
        rate.senior,
        compoundingFrequency
      ).formattedValue,
      senior_isTop: top5Rates.includes(rate.senior),
      end: rate.end,
      start: rate.start
    };
  });

  const bankViewData = {
    name: bank.name,
    key: bank.key,
    type: bank.type,
    shortName: bank.shortName,
    description: bank.description,
    establishedSince: bank.establishedSince,
    protection: bank.protection,
    compounding: bank.compounding,
    tenureLabel: bank.tenureLabel,
    ratesGeneralLabel: bank.ratesGeneralLabel,
    ratesSeniorLabel: bank.ratesSeniorLabel,
    rating: bank.rating,
    rates: finalRecords
  };

  return bankViewData;
};

export function getCalcData(calcState) {
  let { amount, tenure, banks } = calcState;
  tenure = Number(tenure);
  const fullYears = Math.floor(tenure / 12);
  const remainingMonths = tenure % 12;
  const tenureDays = fullYears * 365 + remainingMonths * 30;
  const calcData = [];

  for (const bankName of banks) {
    try {
      const bank = bankRates.find(
        (record) => record.name === bankName || record.key === bankName
      );
      const matchingRate = bank.rates.main
        .slice()
        .reverse()
        .find(
          (rate) =>
            tenureDays >= parseInt(rate.start) &&
            tenureDays <= parseInt(rate.end)
        );
      let generalCalc, seniorCalc;
      if (matchingRate) {
        const compoundingFrequency = getCompoundingFrequency(bank.compounding);
        generalCalc = calculateFd(
          tenureDays,
          amount,
          matchingRate.general,
          compoundingFrequency
        );
        seniorCalc = calculateFd(
          tenureDays,
          amount,
          matchingRate.senior,
          compoundingFrequency
        );
      }

      let totalYieldPercentage = ((generalCalc?.value / amount) * 100).toFixed(
        2
      );
      totalYieldPercentage =
        totalYieldPercentage < Number(matchingRate?.general)
          ? matchingRate.general
          : totalYieldPercentage;
      const yearlyYieldPercentage = (
        totalYieldPercentage /
        (tenure / 12)
      ).toFixed(2);

      let totalSeniorYieldPercentage = (
        (seniorCalc?.value / amount) *
        100
      ).toFixed(2);
      totalSeniorYieldPercentage =
        totalSeniorYieldPercentage < Number(matchingRate?.senior)
          ? matchingRate.senior
          : totalSeniorYieldPercentage;
      const yearlySeniorYieldPercentage = (
        totalSeniorYieldPercentage /
        (tenure / 12)
      ).toFixed(2);

      calcData.push({
        name: bankName,
        general: matchingRate?.general,
        general_interest: generalCalc?.formattedValue,
        general_value: generalCalc?.value,
        senior: matchingRate?.senior,
        senior_interest: seniorCalc?.formattedValue,
        senior_value: seniorCalc?.value,
        general_absolute_percentage: totalYieldPercentage,
        general_yearly_percentage: yearlyYieldPercentage,
        senior_absolute_percentage: totalSeniorYieldPercentage,
        senior_yearly_percentage: yearlySeniorYieldPercentage,
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
  if (calcData.length) {
    calcData.sort((a, b) => b.general_value - a.general_value);
    if (calcData.length >= 4) {
      calcData[0].isTop = true;
      calcData[1].isTop = true;
    } else if (calcData.length <= 3) {
      calcData[0].isTop = true;
    }
  }

  return calcData;
}

export default getData;
