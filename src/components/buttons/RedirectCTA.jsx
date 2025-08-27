export default function RedirectCTA({ href, text, buttonClass }) {
  return (
    <a href={href} className={buttonClass}>
      <img
        src="/icons/calendar.png"
        alt=""
        className="cta-icon"
      />
      <span>{text}</span>
    </a>
  );
}
