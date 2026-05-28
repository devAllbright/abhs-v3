import { useState, useRef, useEffect } from 'react';
import MegaMenu from './MegaMenu';
import SearchIcon from '../pages/our-services/SearchIcon';
import SearchBar from '../pages/our-services/ServiceSearchHero.jsx';
import SmartCTA from '../buttons/SmartCTA';
//import CTAButton from '../buttons/CTAButton';
//import ModalCTA from '../buttons/ModalCTA';
import HCPButton from '../buttons/HCPButton';

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

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [serviceType, setServiceType] = useState(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    const storedServiceType = sessionStorage.getItem('serviceType');
    setServiceType(storedServiceType);
  }, []);

  const handleMouseEnterServices = () => {
    setShowSearch(false);
    setShowLocations(false);
    setIsVisible(true);
  };

  const handleCloseIfNotServices = (e) => {
    const target = e.relatedTarget;

    const fromOtherNavItem =
      target?.closest('.header__nav-item') &&
      !target?.textContent.includes('Our Services');

    const fromOverlay = target?.classList.contains('mega-menu__overlay');
    const fromHeaderLogo = target?.closest('.header__logo');
    const fromNumber = target?.closest('.header__cta-number');
    const fromButton = target?.closest('.header__cta-button');

    if (fromOtherNavItem || fromOverlay || fromHeaderLogo || fromNumber || fromButton) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    function onDocClick(e) {
      if (!showSearch) return;
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    }
    function onEsc(e) {
      if (e.key === 'Escape') setShowSearch(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [showSearch]);

  useEffect(() => {
    if (showSearch) {
      const t = setTimeout(() => {
        const input = document.getElementById('service-search');
        if (input) input.focus();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [showSearch]);

  return (
    <>
      <header className="header">
        <div
          className="header__logo"
          onMouseEnter={() => {
            setIsVisible(false);
            setShowSearch(false);
            setShowLocations(false);
          }}
        >
          <a href="/" className="header__logo-link">
            <div className="header__logo-img">
              <img 
                src="/allbright-logo.png" 
                alt="Allbright Logo" 
                width="50" 
                height="50" 
                loading="eager" 
                fetchPriority="high"
              />
            </div>
            <div className="header__logo-text">
              <span>ALLBRIGHT HOMES SERVICES</span>
            </div>
          </a>
        </div>

        <nav className="header__nav">
          <div
            className="header__nav-item"
            onMouseEnter={() => {
              setIsVisible(false);
              setShowSearch(false);
              setShowLocations(false);
            }}
          >
            <a href="/about-us">About Us</a>
          </div>

          <div
            className="header__nav-item"
            onMouseEnter={handleMouseEnterServices}
          >
            <a href="/our-services">Our Services</a>
          </div>

          <div
            className="header__nav-item"
            onMouseEnter={() => {
              setIsVisible(false);
              setShowSearch(false);
              setShowLocations(true);
            }}
            onMouseLeave={() => setShowLocations(false)}
          >
            <a href="#" onClick={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Locations <span style={{ fontSize: '0.8rem', transform: showLocations ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
            </a>
            {showLocations && (
              <div className="header__locations-dropdown">
                <div className="locations-grid">
                  {CITIES.map((c) => (
                    <a key={c.slug} href={`/locations/${c.slug}/`} className="locations-item">
                      <span className="pin">📍</span> {c.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className="header__nav-item"
            onMouseEnter={() => {
              setIsVisible(false);
              setShowSearch(false);
              setShowLocations(false);
            }}
          >
            <a href="/contact-us">Contact Us</a>
          </div>

          <SearchIcon
            className="header__nav-icon"
            size={40}
            strokeWidth={1}
            onClick={() => {
              setIsVisible(false);
              setShowSearch((s) => !s);
            }}
          />

          {showSearch && (
            <div ref={popoverRef} className="header__search-popover">
              <SearchBar />
            </div>
          )}
        </nav>

        <div className="header__cta">
          <div
            className="header__cta-number"
            onMouseEnter={() => {
              setIsVisible(false);
              setShowSearch(false);
              setShowLocations(false);
            }}
          >
            <a href="tel:4082801234" className="header__cta-number-link">
              <img 
                src="/phone-call.png" 
                alt="Phone Icon" 
                className="header__cta-number-icon" 
                width="20" 
                height="20"
              />
              <span className="header__cta-number-text">(408) - 280 - 1234</span>
            </a>
          </div>

          <div
            className="header__cta-button"
            onMouseEnter={() => {
              setIsVisible(false);
              setShowSearch(false);
              setShowLocations(false);
            }}
          >
            <SmartCTA 
              secondaryCta="Book a FREE Consultation"
              buttonClass={'primary-cta'}
            />
          </div>
        </div>
      </header>

      <MegaMenu visible={isVisible} onLeave={handleCloseIfNotServices} />
    </>
  );
}
