import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import LeadForm from "./forms/LeadForm";

export default function LeadModal({ isOpen, onClose, thankYouPath = "/thank-you" }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onEsc);
      setTimeout(() => dialogRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    }
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  // SSR guard for Astro: only portal on the client
  if (!isOpen || typeof document === "undefined") return null;

  const modalNode = (
    <div className="modal" role="presentation" onClick={onClose}>
      <div
        className="modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-title"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        ref={dialogRef}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close">×</button>

        <LeadForm
          onSuccess={() => {
            onClose();
            window.location.href = thankYouPath; // redirects fine from a portal
          }}
        />
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
}
