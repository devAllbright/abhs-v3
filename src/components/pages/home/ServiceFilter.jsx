import React, { useState, useEffect } from "react";
import clsx from "clsx";

const categories = [
  { name: "Trending", icon: "/icons/recurring.svg" },
  { name: "Cleaning", icon: "/icons/one-time.svg" },
  { name: "Specialty", icon: "/icons/specialty.svg" },
  { name: "Add-ons", icon: "/icons/add-ons.svg" },
  { name: "Packages", icon: "/icons/packages.svg" },
];

const allServices = [
  {
    id: 1,
    title: "Maid Services",
    price: "$195",
    image: "/service-filter/maid-services.jpg",
    category: "Trending",
  },
  {
    id: 2,
    title: "Exterior Cleaning",
    price: "$195",
    image: "/service-filter/exterior-cleaning.jpg",
    category: "Cleaning",
  },
  {
    id: 3,
    title: "Window Washing",
    price: "$195",
    image: "/service-filter/window-washing.jpg",
    category: "Cleaning",
  },
];

const ServiceFilter = () => {
  const [activeCategory, setActiveCategory] = useState("Trending");
  const [animate, setAnimate] = useState(false);

  const filteredServices = allServices.filter(
    (service) => service.category === activeCategory
  );

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

        <div className="service-filter__services">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={clsx("service-filter__service", {
                "fade-slide-in": animate,
              })}
            >
              <div className="service-filter__service-img">
                <img src={service.image} alt={service.title} />
              </div>
              <div className="service-filter__service-name">
                <p>{service.title}</p>
              </div>
              <div className="service-filter__service-price">
                <p>Projects starting at {service.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceFilter;
