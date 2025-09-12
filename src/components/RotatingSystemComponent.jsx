import { useState, useEffect } from 'react';

const RotatingSystemComponent = () => {
  const [rotation, setRotation] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [currentInfo, setCurrentInfo] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const infoData = [
    {
      className: 'bathroom-info',
      title: 'Bathroom',
      normalCleaning: [
        `Clean and disinfect bathtubs, stone showers, glass enclosures, sinks, and mirrors.`,
        `Clean, disinfect, and hand polish stone counters.`,
        `Clean and disinfect toilets - inside and out, including base.`,
        `Wipe down light fixtures and polish chrome.`,
        `Cabinet's front cleaned.`,
        `Empty trash cans.`,
        `Sweep, damp-mop, and dry wood floors.`,
      ],
      rotatingCleaning: [
        `Scrub grout, polish glass, and detail faucets and drains.`,
        `Detail backsplash edges and apply stone protector.`,
        `Scrub hinges, base edges, and polish toilet handle.`,
        `Wipe bulbs and covers, polish chrome surfaces.`,
        `Clean cabinet handles, hinges, and sides.`,
        `Sanitize and deodorize trash bins inside and out.`,
        `Hand clean floor corners and apply wood polish.`,
      ],
    },
    {
      className: 'kitchen-info',
      title: 'Kitchen',
      normalCleaning: [
        `Clean and disinfect sinks and stone counters.`,
        `Sanitize the top, front, and sides of the refrigerator, stove, and oven.`,
        `Clean microwave inside and out.`,
        `Clean and polish stainless steel appliances and chrome.`,
        `Empty trash cans.`,
        `Sweep, mop, and dry wood floors.`,
      ],
      rotatingCleaning: [
        `Detail backsplash seams and apply stone protector.`,
        `Degrease range hood interior and scrub drip pans.`,
        `Wipe vents, turntable, and keypad edges.`,
        `Buff stainless with grain-safe polish and brighten chrome.`,
        `Sanitize and deodorize bins inside and out.`,
        `Hand clean floor edges and wipe baseboards.`,
      ],
    },
    {
      className: 'requests-info',
      title: 'Living Areas',
      normalCleaning: [
        `Thoroughly dust the top of furniture, shelves, pictures, and light fixtures.`,
        `Clean and polish the top surfaces of wood and glass furniture.`,
        `Wipe windowsills.`,
        `Hard-to-reach dusting areas.`,
        `Empty trash cans.`,
        `Vacuum all carpeted areas.`,
      ],
      rotatingCleaning: [
        `Hand wipe furniture surfaces and polish details.`,
        `Vacuum and refresh upholstered furniture pieces.`,
        `Hand wipe window sills and ledges.`,
        `Detail dust intricate items and knickknacks.`,
        `Sanitize and deodorize trash bins inside and out.`,
        `Vacuum carpet edges and under furniture areas.`,
      ],
    },
    {
      className: 'bedrooms-info',
      title: 'Sleeping Areas',
      normalCleaning: [
        `Remove cobwebs.`,
        `Dust baseboards.`,
        `Dust shutters.`,
        `Clean inside the oven.`,
        `Clean inside the refrigerator.`,
        `Empty trash cans.`,
        `Change linens.`,
      ],
      rotatingCleaning: [
        `Hand wipe doors and window sills.`,
        `Deep clean knickknacks and furniture surfaces.`,
        `Vacuum upholstered furniture and carpet edges.`,
        `Give extra attention to floors and corners.`,
        `Vacuum accessible areas under furniture.`,
        `Sanitize and deodorize trash bins inside and out.`,
        `Freshen mattresses and fluff pillows.`,
      ],
    },
  ];

  const handleRotate = () => {
    setShowInfo(false);
    setRotation((prev) => prev + 90);
    setTimeout(() => {
      setCurrentInfo((prev) => (prev + 1) % infoData.length);
      setShowInfo(true);
    }, 500);
  };

  useEffect(() => {
    if (autoRotate) {
      const intervalId = setInterval(handleRotate, 4000);
      return () => clearInterval(intervalId);
    }
  }, [autoRotate, currentInfo]);

  const handleManualRotate = () => {
    handleRotate();
    setAutoRotate(false);
  };

  return (
  <>
  <div className="rotating-system-frame__header">
    <p className="rotating-system-frame__title">
      Our Signature Rotating Cleaning System
    </p>
    <p className="rotating-system-frame__subtitle">
      ✔ CONSISTENT ✔ ACCOMMODATING ✔ AFFORDABLE
    </p>
  </div>
  <div className="rotating-system">
      <div
        className="rotating-system__grid"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div
          className={`rotating-system__circle rotating-system__circle--kitchen ${
            currentInfo === 1 ? 'rotating-system__circle--highlight' : ''
          }`}
          style={{ transform: `rotate(${-rotation}deg)` }}
          onClick={handleManualRotate}
        >
          <img src="/rotating-kitchen.png" alt="Kitchen" className="rotating-system__img" />
        </div>

        <div
          className={`rotating-system__circle rotating-system__circle--requests ${
            currentInfo === 2 ? 'rotating-system__circle--highlight' : ''
          }`}
          style={{ transform: `rotate(${-rotation}deg)` }}
          onClick={handleManualRotate}
        >
          <img src="/rotating-living-areas.png" alt="Requests" className="rotating-system__img" />
        </div>

        <div
          className={`rotating-system__circle rotating-system__circle--bathrooms ${
            currentInfo === 0 ? 'rotating-system__circle--highlight' : ''
          }`}
          style={{ transform: `rotate(${-rotation}deg)` }}
          onClick={handleManualRotate}
        >
          <img src="/rotating-bathroom.png" alt="Bathrooms" className="rotating-system__img" />
        </div>

        <div
          className={`rotating-system__circle rotating-system__circle--bedrooms ${
            currentInfo === 3 ? 'rotating-system__circle--highlight' : ''
          }`}
          style={{ transform: `rotate(${-rotation}deg)` }}
          onClick={handleManualRotate}
        >
          <img
            src="/rotating-sleeping-areas.png"
            alt="Bedrooms"
            className="rotating-system__img"
          />
        </div>

        <div
          className="rotating-system__circle rotating-system__circle--arrows"
          style={{ transform: `rotate(${rotation}deg)` }}
          onClick={handleManualRotate}
        >
          <img src="/rotating-arrows.png" alt="Rotate" />
        </div>
      </div>

      <div className="rotating-system__description">
        <div
          className={`rotating-system__info-box rotating-system__info-box--${
            infoData[currentInfo]?.className
          } ${showInfo ? 'rotating-system__info-box--visible' : 'rotating-system__info-box--hidden'}`}
        >
          <div className="rotating-system__subheader">
            {infoData[currentInfo]?.title}
          </div>

          <div className="rotating-system__text">
            <div className="rotating-system__section-container">
              <div className="rotating-system__section">
                <div className="rotating-system__section-header">Normal Clean</div>
                <div className="rotating-system__section-content">
                  {infoData[currentInfo]?.normalCleaning.map((item, index) => (
                    <p key={index} className="rotating-system__item">
                      <span className="rotating-system__checkmark">&#x2713;</span>
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rotating-system__section">
                <div className="rotating-system__section-header">Rotation Clean</div>
                <div className="rotating-system__section-content">
                  {infoData[currentInfo]?.rotatingCleaning.map((item, index) => (
                    <p key={index} className="rotating-system__item">
                      <span className="rotating-system__checkmark">&#x2713;</span>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
  </>
    
    
  );
};

export default RotatingSystemComponent;
