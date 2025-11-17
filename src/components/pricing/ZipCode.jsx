import { useState, useEffect } from "react";
import zipCodeMap from "../../data/zipCodeMap.json";
import { loadFromStorage, saveToStorage } from "../../helpers/storageUtils";
import "../../styles/pricing/zip-code.css";

const ZipCode = () => {
  const [zipCode, setZipCode] = useState("");
  const [isValidLength, setIsValidLength] = useState(false);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const saved = loadFromStorage("cartData");
    if (saved?.zipCode) {
      const z = saved.zipCode;
      setZipCode(z);
      setIsValidLength(z.length === 5);
      const foundLocation = findLocation(z);
      if (foundLocation) setLocation(foundLocation);
    }
  }, []);

  const findLocation = (zip) => {
    for (let area in zipCodeMap) {
      if (zipCodeMap[area].includes(zip)) {
        return area;
      }
    }
    return "";
  };

  const handleChange = (event) => {
    const entered = event.target.value.replace(/\D/g, "").slice(0, 5);
    setZipCode(entered);
    setIsValidLength(entered.length === 5);

    if (entered.length === 5) {
      const found = findLocation(entered);
      setLocation(found);
    } else {
      setLocation("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isValidLength) return;

    const foundLocation = findLocation(zipCode);

    if (!foundLocation) {
      alert("Sorry, we currently do not serve this location.");
      window.location.href = "/";
      return;
    }

    saveToStorage("cartData", { zipCode });
    window.location.href = "/pricing/home-type";
  };

  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <div className="img-container">
              <img src="/icon-location.png" alt="location icon" />
            </div>

            <input
              type="text"
              id="postal-code"
              name="postal-code"
              placeholder="Postal Code"
              value={zipCode}
              onChange={handleChange}
              maxLength="5"
              inputMode="numeric"
            />

            <button
              type="submit"
              id="submit-button"
              className={isValidLength ? "submit-enabled" : "submit-disabled"}
              disabled={!isValidLength}
            >
              NEXT
            </button>
          </div>
        </form>
      </div>

      <div className="location-container">
        {location && <p id="location-display">{location}</p>}
      </div>
    </>
  );
};

export default ZipCode;
