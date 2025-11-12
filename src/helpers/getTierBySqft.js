export function getTierBySqft(data, sqft) {
  if (!data?.priceTiers) return null;
  for (const tier of data.priceTiers) {
    const [min, max] = tier.sqftRange.split("-").map(Number);
    if (sqft >= min && sqft <= max) return tier;
  }
  return data.priceTiers[0];
}
