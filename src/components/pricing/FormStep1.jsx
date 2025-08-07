import { useState } from 'react';
import '../../styles/pricing/form-step1.css';

const Step1 = () => {
  const [formData, setFormData] = useState({
    email: '',
    source: '',
    houseType: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleHouseTypeSelection = (houseType) => {
    setFormData({
      ...formData,
      houseType,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTimeout(() => {
      if (!formData.email || !formData.source || !formData.houseType) {
        alert('Empty fields are not allowed');
      } else {
        sessionStorage.setItem('step1FormData', JSON.stringify(formData));
        window.location.href = '/pricing/service-type';
      }
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='user-info'>
        <div className="input-container">
          <div className="form-control">
            <div><label htmlFor="email">Email</label></div>
            <input
              id="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <div><label htmlFor="source">Where did you hear about us?</label></div>
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
          <div
            className={`type-element ${formData.houseType === 'Single Family' ? 'type-active' : 'type-inactive'}`}
            onClick={() => handleHouseTypeSelection('Single Family')}
          >
            <div className="house-icon"><img src="/single-family.png" alt="Single Family" /></div>
            <p className="type-text">Single Family</p>
          </div>
          <div
            className={`type-element ${formData.houseType === 'Town House' ? 'type-active' : 'type-inactive'}`}
            onClick={() => handleHouseTypeSelection('Town House')}
          >
            <div className="house-icon"><img src="/town-house.png" alt="Town House" /></div>
            <p className="type-text">Town House</p>
          </div>
          <div
            className={`type-element ${formData.houseType === 'Apartment' ? 'type-active' : 'type-inactive'}`}
            onClick={() => handleHouseTypeSelection('Apartment')}
          >
            <div className="house-icon"><img src="/apartment.png" alt="Apartment" /></div>
            <p className="type-text">Apartment</p>
          </div>
          <div
            className={`type-element ${formData.houseType === 'Condominium' ? 'type-active' : 'type-inactive'}`}
            onClick={() => handleHouseTypeSelection('Condominium')}
          >
            <div className="house-icon"><img src="/condominium.png" alt="Condominium" /></div>
            <p className="type-text">Condominium</p>
          </div>
        </div>

        <div className="navigation-buttons">
          <button
            type="button"
            className="nav-button"
            onClick={() => window.location.href = '/pricing/location'}
          >
            Back
          </button>
          <button type="submit" className="nav-button">Next</button>
        </div>
      </div>
    </form>
  );
};

export default Step1;
