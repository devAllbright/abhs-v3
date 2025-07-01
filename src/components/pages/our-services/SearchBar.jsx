import { useState, useMemo } from "react";

const services = [
  {
    name: "Carpet Cleaning",
    slug: "carpet-cleaning",
    price: 199,
    keywords: ["carpet", "floor cleaning", "rug", "deep clean", "stains", "steam"],
  },
  {
    name: "Window Washing",
    slug: "window-washing",
    price: 199,
    keywords: ["windows", "glass", "exterior", "interior", "cleaning"],
  },
  {
    name: "Maid Services",
    slug: "maid-services",
    price: 199,
    keywords: ["cleaning", "home", "weekly", "monthly", "housekeeping", "bi-monthly"],
  },
  {
    name: "Upholstery Cleaning",
    slug: "upholstery-cleaning",
    price: 199,
    keywords: ["sofa", "couch", "fabric", "steam", "stain removal", "furniture"],
  },
  {
    name: "Tile Cleaning",
    slug: "tile-cleaning",
    price: 199,
    keywords: ["tiles", "grout", "floor", "bathroom", "kitchen", "scrub"],
  },
  {
    name: "Stone and Marble Restoration",
    slug: "stone-and-marble-restoration",
    price: 199,
    keywords: ["marble", "granite", "stone", "polish", "restore", "shine"],
  },
  {
    name: "Gutter Cleaning",
    slug: "gutter-cleaning",
    price: 199,
    keywords: ["gutter", "roof", "drainage", "leaves", "clog"],
  },
  {
    name: "Move-in Ready",
    slug: "move-in-ready",
    price: 199,
    keywords: ["moving", "cleaning", "new home", "vacuum", "fresh start"],
  },
  {
    name: "Exterior Surface Washing",
    slug: "exterior-surface-washing",
    price: 199,
    keywords: ["power wash", "pressure wash", "driveway", "siding", "patio"],
  },
  {
    name: "Wood Cabinets and Floors Reviving",
    slug: "wood-cabinets-and-floors-reviving",
    price: 199,
    keywords: ["wood", "floor", "cabinet", "refinish", "restore", "polish"],
  },
];

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const filteredServices = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (q === "") return [];

    return services.filter(({ name, keywords }) => {
      const inName = name.toLowerCase().includes(q);
      const inKeywords = keywords.some((kw) => kw.toLowerCase().includes(q));
      return inName || inKeywords;
    });
  }, [query]);

  return (
    <div className="search-bar">
      <section className="search-bar__section">
        <h1 className="search-bar__title">How can we help you today?</h1>

        <form
          className="search-bar__form"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="search-bar__input-group">
            <input
              id="service-search"
              type="text"
              className="search-bar__input"
              placeholder="Search services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search services"
            />

            {filteredServices.length > 0 && (
              <ul className="search-bar__results">
                {filteredServices.map((service) => (
                  <li key={service.slug}>
                    <a
                      href={`/our-services/${service.slug}`}
                      className="search-bar__result-item"
                    >
                      <span className="search-bar__result-name">{service.name}</span>
                      <span className="search-bar__result-price">
                        Starting from ${service.price}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
