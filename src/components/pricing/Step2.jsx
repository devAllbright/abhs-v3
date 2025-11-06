import { useState, useEffect } from "react";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import "../../styles/pricing/home-details.css";

export default function StepHomeDetails() {
  const { cartData, updateCartData } = useShoppingCart();
  const serviceType = cartData.selectedServiceType || "recurring";

  const [counters, setCounters] = useState({
    bedrooms: cartData.bedroomNumber || 1,
    fullBathrooms: cartData.bathroomNumber || 1,
    halfBathrooms: cartData.halfBathroomNumber || 0,
    otherRooms: cartData.otherRoomNumber || 0,
  });

  const [squareFootage, setSquareFootage] = useState(
    cartData.squareFootage || "1500-1800"
  );

  useEffect(() => {
    updateCartData({
      livingRoomIncluded: true,
      kitchenIncluded: true,
      dinningRoomIncluded: true,
      bedroomNumber: counters.bedrooms,
      bathroomNumber: counters.fullBathrooms,
      halfBathroomNumber: counters.halfBathrooms,
      otherRoomNumber: counters.otherRooms,
      squareFootage,
    });
  }, [counters, squareFootage]);

  const handleCounterChange = (field, delta) => {
    setCounters((prev) => {
      let newValue = prev[field] + delta;
      const limits = {
        bedrooms: { min: 1, max: 5 },
        fullBathrooms: { min: 1, max: 5 },
        halfBathrooms: { min: 0, max: 5 },
        otherRooms: { min: 0, max: 5 },
      };
      const { min, max } = limits[field];
      if (newValue < min) newValue = min;
      if (newValue > max) newValue = max;
      return { ...prev, [field]: newValue };
    });
  };

  const handleNextClick = () => {
    updateCartData({
      livingRoomIncluded: true,
      kitchenIncluded: true,
      dinningRoomIncluded: true,
      bedroomNumber: counters.bedrooms,
      bathroomNumber: counters.fullBathrooms,
      halfBathroomNumber: counters.halfBathrooms,
      otherRoomNumber: counters.otherRooms,
      squareFootage,
    });

    window.location.href = "/pricing/pro-services";
  };

  const squareFootageOptions = [
    "800-1000",
    "1000-1200",
    "1200-1400",
    "1400-1600",
    "1600-1800",
    "1800-2000",
    "2000-2200",
    "2200-2400",
    "2400-2800",
    "2800-3000",
    "3000-3200",
    "3200-3400",
    "3400-3600",
    "More than 3600",
  ];

  return (
    <>
      <div className="details-container">
        {["Living Room", "Kitchen", "Dinning Room"].map((room) => (
          <div key={room} className="detail-element active-detail">
            <div className="detail-img">
              <img
                src={`/shopping-cart/${room.toLowerCase().replace(" ", "-")}.png`}
                alt={room}
              />
            </div>
            <div className="detail-info">
              <div>
                <div className="detail-name">{room}</div>
                <div className="detail-counter">Included</div>
              </div>
            </div>
          </div>
        ))}

        <div className="detail-element">
          <div className="detail-img">
            <img src="/shopping-cart/square-footage.png" alt="Square Footage" />
          </div>
          <div className="detail-info">
            <div>
              <div className="detail-name">Square Footage</div>
              <div className="detail-counter">
                <select
                  id="square-footage"
                  value={squareFootage}
                  onChange={(e) => setSquareFootage(e.target.value)}
                >
                  {squareFootageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {[
          { key: "bedrooms", label: "Bedroom(s)", img: "bedroom.png" },
          { key: "fullBathrooms", label: "Full Bathroom(s)", img: "full-bathroom.png" },
          { key: "halfBathrooms", label: "Half Bathroom(s)", img: "half-bathroom.png" },
          { key: "otherRooms", label: "Other Room(s)", img: "other-room.png" },
        ].map(({ key, label, img }) => (
          <div
            key={key}
            className={`detail-element ${counters[key] > 0 ? "active-detail" : ""}`}
          >
            <div className="detail-img">
              <img src={`/shopping-cart/${img}`} alt={label} />
            </div>
            <div className="detail-info">
              <div>
                <div className="detail-name">{label}</div>
                <div className="detail-counter">
                  <img
                    src={
                      counters[key] > 0
                        ? "/shopping-cart/remove.png"
                        : "/shopping-cart/colored-remove.png"
                    }
                    alt="Decrease"
                    onClick={() => handleCounterChange(key, -1)}
                  />
                  <span>{counters[key]}</span>
                  <img
                    src={
                      counters[key] > 0
                        ? "/shopping-cart/add.png"
                        : "/shopping-cart/colored-add.png"
                    }
                    alt="Increase"
                    onClick={() => handleCounterChange(key, 1)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="navigation-buttons">
        <a href="/pricing/home-type">
          <button className="nav-button">Back</button>
        </a>
        <button className="nav-button" onClick={handleNextClick}>
          Next
        </button>
      </div>
    </>
  );
}
