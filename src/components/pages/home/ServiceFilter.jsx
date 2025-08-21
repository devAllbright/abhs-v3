import React, { useState, useEffect } from "react";
import clsx from "clsx";
import serviceTypes from "../../../data/serviceTypes.json";

const categories = [
  { name: "Trending", icon: "/icons/trending.svg" },
  { name: "Cleaning", icon: "/icons/recurring.svg" },
  { name: "Specialty", icon: "/icons/specialty.svg" },
  { name: "Packages", icon: "/icons/packages.svg" },
];

// 🔧 Utility: Match by service name
const findServiceByName = (name) => {
  const services = [];

  Object.values(serviceTypes).forEach((type) => {
    type.categories.forEach((category) => {
      category.services.forEach((service) => {
        if (service.name === name) {
          services.push(service);
        }
      });
    });
  });

  return services[0]; // return first match
};

// 🔧 Category Mapping
const categoryServiceMap = {
  Trending: [
    "Weekly Maid Services",
    "Carpet Cleaning",
    "Window Washing",
    "Gutter Cleaning",
  ],
  Cleaning: [
    "Weekly Maid Services",
    "Bi-Monthly Maid Services",
    "Monthly Maid Services",
  ],
  Specialty: [
    "Window Washing", // You can add more specialty services if desired
  ],
  Packages: [
    "Full Bundle",
    "Carpet Bundle",
    "Window Bundle",
    "Carpet and Windows",
    "Pristine Plan",
    "Care Plan",
    "Refresh Plan",
    "Signature Plan",
  ],
};

const formatPrice = (price) => {
  if (price == null) return "";
  const num = Number(price);
  if (!Number.isNaN(num)) {
    return `Projects starting at $${num.toLocaleString("en-US")}`;
  }
  return `Projects starting at ${price}`;
};

const ServiceFilter = () => {
  const [activeCategory, setActiveCategory] = useState("Trending");
  const [animate, setAnimate] = useState(false);

  const filteredServices = categoryServiceMap[activeCategory]
    .map(findServiceByName)
    .filter(Boolean);

  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;

    setAnimate(false);
    requestAnimationFrame(() => {
      setActiveCategory(category);
      setAnimate(true);
    });
  };

  useEffect(() => {
    if (!animate) return;
    const timeout = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timeout);
  }, [animate]);

  return (
    <div className="filter-container">
      <div className="service-filter">
        {/* Tabs */}
        <div className="service-filter__tabs">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.name}
              className={clsx("service-filter__tab", {
                "service-filter__tab--active": activeCategory === cat.name,
              })}
              onClick={(e) => {
                e.currentTarget.blur();
                handleCategoryChange(cat.name);
              }}
            >
              <img
                src={cat.icon}
                alt={`${cat.name} Icon`}
                className="service-filter__tab-icon"
              />
              <span className="service-filter__tab-label">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Service Cards */}
        <div className="service-filter__services">
          {filteredServices.map((service, idx) => (
            <a
              href={service.url}
              key={idx}
              className={clsx("service-filter__service", {
                "fade-slide-in": animate,
              })}
            >
              <div className="service-filter__service-img">
                <img src={service.img || "/fallback.jpg"} alt={service.name} />
              </div>
              <div className="service-filter__service-name">
                <p>{service.name}</p>
              </div>
              <div className="service-filter__service-price">
                <p>{formatPrice(service.price)}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceFilter;
