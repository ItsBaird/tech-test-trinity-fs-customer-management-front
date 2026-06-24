import { useEffect } from "react";

const SIZE = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const Modal = ({ isOpen, onClose, title, size = "md", children }) => {
  /* Cerrar con Escape */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  /* Bloquear scroll */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`
          relative z-10 w-full ${SIZE[size]}
          bg-white rounded-2xl shadow-2xl
          max-h-[90dvh] flex flex-col
          overflow-hidden
        `}
        style={{
          animation: "modalIn 0.18s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h2
            id="modal-title"
            className="text-base font-semibold text-gray-900 tracking-tight"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="
              w-8 h-8 flex items-center justify-center rounded-lg
              text-gray-400 hover:text-gray-700 hover:bg-gray-100
              transition-colors focus:outline-none focus:ring-2
              focus:ring-[#16A34A] focus:ring-offset-1
            "
            aria-label="Cerrar"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body — scrollable en mobile si el contenido es largo */}
        <div className="overflow-y-auto px-5 py-5">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes modalIn { from { opacity: 0; } to { opacity: 1; } }
        }
      `}</style>
    </div>
  );
};

export default Modal;