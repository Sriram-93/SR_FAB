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

  // Extract unique colors from variants
  const colors = [
    ...new Set(product.variants?.map((v) => v.color).filter(Boolean)),
  ];

  const candidateModelUrl =
    product?.model3D?.modelUrl || product?.modelUrl || null;
  const generationStatus = String(
    product?.model3D?.generationStatus || "not_started",
  ).toLowerCase();
  const isReady3D = ["ready", "completed", "success"].includes(
    generationStatus,
  );
  const hasSupportedExt =
    typeof candidateModelUrl === "string" &&
    /\.(glb|gltf)(\?|$)/i.test(candidateModelUrl);
  const liveModelUrl = isReady3D && hasSupportedExt ? candidateModelUrl : null;

  const handleDetailsClick = () => {
    onClose();
    navigate(`/product/${product.productId}`);
  };

  // If not open, we still use AnimatePresence to handle exit
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop with premium blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-full max-h-[900px] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] bg-surface border border-[var(--line)] shadow-[0_32px_96px_-16px_rgba(0,0,0,0.3)] md:flex-row"
          >
            {/* Close Button - Premium Glassmorphism */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--elevated)] text-primary backdrop-blur-md transition hover:border-[var(--line-strong)] hover:text-accent"
            >
              <FiX size={20} />
            </button>

            {/* Left Section: Immersive 3D Experience (Occupies Most Space) */}
            <div className="relative flex-1 bg-primary/5 group/canvas">
              <div className="absolute left-8 top-8 z-10 flex flex-col gap-1 pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent/60 animate-pulse">
                  Immersive Experience
                </span>
                <h3 className="text-xl font-serif font-black text-primary/80 uppercase tracking-tight italic">
                  360° Studio
                </h3>
                <div className="mt-4 flex flex-col gap-2 text-[10px] font-medium text-muted/60 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <FiRotateCcw /> Drag to rotate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiMaximize2 /> Scroll to zoom
                  </span>
                </div>
              </div>

              <div className="h-full w-full py-10 px-5">
                <ModelViewer
                  modelUrl={liveModelUrl}
                  activeColor={activeColor}
                />
              </div>

              {!liveModelUrl && (
                <div className="absolute bottom-8 right-8 rounded-xl border border-[var(--line-strong)]/45 bg-[var(--elevated)]/95 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-accent">
                  <FiAlertCircle className="mr-1 inline" />
                  {generationStatus === "processing"
                    ? "3D model is generating"
                    : "Showing preview cube"}
                </div>
              )}

              {/* Bottom Attribution */}
              <div className="absolute bottom-8 left-8 flex items-center gap-2 opacity-30 grayscale pointer-events-none">
                <span className="font-serif font-bold text-xs font-black">
                  SR FAB
                </span>
                <span className="h-4 w-[1px] bg-primary/30"></span>
                <span className="text-[10px] font-medium tracking-tighter uppercase font-bold">
                  Premium Fabric Lab
                </span>
              </div>
            </div>

            {/* Right Section: Compact Details Panel */}
            <div className="flex w-full flex-col justify-between bg-surface px-8 py-10 md:w-[340px] lg:w-[380px] border-l border-[var(--line)]">
              <div className="flex flex-col">
                <div className="mb-8 space-y-3">
                  {product.brand && (
                    <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
                      {product.brand}
                    </span>
                  )}
                  <h2 className="font-serif text-4xl font-bold leading-[1.1] text-primary">
                    {product.productName}
                  </h2>
                  <div className="flex items-baseline gap-4 pt-2">
                    <span className="text-3xl font-black text-primary">
                      ₹
                      {product.productPriceAfterDiscount ||
                        product.productPrice}
                    </span>
                    {product.productDiscount > 0 && (
                      <span className="text-lg font-medium text-muted line-through opacity-40">
                        ₹{product.productPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-sm leading-relaxed text-muted/80">
                    {product.productDescription ||
                      "An artisanal masterpiece designed for the modern connoisseur. Experience every stitch, drape, and texture with our interactive studio viewer."}
                  </p>

                  <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--line)] to-transparent" />

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
                                ? "border-primary bg-primary shadow-lg ring-4 ring-primary/5"
                                : "border-[var(--line)] bg-[var(--elevated)] hover:border-[var(--line-strong)]"
                            }`}
                          >
                            <span
                              className={`h-6 w-6 rounded-lg shadow-inner ${activeColor === c ? "ring-2 ring-[var(--bg)]" : ""}`}
                              style={{
                                backgroundColor:
                                  {
                                    Black: "#1A1A1A",
                                    White: "#FFFFFF",
                                    Navy: "#000080",
                                    Beige: "#F5F5DC",
                                    Grey: "#808080",
                                    Maroon: "#800000",
                                    Blue: "#3b82f6",
                                    Pink: "#ec4899",
                                    Green: "#10b981",
                                    Purple: "#8b5cf6",
                                  }[c] || "#ddd",
                              }}
                            />
                            <span
                              className={`text-[9px] font-bold uppercase tracking-widest ${activeColor === c ? "text-[var(--bg)]" : "text-muted"}`}
                            >
                              {c}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[var(--line)] bg-primary/5 p-5">
                    <div className="space-y-1">
                      <span className="block text-[8px] font-bold uppercase tracking-widest text-muted">
                        Fit
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <FiCheckCircle className="text-green-500" /> True to
                        Size
                      </span>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="block text-[8px] font-bold uppercase tracking-widest text-muted">
                        Material
                      </span>
                      <span className="text-xs font-semibold text-primary italic">
                        Luxury Linen Blend
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <button
                  onClick={handleDetailsClick}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-primary py-5 text-xs font-bold uppercase tracking-[0.3em] text-[var(--bg)] shadow-xl transition-all duration-500 hover:bg-accent hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]"
                >
                  <span className="relative z-10">Experience Details</span>
                  <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
                </button>
                <p className="text-center text-[9px] font-medium tracking-widest text-muted/40 uppercase">
                  Exclusive Complimentary Shipping Included
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default ModelViewerModal;
