import { useEffect, useState } from "react";
import CTAButton from "../buttons/CTAButton";
import ModalCTA from "../buttons/ModalCTA";

export default function FinalCTA({ buttonClass }) {
  const [serviceType, setServiceType] = useState(null);

  useEffect(() => {
    const storedType = sessionStorage.getItem("serviceType");
    setServiceType(storedType);
  }, []);

  return (
    <>
      {(serviceType === "recurring" || serviceType === "oneTime") ? (
        <CTAButton buttonClass={ buttonClass } />
      ) : (
        <ModalCTA buttonClass={ buttonClass } />
      )}
    </>
  );
}
