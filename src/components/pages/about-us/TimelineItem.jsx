/* const TimelineItem = ({ title, subtitle, date, description, images, side }) => {
  return (
    <div className={`timeline__item ${side}`}>
      <div className="timeline__marker"></div>
      <div className="timeline__date">{date}</div>
      <div className="timeline__content">
        <h3>{title}</h3>
        {subtitle && <h4>{subtitle}</h4>}
        {images && (
          <div className="timeline__images">
            {images.map((src, index) => (
              <img key={index} src={src} alt={`Milestone ${title}`} />
            ))}
          </div>
        )}
        <p>{description}</p>

      </div>
    </div>
  );
};

export default TimelineItem;
 */