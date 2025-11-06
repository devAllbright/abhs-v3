import { createContext, useContext, useState, useEffect } from "react";
import { saveToStorage, loadFromStorage } from "../helpers/storageUtils";
import { calculateRecurringPrice } from "../helpers/recurringCalculations";

const ShoppingCartContext = createContext();

export function ShoppingCartProvider({ children }) {
  const [cartData, setCartData] = useState(() =>
    loadFromStorage("cartData") || {
      zipCode: "",

      livingRoomIncluded: false,
      kitchenIncluded: false,
      dinningRoomIncluded: false,

      bedroomNumber: 0,
      bathroomNumber: 0,
      halfBathroomNumber: 0,
      otherRoomNumber: 0,

      squareFootage: null,
      hadProServices: null,

      selectedServiceType: "",
      selectedFrequency: "",

      extras: {
        linens: false,
        pets: false,
        shutters: false,
        oven: false,
        refrigerator: false
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
    }
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
    const reset = {
      zipCode: "",

      livingRoomIncluded: false,
      kitchenIncluded: false,
      dinningRoomIncluded: false,
      bedroomNumber: 0,
      bathroomNumber: 0,
      halfBathroomNumber: 0,
      otherRoomNumber: 0,
      squareFootage: null,
      hadProServices: null,
      selectedServiceType: "",
      selectedFrequency: "",
      extras: {
        linens: false,
        pets: false,
        shutters: false,
        oven: false,
        refrigerator: false
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
    setCartData(reset);
    saveToStorage("cartData", reset);
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
