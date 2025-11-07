import { useState, useEffect } from "react";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import recurringPrices from "../../../data/recurringPrices.json";
import "../../../styles/pricing/shopping-cart/scroll-steps/customize-service.css";

export default function CustomizeService() {
  const { cartData, updateCartData } = useShoppingCart();
  const extras = cartData.extras || {};
  const hadProServices = cartData.hadProServices;
  const extrasList = recurringPrices.globalExtras;

  const [linensCount, setLinensCount] = useState(extras.changeLinens || 0);

  useEffect(() => {
    if (extras.changeLinens !== linensCount) {
      updateCartData({
        extras: { ...extras, changeLinens: linensCount }
      });
    }
  }, [linensCount]);

  const toggleExtra = (key) => {
    updateCartData({
      extras: { ...extras, [key]: !extras[key] }
    });
  };

  const handleLinensChange = (increment) => {
    const next = Math.min(10, Math.max(0, linensCount + increment));
    setLinensCount(next);
  };

  const isDisabled =
    !cartData.selectedServiceType ||
    !cartData.selectedFrequency ||
    !cartData.squareFootage;

  const activeExtras = hadProServices
    ? [
        {
          id: "dustShutters",
          name: "Shutters & Blinds",
          price: extrasList.dustShuttersPrice
        },
        {
          id: "furryPets",
          name: "Pet Fee",
          price: extrasList.furryPetsPrice
        },
        {
          id: "changeLinens",
          name: "Change Linens",
          price: extrasList.changeLinensPrice,
          isCounter: true
        }
      ]
    : [
        {
          id: "furryPets",
          name: "Pet Fee",
          price: extrasList.furryPetsPrice
        },
        {
          id: "insideOven",
          name: "Oven Cleaning",
          price: extrasList.insideOvenPrice
        },
        {
          id: "insideRefrigerator",
          name: "Refrigerator Cleaning",
          price: extrasList.insideRefrigeratorPrice
        }
      ];

  return (
    <div className="scroll-customize-service">
      <div className="scroll-title">
        <p>2. Add-ons</p>
      </div>

      <div className="extras-container">
        {activeExtras.map((extra) =>
          extra.isCounter ? (
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
          ) : (
            <button
              key={extra.id}
              className={`extra-element ${
                extras[extra.id] ? "active-extra" : ""
              }`}
              onClick={() => !isDisabled && toggleExtra(extra.id)}
              disabled={isDisabled}
            >
              <div className="extra-name">
                <p>
                  {extra.name} (+${extra.price})
                </p>
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
}
