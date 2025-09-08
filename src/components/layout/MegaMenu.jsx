import { forwardRef, useState } from 'react'
import serviceTypes from '../../data/serviceTypes.json'

const MegaMenu = forwardRef(({ visible, onLeave }, ref) => {
  const [selectedType, setSelectedType] = useState('Recurring Services')

  const handleHover = (type) => {
    setSelectedType(type)
  }

  const formatPrice = (price, type) => {
    if (price == null) return ''
    const num = Number(price)
    if (!Number.isNaN(num)) {
      // For Maintenance Plans and Bundles, show plain price (no "Starting at")
      if (type === 'Maintenance Plans' || type === 'Bundles') {
        return `$${num.toLocaleString('en-US')}`
      }
      // Default: Recurring Services (and any other types) show "Starting at"
      return `Starting at $${num.toLocaleString('en-US')}`
    }
    // If price is already a string like "Custom" or "Free estimate", pass through
    return String(price)
  }

  return (
    <div className={`mega-menu ${visible ? 'mega-menu--visible' : ''}`} ref={ref}>
      <div className="mega-menu__content" onMouseLeave={onLeave}>
        {/* Section: Service Types */}
        <div className="mega-menu__section">
          <div className="mega-menu__section-title">
            <p>Service Type</p>
          </div>

          {Object.entries(serviceTypes).map(([type, data]) => {
            // Skip Packages
            if (type === 'Packages') return null
            return (
              <div
                key={type}
                className="mega-menu__service-type"
                onMouseEnter={() => handleHover(type)}
              >
                <div className="mega-menu__service-type-icon">
                  <div className="mega-menu__service-type-icon-wrapper">
                    <img
                      src={`/services/${type.toLowerCase().replace(/ /g, '-')}.png`}
                      alt={`${type} Icon`}
                    />
                  </div>
                </div>
                <div className="mega-menu__service-type-text">
                  <div>
                    <div className="mega-menu__service-type-text-name">
                      <p>{type}</p>
                    </div>
                    <div className="mega-menu__service-type-text-description">
                      <p>{data.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Section: Category Services */}
        <div className="mega-menu__section">
          {(serviceTypes[selectedType]?.categories || []).map((category, index) => (
            <div className="mega-menu__category" key={index}>
              <div className="mega-menu__category-title">
                <p>{category.title}</p>
              </div>
              <div className="mega-menu__services">
                {category.services.map((service, idx) => (
                  <a
                    key={idx}
                    href={service.url}
                    className="mega-menu__service"
                  >
                    <div className="mega-menu__service-img">
                      <img src={service.img} alt={service.name} />
                    </div>
                    <div className="mega-menu__service-name">
                      <p>{service.name}</p>
                    </div>
                    <div className="mega-menu__service-price">
                      <p>{formatPrice(service.price, selectedType)}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mega-menu__overlay" />
    </div>
  )
})

export default MegaMenu
