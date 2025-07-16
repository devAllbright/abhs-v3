import { forwardRef, useState } from 'react'

const serviceTypes = {
  'Recurring Services': {
    description: 'Routine cleanings to keep your home spotless.',
    categories: [
      {
        title: 'Routine Cleaning',
        services: [
          { name: 'Weekly Maid Services', img: '/mega-menu/maid-weekly.png', price: 'Starting at $125' },
          { name: 'Bi-monthly Maid Services', img: '/mega-menu/maid-bi.png', price: 'Starting at $135' },
          { name: 'Monthly Maid Services', img: '/mega-menu/maid-monthly.png', price: 'Starting at $145' }
        ]
      }
    ]
  },
  'One-Time Services': {
    description: 'Occasional deep and specialty cleaning services.',
    categories: [
      {
        title: 'General Cleaning',
        services: [
          { name: 'Deep Cleaning', img: '/mega-menu/deep-cleaning.png', price: 'Starting at $195' },
          { name: 'Move-In Ready Cleaning', img: '/mega-menu/move-in.png', price: 'Starting at $195' }
        ]
      },
      {
        title: 'Floor & Surface Care',
        services: [
          { name: 'Carpet Cleaning', img: '/mega-menu/carpet-cleaning.png', price: 'Starting at $159' },
          { name: 'Tile Cleaning', img: '/mega-menu/tile-cleaning.png', price: 'Starting at $185' },
          { name: 'Upholstery Cleaning', img: '/mega-menu/upholstery-cleaning.png', price: 'Starting at $149' },
          { name: 'Stone & Marble Restoration', img: '/mega-menu/stone-marble.png', price: 'Custom Quote' },
          { name: 'Wood Cabinets & Floors Reviving', img: '/mega-menu/wood-revive.png', price: 'Custom Quote' }
        ]
      },
      {
        title: 'Outdoor Cleaning',
        services: [
          { name: 'Gutter Cleaning', img: '/mega-menu/gutter-cleaning.png', price: 'Starting at $195' },
          { name: 'Exterior Surface Washing', img: '/mega-menu/exterior-washing.png', price: 'Custom Quote' },
          { name: 'Outdoor Patios & Furniture Cleaning', img: '/mega-menu/patios-furniture.png', price: 'Custom Quote' },
          { name: 'Outdoor Kitchen Cleaning', img: '/mega-menu/outdoor-kitchen.png', price: 'Custom Quote' },
          { name: 'Anodized Frames Restoration', img: '/mega-menu/anodized-frames.png', price: 'Custom Quote' }
        ]
      },
      {
        title: 'Window Care',
        services: [
          { name: 'Window Washing', img: '/mega-menu/window-washing.png', price: 'Starting at $195' }
        ]
      }
    ]
  },
  'Packages': {
    description: 'For convenience and savings.',
    categories: [
      {
        title: 'Bundles',
        services: [
/*           { name: 'Full Bundle', img: '/mega-menu/full-bundle.png', price: 'Includes Deep, Carpet & Window' },
          { name: 'Carpet Bundle', img: '/mega-menu/carpet-bundle.png', price: 'Includes Deep & Carpet' },
          { name: 'Window Bundle', img: '/mega-menu/window-bundle.png', price: 'Includes Deep & Window' },
          { name: 'Carpet and Windows', img: '/mega-menu/carpet-window.png', price: 'Includes Carpet & Window' } */
          { name: 'Full Bundle', img: '', price: 'Includes Deep, Carpet & Window' },
          { name: 'Carpet Bundle', img: '', price: 'Includes Deep & Carpet' },
          { name: 'Window Bundle', img: '/', price: 'Includes Deep & Window' },
          { name: 'Carpet and Windows', img: '', price: 'Includes Carpet & Window' }
        ]
      },
      {
        title: 'Maintenance Plans',
        services: [
/*           { name: 'Refresh Plan', img: '/mega-menu/refresh.png', price: 'Monthly + Annual Services' },
          { name: 'Care Plan', img: '/mega-menu/care.png', price: 'Bi-Monthly + Annual Services' },
          { name: 'Signature Plan', img: '/mega-menu/signature.png', price: 'Tailored to Your Needs' },
          { name: 'Pristine Plan', img: '/mega-menu/pristine.png', price: 'Weekly + Annual Services' } */
          { name: 'Refresh Plan', img: '', price: 'Monthly + Annual Services' },
          { name: 'Care Plan', img: '', price: 'Bi-Monthly + Annual Services' },
          { name: 'Signature Plan', img: '', price: 'Tailored to Your Needs' },
          { name: 'Pristine Plan', img: '', price: 'Weekly + Annual Services' }
        ]
      }
    ]
  }
}

const MegaMenu = forwardRef(({ visible, onLeave }, ref) => {
  const [selectedType, setSelectedType] = useState('Recurring Services')

  const handleHover = (type) => {
    setSelectedType(type)
  }

  return (
    <div className={`mega-menu ${visible ? 'mega-menu--visible' : ''}`} ref={ref}>
      <div className="mega-menu__content" onMouseLeave={onLeave}>
        {/* Section: Service Types */}
        <div className="mega-menu__section">
          <div className="mega-menu__section-title">
            <p>Service Type</p>
          </div>

          {Object.entries(serviceTypes).map(([type, data]) => (
            <div
              key={type}
              className="mega-menu__service-type"
              onMouseEnter={() => handleHover(type)}
            >
              <div className="mega-menu__service-type-icon">
                <div className="mega-menu__service-type-icon-wrapper">
                  <img src={`/services/${type.toLowerCase().replace(/ /g, '-')}.png`} alt={`${type} Icon`} />
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
          ))}
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
                  <div className="mega-menu__service" key={idx}>
                    <div className="mega-menu__service-img">
                      <img src={service.img} alt={service.name} />
                    </div>
                    <div className="mega-menu__service-name">
                      <p>{service.name}</p>
                    </div>
                    <div className="mega-menu__service-price">
                      <p>{service.price}</p>
                    </div>
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
