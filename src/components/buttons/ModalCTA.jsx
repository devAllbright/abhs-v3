import { useState } from "react";
import LeadModal from "../LeadModal";

export default function ModalCTA({ secondaryCta, buttonClass, thankYouPath = "/thank-you" }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (e) => {
    e.preventDefault();
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
        { secondaryCta }
      </a>

      <LeadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        thankYouPath={thankYouPath}
      />
    </>
  );
}
