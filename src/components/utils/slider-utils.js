/**
 * Utility functions for dynamic slider scaling across calculator components
 */

/**
 * Converts an amount value to a slider position (0-100 scale)
 * @param {number} amount The amount value to convert
 * @param {Object} config Configuration for the conversion
 * @param {number} config.minAmount Minimum valid amount (e.g., 1000 for SIP, 100000 for loan)
 * @param {number} config.midAmount First threshold amount (e.g., 50000 for SIP, 5000000 for loan)
 * @param {number} config.maxAmount Second threshold amount (e.g., 100000 for SIP, 10000000 for loan)
 * @param {number} config.topAmount Maximum valid amount (e.g., 1000000 for SIP, 100000000 for loan)
 * @returns {number} Slider position (0-100)
 */
export const amountToSliderPosition = (amount, config) => {
  const { minAmount, midAmount, maxAmount, topAmount } = config;

  // Handle invalid or empty values
  if (!amount || amount === '' || isNaN(amount) || amount < minAmount) return 0;

  if (amount <= midAmount) {
    // First tier (0-40 position)
    return ((amount - minAmount) / (midAmount - minAmount)) * 40;
  } else if (amount <= maxAmount) {
    // Second tier (40-70 position)
    const excessAmount = amount - midAmount;
    const rangeSize = maxAmount - midAmount;
    return 40 + (excessAmount / rangeSize) * 30;
  } else {
    // Third tier (70-100 position)
    const excessAmount = amount - maxAmount;
    const maxExcess = topAmount - maxAmount;
    return Math.min(100, 70 + (excessAmount / maxExcess) * 30); // Cap at 100
  }
};

/**
 * Converts a slider position to an actual amount value
 * @param {number} position The slider position (0-100)
 * @param {Object} config Configuration for the conversion
 * @param {number} config.minAmount Minimum amount (e.g., 1000 for SIP, 100000 for loan)
 * @param {number} config.midAmount First threshold amount (e.g., 50000 for SIP, 5000000 for loan)
 * @param {number} config.maxAmount Second threshold amount (e.g., 100000 for SIP, 10000000 for loan)
 * @param {number} config.topAmount Maximum valid amount (e.g., 1000000 for SIP, 100000000 for loan)
 * @param {number} config.firstStepSize Step size for first tier (e.g., 1000 for SIP, 100000 for loan)
 * @param {number} config.secondStepSize Step size for second tier (e.g., 5000 for SIP, 500000 for loan)
 * @param {number} config.thirdStepSize Step size for third tier (e.g., 50000 for SIP, 5000000 for loan)
 * @returns {number} The calculated amount value
 */
export const sliderPositionToAmount = (position, config) => {
  const {
    minAmount,
    midAmount,
    maxAmount,
    firstStepSize,
    secondStepSize,
    thirdStepSize
  } = config;

  if (position <= 40) {
    // First tier (0-40 position)
    const amount = minAmount + (position / 40) * (midAmount - minAmount);
    return Math.round(amount / firstStepSize) * firstStepSize;
  } else if (position <= 70) {
    // Second tier (40-70 position)
    const excessPosition = position - 40;
    const excessAmount = (excessPosition / 30) * (maxAmount - midAmount);
    const amount = midAmount + excessAmount;
    return Math.round(amount / secondStepSize) * secondStepSize;
  } else {
    // Third tier (70-100 position)
    const excessPosition = position - 70;
    const excessAmount = (excessPosition / 30) * (config.topAmount - maxAmount);
    const amount = maxAmount + excessAmount;
    return Math.round(amount / thirdStepSize) * thirdStepSize;
  }
};
