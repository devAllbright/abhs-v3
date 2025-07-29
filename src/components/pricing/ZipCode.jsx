import { useState } from 'react';
import '../../styles/pricing/zip-code.css'

const ZipCode = () => {

  const zipCodeMap = {
    'San Jose, CA': ['95110', '95112', '95116', '95118', '95120', '95122', '95124', '95125'],
    'Campbell, CA': ['95008', '95009', '95011'],
    'Saratoga, CA': ['95070', '95071'],
    'Los Gatos, CA': ['95030', '95031', '95032', '95033'],
    'Morgan Hill, CA': ['95037', '95038'],
    'Sunnyvale, CA': ['94085', '94086', '94087', '94088', '94089'],
    'Cupertino, CA': ['95014', '95015'],
    'Santa Clara, CA': ['95050', '95051', '95052', '95053', '95054', '95055', '95056'],
    'Milpitas, CA': ['95035', '95036'],
    'Mountain View, CA': ['94035', '94039', '94040', '94041', '94042', '94043'],
    'Los Altos, CA': ['94022', '94023', '94024'],
    'Palo Alto, CA': ['94301', '94302', '94303', '94304', '94305', '94306'],
  };

  const [zipCode, setZipCode] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [location, setLocation] = useState('');

  const handleChange = (event) => {

    const enteredZipCode = event.target.value;
    setZipCode(enteredZipCode);

    let foundLocation = '';
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
      setLocation('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isValid) {
      window.location.href = '/pricing/home-type';
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
          />
          <button 
            type="submit" 
            id="submit-button"
            className={isValid ? 'submit-enabled' : 'submit-disabled'} 
            disabled={!isValid}>
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