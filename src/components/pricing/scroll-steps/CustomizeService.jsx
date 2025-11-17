import { useState, useEffect } from "react";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import recurringPrices from "../../../data/maidServicesPrices.json";
import oneTimePrices from "../../../data/professionalServicesPrices.json";
import carpetPrices from "../../../data/carpetCleaningPrices.json";

import "../../../styles/pricing/shopping-cart/scroll-steps/customize-service.css";

export default function CustomizeService() {
  const { cartData, updateCartData } = useShoppingCart();
  const { extras = {}, hadProServices, selectedServiceType } = cartData;

  const [linensCount, setLinensCount] = useState(extras.changeLinens || 0);

  useEffect(() => {
    if (extras.changeLinens !== linensCount) {
      updateCartData({
        extras: { ...extras, changeLinens: linensCount },
      });
    }
  }, [linensCount]);

  const serviceMap = {
    recurringMaids: recurringPrices,
    oneTimeMaids: oneTimePrices,
    carpetCleaning: carpetPrices,
  };

  const currentService = serviceMap[selectedServiceType] || {};
  const extrasList = currentService.globalExtras || currentService.extras || {};

  // Maid extras
  const maidExtras = [
    {
      id: "changeLinens",
      name: "Change Linens",
      price: extrasList.changeLinensPrice,
      isCounter: true,
    },
    {
      id: "shuttersAndBlinds",
      name: "Shutters & Blinds",
      price: extrasList.shuttersAndBlindsPrice,
    },
    {
      id: "furryPets",
      name: "Pet Fee",
      price: extrasList.furryPetsPrice,
    },
  ].filter((e) => e.price);

  // Initial cleaning extras
  const initialCleaningExtras = [
    {
      id: "insideOven",
      name: "Oven Cleaning",
      price: extrasList.insideOvenPrice,
    },
    {
      id: "insideRefrigerator",
      name: "Refrigerator Cleaning",
      price: extrasList.insideRefrigeratorPrice,
    },
  ].filter((e) => e.price);

  // Carpet extras
  const carpetExtras = [
    { id: "deodorize", name: "Deodorize", price: extrasList.deodorize },
    { id: "stainsRemove", name: "Stains Removal", price: extrasList.stainsRemove },
    { id: "petUrineTreatment", name: "Pet Urine Treatment", price: extrasList.petUrineTreatment },
  ].filter((e) => e.price);

  const toggleExtra = (key) => {
    updateCartData({
      extras: { ...extras, [key]: !extras[key] },
    });
  };

  const handleLinensChange = (increment) => {
    const next = Math.min(10, Math.max(0, linensCount + increment));
    setLinensCount(next);
  };

  const isDisabled =
    !selectedServiceType ||
    (selectedServiceType !== "carpetCleaning" &&
      (!cartData.selectedFrequency || !cartData.squareFootage));

  const renderExtraButton = (extra) => {
    const active = !!extras[extra.id];
    if (extra.isCounter) {
      return (
        <div
          key={extra.id}
          className={`extra-element counter-element ${
            linensCount > 0 ? "active-extra" : ""
          }`}
        >
          <div className="extra-name">
            <p>
              {extra.name} (+${extra.price} each)
            </p>
          </div>
          <div className="counter-controls">
            <button
              onClick={() => !isDisabled && handleLinensChange(-1)}
              disabled={isDisabled || linensCount === 0}
            >
              -
            </button>
            <span>{linensCount}</span>
            <button
              onClick={() => !isDisabled && handleLinensChange(1)}
              disabled={isDisabled || linensCount >= 10}
            >
              +
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        key={extra.id}
        className={`extra-element ${active ? "active-extra" : ""}`}
        onClick={() => !isDisabled && toggleExtra(extra.id)}
        disabled={isDisabled}
      >
        <div className="extra-name">
          <p>
            {extra.name} (+${extra.price})
          </p>
        </div>
      </button>
    );
  };

  // ------------------------------
  // Render logic
  // ------------------------------
  const showCarpet = selectedServiceType === "carpetCleaning";
  const showMaid = selectedServiceType === "recurringMaids" || selectedServiceType === "oneTimeMaids";

  return (
    <div className="scroll-customize-service">
      {/* 🧩 Maid / One-time services */}
      {showMaid && (
        <>
          <div className="scroll-title">
            <p>2. Customize your Maid Service</p>
          </div>

          <div className="extras-container">
            {maidExtras.map(renderExtraButton)}
          </div>

          {/* Duplicate only if initial cleaning extras exist and hadProServices is false */}
          {!hadProServices && initialCleaningExtras.length > 0 && (
            <>
              <div className="scroll-title second-extras-title">
                <p>3. Customize your Initial Cleaning Service</p>
              </div>

              <div className="extras-container">
                {initialCleaningExtras.map(renderExtraButton)}
              </div>
            </>
          )}
        </>
      )}

      {/* 🧩 Carpet cleaning */}
      {showCarpet && (
        <>
          <div className="scroll-title">
            <p>2. Customize your Carpet Cleaning Service</p>
          </div>

          <div className="extras-container">
            {carpetExtras.map(renderExtraButton)}
          </div>
        </>
      )}
    </div>
  );
}
