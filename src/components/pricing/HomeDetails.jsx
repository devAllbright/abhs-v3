import React, { useState } from 'react';
import '../../styles/pricing/home-details.css';

export default function HomeDetails() {
  // Read serviceType from sessionStorage (defaulting to "recurring" if missing)
  const serviceType = sessionStorage.getItem("serviceType") || "recurring";

  const [counters, setCounters] = useState({
    bedrooms: 0,
    fullBathrooms: 0,
    halfBathrooms: 0,
    otherRooms: 0,
  });
  
  // For oneTime service, add a separate state for Square Footage with a default value of 1500.
  const [squareFootage, setSquareFootage] = useState(1500);
  
  const [condition, setCondition] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Handles increment/decrement for the other counters
  const handleCounterChange = (field, delta) => {
    setCounters((prev) => {
      const newValue = Math.min(5, Math.max(0, prev[field] + delta));
      return { ...prev, [field]: newValue };
    });
  };

  // Handles Square Footage changes for oneTime service type.
  const handleSquareFootageChange = (delta) => {
    if (delta < 0 && squareFootage - 100 >= 800) {
      setSquareFootage(squareFootage - 100);
    }
    if (delta > 0 && squareFootage + 100 <= 3000) {
      setSquareFootage(squareFootage + 100);
    }
  };

  const handleConditionSelect = (value) => {
    setCondition(value);
    setIsModalVisible(false);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleNextClick = () => {
    if (!condition) {
      alert("You must select your home condition");
      return;
    }

    // Save additional squareFootage for oneTime service type.
    const homeDetails = serviceType === "oneTime"
      ? { squareFootage, counters, condition }
      : { counters, condition };

    sessionStorage.setItem("homeDetails", JSON.stringify(homeDetails));

    window.location.href = "/pricing/shopping-cart";
  };

  return (
    <>
      <div className="details-container">

        {serviceType === "recurring" ? (
          <>
            <div className="detail-element active-detail">
              <div className="detail-img">
                <img src="/shopping-cart/living-room.png" alt="Living Room" />
              </div>
              <div className="detail-info">
                <div>
                  <div className="detail-name">Living Room</div>
                  <div className="detail-counter">Included</div>
                </div>
              </div>
            </div>

            <div className="detail-element active-detail">
              <div className="detail-img">
                <img src="/shopping-cart/kitchen.png" alt="Kitchen" />
              </div>
              <div className="detail-info">
                <div>
                  <div className="detail-name">Kitchen</div>
                  <div className="detail-counter">Included</div>
                </div>
              </div>
            </div>

            <div className="detail-element active-detail">
              <div className="detail-img">
                <img src="/shopping-cart/dinning-room.png" alt="Dinning Room" />
              </div>
              <div className="detail-info">
                <div>
                  <div className="detail-name">Dinning Room</div>
                  <div className="detail-counter">Included</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // For oneTime, render the Square Footage counter instead.
          <div className="detail-element">
            <div className="detail-img">
              <img src="/shopping-cart/square-footage.png" alt="Square Footage" />
            </div>
            <div className="detail-info">
              <div>
                <div className="detail-name">Square Footage</div>
                <div className="detail-counter">
                  <img
                    src={squareFootage > 800 ? "/shopping-cart/colored-remove.png" : "/shopping-cart/colored-remove.png"}
                    alt=""
                    onClick={() => handleSquareFootageChange(-1)}
                  />
                  <span>{squareFootage}</span>
                  <img
                    src={squareFootage < 3000 ? "/shopping-cart/colored-add.png" : "/shopping-cart/colored-add.png"}
                    alt=""
                    onClick={() => handleSquareFootageChange(1)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`detail-element ${counters.bedrooms > 0 ? 'active-detail' : ''}`}>
          <div className="detail-img">
            <img src="/shopping-cart/bedroom.png" alt="Bedroom" />
          </div>
          <div className="detail-info">
            <div>
              <div className="detail-name">Bedroom(s)</div>
              <div className="detail-counter">
                <img
                  src={counters.bedrooms > 0 ? "/shopping-cart/remove.png" : "/shopping-cart/colored-remove.png"}
                  alt=""
                  onClick={() => handleCounterChange('bedrooms', -1)}
                />
                <span>{counters.bedrooms}</span>
                <img
                  src={counters.bedrooms > 0 ? "/shopping-cart/add.png" : "/shopping-cart/colored-add.png"}
                  alt=""
                  onClick={() => handleCounterChange('bedrooms', 1)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`detail-element ${counters.fullBathrooms > 0 ? 'active-detail' : ''}`}>
          <div className="detail-img">
            <img src="/shopping-cart/full-bathroom.png" alt="Full Bathroom" />
          </div>
          <div className="detail-info">
            <div>
              <div className="detail-name">Full Bathroom(s)</div>
              <div className="detail-counter">
                <img
                  src={counters.fullBathrooms > 0 ? "/shopping-cart/remove.png" : "/shopping-cart/colored-remove.png"}
                  alt=""
                  onClick={() => handleCounterChange('fullBathrooms', -1)}
                />
                <span>{counters.fullBathrooms}</span>
                <img
                  src={counters.fullBathrooms > 0 ? "/shopping-cart/add.png" : "/shopping-cart/colored-add.png"}
                  alt=""
                  onClick={() => handleCounterChange('fullBathrooms', 1)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`detail-element ${counters.halfBathrooms > 0 ? 'active-detail' : ''}`}>
          <div className="detail-img">
            <img src="/shopping-cart/half-bathroom.png" alt="Half Bathroom" />
          </div>
          <div className="detail-info">
            <div>
              <div className="detail-name">Half Bathroom(s)</div>
              <div className="detail-counter">
                <img
                  src={counters.halfBathrooms > 0 ? "/shopping-cart/remove.png" : "/shopping-cart/colored-remove.png"}
                  alt=""
                  onClick={() => handleCounterChange('halfBathrooms', -1)}
                />
                <span>{counters.halfBathrooms}</span>
                <img
                  src={counters.halfBathrooms > 0 ? "/shopping-cart/add.png" : "/shopping-cart/colored-add.png"}
                  alt=""
                  onClick={() => handleCounterChange('halfBathrooms', 1)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`detail-element ${counters.otherRooms > 0 ? 'active-detail' : ''}`}>
          <div className="detail-img">
            <img src="/shopping-cart/other-room.png" alt="Other Rooms" />
          </div>
          <div className="detail-info">
            <div>
              <div className="detail-name">Other Room(s)</div>
              <div className="detail-counter">
                <img
                  src={counters.otherRooms > 0 ? "/shopping-cart/remove.png" : "/shopping-cart/colored-remove.png"}
                  alt=""
                  onClick={() => handleCounterChange('otherRooms', -1)}
                />
                <span>{counters.otherRooms}</span>
                <img
                  src={counters.otherRooms > 0 ? "/shopping-cart/add.png" : "/shopping-cart/colored-add.png"}
                  alt=""
                  onClick={() => handleCounterChange('otherRooms', 1)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`detail-element ${condition ? 'active-detail' : ''}`}>
          <div className="detail-img">
            <img src="/shopping-cart/home-condition.png" alt="Home Condition" />
          </div>
          <div className="detail-info">
            <div>
              <div className="detail-name">Home Condition</div>
              <div
                className="detail-counter condition-select"
                onClick={() => setIsModalVisible(true)}
              >
                {condition || "Condition"}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="navigation-buttons">
        <a href="/pricing-v2/service-type">
          <button className="nav-button">Back</button>
        </a>
        <button className="nav-button" onClick={handleNextClick}>Next</button>
      </div>

      {isModalVisible && (
        <div className="modal-container" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>X</button>
            <p>Have you had professional cleaning services in the last 90 days?</p>
            <div className="modal-options">
              <div className="modal-option" onClick={() => handleConditionSelect("YES")}>YES</div>
              <div className="modal-option" onClick={() => handleConditionSelect("NO")}>NO</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
