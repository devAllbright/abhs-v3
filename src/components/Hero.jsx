import CTAButton from "./buttons/CTAButton";

const PrimaryBanner = ({ bannerData }) => {
  const { ratingText, title, subtitle, description, socialProof, images, imgClass } = bannerData;

  return (
    <div className="primary-banner">
      <div className="primary-banner__content">
        <div>
          <div className="primary-banner__reviews">
            <img src={images.googleLogo} className="primary-banner__reviews-icon" alt="Google Logo" />
            <img src={images.ratingStars} className="primary-banner__reviews-icon" alt="Rating Stars" />
            <p className="primary-banner__reviews-text">{ratingText}</p>
          </div>
          <h1 className="primary-banner__title">
            {title}<br />
            <span>{subtitle}</span>
          </h1>
          <p className="primary-banner__description">{description}</p>
          <div className="primary-banner__social-proof">
            {socialProof.map((text, index) => (
              <div key={index} className="primary-banner__social-proof-item">
                <img className="primary-banner__social-proof-icon" src={images.checkIcon} alt="Check Icon" />
                <p className="primary-banner__social-proof-text">{text}</p>
              </div>
            ))}
          </div>
          <div className="primary-banner__cta">
            <CTAButton href="#" text="Check Prices" buttonClass="primary-cta" />
          </div>
        </div>
      </div>
      <div className={ "primary-banner__img" + imgClass }>
        <img src={images.heroImage} alt="Hero Image" />
      </div>
    </div>
  );
};

export default PrimaryBanner;
