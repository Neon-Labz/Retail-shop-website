export function formatPrice(price: number | null | undefined, currency: string = 'LKR'): string {
  if (price === null || price === undefined || isNaN(Number(price))) return '';

  const num = Number(price);

  if (currency === 'LKR' || currency === 'Rs' || currency === 'RS') {
    return `LKR ${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(num);
}

