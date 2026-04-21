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
      if (type === 'Maintenance Plans' || type === 'Bundles') {
        return `$${num.toLocaleString('en-US')}`
      }
      return `Starting at $${num.toLocaleString('en-US')}`
    }
    return String(price)
  }

  return (
    <div className={`mega-menu ${visible ? 'mega-menu--visible' : ''}`} ref={ref}>
      <div className="mega-menu__content" onMouseLeave={onLeave}>
        <div className="mega-menu__section">
          <div className="mega-menu__section-title">
            <p>Service Type</p>
          </div>

          {Object.entries(serviceTypes).map(([type, data]) => {
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
                      loading="lazy"
                      decoding="async"
                      width="40"
                      height="40"
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
                  <div className="mega-menu__service-item" key={idx}>
                    <a
                      href={service.url}
                      className="mega-menu__service-card"
                    >
                      <div className="mega-menu__service-card-bg">
                        <img 
                          src={service.img} 
                          alt={service.name} 
                          loading="lazy" 
                          decoding="async"
                        />
                        <div className="mega-menu__service-card-overlay" />
                      </div>
                      <div className="mega-menu__service-card-content">
                        <h5 className="mega-menu__service-card-title">{service.name}</h5>
                      </div>
                    </a>
                    {service.summary && (
                      <p className="mega-menu__service-card-summary">
                        {service.summary}
                        {service.savings && (
                          <span className="mega-menu__service-card-savings">
                            {" "}{service.savings}
                          </span>
                        )}
                        {!service.savings && service.price && (
                           <span className="mega-menu__service-card-price">
                             {" • "}{formatPrice(service.price, selectedType)}
                           </span>
                        )}
                      </p>
                    )}
                  </div>
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
