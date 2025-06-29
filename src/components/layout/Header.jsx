import { useState } from 'react'
import MegaMenu from './MegaMenu'

export default function Header() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <header
        className="header"
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="header__logo">
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
          <div className="header__nav-item">
            <a href="/about-us">About Us</a>
          </div>

          <div
            className="header__nav-item"
            onMouseEnter={() => setIsHovered(true)}
          >
            <a href="#">Our Services</a>
          </div>

          <div className="header__nav-item">
            <a href="#">Blog</a>
          </div>

          <div className="header__nav-item">
            <a href="#">FAQs</a>
          </div>

          <div className="header__nav-item">
            <a href="#">Contact Us</a>
          </div>
        </nav>

        <div className="header__cta">
          <div className="header__cta-number">
            <a href="#" className="header__cta-number-link">
              <img src="/phone-call.png" alt="Phone Icon" className="header__cta-number-icon" />
              <span className="header__cta-number-text">(555) - 555 - 5555</span>
            </a>
          </div>
          <div className="header__cta-button">
            <a href="#" className="primary-cta">Check Prices</a>
          </div>
        </div>
      </header>

      <MegaMenu visible={isHovered} onLeave={() => setIsHovered(false)} />
    </>
  )
}
