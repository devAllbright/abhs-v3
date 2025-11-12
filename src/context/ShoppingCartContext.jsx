import { createContext, useContext, useState, useEffect } from "react";
import {
  saveToStorage,
  loadFromStorage
} from "../helpers/storageUtils";
import {
  calculateRecurringPrice,
  calculateOneTimePrice,
  calculateCarpetPrice
} from "../helpers";

const ShoppingCartContext = createContext();

const defaultCartData = {
  // --- General Info ---
  zipCode: "",
  selectedServiceType: "", // recurringMaids | oneTimeMaids | carpetCleaning
  selectedService: "", // human-readable name (e.g., "Maid Services")
  selectedFrequency: "", // weekly, biweekly, etc.
  condition: "normal", // only for oneTime & carpet

  // --- Property Info ---
  squareFootage: null,
  bedroomNumber: 1,
  bathroomNumber: 1,
  halfBathroomNumber: 0,
  otherRoomNumber: 0,

  // --- Cleaning Type ---
  hadProServices: null, // recurring only

  // --- Extras ---
  extras: {
    changeLinens: 0,
    furryPets: false,
    shuttersAndBlinds: false,
    insideOven: false,
    insideRefrigerator: false,
    deodorize: false,
    stainsRemove: false,
    petUrineTreatment: false
  },

  // --- Contact Info ---
  contactInfo: {
    name: "",
    phone: "",
    email: "",
    address: ""
  },

  // --- Prices ---
  basePrice: 0,
  extrasTotal: 0,
  finalPrice: 0,

  // --- UI Control ---
  isStepComplete: false
};

export function ShoppingCartProvider({ children }) {
  const [cartData, setCartData] = useState(
    () => loadFromStorage("cartData") || defaultCartData
  );

  // --- Keep sessionStorage in sync ---
  useEffect(() => {
    saveToStorage("cartData", cartData);
  }, [cartData]);

  // --- Core Update Function ---
  const updateCartData = (updates) =>
    setCartData((prev) => ({ ...prev, ...updates }));

  // --- Centralized Price Calculation Logic ---
  const calculateTotal = () => {
    const { selectedServiceType } = cartData;

    if (!selectedServiceType) return;

    let pricingFn;
    switch (selectedServiceType) {
      case "recurringMaids":
        pricingFn = calculateRecurringPrice;
        break;
      case "oneTimeMaids":
        pricingFn = calculateOneTimePrice;
        break;
      case "carpetCleaning":
        pricingFn = calculateCarpetPrice;
        break;
      default:
        return;
    }

    const { basePrice, extrasTotal, finalPrice } = pricingFn(cartData);

    setCartData((prev) => ({
      ...prev,
      basePrice,
      extrasTotal,
      finalPrice
    }));

    return { basePrice, extrasTotal, finalPrice };
  };

  // --- Resets Entire Cart ---
  const resetCart = () => {
    setCartData(defaultCartData);
    saveToStorage("cartData", defaultCartData);
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        cartData,
        updateCartData,
        calculateTotal,
        resetCart
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}
