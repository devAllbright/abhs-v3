import { useState, useMemo, useRef, useEffect } from "react";
import Fuse from "fuse.js";
import SearchIconTest from "../../SearchIconTest";
import serviceFinderInfo from "../../../data/serviceFinderInfo.json";
import serviceTypes from "../../../data/serviceTypes.json";

function extractServices(json) {
  const services = [];
  Object.entries(json).forEach(([typeName, typeData]) => {
    (typeData.categories || []).forEach((category) => {
      (category.services || []).forEach((service) => {
        services.push({
          type: typeName,
          name: service.name,
          slug: service.url.replace("/our-services/", ""),
          url: service.url,
          price: service.price,
          keywords: [service.name, category.title, typeName]
        });
      });
    });
  });
  return services;
}

const fuse = new Fuse(extractServices(serviceTypes), {
  keys: ["name", "keywords"],
  threshold: 0.4,
  includeMatches: true
});

function formatPrice(price, type) {
  if (price == null) return "";
  const num = Number(price);
  if (!Number.isNaN(num)) {
    if (type === "Maintenance Plans" || type === "Bundles") {
      return `$${num.toLocaleString("en-US")}`;
    }
    return `Starting at $${num.toLocaleString("en-US")}`;
  }
  return String(price);
}

export default function ServiceFinderSection() {
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query.trim()).map(({ item, matches }) => ({
      ...item,
      match: matches?.find((m) => m.key === "name" || m.key === "keywords")
    }));
  }, [query]);

  const highlightMatch = (text, match) => {
    if (!match?.indices?.length) return text;
    let result = "";
    let last = 0;
    match.indices.forEach(([start, end]) => {
      result += text.slice(last, start);
      result += `<mark>${text.slice(start, end + 1)}</mark>`;
      last = end + 1;
    });
    return result + text.slice(last);
  };

  const handleKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((p) => (p + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((p) => (p <= 0 ? results.length - 1 : p - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      window.location.href = results[activeIndex].url;
    }
  };

  useEffect(() => setActiveIndex(-1), [results]);

  const buttons = [
    { label: "Maid Services", icon: "/searchbar-icons/maid-services.png" },
    { label: "Home Maintenance Services", icon: "/searchbar-icons/maintenance-services.png" },
    { label: "Bundles", icon: "/searchbar-icons/bundles.png" },
    { label: "Yearly Maintenance Plans", icon: "/searchbar-icons/maintenance-plans.png" }
  ];


  return (
    <div className="service-finder-wrapper">
      <div className="service-finder">

        {/* ------------------ HEADING ------------------ */}
        <div className="service-finder__heading">
          <h2 className="service-finder__title">
            Your Home, Your Needs, One Search 🏠
          </h2>
        </div>

        {/* ---------------- SEARCH BAR ---------------- */}
        <div className="service-finder__search">
          <div className="search-bar__input-group">

            <div className="search-bar__input-wrapper">

              {/* left icon */}
              <SearchIconTest className="search-bar__icon" size={22} />

              {/* input */}
              <input
                type="text"
                ref={inputRef}
                className="search-bar__input"
                placeholder="What do you need help with?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />

              {/* right logo */}
              <img
                src="/abhs-logo.png"
                alt="Allbright Logo"
                className="search-bar__logo"
              />
            </div>

            {/* RESULTS */}
            {query.trim() && (
              <ul className="search-bar__results">
                {results.length ? (
                  results.map((service, i) => (
                    <li key={service.slug}>
                      <a
                        href={service.url}
                        className={`search-bar__result-item ${
                          i === activeIndex ? "active" : ""
                        }`}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(service.name, service.match)
                          }}
                        />
                        <span className="search-bar__result-price">
                          {formatPrice(service.price, service.type)}
                        </span>
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="search-bar__no-results">
                    No results found for "{query}"
                  </li>
                )}
              </ul>
            )}

          </div>
        </div>

        {/* ---------------- BUTTON GROUP ---------------- */}
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
              {/* LEFT ICON — always visible */}
              <img
                src={btn.icon}
                alt=""
                className="service-finder__button-icon"
              />

              {/* TEXT */}
              <span className="service-finder__button-text">{btn.label}</span>

              {/* RIGHT ARROW — only visible if NOT active */}
              {active !== btn.label && (
                <img
                  src="/searchbar-icons/down-arrow.png"
                  alt=""
                  className="service-finder__button-icon"
                />
              )}
            </button>
          ))}
        </div>


        {/* ---------------- DROPDOWN ---------------- */}
        {active && (
          <div className="service-finder__dropdown">
            <h3 className="service-finder__dropdown-title">
              {serviceFinderInfo[active].title}
            </h3>

            {serviceFinderInfo[active].sections.map((section, i) => (
              <div key={i} className="service-finder__dropdown-section">
                <h4 className="service-finder__dropdown-label">
                  {section.label}
                </h4>
                <p className="service-finder__dropdown-text">
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
