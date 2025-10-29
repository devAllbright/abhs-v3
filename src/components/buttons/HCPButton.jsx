export default function HCPButton({ secondaryCta, buttonClass }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.location.href = "https://book.housecallpro.com/book/All-Bright-Home-Services/38acff17233d44ec9cdc0edf4aadf395?v2=true";
  };

  return (
    <a
      className={buttonClass}
      onClick={handleClick}
    >
      <span>{ secondaryCta }</span>
    </a>
  );
}
