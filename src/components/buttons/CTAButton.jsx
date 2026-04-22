import { useState, useEffect } from "react";

export default function CTAButton({ buttonClass, label }) {
  const [primaryCTA, setPrimaryCTA] = useState(label || "Book Now");

  useEffect(() => {
    if (!label) {
      const stored = sessionStorage.getItem("primaryCta");
      if (stored) setPrimaryCTA(stored);
    }
  }, [label]);

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
