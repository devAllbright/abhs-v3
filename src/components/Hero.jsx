import { useState, useEffect } from "react";
/* import CTAButton from "./buttons/CTAButton"; */
//import ModalCTA from "./buttons/ModalCTA";
import SmartCTA from "./buttons/SmartCTA";
import HCPButton from "./buttons/HCPButton";

const StaticColumn = ({ images }) => (
  <div className="primary-banner__collage-column-wrapper">
    <div className="primary-banner__collage-column primary-banner__collage-column--animated">
      {images.map((item, i) => (
        <img
          key={i}
          src={item.src}
          alt={`Image ${i + 1}`}
          className={`primary-banner__collage-image primary-banner__collage-image--type-${item.type}`}
          loading="lazy"
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

  const columnOneImages = uiImages.slice(0, 8);
  const columnTwoImages = uiImages.slice(8, 16);

  useEffect(() => {
    const storedServiceType = sessionStorage.getItem("serviceType");
    setServiceType(storedServiceType);
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

      <div className="primary-banner__collage">
        <div className="primary-banner__collage-container">
          <StaticColumn images={columnOneImages} />
          <StaticColumn images={columnTwoImages} />
        </div>
      </div>
    </div>
  );
}
