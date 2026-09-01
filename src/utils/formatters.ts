/**
 * Currency & Number format helper with defensive checks for null/undefined/NaN
 */
export const formatCurrency = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null) return '0';
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US');
};

export const formatAmount = (val: number | string | undefined | null): string => {
  return `$${formatCurrency(val)}`;
};
