export default function PrimaryCTA({ href, text, buttonClass }) {
  return (
    <a href={href} className={ buttonClass }>
      {text}
    </a>
  );
}