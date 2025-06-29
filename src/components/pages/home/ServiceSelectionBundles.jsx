import OfferCard from "../../cards/OfferCard";

export default function ServiceSelectionBundles() {

  const bundles = [
    {
      title: "Full Bundle",
      discount: "10% OFF!",
      price: "$199",
      brief: "Lorem ipsum dolor",
      features: ["Deep Cleaning", "Carpet Cleaning", "Window Washing"],
      cta: { href: "#", text: "BOOK NOW!" },
      disclaimer: "One-time Service",
    },
    {
      title: "Carpet Bundle",
      discount: "15% OFF!",
      price: "$299",
      brief: "Lorem ipsum dolor",
      features: ["Deep cleaning", "Carpet Cleaning"],
      cta: { href: "#", text: "BOOK NOW!" },
      disclaimer: "One-time Service",
    },
    {
      title: "Window Bundle",
      discount: "20% OFF!",
      price: "$499",
      brief: "Lorem ipsum dolor",
      features: ["Deep Cleaning", "Window Washing"],
      cta: { href: "#", text: "BOOK NOW!" },
      disclaimer: "One-time Service",
    },
  ];

  return (
    <>
    
    <div className="bundles">
      {bundles.map((bundle, index) => (
        <OfferCard key={index} {...bundle} />
      ))}
    </div>

    
    </>
  )
}
