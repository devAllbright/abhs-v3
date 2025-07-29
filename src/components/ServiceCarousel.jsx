import { useEffect, useRef, useState } from 'react';

const services = [
  {
    id: 1,
    title: 'Bi-Monthly Maid Services',
    description: 'Your bi-monthly solution for a home that feels clean, cared for, and effortlessly refreshed.',
    price: 'Starting at $195',
    image: '/images/service1.jpg',
  },
  {
    id: 2,
    title: 'Custom Cleaning',
    description: 'Tailored cleaning to match your needs and schedule.',
    price: 'Starting at $135',
    image: '/images/service2.jpg',
  },
  {
    id: 3,
    title: 'Exterior Detailed Cleaning',
    description: 'Revitalize the exterior of your home with detailed cleaning.',
    price: 'Starting at $160',
    image: '/images/service3.jpg',
  },
];

const INTERVAL_MS = 6000;

export default function ServiceCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const progressRef = useRef(null);
  const timeoutRef = useRef(null);

  const resetTimer = () => {
    clearTimeout(timeoutRef.current);
    progressRef.current?.classList.remove('carousel__progress-bar--animate');
    void progressRef.current?.offsetWidth; // Force reflow
    progressRef.current?.classList.add('carousel__progress-bar--animate');
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, INTERVAL_MS);
  };

  useEffect(() => {
    resetTimer();
    return () => clearTimeout(timeoutRef.current);
  }, [activeIndex]);

  const handleSelect = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className='carousel-container'>
			<div className="carousel">
				<div className="carousel__sidebar">
					{services.map((service, index) => (
						<button
							key={service.id}
							className={`carousel__thumbnail ${index === activeIndex ? 'carousel__thumbnail--active' : ''}`}
							onClick={() => handleSelect(index)}
							aria-label={`View ${service.title}`}
						>
							<img src={service.image} alt={service.title} />
							<span>{service.title}</span>
						</button>
					))}
				</div>

				<div className="carousel__main">
					<img className="carousel__image" src={services[activeIndex].image} alt={services[activeIndex].title} />
					<div className="carousel__info">
						<h2 className="carousel__title">{services[activeIndex].title}</h2>
						<p className="carousel__price">{services[activeIndex].price}</p>
						<p className="carousel__description">{services[activeIndex].description}</p>
						<a href="#" className="carousel__link">Learn more &gt;</a>
					</div>
					<div ref={progressRef} className="carousel__progress-bar" />
				</div>
			</div>
    </div>
  );
}
