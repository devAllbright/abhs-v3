export default function MegaMenu({ visible, onLeave }) {
  return (
    <div
      className={`mega-menu ${visible ? 'mega-menu--visible' : ''}`}
      onMouseLeave={onLeave}
    >
      <div className="mega-menu__content">
         <div className="mega-menu__section">
            <div className="mega-menu__section-title">
              <p>Service Type</p>
            </div>
            <div className="mega-menu__service-type">
              <div className="mega-menu__service-type-icon">
                <img src="" alt="" />
              </div>
              <div className="mega-menu__service-type-name">
                <p>Recurring Services</p>
              </div>
              <div className="mega-menu__service-type-description">
                <p>This will be the description for recurring Services</p>
              </div>
            </div>
            <div className="mega-menu__service-type">
              <div className="mega-menu__service-type-icon">
                <img src="" alt="" />
              </div>
              <div className="mega-menu__service-type-name">
                <p>One Time Services</p>
              </div>
              <div className="mega-menu__service-type-description">
                <p>This will be the description for One Time Services</p>
              </div>
            </div>
            <div className="mega-menu__service-type">
              <div className="mega-menu__service-type-icon">
                <img src="" alt="" />
              </div>
              <div className="mega-menu__service-type-name">
                <p>Packages</p>
              </div>
              <div className="mega-menu__service-type-description">
                <p>This will be the description for Packages</p>
              </div>
            </div>
         </div>
         <div className="mega-menu__section">
          <div className="mega-menu-category">
            <div className="mega-menu-category-service">
              Aqui va la tarjeta de servicio
            </div>
          </div>
         </div>
      </div>
      <div className="mega-menu__overlay" />
    </div>
  )
}
