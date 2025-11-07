import { createContext, useContext, useState, useEffect } from "react";
import { saveToStorage, loadFromStorage } from "../helpers/storageUtils";
import { calculateRecurringPrice } from "../helpers/recurringCalculations";

const ShoppingCartContext = createContext();

const defaultCartData = {
  zipCode: "",

  livingRoomIncluded: true,
  kitchenIncluded: true,
  dinningRoomIncluded: true,

  bedroomNumber: 1,
  bathroomNumber: 1,
  halfBathroomNumber: 0,
  otherRoomNumber: 0,

  squareFootage: null,
  hadProServices: null,

  selectedServiceType: "",
  selectedFrequency: "",

  extras: {
    changeLinens: 0,
    furryPets: false,
    dustShutters: false,
    insideOven: false,
    insideRefrigerator: false
  },

  contactInfo: {
    name: "",
    phone: "",
    email: "",
    address: ""
  },

  recurringPrice: 0,
  initialCleaningPrice: 0,
  isStepComplete: false
};

export function ShoppingCartProvider({ children }) {
  const [cartData, setCartData] = useState(
    () => loadFromStorage("cartData") || defaultCartData
  );

  useEffect(() => {
    saveToStorage("cartData", cartData);
  }, [cartData]);

  const updateCartData = (updates) =>
    setCartData((prev) => ({ ...prev, ...updates }));

  const calculateRecurringTotal = () => {
    const total = calculateRecurringPrice({
      houseSize: cartData.squareFootage,
      bedrooms: cartData.bedroomNumber,
      bathrooms: cartData.bathroomNumber,
      hadProServices: cartData.hadProServices,
      extras: cartData.extras
    });
    setCartData((prev) => ({ ...prev, recurringPrice: total }));
    return total;
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
        calculateRecurringTotal,
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
