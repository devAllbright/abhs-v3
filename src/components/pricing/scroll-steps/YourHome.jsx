import React, { useContext, useState, useEffect } from 'react'
import { ShoppingCartContext } from '../../../context/ShoppingCartContext'
import "../../../styles/pricing/shopping-cart/scroll-steps/your-home";


export default function YourHome() {

  const { cartData, updateCartData } = useContext(ShoppingCartContext)

  const [squareFootage, setSquareFootage] = useState(1200);
  const [levels, setLevels] = useState(1);
  const [surface, setSurface] = useState("");
  const [condition, setCondition] = useState("NO");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSquareFootageChange = (amount) => {
    setSquareFootage((prev) => {
      const newValue = prev + amount;
      if (newValue < 0) return 0;
      if (newValue > 3000) return 3000;
      return newValue;
    });
  };

  const handleLevelsChange = (amount) => {
    setLevels((prev) => {
      const newValue = prev + amount;
      if (newValue < 0) return 0;
      if (newValue > 3) return 3;
      return newValue;
    });
  };

  const handleSurfaceChange = (value) => {
    setSurface(value)
    updateCartData('yourHome', { ...cartData.yourHome, surface: value })
  }

  const handleConditionClick = () => {
    setIsModalOpen(true);
  };

  const handleConditionSelect = (value) => {
    setCondition(value);
    updateCartData('yourHome', { ...cartData.yourHome, condition: value })
    setIsModalOpen(false);
  };

  useEffect(() => {
    updateCartData('yourHome', { ...cartData.yourHome, squareFootage })
  }, [squareFootage])
  
  useEffect(() => {
    updateCartData('yourHome', { ...cartData.yourHome, levels })
  }, [levels])

  return (
    <div className='scroll-your-home'>
      <div className="scroll-title"><p>Your Home</p></div>

      <div className="details-container">

        <div className="detail-box">
          <div className="detail-element">
            <div className="detail-name"><p>Square Footage</p></div>
          </div>
          <div className="detail-input">
            <button onClick={() => handleSquareFootageChange(-100)}>-</button>
            <span>{squareFootage}</span>
            <button onClick={() => handleSquareFootageChange(100)}>+</button>
          </div>
        </div>

        <div className="detail-box">
          <div className="detail-element">
            <div className="detail-name"><p>Levels</p></div>
          </div>
          <div className="detail-input">
            <button onClick={() => handleLevelsChange(-1)}>-</button>
            <span>{levels}</span>
            <button onClick={() => handleLevelsChange(1)}>+</button>
          </div>
        </div>

        <div className="detail-box">
          <div className="detail-element">
            <div className="detail-name"><p>Surfaces</p></div>
          </div>
          <div className="detail-input">
            <select value={surface} onChange={(e) => handleSurfaceChange(e.target.value)}>
              <option value="" disabled>Select a surface</option>
              <option value="Stone">Stone</option>
              <option value="Wood Floors">Wood Floors</option>
              <option value="Stainless Steel">Stainless Steel</option>
            </select>
          </div>
        </div>

        <div className="detail-box">
          <div className="detail-element">
            <div className="detail-name"><p>Home Condition</p></div>
          </div>
          <div className="detail-input">
            <button onClick={handleConditionClick}>Initial Cleaning</button>
          </div>
        </div>

      </div>

      {isModalOpen && (
        <div className="modal">
          <p>Have you had professional cleaning services in the last 90 days?</p>
          <div className="modal-options">
            <div className="modal-option" onClick={() => handleConditionSelect("YES")}>YES</div>
            <div className="modal-option" onClick={() => handleConditionSelect("NO")}>NO</div>
          </div>
        </div>
      )}
    </div>
  );
}