import { useEffect, useState } from "react";
import CTAButton from "../buttons/CTAButton";
import HCPButton from "../buttons/HCPButton";

export default function FinalCTA({ secondaryCta, buttonClass }) {
  const [serviceType, setServiceType] = useState(null);

  useEffect(() => {
    const storedType = sessionStorage.getItem("serviceType");
    setServiceType(storedType);
  }, []);

  return (
    <>
      {/* 
      {(serviceType === "recurring" || serviceType === "oneTime") ? (
        <CTAButton buttonClass={ buttonClass } />
      ) : (
        <HCPButton secondaryCta={ secondaryCta } buttonClass={ buttonClass } />
      )}
      */}

      <HCPButton secondaryCta={ secondaryCta } buttonClass={ buttonClass } />
    </>
  );
}
