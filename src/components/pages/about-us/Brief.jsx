export default function Brief({ briefData }) {
  return (
    <div className="brief">
      <div className="brief__img">
        <img src={briefData.imageUrl} alt={briefData.title} />
      </div>
      <div className="brief__text">
        <div>
          <h2 className="brief__title">{briefData.title}</h2>
          {briefData.paragraphs.map((para, index) => (
            <div key={index}>
              <p className="brief__description">{para.brief}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}