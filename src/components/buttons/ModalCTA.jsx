import { useState } from "react";
import LeadModal from "../LeadModal";

export default function ModalCTA({ text, buttonClass, thankYouPath = "/thank-you" }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        className={buttonClass}
        onClick={() => setShowModal(true)}
        aria-haspopup="dialog"
        aria-expanded={showModal}
      >
        {text}
      </button>

      <LeadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        thankYouPath={thankYouPath}
      />
    </>
  );
}
