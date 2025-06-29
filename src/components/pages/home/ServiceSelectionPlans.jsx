import OfferCard from "../../cards/OfferCard";

export default function ServiceSelectionPlans() {
  const maintenancePlans = [
      {
        title: "Basic",
        discount: "10% OFF!",
        price: "$1200",
        brief: "Lorem ipsum dolor",
        features: ["Deep Cleaning (Once a month)", "Carpet Cleaning (Once per year)", "Window Washing (Once per year)"],
        cta: { href: "#", text: "BOOK NOW!" },
        disclaimer: "Recurring Service",
      },
      {
        title: "Standard",
        discount: "15% OFF!",
        price: "$1500",
        brief: "Lorem ipsum dolor",
        features: ["Deep cleaning (Biweekly)", "Carpet Cleaning (Once per year)"],
        cta: { href: "#", text: "BOOK NOW!" },
        disclaimer: "Recurring Service",
      },
      {
        title: "Premium",
        discount: "20% OFF!",
        price: "$2000",
        brief: "Lorem ipsum dolor",
        features: ["Deep Cleaning (Weekly)", "Window Washing (Once per year)"],
        cta: { href: "#", text: "BOOK NOW!" },
        disclaimer: "Recurring Services",
      },
    ];
  
    return (
      <>
      
      <div className="maintenance-plans">
        {maintenancePlans.map((plan, index) => (
          <OfferCard key={index} {...plan} />
        ))}
      </div>
  
      
      </>
    )
}
