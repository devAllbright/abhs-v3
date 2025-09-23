import { useState, useEffect } from 'react';

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsServicesOpen(false);
  };

  const toggleServices = () => {
    setIsServicesOpen((prev) => !prev);
  };

  return (
    <header className="mobile-header">
      <div className="mobile-header__top">
        <a href="/" className="mobile-header__logo">
          <img src="/allbright-logo.png" alt="Allbright Logo" />
        </a>

        <button
          className="mobile-header__hamburger"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <img
            src="/icons/hamburger.png"
            alt="Open menu"
          />
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-header__overlay">
          {/* X icon inside overlay */}
        <div>
          <button
            className="mobile-header__overlay-close"
            onClick={toggleMenu}
            aria-label="Close menu"
            >
            <img src="/icons/close.png" alt="Close menu" />
          </button>
        </div>

          <nav className="mobile-header__menu">
            <ul>
              <li>
                <a href="/about-us">About Us</a>
              </li>

              <li>
                <button
                  className="mobile-header__expand-btn"
                  onClick={toggleServices}
                  aria-expanded={isServicesOpen}
                >
                  Our Cleaning Services
                  <img
                    src={isServicesOpen ? '/icons/minus.png' : '/icons/plus.png'}
                    alt={isServicesOpen ? 'Collapse services' : 'Expand services'}
                    className="mobile-header__icon"
                  />
                </button>

                {isServicesOpen && (
                  <ul className="mobile-header__submenu">
                    <li><a href="/weekly-maid-services">Weekly Maid Services</a></li>
                    <li><a href="/bi-monthly-maid-services">Bi-Monthly Maid Services</a></li>
                    <li><a href="/monthly-maid-services">Monthly Maid Services</a></li>
                    <li><a href="/one-time-maid-services">One-Time Maid Services</a></li>
                    <li><a href="/home-detailing-cleaning">Home Detailing Cleaning</a></li>
                    <li><a href="/deep-cleaning">Deep Cleaning</a></li>
                    <li><a href="/move-in-ready">Move in Ready</a></li>
                    <li><a href="/carpet-cleaning">Carpet Cleaning</a></li>
                    <li><a href="/window-washing">Window Washing</a></li>
                  </ul>
                )}
              </li>

              <li>
                <a href="/contact-us">Contact Us</a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
