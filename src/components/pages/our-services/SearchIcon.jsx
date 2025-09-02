// SearchIcon.jsx
export default function SearchIcon({
  size = 20,
  strokeWidth = 1,
  className = "",
  onClick, // receive the handler from parent
}) {
  return (
    <button
      type="button"
      className={`search-icon-btn ${className}`}
      onClick={onClick}
      aria-label="Open search"
      style={{
        background: "transparent",
        border: 0,
        padding: 0,
        cursor: "pointer",
        lineHeight: 0,
        display: "grid",
        placeItems: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </button>
  );
}
