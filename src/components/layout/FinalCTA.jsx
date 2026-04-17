import { useEffect, useState } from "react";
import SmartCTA from "../buttons/SmartCTA";
import HCPButton from "../buttons/HCPButton";

export default function FinalCTA({ secondaryCta, buttonClass }) {
  const [serviceType, setServiceType] = useState(null);

  useEffect(() => {
    const storedType = sessionStorage.getItem("serviceType");
    setServiceType(storedType);
  }, []);

  return (
    <>
      <SmartCTA 
        secondaryCta={ secondaryCta } 
        buttonClass={ buttonClass } 
      />
    </>
  );
}
