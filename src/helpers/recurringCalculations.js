import data from "../data/maidServicesPrices.json";
import { getTierBySqft } from "./getTierBySqft";

export function calculateRecurringPrice(formData) {
  const {
    houseSize = 0,
    bedrooms = 0,
    bathrooms = 0,
    hadProServices = false,
    extras = {},
    selectedFrequency = ""
  } = formData;

  const tier = getTierBySqft(data, houseSize);
  if (!tier) return { basePrice: 0, extrasTotal: 0, finalPrice: 0 };

  const { includedRooms, minimum, initialCleaning } = tier;
  const global = data.globalExtras;

  let basePrice = hadProServices ? minimum : initialCleaning;
  let extrasTotal = 0;

  if (bedrooms > includedRooms.bedrooms)
    extrasTotal += (bedrooms - includedRooms.bedrooms) * global.bedroomPrice;

  if (bathrooms > includedRooms.bathrooms)
    extrasTotal += (bathrooms - includedRooms.bathrooms) * global.bathroomPrice;

  if (extras.changeLinens > 0)
    extrasTotal += extras.changeLinens * global.changeLinensPrice;
  if (extras.furryPets) extrasTotal += global.furryPetsPrice;
  if (extras.shuttersAndBlinds) extrasTotal += global.shuttersAndBlindsPrice;
  if (extras.insideOven) extrasTotal += global.insideOvenPrice;
  if (extras.insideRefrigerator) extrasTotal += global.insideRefrigeratorPrice;

  let discount = 0;
  if (selectedFrequency === "Weekly") discount = global.weeklyDiscount;
  else if (selectedFrequency === "Bi-Weekly") discount = global.biMonthlyDiscount;
  else if (selectedFrequency === "Monthly") discount = global.monthlyDiscount;

  let finalPrice;

  if (hadProServices) {
    finalPrice = (basePrice + extrasTotal) * (1 - discount);
  } else {
    finalPrice = basePrice + extrasTotal + initialCleaning;
  }

  return {
    basePrice,
    extrasTotal,
    finalPrice: Math.round(finalPrice)
  };
}
