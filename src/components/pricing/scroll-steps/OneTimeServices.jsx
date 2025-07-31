import { useShoppingCart } from "../../../context/ShoppingCartContext";
import "../../../styles/pricing/shopping-cart/scroll-steps/one-time-services.css";

export default function OneTimeServices() {
  const { addService, removeService, addExtra, removeExtra, activeServices, activeExtras, services, updateBundleDiscount } = useShoppingCart();

  // Retrieve one-time services
  const oneTimeServices = services.oneTimeServices;

  // Handle service selection
  const handleServiceClick = (service) => {
    const isActive = activeServices.some((s) => s.id === service.id);
    if (isActive) {
      removeService(service.id);
    } else {
      addService(service);
    }
    updateBundleDiscount(); // ✅ Ensure bundle discount updates
  };

  // Handle extra selection
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

  return (
    <div className="scroll-choose-service">
      <div className="scroll-title">
        <p>1. Choose your Services</p>
      </div>

      <div className="services-container">
        {Object.entries(oneTimeServices).map(([serviceId, service]) => {
          const isServiceActive = activeServices.some((s) => s.id === serviceId);

          return (
            <div key={serviceId}>
              {/* Service Button (No Price) */}
              <button
                className={`service ${isServiceActive ? "active-service" : ""}`}
                onClick={() => handleServiceClick({ id: serviceId, name: serviceId.replace(/([A-Z])/g, " $1").trim(), price: service.price })}
              >
                {serviceId.replace(/([A-Z])/g, " $1").trim()}
              </button>

              {/* Extras Section - Only shown when service is active */}
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
