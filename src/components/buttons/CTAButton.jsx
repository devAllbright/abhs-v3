export default function CTAButton({ buttonClass, label }) {
  const primaryCTA = label || sessionStorage.getItem("primaryCta") || "Book Now";

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
      <span>{primaryCTA}</span>
    </a>
  );
}
