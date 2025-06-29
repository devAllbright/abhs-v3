import React, { useState, useEffect } from "react";
import SectionHeading from "../../SectionHeading";

const benefits = [
  {
    id: 1,
    title: "Time-Saving Convenience",
    description: "Book in seconds and let us handle the rest, so you can enjoy more free time.",
    icon: "/benefits/convenience-icon.png",
    image: "/benefits/convenience.png"
  },
  {
    id: 2,
    title: "Consistent, High-Quality Service",
    description: "Our background-checked, experienced professionals ensure top-tier results every time.",
    icon: "/benefits/quality-icon.png",
    image: "/benefits/quality.png"
  },
  {
    id: 3,
    title: "Eco-Friendly Cleaning",
    description: "We use safe, non-toxic products to protect your home, family, and the planet.",
    icon: "/benefits/eco-icon.png",
    image: "/benefits/eco.png"
  },
  {
    id: 4,
    title: "Custom Plans for Every Home",
    description: "Tailored cleaning and maintenance solutions designed to fit your unique needs.",
    icon: "/benefits/customization-icon.png",
    image: "/benefits/customization.png"
  },
  {
    id: 5,
    title: "24/7 AI Assistant Support",
    description: "Need help? Our smart AI assistant is always available to understand your needs and connect you with the right service—anytime, anywhere.",
    icon: "/benefits/assistant-icon.png",
    image: "/benefits/ai-assistant.png"
  },
  {
    id: 6,
    title: "100% Satisfaction Guarantee",
    description: "",
    icon: "/benefits/guarantee-icon.png",
    image: "/benefits/guarantee.png"
  }
];

export default function BenefitsSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setActiveIndex(0);
    }, 100);

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % benefits.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SectionHeading 
        title="Painless Home Care, Exceptional Results"
        subtitle="Owning a home is rewarding, but keeping it clean and 
                  well-maintained shouldn’t be a hassle. We make the process 
                  seamless, efficient, and stress-free."
      />
      <div className="benefit-section">
        <div className="benefit-section__list">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              className={`benefit-section__list-item ${index === activeIndex ? "active" : ""} ${index < activeIndex ? "reset" : ""}`}
            >
              <div className="benefit-section__list-item-icon">
                <img src={benefit.icon} alt={benefit.title} />
              </div>
              <div className="benefit-section__list-item-text">
                <div className="benefit-section__list-item-title">
                  {benefit.title}
                </div>
                <div className="benefit-section__list-item-description">
                  <p>{benefit.description}</p>
                </div>
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
    </>
  );
}




