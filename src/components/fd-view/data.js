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

function filterData1(filter) {
  let filteredRecords = bankRates.filter((item) =>
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
  return filteredRecords;
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

/**
 * Gets the top two highest interest rates from each bank for the specified type
 * @param {string} type - Either "general" or "senior"
 * @returns {Array} Array of objects with bank details and their top two highest rates
 */
export function getHighestData(filter) {
  const banksData = filterData1(filter);

  const result = [];

  // Iterate through each bank
  banksData.forEach((bank) => {
    // Get rates with the specified type and convert to number
    const validRates = bank.rates.main.map((rate) => ({
      ...rate,
      rateValue: parseFloat(filter.category ? rate.senior : rate.general)
    }));

    // Sort rates in descending order
    validRates.sort((a, b) => b.rateValue - a.rateValue);

    // Take top two rates
    const topTwoRates = validRates.slice(0, 2);

    // Add to result with only the specified keys
    topTwoRates.forEach((rate) => {
      const { value, formattedValue } = filter.calc
        ? calculateFd(rate.end, filter.calc, rate.rateValue)
        : { value: undefined, formattedValue: undefined };
      result.push({
        abb: bank.abb,
        name: bank.name,
        type: bank.type,
        key: bank.key,
        rate: rate.rateValue,
        calc: formattedValue,
        calcValue: value,
        tenure: rate.end,
        schemeName: rate.displayLabel
      });
    });
  });
  // Get unique rates and find top 5 rate values
  const uniqueRates = [...new Set(result.map((record) => record.rate))];
  const top5RateValues = uniqueRates.sort((a, b) => b - a).slice(0, 5);

  // Sort all results by rate in descending order
  result.sort((a, b) => b.rate - a.rate);

  // Mark records with top 5 rate values as isTop: true
  result.forEach((record) => {
    record.isTop = top5RateValues.includes(record.rate);
  });

  return result;
}

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

/**
 * Gets rates for each bank tenure-wise for specific periods using bankRates
 * @param {Object} filter - Filter object with bank types, names, category (general/senior)
 * @returns {Array} Array of objects with bank details and their rates for specific tenures
 */
export function getTenureWiseRates(filter = {}) {
  // Define specific tenure periods in days
  const targetTenures = [
    { label: '1_Month', days: 30 },
    { label: '3_Months', days: 90 },
    { label: '6_Months', days: 180 },
    { label: '9_Months', days: 270 },
    { label: '1_Year', days: 365 },
    { label: '2_Years', days: 730 },
    { label: '3_Years', days: 1095 },
    { label: '5_Years', days: 1825 }
  ];

  // Filter banks based on provided filter criteria
  let filteredBanks = bankRates;

  if (filter.bankTypes && filter.bankTypes.length > 0) {
    filteredBanks = filteredBanks.filter((bank) =>
      filter.bankTypes.includes(bank.type)
    );
  }

  if (filter.bankNames && filter.bankNames.length > 0) {
    filteredBanks = filteredBanks.filter((bank) =>
      filter.bankNames.includes(bank.name)
    );
  }

  if (filter.search) {
    filteredBanks = filteredBanks.filter((bank) => search(filter.search, bank));
  }

  const result = [];

  filteredBanks.forEach((bank) => {
    const bankData = {
      key: bank.key,
      name: bank.name,
      type: bank.type,
      abb: bank.abb,
      rates: {}
    };

    // For each target tenure, find the best matching rate from bank's rates
    targetTenures.forEach((tenure) => {
      const matchingRate = bank.rates.main.find((rate) => {
        const start = parseInt(rate.start);
        const end = parseInt(rate.end);
        return tenure.days >= start && tenure.days <= end;
      });

      if (matchingRate) {
        const rateValue = filter.category
          ? matchingRate.senior
          : matchingRate.general;

        // Calculate interest if calc amount is provided
        let calculatedInterest = null;
        if (filter.calc && rateValue) {
          const compoundingFrequency = getCompoundingFrequency(
            bank.compounding
          );
          calculatedInterest = calculateFd(
            tenure.days,
            filter.calc,
            rateValue,
            compoundingFrequency
          );
        }

        bankData.rates[tenure.label] = {
          rate: rateValue,
          calculatedInterest: calculatedInterest
            ? calculatedInterest.formattedValue
            : null,
          calculatedValue: calculatedInterest ? calculatedInterest.value : null
        };
      } else {
        // If no exact match, mark as not available
        bankData.rates[tenure.label] = {
          rate: null,
          general: null,
          senior: null,
          displayLabel: 'Not Available',
          tenure: tenure.days,
          calculatedInterest: null,
          calculatedValue: null
        };
      }
    });

    result.push(bankData);
  });

  return result;
}

/**
 * Gets rates for each bank in a simplified tabular format for specific tenures
 * @param {Object} filter - Filter object with bank types, names, category (general/senior)
 * @returns {Array} Array of objects with bank details and rates as columns
 */
export function getTenureWiseRatesTable(filter = {}) {
  const tenureData = getTenureWiseRates(filter);

  const result = tenureData.map((bank) => {
    const bankRow = {
      key: bank.key,
      name: bank.name
    };

    // Add each tenure as a column
    Object.keys(bank.rates).forEach((tenure) => {
      const rateData = bank.rates[tenure];
      bankRow[`${tenure}_rate`] = rateData.rate;
      bankRow[`${tenure}`] = rateData.rate;

      if (rateData.calculatedInterest) {
        bankRow[`${tenure}_interest`] = rateData.calculatedInterest;
        bankRow[`${tenure}_value`] = rateData.calculatedValue;
        bankRow[`${tenure}`] = rateData.calculatedInterest;
      }
    });

    return bankRow;
  });
  return result;
}
