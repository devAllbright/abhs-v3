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
    otherRoomNumber,
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

  // ---------------------------------------------------------
  // MAID SERVICES (GOOD CONDITION ALWAYS + INITIAL CLEANING)
  // ---------------------------------------------------------
  if (selectedService === "Maid Services") {
    const tier = findTier(maidData.priceTiers, sqft);
    if (!tier) return null;

    const includedBeds = tier.includedRooms.bedrooms;
    const includedBaths = tier.includedRooms.bathrooms;
    const priceAdjust = tier.priceAdjust ?? 1;

    const extraBedrooms = Math.max(0, bedroomNumber - includedBeds);
    const extraBathrooms = Math.max(0, bathroomNumber - includedBaths);
    const extraHalfBaths = Math.max(0, halfBathroomNumber);

    const perRoom = maidData.globalExtras;

    // ---------------------------
    // EXTRAS (Recurring)
    // ---------------------------
    if (extras.changeLinens > 0) {
      const price = extras.changeLinens * perRoom.changeLinensPrice;
      extrasList.push({ name: `Change Linens ×${extras.changeLinens}`, price });
      extrasTotal += price;
    }

    if (extras.furryPets) {
      extrasList.push({ name: "Furry Pets", price: perRoom.furryPetsPrice });
      extrasTotal += perRoom.furryPetsPrice;
    }

    if (extras.shuttersAndBlinds > 0) {
      const qty = extras.shuttersAndBlinds;
      const price = qty * perRoom.shuttersAndBlindsPrice;
      extrasList.push({ name: `Shutters & Blinds ×${qty}`, price });
      extrasTotal += price;
    }

    // ---------------------------------------------------------
    // GOOD CONDITION FORMULA — Updated with priceAdjust
    // ---------------------------------------------------------
    const conditionMultiplierGood = 1.25;

    const roomFactorGood =
      (sqft / 400) +
      (extraBedrooms * 0.5) +
      (extraBathrooms * 0.5) +
      (extraHalfBaths * 0.5);

    const serviceBaseBeforeDiscount =
      roomFactorGood *
      priceAdjust *                // ← NEW
      conditionMultiplierGood *
      55;

    const serviceAfterDiscount =
      serviceBaseBeforeDiscount *
      (1 - frequencyRate);

    const maidServiceFinal = serviceAfterDiscount;

    discountAmount =
      serviceBaseBeforeDiscount - serviceAfterDiscount;

    // ---------------------------------------------------------
    // INITIAL CLEANING (BAD CONDITION FORMULA WITH priceAdjust)
    // ---------------------------------------------------------
    if (condition === "bad") {
      const conditionMultiplierBad = 2.6;

      const roomFactorBad =
        (sqft / 400) +
        (extraBedrooms * 1) +
        (extraBathrooms * 1) +
        (extraHalfBaths * 1);

      const initialBase =
        roomFactorBad *
        priceAdjust *             // ← NEW
        conditionMultiplierBad *
        55;

      let initialExtrasTotal = 0;
      let initialExtrasList = [];

      if (extras.insideOven) {
        initialExtrasList.push({
          name: "Inside Oven",
          price: perRoom.insideOvenPrice
        });
        initialExtrasTotal += perRoom.insideOvenPrice;
      }

      if (extras.insideRefrigerator) {
        initialExtrasList.push({
          name: "Inside Refrigerator",
          price: perRoom.insideRefrigeratorPrice
        });
        initialExtrasTotal += perRoom.insideRefrigeratorPrice;
      }

      additionalBlocks.push({
        label: "Initial Cleaning",
        base: initialBase,
        extrasList: initialExtrasList,
        final: initialBase + initialExtrasTotal
      });
    }

    base = serviceBaseBeforeDiscount;
    final = maidServiceFinal + extrasTotal;
  }

  // ---------------------------------------------------------
  // PROFESSIONAL SERVICES (UPDATED FORMULA USING priceAdjust)
  // ---------------------------------------------------------
  if (selectedService === "Professional Services") {
    const tier = findTier(proData.priceTiers, sqft);
    if (!tier) return null;

    const includedBeds = tier.includedRooms.bedrooms;
    const includedBaths = tier.includedRooms.bathrooms;
    const priceAdjust = tier.priceAdjust ?? 1;

    const extraBedrooms = Math.max(0, bedroomNumber - includedBeds);
    const extraBathrooms = Math.max(0, bathroomNumber - includedBaths);
    const extraHalfBaths = Math.max(0, halfBathroomNumber);

    const multiplier = condition === "bad" ? 2.6 : 1.25;

    const factor =
      sqft / 400 +
      extraBedrooms * 0.5 +
      extraBathrooms * 0.5 +
      extraHalfBaths * 0.5;

    base =
      factor *
      priceAdjust *          // ← NEW
      multiplier *
      55;

    const perRoom = proData.globalExtras;

    // -----------------------------
    // EXTRAS
    // -----------------------------
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

      if (e.type === "count" && value > 0) {
        const total = value * e.price;
        extrasList.push({ name: `${e.label} ×${value}`, price: total });
        extrasTotal += total;
      }

      if (e.type === "boolean" && value === true) {
        extrasList.push({ name: e.label, price: e.price });
        extrasTotal += e.price;
      }
    });

    final = base + extrasTotal;
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

    base = carpetSqft * rate;

    if (extras.deodorize) {
      extrasList.push({ name: "Deodorize", price: carpetData.extras.deodorize });
      extrasTotal += carpetData.extras.deodorize;
    }
    if (extras.stainsRemove) {
      extrasList.push({ name: "Stains Removal", price: carpetData.extras.stainsRemove });
      extrasTotal += carpetData.extras.stainsRemove;
    }
    if (extras.petUrineTreatment) {
      extrasList.push({
        name: "Pet Urine Treatment",
        price: carpetData.extras.petUrineTreatment
      });
      extrasTotal += carpetData.extras.petUrineTreatment;
    }

    final = base + extrasTotal;
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

// ---------------------------------------------------------
function findTier(tiers, sqft) {
  if (!tiers || !sqft) return null;

  for (const t of tiers) {
    const [min, max] = t.sqftRange.split("-").map(Number);
    if (sqft >= min && sqft <= max) return t;
  }

  return null;
}
