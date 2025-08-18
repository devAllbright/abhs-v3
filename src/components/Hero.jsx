import { useState } from "react";
import RedirectCTA from "./buttons/RedirectCTA";
import ModalCTA from "./buttons/ModalCTA";
import LeadModal from '../components/LeadModal'

const IMAGE_LIST = [
  { type: "a", src: "/collage/collage-img-1.jpg" },
  { type: "b", src: "/collage/collage-img-2.jpg" },
  { type: "a", src: "/collage/collage-img-3.jpg" },
  { type: "b", src: "/collage/collage-img-4.jpg" },
  { type: "a", src: "/collage/collage-img-5.jpg" },
  { type: "b", src: "/collage/collage-img-6.jpg" },
  { type: "a", src: "/collage/collage-img-7.jpg" },
  { type: "b", src: "/collage/collage-img-8.jpg" },
];

const StaticColumn = ({ images }) => (
  <div className="primary-banner__collage-column-wrapper">
    <div className="primary-banner__collage-column primary-banner__collage-column--animated">
      {[...images, ...images].map((item, i) => (
        <img
          key={i}
          src={item.src}
          alt={`Collage ${i + 1}`}
          className={`primary-banner__collage-image primary-banner__collage-image--type-${item.type}`}
          loading="lazy"
        />
      ))}
    </div>
  </div>
);

const PrimaryBanner = ({ bannerData }) => {
  const [showModal, setShowModal] = useState(false);

  const { ratingText, title, subtitle, description, socialProof, images, ctaAction } = bannerData;

  return (
    <>
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
              {ctaAction === "redirect" ? (
                <RedirectCTA
                  href="https://book.housecallpro.com/book/All-Bright-Home-Services/38acff17233d44ec9cdc0edf4aadf395?v2=true"
                  text="Free Consultation"
                  buttonClass="primary-cta"
                />
              ) : (
                <ModalCTA
                  text="Free Consultation"
                  buttonClass="primary-cta"
                />
              )}
            </div>
          </div>
        </div>

        <div className="primary-banner__collage">
          <div className="primary-banner__collage-container">
            <StaticColumn images={IMAGE_LIST} />
            <StaticColumn images={[...IMAGE_LIST].reverse()} />
          </div>
        </div>

      </div>
      
      <LeadModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default PrimaryBanner;
