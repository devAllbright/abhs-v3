import { useEffect, useState } from "react";
import { useShoppingCart } from "../../../context/ShoppingCartContext";
import "../../../styles/pricing/shopping-cart/scroll-steps/one-time-services.css";

export default function OneTimeServices() {
  const {
    addService,
    removeService,
    addExtra,
    removeExtra,
    activeServices,
    activeExtras,
    services,
    updateBundleDiscount,
  } = useShoppingCart();

  const [condition, setCondition] = useState(null);

  useEffect(() => {
    const homeDetailsRaw = sessionStorage.getItem("homeDetails");
    const homeDetails = homeDetailsRaw ? JSON.parse(homeDetailsRaw) : {};
    setCondition(homeDetails.condition || "YES");
  }, []);

  if (condition === null) return null;

  const oneTimeServices = services.oneTimeServices;

  const handleServiceClick = (service) => {
    const isActive = activeServices.some((s) => s.id === service.id);
    if (isActive) {
      removeService(service.id);
    } else {
      addService(service);
    }
    updateBundleDiscount();
  };

  const handleExtraClick = (serviceId, extra) => {
    const isServiceActive = activeServices.some((s) => s.id === serviceId);
    if (!isServiceActive) {
      alert("You must select a service before choosing extras.");
      return;
    }

    const isActive = activeExtras[serviceId]?.some((e) => e.id === extra.id);
    if (isActive) {
      removeExtra(serviceId, extra.name);
    } else {
      addExtra(serviceId, extra);
    }
  };

  const formatServiceName = (id) => id.replace(/([A-Z])/g, " $1").trim();

  return (
    <div className="scroll-choose-service">
      <div className="scroll-title">
        <p>1. Choose your Services</p>
      </div>

      <div className="services-container">
        {Object.entries(oneTimeServices).map(([serviceId, service]) => {
          if (serviceId === "OneTimeFreshenUp" && condition === "NO") return null;

          const isServiceActive = activeServices.some((s) => s.id === serviceId);

          return (
            <div key={serviceId}>
              <button
                className={`service ${isServiceActive ? "active-service" : ""}`}
                onClick={() =>
                  handleServiceClick({
                    id: serviceId,
                    name: formatServiceName(serviceId),
                    price: service.price,
                  })
                }
              >
                {formatServiceName(serviceId)}
              </button>

              {isServiceActive && service.extras && (
                <div className="extras-container">
                  {service.extras.map((extra) => {
                    const isActive = activeExtras[serviceId]?.some((e) => e.id === extra.id);

                    return (
                      <button
                        key={extra.id}
                        className={`extra-element ${isActive ? "active-extra" : ""}`}
                        onClick={() => handleExtraClick(serviceId, extra)}
                      >
                        <div className="extra-img">
                          <img src={extra.img} alt={extra.name} />
                        </div>
                        <div className="extra-name">
                          <p>{extra.name} (+${extra.price})</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
