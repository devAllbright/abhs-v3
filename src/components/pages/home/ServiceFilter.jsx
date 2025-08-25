import React, { useState, useEffect, useMemo } from "react";
import clsx from "clsx";
import serviceTypes from "../../../data/serviceTypes.json";

const categories = [
  { name: "Trending", icon: "/icons/trending.svg" },
  { name: "Cleaning", icon: "/icons/recurring.svg" },
  { name: "Specialty", icon: "/icons/specialty.svg" },
  { name: "Packages", icon: "/icons/packages.svg" },
];

/** Build a strict index: serviceName -> { service, type } */
function buildServiceIndex(json) {
  const byName = new Map(); // name -> { service, type }
  Object.entries(json).forEach(([typeName, typeData]) => {
    (typeData.categories || []).forEach((cat) => {
      (cat.services || []).forEach((svc) => {
        if (!byName.has(svc.name)) {
          byName.set(svc.name, { service: svc, type: typeName });
        }
      });
    });
  });
  return byName;
}

const serviceIndex = buildServiceIndex(serviceTypes);

/** Category Mapping (display groups) */
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
  Specialty: ["Window Washing"],
  Packages: [
    "Full Bundle",
    "Carpet Bundle",
    "Window Bundle",
    "Carpet and Window",
    "Pristine Plan",
    "Care Plan",
    "Refresh Plan",
    "Signature Plan",
  ],
};

/** Normalize strings for safe comparisons */
const norm = (s) =>
  (s || "")
    .toString()
    .trim()
    .toLowerCase();

/** Does this parent type require plain price (no "Starting at")? */
const isPlainPriceType = (parentType) => {
  const t = norm(parentType);
  // Support common top-level key variants without relying on exact spelling
  return (
    t === "packages" || // many JSONs use "Packages" instead of "Bundles"
    t === "bundles" ||
    t === "maintenance plans" ||
    t === "maintenance plan" ||
    t === "maintenance"
  );
};

/** Strict price formatter using normalized parent type */
const formatPrice = (price, parentType) => {
  if (price == null) return "";
  const n = Number(price);
  const plain = isPlainPriceType(parentType);

  if (!Number.isNaN(n)) {
    return plain
      ? `$${n.toLocaleString("en-US")}`
      : `Projects starting at $${n.toLocaleString("en-US")}`;
  }
  // For string prices like "Custom", "Free estimate"
  return plain ? String(price) : `Projects starting at ${price}`;
};

const ServiceFilter = () => {
  const [activeCategory, setActiveCategory] = useState("Trending");
  const [animate, setAnimate] = useState(false);

  const filteredServices = useMemo(() => {
    const names = categoryServiceMap[activeCategory] || [];
    return names
      .map((name) => {
        const hit = serviceIndex.get(name);
        if (!hit) return null;
        return {
          ...hit.service,
          _parentType: hit.type, // carry exact parent type from JSON
        };
      })
      .filter(Boolean);
  }, [activeCategory]);

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
    const t = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(t);
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
          {filteredServices.map((svc, idx) => (
            <a
              href={svc.url}
              key={`${svc.name}-${idx}`}
              className={clsx("service-filter__service", {
                "fade-slide-in": animate,
              })}
            >
              <div className="service-filter__service-img">
                <img src={svc.img || "/fallback.jpg"} alt={svc.name} />
              </div>
              <div className="service-filter__service-name">
                <p>{svc.name}</p>
              </div>
              <div className="service-filter__service-price">
                <p>{formatPrice(svc.price, svc._parentType)}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceFilter;
