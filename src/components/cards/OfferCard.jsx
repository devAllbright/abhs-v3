import CTAButton from '../buttons/CTAButton';

export default function OfferCard({ title, discount, price, brief, features, cta, disclaimer }) {
  return (
    <div className="offer-card">
      <div className="offer-card__title">
        <h3 className="offer-card__title-text">{title}</h3>
        {discount && <span className="offer-card__discount">{discount}</span>}
      </div>

      <p className="offer-card__price">{price}</p>
      <p className="offer-card__brief">{brief}</p>

      <div className="offer-card__features">
        <ul className="offer-card__features-list">
          {features.map((feature, index) => (
            <li key={index} className="offer-card__feature">✔ {feature}</li>
          ))}
        </ul>
      </div>

      <div className="offer-card__cta">
        <CTAButton href={cta.href} text={cta.text} buttonClass="primary-cta"/>
      </div>

      {disclaimer && (
        <div className="offer-card__disclaimer">
          <span>{disclaimer}</span>
        </div>
      )}
    </div>
  );
}

