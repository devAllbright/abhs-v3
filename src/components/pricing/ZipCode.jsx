import { useState, useEffect } from "react";
import zipCodeMap from "../../data/zipCodeMap.json";
import { loadFromStorage, updateStorage } from "../../helpers/storageUtils";
import "../../styles/pricing/zip-code.css";

const ZipCode = () => {
  const [zipCode, setZipCode] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const saved = loadFromStorage("cartData");
    if (saved?.zipCode) {
      setZipCode(saved.zipCode);

      let foundLocation = "";
      for (let area in zipCodeMap) {
        if (zipCodeMap[area].includes(saved.zipCode)) {
          foundLocation = area;
          break;
        }
      }

      if (foundLocation) {
        setIsValid(true);
        setLocation(foundLocation);
      }
    }
  }, []);

  const handleChange = (event) => {
    const enteredZipCode = event.target.value.replace(/\D/g, "");
    setZipCode(enteredZipCode);

    if (enteredZipCode.length !== 5) {
      setIsValid(false);
      setLocation("");
      return;
    }

    let foundLocation = "";
    for (let area in zipCodeMap) {
      if (zipCodeMap[area].includes(enteredZipCode)) {
        foundLocation = area;
        break;
      }
    }

    if (foundLocation) {
      setIsValid(true);
      setLocation(foundLocation);
    } else {
      setIsValid(false);
      setLocation("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isValid) {
      updateStorage("cartData", { zipCode });
      window.location.href = "/pricing/home-type";
    }
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
              className={isValid ? "submit-enabled" : "submit-disabled"}
              disabled={!isValid}
            >
              NEXT
            </button>
          </div>
        </form>
      </div>
      <div className="location-container">
        {isValid && <p id="location-display">{location}</p>}
      </div>
    </>
  );
};

export default ZipCode;
