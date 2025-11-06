import { useState, useEffect } from "react";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import recurringPrices from "../../../data/recurringPrices.json";
import "../../../styles/pricing/shopping-cart/scroll-steps/customize-service.css";

export default function CustomizeService() {
  const { cartData, updateCartData } = useShoppingCart();
  const { extras = {}, hadProServices } = cartData;
  const extrasList = recurringPrices.globalExtras;

  const [linenCount, setLinenCount] = useState(extras.linens || 0);

  useEffect(() => {
    updateCartData({
      extras: { ...extras, linens: linenCount }
    });
  }, [linenCount]);

  const toggleExtra = (key) => {
    updateCartData({
      extras: { ...extras, [key]: !extras[key] }
    });
  };

  const incrementLinen = () => {
    if (linenCount < 10) setLinenCount((prev) => prev + 1);
  };

  const decrementLinen = () => {
    if (linenCount > 0) setLinenCount((prev) => prev - 1);
  };

  const formattedExtras = hadProServices
    ? [
        { id: "shutterAndBlinds", name: "Shutters & Blinds", price: extrasList.shuttersAndBlindsPrice, type: "toggle" },
        { id: "furryPets", name: "Furry Pets", price: extrasList.furryPetsPrice, type: "toggle" },
        { id: "changeLinens", name: "Change Linens", price: extrasList.changeLinensPrice, type: "counter" }
      ]
    : [
        { id: "furryPets", name: "Furry Pets", price: extrasList.furryPetsPrice, type: "toggle" },
        { id: "insideOven", name: "Inside Oven", price: extrasList.insideOvenPrice, type: "toggle" },
        { id: "insideRefrigerator", name: "Inside Refrigerator", price: extrasList.insideRefrigeratorPrice, type: "toggle" }
      ];

  return (
    <div className="scroll-customize-service">
      <div className="scroll-title">
        <p>2. Add-ons</p>
      </div>

      <div className="extras-container">
        {formattedExtras.map((extra) => (
          <div key={extra.id} className="extra-element-wrapper">
            {extra.type === "toggle" ? (
              <button
                className={`extra-element ${extras[extra.id] ? "active-extra" : ""}`}
                onClick={() => toggleExtra(extra.id)}
              >
                <div className="extra-name">
                  <p>
                    {extra.name} (+${extra.price})
                  </p>
                </div>
              </button>
            ) : (
              <div
                className={`extra-element ${linenCount > 0 ? "active-extra" : ""}`}
              >
                <div className="extra-name linen-name">
                  <p>{extra.name} (+${extra.price} each)</p>
                </div>
                <div className="linen-counter">
                  <button
                    className="linen-btn"
                    onClick={decrementLinen}
                    disabled={linenCount <= 0}
                  >
                    -
                  </button>
                  <span className="linen-value">{linenCount}</span>
                  <button
                    className="linen-btn"
                    onClick={incrementLinen}
                    disabled={linenCount >= 10}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
