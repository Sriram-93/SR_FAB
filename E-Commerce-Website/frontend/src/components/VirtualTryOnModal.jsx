import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiCamera, FiRefreshCw, FiUpload, FiX } from "react-icons/fi";

const VirtualTryOnModal = ({ isOpen, onClose, product }) => {
  const [mode, setMode] = useState("webcam");
  const [selfiePreview, setSelfiePreview] = useState("");
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const productImage = useMemo(
    () => product?.productImages || product?.productImage || "",
    [product],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || mode !== "webcam") return;

    let cancelled = false;

    const startCamera = async () => {
      try {
        setCameraError("");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (cancelled) return;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (error) {
        setCameraError("Camera access denied or unavailable.");
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, mode]);

  useEffect(() => {
    return () => {
      if (selfiePreview) {
        URL.revokeObjectURL(selfiePreview);
      }
    };
  }, [selfiePreview]);

  const onUploadSelfie = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (selfiePreview) {
      URL.revokeObjectURL(selfiePreview);
    }
    // Keep selfie in-memory only; no upload/persistence in MVP.
    setSelfiePreview(URL.createObjectURL(file));
    setMode("selfie");
  };

  const closeAndCleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (selfiePreview) {
      URL.revokeObjectURL(selfiePreview);
      setSelfiePreview("");
    }
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAndCleanup}
          />

          <motion.div
            className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-[var(--line)] bg-surface"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
          >
            <button
              onClick={closeAndCleanup}
              className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--elevated)] text-primary transition hover:text-accent"
            >
              <FiX />
            </button>

            <div className="grid gap-6 p-6 md:grid-cols-[240px_1fr] md:p-8">
              <aside className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-primary">
                  Virtual Try-On
                </h3>
                <p className="text-xs text-muted">
                  MVP mode keeps selfies temporary only in your browser session.
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setMode("webcam")}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest transition ${
                      mode === "webcam"
                        ? "border-primary bg-primary text-bg"
                        : "border-[var(--line)] text-primary"
                    }`}
                  >
                    <FiCamera className="mr-2 inline" /> Webcam
                  </button>

                  <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-primary transition hover:border-primary/40">
                    <FiUpload /> Upload selfie
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onUploadSelfie}
                    />
                  </label>
                </div>

                <div className="rounded-xl bg-primary/5 p-3 text-[11px] text-muted">
                  Product:{" "}
                  <span className="font-semibold text-primary">
                    {product?.productName}
                  </span>
                </div>
              </aside>

              <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-black">
                {mode === "webcam" && (
                  <>
                    <video
                      ref={videoRef}
                      className="h-[60vh] w-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                    {cameraError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 text-center text-sm text-white">
                        {cameraError}
                      </div>
                    )}
                  </>
                )}

                {mode === "selfie" && (
                  <img
                    src={selfiePreview || productImage}
                    alt="Selfie preview"
                    className="h-[60vh] w-full object-cover"
                  />
                )}

                {productImage && (
                  <img
                    src={productImage}
                    alt="Garment overlay"
                    className="pointer-events-none absolute inset-x-[22%] bottom-0 h-[58%] w-[56%] object-contain opacity-80"
                  />
                )}

                <button
                  type="button"
                  onClick={() =>
                    setMode((current) =>
                      current === "webcam" ? "selfie" : "webcam",
                    )
                  }
                  className="absolute bottom-4 right-4 rounded-full bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary"
                >
                  <FiRefreshCw className="mr-2 inline" /> Switch mode
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default VirtualTryOnModal;
