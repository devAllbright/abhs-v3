import React, { useState, useEffect } from 'react';
import '../../styles/pricing/service-type.css';

export default function ServiceType() {
  const [activeService, setActiveService] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('serviceType');
    if (stored) setActiveService(stored);
  }, []);

  useEffect(() => {
    if (activeService) {
      sessionStorage.setItem('serviceType', activeService);
    } else {
      sessionStorage.removeItem('serviceType');
    }
  }, [activeService]);

  const handleClick = (service) => {
    setActiveService(prev => (prev === service ? '' : service));
  };

  const handleNextClick = () => {
    if (!activeService) {
      alert('You must select one of the service types before proceeding.');
      return;
    }
    window.location.href = '/pricing/home-details';
  };

  return (
    <>
      <div className="service-type-elements">
        <div 
          className={`service-type-element ${activeService === 'recurring' ? 'active-element' : ''}`} 
          onClick={() => handleClick('recurring')}
        >
          <div className="service-type-img">
            <img src="/shopping-cart/recurring-services.png" alt="Recurring Services" />
          </div>
          <div className="service-type-title">
            <p>Recurring Services</p>
          </div>
        </div>

        <div 
          className={`service-type-element ${activeService === 'oneTime' ? 'active-element' : ''}`} 
          onClick={() => handleClick('oneTime')}
        >
          <div className="service-type-img">
            <img src="/shopping-cart/one-time-services.png" alt="On-Demand Services" />
          </div>
          <div className="service-type-title">
            <p>On-Demand Services</p>
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <a href="/pricing/home-type">
          <button className="nav-button">Back</button>
        </a>
        <button className="nav-button" onClick={handleNextClick}>Next</button>
      </div>
    </>
  );
}