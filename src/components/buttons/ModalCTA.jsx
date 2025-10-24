import { useState } from "react";
import LeadModal from "../LeadModal";

export default function ModalCTA({ buttonClass, thankYouPath = "/thank-you" }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (e) => {
    e.preventDefault(); // ✅ prevents the default anchor navigation
    setShowModal(true);
  };

  return (
    <>
      <a
        href="#"
        className={buttonClass}
        onClick={handleOpenModal}
        role="button"
        aria-haspopup="dialog"
        aria-expanded={showModal}
      >
        Get a Free Consultation
      </a>

      <LeadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        thankYouPath={thankYouPath}
      />
    </>
  );
}
