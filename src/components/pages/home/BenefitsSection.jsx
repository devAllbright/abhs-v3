import { useState, useEffect, useRef } from "react";
import SectionHeading from "../../SectionHeading";

const benefits = [
  {
    id: 1,
    title: "Time-Saving Convenience",
    description:
      "With AllBright, home care starts with a free consultation you can book online in seconds—or a quick call to get everything started. From there, we handle the details.",
    icon: "/benefits/convenience-icon.png",
    image: "/benefits/convenience.png",
  },
  {
    id: 2,
    title: "Consistent, High-Quality Service",
    description:
      "Our background-checked, experienced professionals ensure top-tier results every time.",
    icon: "/benefits/quality-icon.png",
    image: "/benefits/quality.png",
  },
  {
    id: 3,
    title: "Eco-Friendly Cleaning",
    description:
      "We use safe, non-toxic products to protect your home, family, and the planet.",
    icon: "/benefits/eco-icon.png",
    image: "/benefits/eco.png",
  },
  {
    id: 4,
    title: "Custom Plans for Every Home",
    description:
      "Enjoy the flexibility of cleaning on your terms—from quick, routine visits to concierge-level yearly maintenance plans that cover every detail. Our services are designed to adapt to your home and lifestyle.",
    icon: "/benefits/customization-icon.png",
    image: "/benefits/customization.png",
  },
  {
    id: 5,
    title: "24/7 AI Assistant Support",
    description:
      "Need help? Our smart AI assistant Sofia is always available to understand your needs and connect you with the right service—anytime, anywhere.",
    icon: "/benefits/assistant-icon.png",
    image: "/benefits/ai-assistant.png",
  },
  {
    id: 6,
    title: "100% Satisfaction Guarantee",
    description: "",
    icon: "/benefits/guarantee-icon.png",
    image: "/benefits/guarantee.png",
  },
];

export default function BenefitsSection() {
  const [activeIndex, setActiveIndex] = useState(null);
  const intervalRef = useRef(null);

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex =
          prevIndex === null ? 0 : (prevIndex + 1) % benefits.length;
        return nextIndex;
      });
    }, 7000);
  };

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setActiveIndex(0);
      startInterval();
    }, 100);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalRef.current);
    };
  }, []);

  const handleClick = (index) => {
    setActiveIndex(index);
    startInterval();
  };

  return (
    <div className="benefit-section">
      <SectionHeading
        title="Live Better, Stress Less"
        subtitle="AllBright makes home care effortless, so you can enjoy more of what truly matters."
      />

      <div className="benefits-container">
        <div className="benefit-section__list">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              onClick={() => handleClick(index)}
              className={`benefit-section__list-item ${
                index === activeIndex ? "active" : ""
              }`}
            >
              <div className="benefit-section__list-item-icon">
                <img src={benefit.icon} alt={benefit.title} />
              </div>
              <div className="benefit-section__list-item-text">
                <div className="benefit-section__list-item-title">
                  {benefit.title}
                </div>
                {typeof benefit.description === "string" &&
                  benefit.description.trim() !== "" && (
                    <div className="benefit-section__list-item-description">
                      <p>{benefit.description}</p>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>

        <div className="benefit-section__img">
          {activeIndex !== null && (
            <img src={benefits[activeIndex].image} alt="Benefit" />
          )}
        </div>
      </div>
    </div>
  );
}
