const RotatingSystemFrame = () => {

  return (
    <div className="rotating-system-frame">
      <div className="rotating-system-frame__header">
        <p className="rotating-system-frame__title">
          Our Signature Rotating Cleaning System
        </p>
        <p className="rotating-system-frame__subtitle">
          ✔ CONSISTENT ✔ ACCOMMODATING ✔ AFFORDABLE
        </p>
      </div>

      <div className="rotating-system-frame__body">
        <div className="rotating-system-frame__side rotating-system-frame__side--media">
          <img
            className="rotating-system-frame__image"
            src="/rotating-system.png"
            alt="Diagram of the Rotating Cleaning System"
          />
        </div>

        <div className="rotating-system-frame__side rotating-system-frame__side--content">
          <div className="rotating-system-frame__text">
            <p className="rotating-system-frame__paragraph">
              AllBright's revolutionary cleaning system delivers impeccable kitchens, bathrooms,
              and living spaces during every visit. Our flexible schedule also includes rotating
              options such as high dusting, window sills, and baseboards. Enhance your service with
              extras like oven, refrigerator, and cabinet cleaning. Choose AllBright for exceptional
              cleanliness and ultimate peace of mind.
              
            </p>

            <p className="rotating-system-frame__bullets">
              ✔ HOW IT WORKS ✔ WHAT WE DO
            </p>

          <button
            className="rotating-system-frame__cta-button"
            onClick={() => window.location.href = '/rotating-system'}
          >
            Learn more &rarr;
          </button>
          </div>
        </div>
      </div>

      <div className="rotating-system-frame__subtitle-row">
        <p className="rotating-system-frame__subtitle-row-text">
          From sparkling counters to dust-free trim, our rotating checklist keeps every space
          consistently fresh while giving extra love to a different zone each visit.
        </p>
      </div>
    </div>
  );
};

export default RotatingSystemFrame;
