import { useState, useEffect, useMemo } from "react";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import maidData from "../../data/maidServicesPrices.json";
import proData from "../../data/professionalServicesPrices.json";
import "../../styles/pricing/home-details.css";

export default function StepHomeDetails() {
  const { cartData, updateCartData } = useShoppingCart();
  const selectedService = cartData.selectedService;

  console.log(cartData)

  const [counters, setCounters] = useState({
    bedrooms: cartData.bedroomNumber || 1,
    fullBathrooms: cartData.bathroomNumber || 1,
    halfBathrooms: cartData.halfBathroomNumber || 0,
    otherRooms: cartData.otherRoomNumber || 0
  });

  const [squareFootage, setSquareFootage] = useState(
    cartData.squareFootage || ""
  );

  const maidOptions = useMemo(() => {
    return maidData.priceTiers.map((t) => t.sqftRange);
  }, []);

  const proOptions = useMemo(() => {
    return proData.priceTiers.map((t) => t.sqftRange);
  }, []);

  const carpetOptions = useMemo(() => {
    const arr = [];
    for (let sqft = 800; sqft <= 3600; sqft += 200) {
      const next = sqft + 200;
      arr.push(`${sqft}-${next}`);
    }
    arr.push("More than 3600");
    return arr;
  }, []);

  const squareFootageOptions = useMemo(() => {
    if (selectedService === "Maid Services") return [...maidOptions, "More than 3600"];
    if (selectedService === "Professional Services") return [...proOptions, "More than 3600"];
    if (selectedService === "Carpet Cleaning") return carpetOptions;
    return [];
  }, [selectedService, maidOptions, proOptions, carpetOptions]);

  useEffect(() => {
    if (squareFootage === "More than 3600") {
      alert("For homes larger than 3600 sq ft, please request a free in-home consultation.");
      window.location.href = "/";
      return;
    }

    updateCartData({
      livingRoomIncluded: true,
      kitchenIncluded: true,
      dinningRoomIncluded: true,
      bedroomNumber: counters.bedrooms,
      bathroomNumber: counters.fullBathrooms,
      halfBathroomNumber: counters.halfBathrooms,
      otherRoomNumber: counters.otherRooms,
      squareFootage
    });
  }, [counters, squareFootage]);

  const handleCounterChange = (field, delta) => {
    setCounters((prev) => {
      let newValue = prev[field] + delta;
      const limits = {
        bedrooms: { min: 1, max: 5 },
        fullBathrooms: { min: 1, max: 5 },
        halfBathrooms: { min: 0, max: 5 },
        otherRooms: { min: 0, max: 5 }
      };
      const { min, max } = limits[field];
      if (newValue < min) newValue = min;
      if (newValue > max) newValue = max;
      return { ...prev, [field]: newValue };
    });
  };

  const handleNextClick = () => {
    if (squareFootage === "More than 3600") {
      alert("For homes larger than 3600 sq ft, please request a free in-home consultation.");
      window.location.href = "/";
      return;
    }

    window.location.href = "/pricing/pro-services";
  };

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
                  <option value="">Select a range</option>
                  {squareFootageOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
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
          { key: "otherRooms", label: "Other Room(s)", img: "other-room.png" }
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
