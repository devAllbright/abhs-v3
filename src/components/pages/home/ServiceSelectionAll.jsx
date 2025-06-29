const services = [
  {
    name: "Maid Services",
    imgSrc: "/services/maid.png",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
    href: "#"
  },
  {
    name: "Carpet Cleaning",
    imgSrc: "/services/carpet.png",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
    href: "#"
  },
  {
    name: "Window Washing",
    imgSrc: "/services/window.png",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
    href: "#"
  },
  {
    name: "Move in Ready",
    imgSrc: "/services/moving.png",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
    href: "#"
  },
  {
    name: "Deep Cleaning",
    imgSrc: "/services/cleaning.png",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
    href: "#"
  },
  {
    name: "Upholstery Cleaning",
    imgSrc: "/services/upholstery.png",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
    href: "#"
  },
  {
    name: "Tile Cleaning",
    imgSrc: "/services/tile.png",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
    href: "#"
  },
  {
    name: "Exterior Surface",
    imgSrc: "/services/pressure.png",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
    href: "#"
  }
];

export default function ServiceSelectionAll() {
  return (
    <div className="all-services">
      <div className="grid-container">
        {services.map((service, index) => (
          <div key={index} className="all-services__item">
            <div className="all-services__item-icon">
              <img src={service.imgSrc} alt={service.name} />
            </div>
            <div className="all-services__item-title">{service.name}</div>
            <div className="all-services__item-description">
              <p>{service.description}</p>
            </div>
            <div className="all-services__item-more-info">
              <a href={service.href}>Learn More &#8594;</a>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  )
}