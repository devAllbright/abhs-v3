import data from "../data/recurringPrices.json";

export function getTierBySqft(houseSize) {
  const tiers = data.priceTiers;
  for (const tier of tiers) {
    const [min, max] = tier.sqftRange.split("-").map(Number);
    if (houseSize >= min && houseSize <= max) return tier;
  }
  return tiers[0];
}

export function calculateRecurringPrice(formData) {
  const {
    houseSize,
    bedrooms = 0,
    bathrooms = 0,
    hadProServices = false,
    extras = {}
  } = formData;

  const tier = getTierBySqft(houseSize);
  const { includedRooms, minimum, initialCleaning } = tier;

  const {
    bedroomPrice,
    bathroomPrice,
    linenPrice,
    petsPrice,
    shuttersPrice,
    ovenPrice,
    refrigeratorPrice
  } = data.globalExtras;

  let total = hadProServices ? minimum : initialCleaning;

  if (bedrooms > includedRooms.bedrooms)
    total += (bedrooms - includedRooms.bedrooms) * bedroomPrice;

  if (bathrooms > includedRooms.bathrooms)
    total += (bathrooms - includedRooms.bathrooms) * bathroomPrice;

  if (extras.linens) total += linenPrice;
  if (extras.pets) total += petsPrice;
  if (extras.shutters) total += shuttersPrice;
  if (extras.oven) total += ovenPrice;
  if (extras.refrigerator) total += refrigeratorPrice;

  return Math.round(total);
}
