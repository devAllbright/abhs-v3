import { createContext, useContext, useState, useEffect } from "react";
import { saveToStorage, loadFromStorage } from "../helpers/storageUtils";
import {
  calculateRecurringPrice,
  calculateOneTimePrice,
  calculateCarpetPrice
} from "../helpers";

const ShoppingCartContext = createContext();

const defaultCartData = {
  zipCode: "",
  selectedService: "",
  selectedFrequency: "",
  condition: "normal",

  squareFootage: null,
  bedroomNumber: 1,
  bathroomNumber: 1,
  halfBathroomNumber: 0,
  otherRoomNumber: 0,

  hadProServices: null,

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

  contactInfo: {
    name: "",
    phone: "",
    email: "",
    address: ""
  },

  basePrice: 0,
  extrasTotal: 0,
  finalPrice: 0,

  isStepComplete: false
};

export function ShoppingCartProvider({ children }) {
  const [cartData, setCartData] = useState(() => {
    const stored = loadFromStorage("cartData");
    return stored ? { ...defaultCartData, ...stored } : defaultCartData;
  });

  useEffect(() => {
    saveToStorage("cartData", cartData);
  }, [cartData]);

  const updateCartData = (updates) =>
    setCartData((prev) => ({ ...prev, ...updates }));

  const calculateTotal = () => {
    const { selectedService } = cartData;
    if (!selectedService) return;

    const normalized = {
      houseSize: cartData.squareFootage ?? 0,
      bedrooms: cartData.bedroomNumber ?? 0,
      bathrooms: cartData.bathroomNumber ?? 0,
      condition: cartData.condition,
      extras: cartData.extras || {},
      selectedFrequency: cartData.selectedFrequency,
      hadProServices: cartData.hadProServices ?? false
    };

    let pricingFn;
    switch (selectedService) {
      case "Maid Services":
        pricingFn = calculateRecurringPrice;
        break;
      case "Professional Services":
        pricingFn = calculateOneTimePrice;
        break;
      case "Carpet Cleaning":
        pricingFn = calculateCarpetPrice;
        break;
      default:
        return;
    }

    const { basePrice, extrasTotal, finalPrice } = pricingFn(normalized);

    setCartData((prev) => ({
      ...prev,
      basePrice,
      extrasTotal,
      finalPrice
    }));

    return { basePrice, extrasTotal, finalPrice };
  };

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
