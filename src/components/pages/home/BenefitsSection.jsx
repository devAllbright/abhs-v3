import { useState, useEffect, useRef } from "react";
import SectionHeading from "../../SectionHeading";

const benefits = [
  {
    id: 1,
    title: "Immediate Booking",
    description:
      "High-authority deep cleaning to reset your home to baseline.",
    icon: "/benefits/convenience-icon.png",
    image: "/benefits/convenience.png",
  },
  {
    id: 2,
    title: "Habitual Care",
    description:
      "Consistent, high-quality recurring services that become your home’s default behavior.",
    icon: "/benefits/quality-icon.png",
    image: "/benefits/quality.png",
  },
  {
    id: 3,
    title: "Total Maintenance",
    description:
      "The end-state for our best clients: a fully managed residential system.",
    icon: "/benefits/customization-icon.png",
    image: "/benefits/customization.png",
  },
  {
    id: 4,
    title: "Eco-Friendly Heritage",
    description:
      "Sustainable home care solutions protecting your family.",
    icon: "/benefits/eco-icon.png",
    image: "/benefits/eco.png",
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
