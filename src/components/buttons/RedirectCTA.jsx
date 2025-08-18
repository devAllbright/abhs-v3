export default function RedirectCTA({ href, text, buttonClass }) {
  return (
    <a href={ href } className={buttonClass}>
      {text}
    </a>
  );
}