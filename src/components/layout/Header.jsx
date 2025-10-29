import { useState, useRef, useEffect } from 'react';
import MegaMenu from './MegaMenu';
import SearchIcon from '../pages/our-services/SearchIcon';
import SearchBar from '../pages/our-services/SearchBar';
import CTAButton from '../buttons/CTAButton';
//import ModalCTA from '../buttons/ModalCTA';
import HCPButton from '../buttons/HCPButton';

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [serviceType, setServiceType] = useState(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    const storedServiceType = sessionStorage.getItem('serviceType');
    setServiceType(storedServiceType);
  }, []);

  const handleMouseEnterServices = () => {
    setShowSearch(false);
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
          }}
        >
          <a href="/" className="header__logo-link">
            <div className="header__logo-img">
              <img src="/allbright-logo.png" alt="Allbright Logo" />
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
            }}
          >
            <a href="tel:4082801234" className="header__cta-number-link">
              <img src="/phone-call.png" alt="Phone Icon" className="header__cta-number-icon" />
              <span className="header__cta-number-text">(408) - 280 - 1234</span>
            </a>
          </div>

          <div
            className="header__cta-button"
            onMouseEnter={() => {
              setIsVisible(false);
              setShowSearch(false);
            }}
          >
            {serviceType === 'recurring' || serviceType === 'oneTime' ? (
              <CTAButton buttonClass={'primary-cta'} />
            ) : (
              <HCPButton secondaryCta="Maintenance - Book a Free Consultation" buttonClass={'primary-cta'} />
            )}
          </div>
        </div>
      </header>

      <MegaMenu visible={isVisible} onLeave={handleCloseIfNotServices} />
    </>
  );
}
