export function formatPrice(value) {
  const num = Number(value);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: false
  }).format(num);
}
