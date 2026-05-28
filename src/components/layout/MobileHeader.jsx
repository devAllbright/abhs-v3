import { useState, useEffect } from 'react';

const CITIES = [
  { name: "San Jose", slug: "san-jose" },
  { name: "Campbell", slug: "campbell" },
  { name: "Saratoga", slug: "saratoga" },
  { name: "Los Gatos", slug: "los-gatos" },
  { name: "Morgan Hill", slug: "morgan-hill" },
  { name: "Sunnyvale", slug: "sunnyvale" },
  { name: "Cupertino", slug: "cupertino" },
  { name: "Santa Clara", slug: "santa-clara" },
  { name: "Milpitas", slug: "milpitas" },
  { name: "Mountain View", slug: "mountain-view" },
  { name: "Los Altos", slug: "los-altos" },
  { name: "Palo Alto", slug: "palo-alto" }
];

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsServicesOpen(false);
    setIsLocationsOpen(false);
  };

  const toggleServices = () => {
    setIsServicesOpen((prev) => !prev);
  };

  return (
    <header className="mobile-header">
      <div className="mobile-header__top">
        <a href="/" className="mobile-header__logo">
          <img 
            src="/allbright-logo.png" 
            alt="Allbright Logo" 
            width="40" 
            height="40" 
            loading="eager"
          />
        </a>

        <button
          className="mobile-header__hamburger"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <img 
            src="/icons/hamburger.png" 
            alt="Open menu" 
            width="32" 
            height="32"
          />
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-header__overlay">
          <div>
            <button
              className="mobile-header__overlay-close"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <img 
                src="/icons/close.png" 
                alt="Close menu" 
                width="32" 
                height="32"
              />
            </button>
          </div>

          <nav className="mobile-header__menu">
            <ul className="mobile-header__menu-list">
              <li className="mobile-header__menu-item">
                <a href="/about-us" className="mobile-header__menu-link">
                  About Us
                </a>
              </li>

              <li className="mobile-header__menu-item">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleServices();
                  }}
                  aria-expanded={isServicesOpen}
                  aria-controls="mobile-services-submenu"
                  className="mobile-header__expand-link"
                >
                  Our Cleaning Services
                  <img
                    src={isServicesOpen ? '/icons/minus.png' : '/icons/plus.png'}
                    alt={isServicesOpen ? 'Collapse services' : 'Expand services'}
                    className="mobile-header__icon"
                  />
                </a>

                {isServicesOpen && (
                  <ul
                    className="mobile-header__submenu"
                    id="mobile-services-submenu"
                  >
                    <li><a href="/our-services/recurring-services/weekly-maid-services">Weekly Maid Services</a></li>
                    <li><a href="/our-services/recurring-services/bi-monthly-maid-services">Bi-Monthly Maid Services</a></li>
                    <li><a href="/our-services/recurring-services/monthly-maid-services">Monthly Maid Services</a></li>
                    <li><a href="/our-services/one-time-services/one-time-maid-services">One-Time Maid Services</a></li>
                    <li><a href="/our-services/one-time-services/home-detailing-cleaning">Home Detailing Cleaning</a></li>
                    <li><a href="/our-services/one-time-services/deep-cleaning">Deep Cleaning</a></li>
                    <li><a href="/our-services/one-time-services/move-in-ready">Move in Ready</a></li>
                    <li><a href="/our-services/one-time-services/carpet-cleaning">Carpet Cleaning</a></li>
                    <li><a href="/our-services/one-time-services/window-washing">Window Washing</a></li>
                  </ul>
                )}
              </li>

              <li className="mobile-header__menu-item">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLocationsOpen((prev) => !prev);
                  }}
                  aria-expanded={isLocationsOpen}
                  aria-controls="mobile-locations-submenu"
                  className="mobile-header__expand-link"
                >
                  Our Locations
                  <img
                    src={isLocationsOpen ? '/icons/minus.png' : '/icons/plus.png'}
                    alt={isLocationsOpen ? 'Collapse locations' : 'Expand locations'}
                    className="mobile-header__icon"
                  />
                </a>

                {isLocationsOpen && (
                  <ul
                    className="mobile-header__submenu"
                    id="mobile-locations-submenu"
                  >
                    {CITIES.map((c) => (
                      <li key={c.slug}>
                        <a href={`/locations/${c.slug}/`} onClick={toggleMenu}>
                          {c.name}, CA
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li className="mobile-header__menu-item">
                <a href="/contact-us" className="mobile-header__menu-link">
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
