import data from "../data/carpetPrices.json";

export function calculateCarpetPrice(formData) {
  const {
    houseSize = 0,
    condition = "normal",
    extras = {}
  } = formData;

  const { minimum, normalConditionPerSqft, badConditionPerSqft } =
    data.pricing;

  const sqftRate =
    condition === "bad" ? badConditionPerSqft : normalConditionPerSqft;

  let basePrice = minimum + houseSize * sqftRate;

  const extrasData = data.extras;
  let extrasTotal = 0;

  if (extras.deodorize) extrasTotal += extrasData.deodorize;
  if (extras.stainsRemove) extrasTotal += extrasData.stainsRemove;
  if (extras.petUrineTreatment) extrasTotal += extrasData.petUrineTreatment;

  const finalPrice = basePrice + extrasTotal;

  return {
    basePrice: Math.round(basePrice),
    extrasTotal,
    finalPrice: Math.round(finalPrice)
  };
}
