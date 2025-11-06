import { useState, useEffect } from "react";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import "../../styles/pricing/home-condition.css";

export default function Step3() {
  const { cartData, updateCartData } = useShoppingCart();
  const [hadProServices, setHadProServices] = useState(
    cartData.hadProServices !== null && cartData.hadProServices !== undefined
      ? cartData.hadProServices
      : ""
  );

  useEffect(() => {
    updateCartData({ hadProServices });
  }, [hadProServices]);

  const handleConditionSelect = (value) => {
    setHadProServices(value === "YES");
  };

  const handleNextClick = () => {
    if (hadProServices === "") {
      alert("You must select your home condition");
      return;
    }
    updateCartData({ hadProServices });
    window.location.href = "/pricing/shopping-cart";
  };

  return (
    <>
      <div className="details-container">
        <div className="modal-options static-options">
          <div
            className={`modal-option ${hadProServices === true ? "selected" : ""}`}
            onClick={() => handleConditionSelect("YES")}
          >
            YES
          </div>
          <div
            className={`modal-option ${hadProServices === false ? "selected" : ""}`}
            onClick={() => handleConditionSelect("NO")}
          >
            NO
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <a href="/pricing/home-details">
          <button className="nav-button">Back</button>
        </a>
        <button className="nav-button" onClick={handleNextClick}>
          Next
        </button>
      </div>
    </>
  );
}
