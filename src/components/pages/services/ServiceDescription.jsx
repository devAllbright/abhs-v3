import { useEffect, useRef } from "react";

export default function ServiceDescription({ descriptionData }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.warn("Autoplay blocked by browser settings.", err);
            });
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }
      });
    }, observerOptions);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div className="service-description">
      <div 
        className="service-description__img"
        ref={containerRef}
      >
        {descriptionData.videoUrl ? (
          <video 
            ref={videoRef}
            loop 
            muted 
            playsinline 
            controls
            poster={descriptionData.imageUrl}
          >
            <source src={descriptionData.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img src={descriptionData.imageUrl} alt={descriptionData.title} />
        )}
      </div>
      <div className="service-description__text">
        <div>
          <h2 className="service-description__title">{descriptionData.title}</h2>
          {descriptionData.paragraphs.map((para, index) => (
            <div key={index}>
              <h3 className="service-description__subtitle">{para.subtitle}</h3>
              <p className="service-description__brief">{para.brief}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}