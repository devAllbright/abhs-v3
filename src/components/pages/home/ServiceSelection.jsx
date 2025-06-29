import { useState } from "react";
import ServiceSelectionGirl from "./ServiceSelectionGirl";
import ServiceSelectionAll from "./ServiceSelectionAll";
import ServiceSelectionBundles from "./ServiceSelectionBundles";
import ServiceSelectionPlans from "./ServiceSelectionPlans";

export default function ServiceSelection() {
  const [activeComponent, setActiveComponent] = useState("girl");

  const components = {
    girl: <ServiceSelectionGirl />,
    services: <ServiceSelectionAll />,
    bundles: <ServiceSelectionBundles />,
    plans: <ServiceSelectionPlans />,
  };

  return (
    <>
      <div className="all-services-selection-buttons">
        <button
          className={activeComponent === "services" ? "active" : ""}
          onClick={() => setActiveComponent("services")}
        >
          Services
        </button>
        <button
          className={activeComponent === "bundles" ? "active" : ""}
          onClick={() => setActiveComponent("bundles")}
        >
          Bundles
        </button>
        <button
          className={activeComponent === "plans" ? "active" : ""}
          onClick={() => setActiveComponent("plans")}
        >
          Maintenance Plans
        </button>
      </div>

      {components[activeComponent]}
    </>
  );
}
