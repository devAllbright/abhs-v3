export default function CTAButton({ primaryCta, buttonClass }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.location.href = "/pricing/location";
  };

  return (
    <a
      href="/pricing/location"
      className={buttonClass}
      onClick={handleClick}
    >
      <img
        src="/icons/calendar.png"
        alt=""
        className="cta-icon"
      />
      <span>{ primaryCta }</span>
    </a>
  );
}
