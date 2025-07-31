import { createContext, useContext, useState, useEffect } from "react";

export const ShoppingCartContext = createContext();

function ShoppingCartProvider({ children }) {
  const [activeServices, setActiveServices] = useState([]);
  const [activeExtras, setActiveExtras] = useState({});
  const [initialCleaning, setInitialCleaning] = useState(null);
  const [frequencyDiscount, setFrequencyDiscount] = useState(0);
  const [bundleDiscount, setBundleDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const services = {
    recurringServices: {
      houseCleaning: {
        price: 250,
        frequencies: {
          weekly: 20,
          biWeekly: 15,
          monthly: 10,
        },
        extras: [
          { id: "furryPets", name: "Furry Pets", price: 10, img: "/shopping-cart/extra-pets.png" },
          { id: "changeLinens", name: "Change Linens", price: 15, img: "/shopping-cart/extra-linens.png" },
          { id: "woodFloors", name: "Wood Floors", price: 20, img: "/shopping-cart/extra-floors.png" },
          { id: "insideRefrigerator", name: "Inside the Fridge", price: 25, img: "/shopping-cart/extra-refrigerator.png" },
          { id: "insideOven", name: "Inside the Oven", price: 30, img: "/shopping-cart/extra-oven.png" },
        ],
      },
      initialCleaning: {
        price: 200,
        name: "Initial Cleaning",
      },
    },
    oneTimeServices: {
      OneTimeFreshenUp: {
        price: 250,
        extras: [
          { id: "furryPets", name: "Furry Pets", price: 10, img: "/shopping-cart/extra-pets.png" },
          { id: "changeLinens", name: "Change Linens", price: 15, img: "/shopping-cart/extra-linens.png" },
          { id: "woodFloors", name: "Wood Floors", price: 20, img: "/shopping-cart/extra-floors.png" },
          { id: "insideRefrigerator", name: "Inside the Fridge", price: 25, img: "/shopping-cart/extra-refrigerator.png" },
          { id: "insideOven", name: "Inside the Oven", price: 30, img: "/shopping-cart/extra-oven.png" },
        ],
      },
      DeepCleaning: { price: 150 },
      CarpetCleaning: {
        price: 130,
        extras: [
          { id: "deodorize", name: "Deodorize", price: 10, img: "/shopping-cart/extra-deodorize.png" },
          { id: "stainsRemoval", name: "Stains Removal", price: 15, img: "/shopping-cart/extra-stain.png" },
          { id: "petUrineTreatment", name: "Pet Urine Treatment", price: 20, img: "/shopping-cart/extra-urine.png" },
          { id: "stairs", name: "Stairs", price: 25, img: "/shopping-cart/extra-stairs.png" },
        ],
      },
      WindowWashing: {
        price: 120,
        extras: [
          { id: "screensWash", name: "Screens Wash", price: 10, img: "/shopping-cart/extra-screens.png" },
          { id: "metalFramesRestoration", name: "Metal Frames Restoration", price: 15, img: "/shopping-cart/extra-frames.png" },
        ],
      },
    },
    bundleDiscounts: [
      { id: "fullBundle", includes: ["DeepCleaning", "CarpetCleaning", "WindowWashing"], discount: 100 },
      { id: "carpetBundle", includes: ["DeepCleaning", "CarpetCleaning"], discount: 75 },
      { id: "windowBundle", includes: ["DeepCleaning", "WindowWashing"], discount: 75 },
      { id: "carpetsAndWindows", includes: ["CarpetCleaning", "WindowWashing"], discount: 50 },
    ],
  };

  const addService = (service) => {
    setActiveServices((prev) => {
      const existingService = prev.find((s) => s.id === service.id);
      if (existingService) {
        return prev.map((s) =>
          s.id === service.id ? { ...s, frequency: service.frequency, discount: service.discount } : s
        );
      }
      return [...prev, service];
    });

    if (service.discount) {
      setFrequencyDiscount((service.price * service.discount) / 100);
    }
  };

  const removeService = (serviceId) => {
    setActiveServices((prev) => prev.filter((s) => s.id !== serviceId));
    removeAllExtras(serviceId);

    if (serviceId === "houseCleaning") {
      setInitialCleaning(null);
      setFrequencyDiscount(0);
    }
  };

  const addExtra = (serviceId, extra) => {
    setActiveExtras((prev) => {
      const existingExtras = prev[serviceId] || [];
      const alreadyExists = existingExtras.some((e) => e.id === extra.id);
      if (alreadyExists) return prev;

      return {
        ...prev,
        [serviceId]: [...existingExtras, extra],
      };
    });
  };

  const removeExtra = (serviceId, extraName) => {
    setActiveExtras((prev) => {
      const updated = {
        ...prev,
        [serviceId]: (prev[serviceId] || []).filter((e) => e.name !== extraName),
      };
      return updated;
    });
  };

  const removeAllExtras = (serviceId) => {
    setActiveExtras((prev) => {
      const updated = { ...prev };
      delete updated[serviceId];
      return updated;
    });
  };

  useEffect(() => {
    const homeDetails = JSON.parse(sessionStorage.getItem("homeDetails") || "{}");
    const isHouseCleaningActive = activeServices.some((s) => s.id === "houseCleaning");

    if (isHouseCleaningActive && homeDetails.condition === "NO") {
      setInitialCleaning(services.recurringServices.initialCleaning);
    } else {
      setInitialCleaning(null);
    }
  }, [activeServices]);

  useEffect(() => {
    let appliedBundleDiscount = 0;
    const selectedServiceIds = activeServices.map((s) => s.id);

    services.bundleDiscounts.forEach((bundle) => {
      if (bundle.includes.every((id) => selectedServiceIds.includes(id))) {
        appliedBundleDiscount = Math.max(appliedBundleDiscount, bundle.discount);
      }
    });

    setBundleDiscount(appliedBundleDiscount);
  }, [activeServices]);

  useEffect(() => {
    let subtotal = activeServices.reduce((sum, service) => sum + service.price, 0);

    Object.values(activeExtras).forEach((extras) => {
      subtotal += extras.reduce((sum, extra) => sum + extra.price, 0);
    });

    subtotal -= bundleDiscount;
    subtotal -= frequencyDiscount;

    if (initialCleaning) {
      subtotal += initialCleaning.price;
    }

    setTotalPrice(subtotal);

    sessionStorage.setItem(
      "orderSummary",
      JSON.stringify({
        activeServices,
        activeExtras,
        initialCleaning,
        frequencyDiscount,
        bundleDiscount,
        totalPrice: subtotal,
      })
    );
  }, [activeServices, activeExtras, initialCleaning, bundleDiscount, frequencyDiscount]);

  return (
    <ShoppingCartContext.Provider
      value={{
        services,
        activeServices,
        addService,
        removeService,
        activeExtras,
        addExtra,
        removeExtra,
        removeAllExtras,
        initialCleaning,
        frequencyDiscount,
        setFrequencyDiscount,
        bundleDiscount,
        totalPrice,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}

function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export { ShoppingCartProvider, useShoppingCart };
export default ShoppingCartProvider;
