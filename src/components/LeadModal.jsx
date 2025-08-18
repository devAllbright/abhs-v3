import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function LeadModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "";
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close modal">
          ×
        </button>
        <iframe
          id="hcp-lead-iframe"
          src="https://book.housecallpro.com/lead-form/All-Bright-Home-Services/8ef469d031c04fe8a2ac4421d606a1ca"
          title="Lead Capture Form"
        />
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
