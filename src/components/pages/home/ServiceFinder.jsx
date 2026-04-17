import { useState, useMemo } from "react";
import serviceTypes from "../../../data/serviceTypes.json";
import SmartCTA from "../../buttons/SmartCTA";

const buttons = [
  { label: "Recurring Services", icon: "/searchbar-icons/maid-services.png" },
  { label: "On-Demand Services", icon: "/searchbar-icons/maintenance-services.png" },
  { label: "Bundles", icon: "/searchbar-icons/bundles.png" },
  { label: "Maintenance Plans", icon: "/searchbar-icons/maid-services.png" } // Reusing icon for now
];

const CATEGORY_FILTERS = {
  "Recurring Services": ["Weekly Maid Services", "Bi-monthly Maid Services", "Monthly Maid Services"],
  "On-Demand Services": ["House Cleaning", "Carpet Cleaning", "Window Washing", "Move in Ready", "Home Detailing Cleaning", "Deep Cleaning"],
  "Maintenance Plans": ["Care Plan", "Pristine Plan", "Refresh Plan", "Signature Plan"],
  "Bundles": ["Full Bundle", "Carpet Bundle", "Window Bundle", "Carpet and Window"]
};

function ServiceCard({ service }) {
  return (
    <div className="service-finder__item">
      <a href={service.url} className="service-finder__card">
        <div className="service-finder__card-bg">
          <img src={service.img} alt={service.name} loading="lazy" />
          <div className="service-finder__card-overlay" />
        </div>
        <div className="service-finder__card-content">
          <h5 className="service-finder__card-title">{service.name}</h5>
        </div>
      </a>
      {service.summary && (
        <p className="service-finder__card-summary">{service.summary}</p>
      )}
    </div>
  );
}

export default function ServiceFinderSection() {
  const [active, setActive] = useState(null);

  // Filter services based on active button and specific requested lists
  const activeServices = useMemo(() => {
    if (!active) return [];
    
    const typeData = serviceTypes[active];
    if (!typeData) return [];
    
    const allowedNames = CATEGORY_FILTERS[active];
    const allServices = [];

    typeData.categories.forEach(cat => {
      cat.services.forEach(s => {
        // Only include if it's in the allowed names list for this category
        if (allowedNames.includes(s.name)) {
          allServices.push({ ...s, type: active });
        }
      });
    });

    return allServices;
  }, [active]);

  return (
    <div className="service-finder-wrapper">
      <div className="service-finder">

        <div className="service-finder__heading">
          <h2 className="service-finder__title">
            Your Home, Your Needs, One Search 🏠
          </h2>
        </div>

        <div className="service-finder__button-group">
          {buttons.map((btn) => (
            <button
              key={btn.label}
              className={`service-finder__button ${
                active === btn.label ? "service-finder__button--active" : ""
              }`}
              onClick={() =>
                setActive((prev) => (prev === btn.label ? null : btn.label))
              }
            >
              <img
                src={btn.icon}
                alt=""
                className="service-finder__button-icon"
              />

              <span className="service-finder__button-text">{btn.label}</span>

              <img
                src="/searchbar-icons/down-arrow.png"
                alt=""
                className={`service-finder__button-arrow ${active === btn.label ? 'service-finder__button-arrow--active' : ''}`}
              />
            </button>
          ))}
        </div>

        {active && (
          <div className="service-finder__dropdown">
            <button
              className="service-finder__close"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="service-finder__card-grid">
              {activeServices.map((service, idx) => (
                <ServiceCard key={idx} service={service} />
              ))}
            </div>

            <div className="service-finder__cta-container">
              <SmartCTA
                forceType={active === 'Recurring Services' ? 'internal' : 'external'}
                secondaryCta="Book a FREE Consultation"
                buttonClass={'primary-cta'}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
