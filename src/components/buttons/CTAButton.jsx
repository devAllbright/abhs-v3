export default function CTAButton({ href, text, buttonClass, ctaAction, onClick }) {
  if (ctaAction === "redirect") {
    return (
      <a href={href} className={buttonClass}>
        {text}
      </a>
    );
  }

  return (
    <a
      type="button"
      className={buttonClass}
      href="https://book.housecallpro.com/book/All-Bright-Home-Services/38acff17233d44ec9cdc0edf4aadf395?v2=true"
    >
      {text}
    </a>
  );
}
