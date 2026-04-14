import { useState, useMemo, useRef, useEffect } from "react";
import Fuse from "fuse.js";
import SearchIconTest from "../../SearchIconTest";
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
          keywords: [service.name, category.title, typeName],
        });
      });
    });
  });

  return services;
}

const allServices = extractServices(serviceTypes);

const fuse = new Fuse(allServices, {
  keys: ["name", "keywords"],
  threshold: 0.4,
  includeMatches: true,
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

export default function SearchBar({ isHero = false }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);

  const filteredResults = useMemo(() => {
    if (query.trim() === "") return [];
    return fuse.search(query.trim()).map(({ item, matches }) => {
      const highlighted = matches?.find(
        (m) => m.key === "name" || m.key === "keywords"
      );
      return {
        ...item,
        match: highlighted,
      };
    });
  }, [query]);

  const handleKeyDown = (e) => {
    if (!filteredResults.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev <= 0 ? filteredResults.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      window.location.href = filteredResults[activeIndex].url;
    }
  };

  useEffect(() => {
    setActiveIndex(-1);
  }, [filteredResults]);

  const highlightMatch = (text, match) => {
    if (!match?.indices?.length) return text;

    let result = "";
    let lastIndex = 0;

    match.indices.forEach(([start, end]) => {
      result += text.slice(lastIndex, start);
      result += `<mark>${text.slice(start, end + 1)}</mark>`;
      lastIndex = end + 1;
    });

    result += text.slice(lastIndex);
    return result;
  };

  return (
    <div className={`search-bar ${isHero ? "search-bar--hero" : ""}`}>
      <section className="search-bar__section">
        <h1 className="search-bar__title">How can we help you today?</h1>

        <form className="search-bar__form" onSubmit={(e) => e.preventDefault()}>
          <div className="search-bar__input-group">
            <div className="search-bar__input-wrapper">
              <SearchIconTest className="search-bar__icon" size={22} />
              
              <input
                id="service-search"
                type="text"
                ref={inputRef}
                className="search-bar__input"
                placeholder="What do you need help with?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Search services"
                autoComplete="off"
              />

              <img
                src="/abhs-logo.png"
                alt="Allbright Logo"
                className="search-bar__logo"
              />
            </div>

            {query.trim() !== "" && (
              <ul className="search-bar__results">
                {filteredResults.length > 0 ? (
                  filteredResults.map((service, i) => (
                    <li key={service.slug}>
                      <a
                        href={service.url}
                        className={`search-bar__result-item ${
                          i === activeIndex ? "active" : ""
                        }`}
                      >
                        <span
                          className="search-bar__result-name"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(service.name, service.match),
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
        </form>
      </section>
    </div>
  );
}
