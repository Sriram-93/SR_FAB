import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiCheckCircle,
  FiMaximize2,
  FiRotateCcw,
  FiAlertCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ModelViewer from "./ModelViewer";

const ModelViewerModal = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeColor, setActiveColor] = useState(null);
  const [shouldRenderModel, setShouldRenderModel] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Staggered loading: first open modal, then load canvas after animation
      const timer = setTimeout(() => setShouldRenderModel(true), 1200);
      return () => clearTimeout(timer);
    } else {
      setShouldRenderModel(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (product?.variants?.length > 0 && !activeColor) {
      const firstColor = product.variants.find((v) => v.color)?.color;
      if (firstColor) setActiveColor(firstColor);
    }
  }, [product, activeColor]);

  // Extract unique colors
  const colors = [
    ...new Set(product.variants?.map((v) => v.color).filter(Boolean)),
  ];

  const candidateModelUrl = product?.model3D?.modelUrl || product?.modelUrl || null;
  const generationStatus = String(
    product?.model3D?.generationStatus || "not_started",
  ).toLowerCase();
  const isReady3D = ["ready", "completed", "success"].includes(generationStatus);
  const liveModelUrl = isReady3D ? candidateModelUrl : null;

  const handleDetailsClick = () => {
    onClose();
    navigate(`/product/${product.productId}`);
  };

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-full max-h-[900px] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] bg-surface border border-[var(--line)] shadow-[0_32px_96px_-16px_rgba(0,0,0,0.3)] md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--elevated)] text-primary backdrop-blur-md transition hover:border-[var(--line-strong)] hover:text-accent"
            >
              <FiX size={20} />
            </button>

            {/* Left Section: 3D Experience */}
            <div className="relative flex-1 bg-primary/5">
              <div className="absolute left-8 top-8 z-10 flex flex-col gap-1 pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/60 animate-pulse">
                  Immersive Experience
                </span>
                <h3 className="text-xl font-serif font-black text-primary/80 uppercase tracking-tight italic">
                  360° Studio
                </h3>
              </div>

              <div className="h-full w-full py-10 px-5">
                {shouldRenderModel ? (
                  <ModelViewer
                    modelUrl={liveModelUrl}
                    activeColor={activeColor}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-accent" />
                  </div>
                )}
              </div>
            </div>

            {/* Right Section: Details */}
            <div className="flex w-full flex-col justify-between bg-surface px-8 py-10 md:w-[340px] lg:w-[380px] border-l border-[var(--line)]">
              <div>
                <h2 className="font-serif text-4xl font-bold leading-[1.1] text-primary mb-6">
                  {product.productName}
                </h2>
                
                <div className="space-y-6">
                   {colors.length > 0 && (
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                        Select Aesthetic
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {colors.map((c) => (
                          <button
                            key={c}
                            onClick={() => setActiveColor(c)}
                            className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition duration-300 ${
                              activeColor === c
                                ? "border-primary bg-primary"
                                : "border-[var(--line)] bg-[var(--elevated)]"
                            }`}
                          >
                            <span
                               className="h-6 w-6 rounded-lg"
                               style={{ backgroundColor: { Navy: "#000080", Black: "#1A1A1A", White: "#FFFFFF" }[c] || "#ddd" }}
                            />
                            <span className={`text-[9px] font-bold uppercase ${activeColor === c ? "text-white" : "text-muted"}`}>
                                {c}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={handleDetailsClick}
                  className="w-full rounded-2xl bg-primary py-5 text-xs font-bold uppercase tracking-[0.3em] text-white shadow-xl hover:bg-accent transition-all"
                >
                  Experience Details
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default ModelViewerModal;
