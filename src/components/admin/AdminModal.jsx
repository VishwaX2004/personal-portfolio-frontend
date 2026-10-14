import { useEffect } from "react";
import { X } from "lucide-react";

export default function AdminModal({
  isOpen,
  title,
  onClose,
  children,
}) {
  // =========================================================
  // HANDLE ESCAPE KEY
  // =========================================================

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // =========================================================
  // HANDLE BACKDROP CLICK
  // =========================================================

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-[#050505] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}

        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-[#050505]/95 backdrop-blur-sm">
          <h2 id="modal-title" className="text-xl font-semibold">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
