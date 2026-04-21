import { useState, useEffect } from "react";
/* import CTAButton from "./buttons/CTAButton"; */
//import ModalCTA from "./buttons/ModalCTA";
import SmartCTA from "./buttons/SmartCTA";
import HCPButton from "./buttons/HCPButton";

const StaticColumn = ({ images, onImageLoad }) => (
  <div className="primary-banner__collage-column-wrapper">
    <div className="primary-banner__collage-column primary-banner__collage-column--animated">
      {images.map((item, i) => (
        <img
          key={i}
          src={item.src}
          alt={`Image ${i + 1}`}
          className={`primary-banner__collage-image primary-banner__collage-image--type-${item.type}`}
          style={{
            ...item.style
          }}
          loading="eager"
          onLoad={onImageLoad}
          onError={onImageLoad}
          fetchPriority={i < 4 ? "high" : "auto"} // Prioritize the first few images in each column
        />
      ))}
    </div>
  </div>
);

export default function Hero({ bannerData }) {
  const {
    ratingText,
    title,
    /* subtitle, */
    description,
    socialProof,
    images,
    uiImages,
  } = bannerData;

  const [serviceType, setServiceType] = useState(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isForcedVisible, setIsForcedVisible] = useState(false);

  // Dynamically split uiImages into two equal-ish columns
  const mid = Math.ceil(uiImages.length / 2);
  const columnOneOriginal = uiImages.slice(0, mid);
  const columnTwoOriginal = uiImages.slice(mid);

  // Double each column for a seamless infinite loop with translateY(-50%)
  const columnOneImages = [...columnOneOriginal, ...columnOneOriginal];
  const columnTwoImages = [...columnTwoOriginal, ...columnTwoOriginal];

  const totalImages = columnOneImages.length + columnTwoImages.length;
  // Reduced threshold: Wait for 50% of images or the unique ones, whichever is smaller, to feel "fast"
  const loadingThreshold = Math.min(uiImages.length, 6); 
  const allImagesLoaded = loadedCount >= loadingThreshold || isForcedVisible;

  const handleImageLoad = () => {
    setLoadedCount(prev => prev + 1);
  };

  useEffect(() => {
    const storedServiceType = sessionStorage.getItem("serviceType");
    setServiceType(storedServiceType);

    // Initial check for cached images
    const imgElements = document.querySelectorAll('.primary-banner__collage-image');
    let completed = 0;
    imgElements.forEach(img => {
      if (img.complete) completed++;
    });
    if (completed > 0) {
      setLoadedCount(prev => prev + completed);
    }

    // Fallback: If images take too long (e.g. 1.2s), show the carousel anyway
    const timer = setTimeout(() => {
      setIsForcedVisible(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="primary-banner">
      <div className="primary-banner__content">
        <div>
          <div className="primary-banner__reviews">
            <img
              src={images.googleLogo}
              className="primary-banner__reviews-icon"
              alt="Google Logo"
            />
            <img
              src={images.ratingStars}
              className="primary-banner__reviews-icon"
              alt="Rating Star"
            />
            <p className="primary-banner__reviews-text">{ratingText}</p>
          </div>

          <h1 className="primary-banner__title">
            {title}
            <br />
            {/* <span>{subtitle}</span> */}
          </h1>

          <p className="primary-banner__description">{description}</p>

          <div className="primary-banner__social-proof">
            {socialProof.map((text, index) => (
              <div
                key={index}
                className="primary-banner__social-proof-item"
              >
                <img
                  className="primary-banner__social-proof-icon"
                  src={images.checkIcon}
                  alt="Check Icon"
                />
                <p className="primary-banner__social-proof-text">{text}</p>
              </div>
            ))}
          </div>

          <div className="primary-banner__cta">
            <SmartCTA
              secondaryCta="Book a FREE Consultation"
              buttonClass="primary-cta banner-cta"
            />
          </div>
        </div>
      </div>

      <div className={`primary-banner__collage ${allImagesLoaded ? 'primary-banner__collage--loaded' : ''}`}>
        <div className="primary-banner__collage-container">
          <StaticColumn images={columnOneImages} onImageLoad={handleImageLoad} />
          <StaticColumn images={columnTwoImages} onImageLoad={handleImageLoad} />
        </div>
      </div>
    </div>
  )
}
