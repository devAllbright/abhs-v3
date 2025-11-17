import data from "../data/professionalServicesPrices.json";
import { getTierBySqft } from "./getTierBySqft";

export function calculateOneTimePrice(formData) {
  const {
    houseSize = 0,
    bedrooms = 0,
    bathrooms = 0,
    condition = "normal",
    extras = {}
  } = formData;

  const tier = getTierBySqft(data, houseSize);
  if (!tier) return { basePrice: 0, extrasTotal: 0, finalPrice: 0 };

  const { includedRooms, minimum, badCondition } = tier;
  const global = data.globalExtras;

  let basePrice = condition === "bad" ? badCondition : minimum;
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

  const finalPrice = basePrice + extrasTotal;

  return {
    basePrice,
    extrasTotal,
    finalPrice: Math.round(finalPrice)
  };
}
