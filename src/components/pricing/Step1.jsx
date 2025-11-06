import { useState, useEffect } from "react";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import "../../styles/pricing/form-step1.css";

const Step1 = () => {
  const { cartData, updateCartData } = useShoppingCart();

  const [formData, setFormData] = useState({
    email: "",
    source: "",
    houseType: "",
  });

  useEffect(() => {
    setFormData({
      email: cartData.contactInfo?.email || "",
      source: cartData.contactInfo?.source || "",
      houseType: cartData.houseType || "",
    });
  }, [cartData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleHouseTypeSelection = (houseType) => {
    setFormData((prev) => ({
      ...prev,
      houseType,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, source, houseType } = formData;

    if (!email || !source || !houseType) {
      alert("Empty fields are not allowed");
      return;
    }

    updateCartData({
      contactInfo: { ...cartData.contactInfo, email, source },
      houseType,
    });

    window.location.href = "/pricing/home-details";
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="user-info">
        <div className="input-container">
          <div className="form-control">
            <div>
              <label htmlFor="email">Email</label>
            </div>
            <input
              id="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <div>
              <label htmlFor="source">Where did you hear about us?</label>
            </div>
            <select
              id="source"
              value={formData.source}
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="Social Media">Social Media</option>
              <option value="Google">Google</option>
              <option value="Ad">Ad</option>
            </select>
          </div>
        </div>
      </div>

      <div className="house-type">
        <p className="type-title">Select your home type</p>
        <div className="house-icons">
          {["Single Family", "Town House", "Apartment", "Condominium"].map(
            (type) => (
              <div
                key={type}
                className={`type-element ${
                  formData.houseType === type ? "type-active" : "type-inactive"
                }`}
                onClick={() => handleHouseTypeSelection(type)}
              >
                <div className="house-icon">
                  <img
                    src={`/${type.toLowerCase().replace(" ", "-")}.png`}
                    alt={type}
                  />
                </div>
                <p className="type-text">{type}</p>
              </div>
            )
          )}
        </div>

        <div className="navigation-buttons">
          <button
            type="button"
            className="nav-button"
            onClick={() => (window.location.href = "/pricing/location")}
          >
            Back
          </button>
          <button type="submit" className="nav-button">
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step1;
