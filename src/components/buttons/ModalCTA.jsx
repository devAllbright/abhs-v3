import { useState } from "react";
import LeadModal from "../LeadModal";

export default function ModalCTA({ text, buttonClass }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        className={buttonClass}
        onClick={() => setShowModal(true)}
        aria-haspopup="dialog"
      >
        {text}
      </button>

      <LeadModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
