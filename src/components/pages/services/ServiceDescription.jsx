export default function ServiceDescription({ descriptionData }) {
  return (
    <div className="service-description">
      <div className="service-description__img">
        <img src={descriptionData.imageUrl} alt={descriptionData.title} />
      </div>
      <div className="service-description__text">
        <div>
          <h2 className="service-description__title">{descriptionData.title}</h2>
          {descriptionData.paragraphs.map((para, index) => (
            <div key={index}>
              <h3 className="service-description__subtitle">{para.subtitle}</h3>
              <p className="service-description__brief">{para.brief}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}