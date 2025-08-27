// components/buttons/CTAButton.jsx

export default function CTAButton({ text, href, buttonClass = "", ctaAction = "redirect" }) {
  // Case 1: Redirect to the given href
  if (ctaAction === "redirect") {
    return (
      <a href={href} className={buttonClass}>
        {text}
      </a>
    );
  }

  // Case 2: Default booking link
  return (
    <a
      href="https://book.housecallpro.com/book/All-Bright-Home-Services/38acff17233d44ec9cdc0edf4aadf395?v2=true"
      className={buttonClass}
    >
      {text}
    </a>
  );
}
