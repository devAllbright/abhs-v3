import React, { forwardRef } from 'react'

const MegaMenu = forwardRef(({ visible, onLeave }, ref) => {
  return (
    <div
      className={`mega-menu ${visible ? 'mega-menu--visible' : ''}`}
      ref={ref}
    >
      <div
        className="mega-menu__content"
        onMouseLeave={onLeave}
      >
        {/* Section: Service Types */}
        <div className="mega-menu__section">
          <div className="mega-menu__section-title">
            <p>Service Type</p>
          </div>

          <div className="mega-menu__service-type">
            <div className="mega-menu__service-type-icon">
              <div className="mega-menu__service-type-icon-wrapper">
                <img src="/services/recurring.png" alt="Recurring Icon" />
              </div>
            </div>
            <div className="mega-menu__service-type-text">
              <div>
                <div className="mega-menu__service-type-text-name">
                  <p>Recurring Services</p>
                </div>
                <div className="mega-menu__service-type-text-description">
                  <p>This will be the description for recurring services</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mega-menu__service-type">
            <div className="mega-menu__service-type-icon">
              <div className="mega-menu__service-type-icon-wrapper">
                <img src="/services/one-time.png" alt="Recurring Icon" />
              </div>
            </div>
            <div className="mega-menu__service-type-text">
              <div>
                <div className="mega-menu__service-type-text-name">
                  <p>One-Time Services</p>
                </div>
                <div className="mega-menu__service-type-text-description">
                  <p>This will be the description for One Time Services</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mega-menu__service-type">
            <div className="mega-menu__service-type-icon">
              <div className="mega-menu__service-type-icon-wrapper">
                <img src="/services/packages.png" alt="Recurring Icon" />
              </div>
            </div>
            <div className="mega-menu__service-type-text">
              <div>
                <div className="mega-menu__service-type-text-name">
                  <p>Recurring Services</p>
                </div>
                <div className="mega-menu__service-type-text-description">
                  <p>This will be the description for recurring services</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Category Services */}
        <div className="mega-menu__section">
          <div className="mega-menu__category">
            <div className="mega-menu__category-title">
              <p>Category 1</p>
            </div>
            <div className="mega-menu__services">
              <div className="mega-menu__service">
                <div className="mega-menu__service-img">
                  <img src="/mega-menu/maid-services.jpg" alt="Maid Services" />
                </div>
                <div className="mega-menu__service-name">
                  <p>Exterior Cleaning</p>
                </div>
                <div className="mega-menu__service-price">
                  <p>Projects starting at $195</p>
                </div>
              </div>
              <div className="mega-menu__service">
                <div className="mega-menu__service-img">
                  <img src="/mega-menu/exterior-cleaning.jpg" alt="Exterior Cleaning" />
                </div>
                <div className="mega-menu__service-name">
                  <p>Exterior Cleaning</p>
                </div>
                <div className="mega-menu__service-price">
                  <p>Projects starting at $195</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mega-menu__category">
            <div className="mega-menu__category-title">
              <p>Category 2</p>
            </div>
            <div className="mega-menu__services">
              <div className="mega-menu__service">
                <div className="mega-menu__service-img">
                  <img src="/mega-menu/house-cleaning.jpg" alt="House Cleaning" />
                </div>
                <div className="mega-menu__service-name">
                  <p>House Cleaning</p>
                </div>
                <div className="mega-menu__service-price">
                  <p>Projects starting at $195</p>
                </div>
              </div>
              <div className="mega-menu__service">
                <div className="mega-menu__service-img">
                  <img src="/mega-menu/move-cleaning.jpg" alt="Move In/Out Cleaning" />
                </div>
                <div className="mega-menu__service-name">
                  <p>Move In/Out Cleaning</p>
                </div>
                <div className="mega-menu__service-price">
                  <p>Projects starting at $195</p>
                </div>
              </div>
              <div className="mega-menu__service">
                <div className="mega-menu__service-img">
                  <img src="/mega-menu/window-washing.jpg" alt=" Window Washing" />
                </div>
                <div className="mega-menu__service-name">
                  <p>Window Washing</p>
                </div>
                <div className="mega-menu__service-price">
                  <p>Projects starting at $195</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay (no close logic here anymore) */}
      <div className="mega-menu__overlay" />
    </div>
  )
})

export default MegaMenu
