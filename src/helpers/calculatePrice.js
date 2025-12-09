import maidData from "../data/maidServicesPrices.json";
import proData from "../data/professionalServicesPrices.json";
import carpetData from "../data/carpetCleaningPrices.json";

export function calculatePrice(cart) {
  if (!cart?.selectedService) return null;

  const {
    selectedService,
    selectedFrequency,
    condition,
    squareFootage,
    bedroomNumber,
    bathroomNumber,
    halfBathroomNumber,
    extras,
    carpetSquareFootage
  } = cart;

  const sqft = Number(squareFootage) || 0;

  let base = 0;
  let extrasTotal = 0;
  let discountAmount = 0;
  let final = 0;
  let extrasList = [];
  let additionalBlocks = [];
  let frequencyRate = 0;

  if (selectedFrequency === "Weekly") frequencyRate = 0.15;
  else if (selectedFrequency === "Bi-Weekly") frequencyRate = 0.10;
  else if (selectedFrequency === "Monthly") frequencyRate = 0.05;

  const R = (v) => Math.round(v);

  // ---------------------------------------------------------
  // MAID SERVICES (UNCHANGED)
  // ---------------------------------------------------------
  if (selectedService === "Maid Services") {
    const tier = findTier(maidData.priceTiers, sqft);
    if (!tier) return null;

    const includedBeds = tier.includedRooms.bedrooms;
    const includedBaths = tier.includedRooms.bathrooms;
    const includedHalfBaths = tier.includedRooms.halfBathrooms;
    const priceAdjust = tier.priceAdjust ?? 1;

    const extraBedrooms = Math.max(0, bedroomNumber - includedBeds);
    const extraBathrooms = Math.max(0, bathroomNumber - includedBaths);
    const extraHalfBaths = Math.max(0, halfBathroomNumber - includedHalfBaths);

    const perRoom = maidData.globalExtras;

    const pushExtra = (label, qty, unitPrice) => {
      const rounded = R(qty * unitPrice);
      extrasList.push({ name: `${label}${qty > 1 ? " ×" + qty : ""}`, price: rounded });
      extrasTotal += rounded;
    };

    if (extras.changeLinens > 0) pushExtra("Change Linens", extras.changeLinens, perRoom.changeLinensPrice);
    if (extras.furryPets) pushExtra("Furry Pets", 1, perRoom.furryPetsPrice);
    if (extras.shuttersAndBlinds > 0) pushExtra("Shutters & Blinds", extras.shuttersAndBlinds, perRoom.shuttersAndBlindsPrice);

    const roomFactor =
      sqft / 400 +
      extraBedrooms * 0.5 +
      extraBathrooms * 0.5 +
      extraHalfBaths * 0.5;

    const conditionMultiplier = 1.25;

    const rawBase =
      roomFactor *
      priceAdjust *
      conditionMultiplier *
      55;

    const roundedBase = R(rawBase);

    const rawDiscount = roundedBase * frequencyRate;
    const roundedDiscount = R(rawDiscount);

    const recurringAfterDiscount = roundedBase - roundedDiscount;

    discountAmount = roundedDiscount;

    if (condition === "bad") {
      const initialRawBase = rawBase * 2.6;
      const initialBase = R(initialRawBase);

      let initialExtrasList = [];
      let initialExtrasTotal = 0;

      const addInitialExtra = (label, price) => {
        const rounded = R(price);
        initialExtrasList.push({ name: label, price: rounded });
        initialExtrasTotal += rounded;
      };

      if (extras.insideOven) addInitialExtra("Inside Oven", perRoom.insideOvenPrice);
      if (extras.insideRefrigerator) addInitialExtra("Inside Refrigerator", perRoom.insideRefrigeratorPrice);

      const initialFinal = R(initialBase + initialExtrasTotal);

      additionalBlocks.push({
        label: "Initial Cleaning",
        base: initialBase,
        extrasList: initialExtrasList,
        final: initialFinal
      });
    }

    base = roundedBase;
    final = R(recurringAfterDiscount + extrasTotal);
  }

  // ---------------------------------------------------------
  // PROFESSIONAL SERVICES (UPDATED BAD CONDITION MULTIPLIER ONLY)
  // ---------------------------------------------------------
  if (selectedService === "Professional Services") {
    const tier = findTier(proData.priceTiers, sqft);
    if (!tier) return null;

    const includedBeds = tier.includedRooms.bedrooms;
    const includedBaths = tier.includedRooms.bathrooms;
    const includedHalfBaths = tier.includedRooms.halfBathrooms;
    const priceAdjust = tier.priceAdjust ?? 1;

    const extraBedrooms = Math.max(0, bedroomNumber - includedBeds);
    const extraBathrooms = Math.max(0, bathroomNumber - includedBaths);
    const extraHalfBaths = Math.max(0, halfBathroomNumber - includedHalfBaths);

    const perRoom = proData.globalExtras;

    const roomFactor =
      sqft / 400 +
      extraBedrooms * 0.5 +
      extraBathrooms * 0.5 +
      extraHalfBaths * 0.5;

    // NORMAL PRICE (exact same formula as before)
    const normalBase =
      roomFactor *
      priceAdjust *
      1.25 *
      55;

    // UPDATED → BAD CONDITION = normal × 2.6
    const conditionMultiplier = condition === "bad" ? 2.6 : 1;

    base = R(normalBase * conditionMultiplier);

    const extrasConfig = [
      { key: "changeLinens", label: "Change Linens", type: "count", price: perRoom.changeLinensPrice },
      { key: "furryPets", label: "Furry Pets", type: "boolean", price: perRoom.furryPetsPrice },
      { key: "shuttersAndBlinds", label: "Shutters & Blinds", type: "count", price: perRoom.shuttersAndBlindsPrice },
      { key: "insideOven", label: "Inside Oven", type: "boolean", price: perRoom.insideOvenPrice },
      { key: "insideRefrigerator", label: "Inside Refrigerator", type: "boolean", price: perRoom.insideRefrigeratorPrice }
    ];

    extrasConfig.forEach((e) => {
      const value = extras[e.key];
      if (!value) return;

      const rounded =
        e.type === "count" ? R(value * e.price) : R(e.price);

      extrasList.push({
        name: e.type === "count" ? `${e.label} ×${value}` : e.label,
        price: rounded
      });

      extrasTotal += rounded;
    });

    final = R(base + extrasTotal);
    discountAmount = 0;
  }

  // ---------------------------------------------------------
  // CARPET CLEANING (UNCHANGED)
  // ---------------------------------------------------------
  if (selectedService === "Carpet Cleaning") {
    const carpetSqft = carpetSquareFootage ?? sqft;
    if (!carpetSqft) return null;

    const rate =
      condition === "bad"
        ? carpetData.pricing.badConditionPerSqft
        : carpetData.pricing.normalConditionPerSqft;

    base = R(carpetSqft * rate);

    if (extras.deodorize) {
      const rounded = R(carpetData.extras.deodorize);
      extrasList.push({ name: "Deodorize", price: rounded });
      extrasTotal += rounded;
    }
    if (extras.stainsRemove) {
      const rounded = R(carpetData.extras.stainsRemove);
      extrasList.push({ name: "Stains Removal", price: rounded });
      extrasTotal += rounded;
    }
    if (extras.petUrineTreatment) {
      const rounded = R(carpetData.extras.petUrineTreatment);
      extrasList.push({ name: "Pet Urine Treatment", price: rounded });
      extrasTotal += rounded;
    }

    final = R(base + extrasTotal);
    discountAmount = 0;
  }

  return {
    basePrice: base,
    extrasTotal,
    finalPrice: final,
    priceBreakdown: {
      serviceName: selectedService,
      frequency: selectedFrequency,
      base,
      extrasList,
      discountAmount,
      final,
      additionalBlocks
    }
  };
}

function findTier(tiers, sqft) {
  if (!tiers || !sqft) return null;

  for (const t of tiers) {
    const [min, max] = t.sqftRange.split("-").map(Number);
    if (sqft >= min && sqft <= max) return t;
  }

  return null;
}
