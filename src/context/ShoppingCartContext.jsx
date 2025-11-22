import { createContext, useContext, useState, useEffect } from "react";
import { saveToStorage, loadFromStorage } from "../helpers/storageUtils";
import { calculatePrice } from "../helpers/calculatePrice";

const ShoppingCartContext = createContext();

const defaultCartData = {
  zipCode: "",
  selectedService: "",
  selectedFrequency: "",
  condition: "normal",
  squareFootage: null,
  carpetSquareFootage: 0,
  bedroomNumber: 1,
  bathroomNumber: 1,
  halfBathroomNumber: 0,
  otherRoomNumber: 0,
  hadProServices: null,
  extras: {
    changeLinens: 0,
    furryPets: false,
    shuttersAndBlinds: 0,
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
  priceBreakdown: null,
  discount: 0,
  isStepComplete: false
};

function setByPath(obj, path, value) {
  const keys = path.split(".");
  const newObj = { ...obj };
  let current = newObj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...(current[key] || {}) };
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return newObj;
}

function withRecomputedTotals(cart) {
  const result = calculatePrice(cart) || {};
  const {
    basePrice = 0,
    extrasTotal = 0,
    finalPrice = 0,
    priceBreakdown = null
  } = result;
  return {
    ...cart,
    basePrice,
    extrasTotal,
    finalPrice,
    priceBreakdown
  };
}

function buildInitialCart() {
  const stored = loadFromStorage("cartData");
  const base = stored ? { ...defaultCartData, ...stored } : defaultCartData;
  return withRecomputedTotals(base);
}

export function ShoppingCartProvider({ children }) {
  const [cartData, setCartData] = useState(buildInitialCart);

  useEffect(() => {
    saveToStorage("cartData", cartData);
  }, [cartData]);

  const updateCartData = (updatesOrPath, value) => {
    setCartData((prev) => {
      let draft = { ...prev };
      if (typeof updatesOrPath === "string") {
        draft = setByPath(draft, updatesOrPath, value);
        return withRecomputedTotals(draft);
      }
      if (updatesOrPath && typeof updatesOrPath === "object") {
        const { extras: ex, contactInfo: ci, ...rest } = updatesOrPath;
        if (ex) draft.extras = { ...draft.extras, ...ex };
        if (ci) draft.contactInfo = { ...draft.contactInfo, ...ci };
        draft = { ...draft, ...rest };
        return withRecomputedTotals(draft);
      }
      return prev;
    });
  };

  const calculateTotal = () => {
    setCartData((prev) => withRecomputedTotals({ ...prev }));
  };

  const resetCart = () => {
    const reset = withRecomputedTotals({ ...defaultCartData });
    setCartData(reset);
    saveToStorage("cartData", reset);
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
