import { useState, useRef } from 'react'
import MegaMenu from './MegaMenu'

export default function Header() {
  const [isVisible, setIsVisible] = useState(false)
  const megaMenuRef = useRef(null)

  const handleMouseEnterServices = () => setIsVisible(true)

  const handleCloseIfNotServices = (e) => {
    const target = e.relatedTarget

    const fromOtherNavItem =
      target?.closest('.header__nav-item') &&
      !target?.textContent.includes('Our Services')

    const fromOverlay = target?.classList.contains('mega-menu__overlay')
    const fromHeaderLogo = target?.closest('.header__logo')
    const fromNumber = target?.closest('.header__cta-number')
    const fromButton = target?.closest('.header__cta-button')

    if (fromOtherNavItem || fromOverlay || fromHeaderLogo || fromNumber || fromButton) {
      setIsVisible(false)
    }
  }

  return (
    <>
      <header className="header">
        <div
          className="header__logo"
          onMouseEnter={() => setIsVisible(false)}
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
          <div className="header__nav-item" onMouseEnter={() => setIsVisible(false)}>
            <a href="/about-us">About Us</a>
          </div>

          <div className="header__nav-item" onMouseEnter={handleMouseEnterServices}>
            <a href="/our-services">Our Services</a>
          </div>

          <div className="header__nav-item" onMouseEnter={() => setIsVisible(false)}>
            <a href="#">Blog</a>
          </div>

          <div className="header__nav-item" onMouseEnter={() => setIsVisible(false)}>
            <a href="#">FAQs</a>
          </div>

          <div className="header__nav-item" onMouseEnter={() => setIsVisible(false)}>
            <a href="#">Contact Us</a>
          </div>
        </nav>

        <div className="header__cta">
          <div
            className="header__cta-number"
            onMouseEnter={() => setIsVisible(false)}
          >
            <a href="#" className="header__cta-number-link">
              <img src="/phone-call.png" alt="Phone Icon" className="header__cta-number-icon" />
              <span className="header__cta-number-text">(555) - 555 - 5555</span>
            </a>
          </div>
          <div
            className="header__cta-button"
            onMouseEnter={() => setIsVisible(false)}
          >
            <a href="/pricing/location" className="primary-cta">Check Prices</a>
          </div>
        </div>
      </header>

      <MegaMenu visible={isVisible} onLeave={handleCloseIfNotServices} ref={megaMenuRef} />
    </>
  )
}
