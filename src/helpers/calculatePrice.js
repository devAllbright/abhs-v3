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
    extras
  } = cart;

  // Normalize sqft (convert "800-1000" → 1000)
  const normalizedSqft = normalizeSqft(squareFootage);

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
  // MAID SERVICES
  // ---------------------------------------------------------
  if (selectedService === "Maid Services") {
    const tier = findTier(maidData.priceTiers, normalizedSqft);
    if (!tier) {
      return null;
    }

    const includedBeds = tier.includedRooms.bedrooms;
    const includedBaths = tier.includedRooms.bathrooms;

    const extraBedrooms = Math.max(0, bedroomNumber - includedBeds);
    const extraBathrooms = Math.max(0, bathroomNumber - includedBaths);
    const extraHalfBaths = Math.max(0, halfBathroomNumber);
    const extraOther = Math.max(0, otherRoomNumber);

    base = tier.minimum;

    const perRoom = maidData.globalExtras;

    const roomExtras = [
      { name: "Extra Bedroom", qty: extraBedrooms, price: perRoom.bedroomPrice },
      { name: "Extra Bathroom", qty: extraBathrooms, price: perRoom.bathroomPrice },
      { name: "Extra Half Bathroom", qty: extraHalfBaths, price: perRoom.halfBathroomPrice },
      { name: "Extra Other Room", qty: extraOther, price: perRoom.halfBathroomPrice }
    ];

    roomExtras.forEach((r) => {
      if (r.qty > 0) {
        const subtotal = r.qty * r.price;
        extrasList.push({ name: `${r.name} ×${r.qty}`, price: subtotal });
        extrasTotal += subtotal;
      }
    });

    if (extras.changeLinens > 0) {
      const price = extras.changeLinens * perRoom.changeLinensPrice;
      extrasList.push({ name: `Change Linens ×${extras.changeLinens}`, price });
      extrasTotal += price;
    }

    if (extras.furryPets) {
      extrasList.push({ name: "Furry Pets", price: perRoom.furryPetsPrice });
      extrasTotal += perRoom.furryPetsPrice;
    }

    if (extras.shuttersAndBlinds) {
      extrasList.push({ name: "Shutters & Blinds", price: perRoom.shuttersAndBlindsPrice });
      extrasTotal += perRoom.shuttersAndBlindsPrice;
    }

    // INITIAL CLEANING SECTION (if applicable)
    if (condition === "bad") {
      const initialBase = tier.initialCleaning;
      let initialExtrasTotal = 0;
      let initialExtrasList = [];

      if (extras.insideOven) {
        initialExtrasList.push({ name: "Inside Oven", price: perRoom.insideOvenPrice });
        initialExtrasTotal += perRoom.insideOvenPrice;
      }

      if (extras.insideRefrigerator) {
        initialExtrasList.push({
          name: "Inside Refrigerator",
          price: perRoom.insideRefrigeratorPrice
        });
        initialExtrasTotal += perRoom.insideRefrigeratorPrice;
      }

      const initialFinal = initialBase + initialExtrasTotal;

      additionalBlocks.push({
        label: "Initial Cleaning",
        base: initialBase,
        extrasList: initialExtrasList,
        final: initialFinal
      });
    }

    const subtotal = base + extrasTotal;
    discountAmount = subtotal * frequencyRate;
    final = subtotal - discountAmount;
  }

  // ---------------------------------------------------------
  // PROFESSIONAL SERVICES
  // ---------------------------------------------------------
  if (selectedService === "Professional Services") {
    const tier = findTier(proData.priceTiers, normalizedSqft);
    if (!tier) {
      return null;
    }

    base = condition === "bad" ? tier.badCondition : tier.minimum;

    const perRoom = proData.globalExtras;

    const extrasConfig = [
      { key: "changeLinens", label: "Change Linens", price: perRoom.changeLinensPrice },
      { key: "furryPets", label: "Furry Pets", price: perRoom.furryPetsPrice },
      { key: "shuttersAndBlinds", label: "Shutters & Blinds", price: perRoom.shuttersAndBlindsPrice },
      { key: "insideOven", label: "Inside Oven", price: perRoom.insideOvenPrice },
      { key: "insideRefrigerator", label: "Inside Refrigerator", price: perRoom.insideRefrigeratorPrice }
    ];

    extrasConfig.forEach((e) => {
      const value = extras[e.key];

      if (!value) return;

      if (typeof value === "number") {
        if (value > 0) {
          const total = value * e.price;
          extrasList.push({ name: `${e.label} ×${value}`, price: total });
          extrasTotal += total;
        }
      } else if (value === true) {
        extrasList.push({ name: e.label, price: e.price });
        extrasTotal += e.price;
      }
    });

    const subtotal = base + extrasTotal;
    discountAmount = subtotal * frequencyRate;
    final = subtotal - discountAmount;
  }

  // ---------------------------------------------------------
  // CARPET CLEANING
  // ---------------------------------------------------------
  if (selectedService === "Carpet Cleaning") {
    if (!normalizedSqft) {
      return null;
    }

    const rate = condition === "bad"
      ? carpetData.pricing.badConditionPerSqft
      : carpetData.pricing.normalConditionPerSqft;

    base = normalizedSqft * rate;

    const carpetExtras = carpetData.extras;

    if (extras.deodorize) {
      extrasList.push({ name: "Deodorize", price: carpetExtras.deodorize });
      extrasTotal += carpetExtras.deodorize;
    }
    if (extras.stainsRemove) {
      extrasList.push({ name: "Stains Removal", price: carpetExtras.stainsRemove });
      extrasTotal += carpetExtras.stainsRemove;
    }
    if (extras.petUrineTreatment) {
      extrasList.push({ name: "Pet Urine Treatment", price: carpetExtras.petUrineTreatment });
      extrasTotal += carpetExtras.petUrineTreatment;
    }

    final = base + extrasTotal;
    discountAmount = 0;
  }

  // ---------------------------------------------------------
  // RESULT (with log)
  // ---------------------------------------------------------
  const result = {
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

  return result;
}

// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------

function normalizeSqft(sqft) {
  if (!sqft) return null;

  if (typeof sqft === "number") return sqft;

  if (typeof sqft === "string" && sqft.includes("-")) {
    const parts = sqft.split("-");
    const max = Number(parts[1]);
    return isNaN(max) ? null : max;
  }

  const numeric = Number(sqft);
  return isNaN(numeric) ? null : numeric;
}

function findTier(tiers, sqft) {
  if (!tiers || !sqft) return null;

  for (const t of tiers) {
    const [min, max] = t.sqftRange.split("-").map(Number);
    if (sqft >= min && sqft <= max) return t;
  }

  return null;
}
