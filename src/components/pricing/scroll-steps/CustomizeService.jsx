import { useShoppingCart } from "../../../context/ShoppingCartContext";
import extrasConfig from "../../../data/extrasConfig.json";
import "../../../styles/pricing/shopping-cart/scroll-steps/customize-service.css";

function ExtrasSection({ title, extrasMap, extrasState, onToggle, onCount }) {
  return (
    <div className="scroll-customize-service">
      <div className="scroll-title">
        <p>{title}</p>
      </div>

      <div className="extras-container">
        {Object.entries(extrasMap).map(([key, def]) => {
          const { label, img, type } = def;
          const value = extrasState[key];
          const isActive =
            type === "boolean" ? value === true : (value || 0) > 0;

          const isCounter = type === "count";

          return (
            <div
              key={key}
              className={`extra-element ${isActive ? "active-extra" : ""}`}
              onClick={() => {
                if (!isCounter) onToggle(key, type);
              }}
            >
              <div className="extra-img">
                <img src={`/shopping-cart/${img}`} alt={label} />
              </div>

              <div className="extra-name">
                <span className="extra-name__label">{label}</span>

                {isCounter && (
                  <div className="extra-counter-wrapper">
                    <img
                      src={
                        value === 0
                          ? "/shopping-cart/colored-remove.png"
                          : "/shopping-cart/remove.png"
                      }
                      alt="Decrease"
                      className="counter-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCount(key, -1);
                      }}
                    />

                    <span className="counter-value">{value || 0}</span>

                    <img
                      src={
                        value === 0
                          ? "/shopping-cart/colored-add.png"
                          : "/shopping-cart/add.png"
                      }
                      alt="Increase"
                      className="counter-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCount(key, 1);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CustomizeService() {
  const { cartData, updateCartData } = useShoppingCart();
  const { selectedService, condition, extras } = cartData;

  if (!selectedService) return null;

  const isMaid = selectedService === "Maid Services";

  const baseExtrasKey =
    selectedService === "Maid Services"
      ? "maid"
      : selectedService === "Professional Services"
      ? "professional"
      : selectedService === "Carpet Cleaning"
      ? "carpet"
      : null;

  if (!baseExtrasKey) return null;

  const baseExtras = extrasConfig[baseExtrasKey];
  const maidInitialExtras =
    isMaid && condition === "bad" ? extrasConfig.maidInitial : null;

  const handleToggle = (key, type) => {
    if (type === "boolean") {
      updateCartData({
        extras: {
          ...extras,
          [key]: !extras[key]
        }
      });
    }
  };

  const handleCounter = (key, delta) => {
    const current = extras[key] || 0;
    let newValue = current + delta;
    if (newValue < 0) newValue = 0;
    if (newValue > 5) newValue = 5;

    updateCartData({
      extras: {
        ...extras,
        [key]: newValue
      }
    });
  };

  return (
    <>
      <ExtrasSection
        title={
          isMaid
            ? "Customize your Maid Services"
            : `Customize your ${selectedService}`
        }
        extrasMap={baseExtras}
        extrasState={extras}
        onToggle={handleToggle}
        onCount={handleCounter}
      />

      {maidInitialExtras && (
        <ExtrasSection
          title="Customize your Initial Cleaning"
          extrasMap={maidInitialExtras}
          extrasState={extras}
          onToggle={handleToggle}
          onCount={handleCounter}
        />
      )}
    </>
  );
}
