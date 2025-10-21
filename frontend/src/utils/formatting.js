// frontend/src/utils/formatting.js
// --- CREATE THIS NEW FILE ---

/**
 * Formats a number into the Indian numbering system (Lakhs, Crores)
 * and prepends the Indian Rupee symbol (₹).
 * Handles null or undefined values.
 * @param {number|string|null|undefined} number - The number to format.
 * @returns {string} - The formatted currency string (e.g., ₹1,50,000).
 */
export const formatIndianCurrency = (number) => {
  if (number === null || number === undefined || isNaN(Number(number))) {
    return '₹ N/A'; // Or return '₹0' or an empty string as preferred
  }

  const num = Number(number);
  // Convert to string and handle potential negative sign
  const sign = num < 0 ? "-" : "";
  const absNumStr = Math.abs(num).toFixed(2); // Ensure two decimal places

  const [integerPart, decimalPart] = absNumStr.split('.');

  let lastThree = integerPart.slice(-3);
  let otherNumbers = integerPart.slice(0, -3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  // Add commas every two digits for the remaining part
  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  return `${sign}₹${formattedInteger}${decimalPart ? '.' + decimalPart : ''}`;
};