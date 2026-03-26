import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Cropper from "react-easy-crop";
import {
  FiCamera, FiUpload, FiX, FiZap, FiRefreshCw,
  FiCheck, FiDownload, FiAlertTriangle, FiMove, FiBox
} from "react-icons/fi";
import { triggerVtoGeneration, fetchVtoStatus } from "../api/vtoApi";
import { toast } from "react-toastify";
import { getCroppedImgBase64 } from "../utils/imageUtils";

const PHASE_LABELS = {
  uploading: { title: "Securely Uploading", sub: "Encrypting and transmitting your portrait to our secure fashion engine...", icon: "🔐" },
  generating: { title: "Synthesizing Outfit", sub: "AI is crafting realistic cloth folds, lighting textures & shadows...", icon: "🧠" },
  finalizing: { title: "Perfecting Result", sub: "Running final color corrections and edge smoothing for studio quality...", icon: "✨" },
};

const AlignmentGuide = () => (
  <svg
    viewBox="0 0 300 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 pointer-events-none w-full h-full z-10 opacity-50 mix-blend-screen"
  >
    {/* Facial Oval */}
    <ellipse cx="150" cy="140" rx="60" ry="80" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
    
    {/* Shoulders */}
    <path
      d="M40 380 Q40 310 90 270 Q150 230 210 270 Q260 310 260 380"
      stroke="white"
      strokeWidth="1"
      strokeDasharray="4 4"
    />
    
    {/* Neckline Target - The CRITICAL ALIGNMENT ZONE */}
    <path
      d="M125 220 Q150 238 175 220"
      stroke="var(--accent)"
      strokeWidth="2"
      className="animate-pulse"
    />
    <rect x="110" y="245" width="80" height="14" rx="7" fill="rgba(184,137,47,0.2)" stroke="var(--accent)" strokeWidth="0.5" />
    <text x="150" y="254" textAnchor="middle" fill="var(--accent)" style={{ fontSize: '7px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
      Align Neckline
    </text>
  </svg>
);

const VirtualTryOnModal = ({ isOpen, onClose, product }) => {
  const [mode, setMode] = useState("webcam"); // webcam | selfie | result
  const [selfiePreview, setSelfiePreview] = useState("");
  const [selfieFile, setSelfieFile] = useState(null);
  const [cameraError, setCameraError] = useState("");

  // Cropping states
  const [isCropping, setIsCropping] = useState(false);
  const [cropImage, setCropImage] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Generation states
  const [vtoResult, setVtoResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genPhase, setGenPhase] = useState(""); // uploading | generating | finalizing
  const [genSeconds, setGenSeconds] = useState(0);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const pollRef = useRef(null);

  const productImage = useMemo(
    () => product?.productImages || product?.productImage || "",
    [product],
  );

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Start camera when in webcam mode
  useEffect(() => {
    if (!isOpen || mode !== "webcam" || isCropping) return;
    let cancelled = false;

    const startCamera = async () => {
      try {
        setCameraError("");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        });
        if (cancelled) return;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (!cancelled) videoRef.current.play();
          };
        }
      } catch {
        setCameraError("Camera access denied. Please allow camera access or use the Upload option.");
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, mode, isCropping]);

  // Timer for generation duration
  useEffect(() => {
    if (isGenerating) {
      setGenSeconds(0);
      timerRef.current = setInterval(() => setGenSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isGenerating]);

  // ─── Capture & Convert ───────────────────────────────────────────

  const captureWebcamFrame = useCallback(() => {
    if (!videoRef.current) return null;
    const v = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.95);
  }, []);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ─── Cropping Logic ─────────────────────────────────────────────

  const onCropComplete = useCallback((_area, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApplyCrop = async () => {
    try {
      // Pass 1024 as maxWidth to optimize transfer speed without losing VTO quality
      const base64 = await getCroppedImgBase64(cropImage, croppedAreaPixels, 1024);
      setSelfiePreview(base64);
      setIsCropping(false);
      setMode("selfie");
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image.");
    }
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    if (!selfiePreview) {
      setMode("webcam");
    }
  };

  // ─── Generate ────────────────────────────────────────────────────

  const handleGenerate = async () => {
    let personImage = "";

    try {
      if (mode === "webcam") {
        const frame = captureWebcamFrame();
        if (!frame) {
          toast.error("Could not capture webcam frame.");
          return;
        }
        setCropImage(frame);
        setIsCropping(true);
        return; // Now wait for user to crop
      } else {
        if (!selfiePreview) {
          toast.error("Please upload or capture a photo first.");
          return;
        }
        personImage = selfiePreview;
      }

      // Ensure garment image is an absolute URL
      let garmentUrl = productImage;
      if (garmentUrl && !garmentUrl.startsWith("http") && !garmentUrl.startsWith("data:")) {
        garmentUrl = window.location.origin + garmentUrl;
      }

      setIsGenerating(true);
      setVtoResult("");
      setGenPhase("uploading");

      const res = await triggerVtoGeneration({
        personImageUrl: personImage,
        garmentImageUrl: garmentUrl,
        garmentDescription: product?.productName || "fashion garment",
      });

      if (res.error) throw new Error(res.error);
      pollForResult(res.jobId);
    } catch (err) {
      console.error("[VTO] Generation error:", err);
      toast.error("Failed: " + (err?.response?.data?.error || err.message));
      setIsGenerating(false);
      setGenPhase("");
    }
  };

  const pollForResult = (jobId) => {
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts++;
      if (attempts > 120) { // 4 minutes at 2s interval
        clearInterval(pollRef.current);
        setIsGenerating(false);
        setGenPhase("");
        toast.error("Generation timed out.");
        return;
      }

      try {
        const data = await fetchVtoStatus(jobId);
        if (data.status === "uploading" || data.status === "generating" || data.status === "finalizing") {
          setGenPhase(data.status);
        }

        if (data.status === "completed") {
          clearInterval(pollRef.current);
          setVtoResult(data.resultUrl);
          setIsGenerating(false);
          setGenPhase("");
          toast.success("🎉 AI Try-On Complete!");
        } else if (data.status === "failed") {
          clearInterval(pollRef.current);
          setIsGenerating(false);
          setGenPhase("");
          toast.error("Generation failed: " + (data.error || "Unknown error"));
        }
      } catch (err) {
        console.error("[VTO] Poll error:", err);
      }
    }, 2000); // 2s for more responsive feedback
  };

  // ─── File Upload ─────────────────────────────────────────────────

  const onUploadSelfie = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);
    setCropImage(base64);
    setIsCropping(true);
  };

  // ─── Cleanup ─────────────────────────────────────────────────────

  const closeAndCleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (pollRef.current) clearInterval(pollRef.current);
    if (selfiePreview && selfiePreview.startsWith("blob:")) URL.revokeObjectURL(selfiePreview);
    setSelfiePreview("");
    setSelfieFile(null);
    setIsGenerating(false);
    setGenPhase("");
    setVtoResult("");
    setIsCropping(false);
    onClose();
  };

  const phaseInfo = PHASE_LABELS[genPhase] || PHASE_LABELS.generating;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAndCleanup}
          />

          <motion.div
            className="relative z-10 w-full max-w-7xl h-[90vh] overflow-hidden rounded-[3rem] border border-white/10 bg-[#080808] shadow-[0_0_100px_rgba(184,137,47,0.15)]"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
          >
            {/* HUD: Close Button */}
            <button
              onClick={closeAndCleanup}
              className="absolute right-10 top-10 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white hover:scale-110 active:scale-95 border border-white/5"
            >
              <FiX size={24} />
            </button>

            <div className="grid h-full lg:grid-cols-[420px_1fr]">
              {/* ─── Sidebar ──────────────────────────────────── */}
              <aside className="no-scrollbar flex flex-col overflow-y-auto border-r border-white/5 bg-black/60 p-12 backdrop-blur-md">
                <div className="mb-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-accent shadow-[0_0_10px_#b8892f]" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-accent/80">
                      Studio Intelligence
                    </span>
                  </div>
                  <h3 className="font-serif text-5xl font-light text-white leading-none tracking-tight">
                    Virtual <br /> <span className="text-accent font-bold italic">Try-On</span>
                  </h3>
                  <p className="mt-6 text-sm text-white/50 leading-relaxed font-light max-w-[280px]">
                    Experience fashion in high-fidelity. Our AI maps this garment precisely to your physique.
                  </p>
                </div>

                <div className="space-y-10">
                  {/* Mode Selector */}
                  <div className="p-1 dark:bg-white/5 rounded-3xl border border-white/5 grid grid-cols-2 gap-1">
                    <button
                      onClick={() => { setMode("webcam"); setVtoResult(""); setSelfiePreview(""); }}
                      className={`flex items-center justify-center gap-3 rounded-2xl py-4 text-[11px] font-bold uppercase tracking-widest transition-all ${
                        mode === "webcam"
                          ? "bg-accent text-black shadow-[0_10px_20px_rgba(184,137,47,0.3)]"
                          : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <FiCamera size={18} /> Webcam
                    </button>
                    <label
                      className={`flex cursor-pointer items-center justify-center gap-3 rounded-2xl py-4 text-[11px] font-bold uppercase tracking-widest transition-all ${
                        mode === "selfie" || (isCropping && mode !== "webcam")
                          ? "bg-accent text-black shadow-[0_10px_20px_rgba(184,137,47,0.3)]"
                          : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <FiUpload size={18} /> Gallery
                      <input type="file" accept="image/*" className="hidden" onChange={onUploadSelfie} />
                    </label>
                  </div>

                  {/* Main Action Button */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-accent/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <motion.button
                      onClick={handleGenerate}
                      disabled={isGenerating || isCropping}
                      className="relative w-full overflow-hidden rounded-[2rem] bg-accent py-7 text-[12px] font-black uppercase tracking-[0.4em] text-black transition-all disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        {isGenerating ? (
                          <>
                            <FiZap className="animate-pulse" size={20} />
                            Calculating...
                          </>
                        ) : (
                          <>
                            <FiZap size={20} />
                            Generate Try-On
                          </>
                        )}
                      </div>
                    </motion.button>
                  </div>

                  {/* Tips Panel */}
                  <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 space-y-5">
                    <div className="flex items-center gap-2">
                       <FiBox className="text-accent" />
                       <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Guidelines</span>
                    </div>
                    <ul className="space-y-4">
                      {[
                        "Frontal view with arms relaxed",
                        "Align chin & neck with the gold guide",
                        "Optimal, natural daylight",
                        "Clean, monochromatic outfit",
                        "Single subject focused"
                      ].map((tip, i) => (
                        <li key={i} className="flex items-center gap-3 text-[11px] text-white/60">
                          <span className="h-1 w-1 rounded-full bg-accent/40" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Garment Card */}
                <div className="mt-auto pt-14">
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative flex items-center gap-6 p-6 rounded-[2rem] bg-white/[0.03] border border-white/5">
                      <div className="h-20 w-20 rounded-2xl bg-white/5 p-3 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={productImage} alt="" className="h-full w-full object-contain transform group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white mb-2 leading-tight uppercase tracking-tight">{product?.productName}</p>
                        <div className="h-0.5 w-8 bg-accent/60 mb-2"></div>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-medium">Studio Asset</p>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* ─── Viewport ─────────────────────────────────── */}
              <div className="relative overflow-hidden bg-[#050505] flex items-center justify-center">
                {/* Visual Backdrop Effects */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-accent/5 rounded-full blur-[120px]" />
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
                </div>

                {/* Cropping Layer */}
                {isCropping && (
                  <div className="absolute inset-0 z-[80] flex flex-col bg-black">
                    <div className="relative flex-1">
                        <Cropper
                          image={cropImage}
                          crop={crop}
                          zoom={zoom}
                          aspect={3 / 4}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                          showGrid={false}
                        />
                        <AlignmentGuide />
                    </div>
                    <div className="bg-black/80 backdrop-blur-xl p-10 border-t border-white/10 flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <FiMove className="text-accent" size={20} />
                          <div>
                            <p className="text-white text-sm font-bold">Center Your Portrait</p>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Scale and position for best fit</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <button
                            onClick={handleCancelCrop}
                            className="px-8 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleApplyCrop}
                            className="bg-accent text-black px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform active:scale-95"
                          >
                            Set Portrait
                          </button>
                       </div>
                    </div>
                  </div>
                )}

                {/* Generation Overlay */}
                <AnimatePresence>
                  {isGenerating && (
                    <motion.div
                      className="absolute inset-0 z-[90] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="relative mb-14 h-40 w-40 flex items-center justify-center">
                        <motion.div
                          className="absolute inset-0 rounded-full border border-accent/20"
                          animate={{ scale: [1, 1.4, 1], rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute inset-4 rounded-full border-2 border-accent/40 border-t-transparent"
                          animate={{ rotate: -360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="text-5xl drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                          {phaseInfo.icon}
                        </div>
                      </div>

                      <h4 className="text-white font-serif text-4xl italic font-light mb-4 text-center">
                        {phaseInfo.title}
                      </h4>
                      <p className="text-white/40 text-[11px] max-w-[280px] text-center leading-relaxed mb-12 uppercase tracking-widest">
                        {phaseInfo.sub}
                      </p>

                      <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden mb-6">
                        <motion.div
                          className="h-full bg-accent shadow-[0_0_15px_#b8892f]"
                          initial={{ width: "0%" }}
                          animate={{ width: genPhase === "finalizing" ? "98%" : genPhase === "generating" ? "75%" : "35%" }}
                          transition={{ duration: 4, ease: "circOut" }}
                        />
                      </div>
                      <p className="text-[10px] font-mono text-accent/50 tracking-[0.5em]">T-{genSeconds}S</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Preview */}
                <div className="relative z-10 w-full h-full p-12 lg:p-20 flex items-center justify-center">
                  <div className="relative aspect-[3/4] h-full max-h-[750px] w-auto overflow-hidden rounded-[3rem] bg-[#111] shadow-[0_50px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/10 group/preview">
                    
                    {vtoResult ? (
                      <motion.div
                        className="absolute inset-0 z-50 bg-black overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <img src={vtoResult} alt="AI Result" className="h-full w-full object-cover" />
                        
                        {/* Aesthetic Overlays */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                          <motion.div 
                            className="absolute inset-x-0 h-px bg-accent/30 shadow-[0_0_15px_var(--accent)]"
                            initial={{ top: "0%" }}
                            animate={{ top: "100%" }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          />
                        </div>

                        {/* HUD labels */}
                        <div className="absolute top-8 left-8 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-accent/30 flex items-center gap-3 shadow-2xl">
                           <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-black">
                             <FiCheck size={14} />
                           </div>
                           <div className="flex flex-col">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Intelligence Verified</span>
                             <span className="text-[8px] font-bold uppercase tracking-widest text-accent/80">Studio Grade Output</span>
                           </div>
                        </div>

                        <div className="absolute bottom-8 inset-x-8 flex justify-between items-center bg-black/60 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/10 shadow-3xl">
                           <button
                             onClick={() => setVtoResult("")}
                             className="flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 transition-all"
                           >
                             <FiRefreshCw /> Retake
                           </button>
                           <div className="flex gap-4">
                             <a
                               href={vtoResult}
                               target="_blank"
                               rel="noreferrer"
                               download
                               className="bg-accent text-black px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all active:scale-95"
                             >
                               <FiDownload /> Export
                             </a>
                           </div>
                        </div>
                      </motion.div>
                    ) : (
                      <>
                        {mode === "webcam" && (
                          <video ref={videoRef} className="h-full w-full object-cover grayscale-[0.2] contrast-[1.1]" autoPlay playsInline muted style={{ transform: "scaleX(-1)" }} />
                        )}

                        {selfiePreview && (
                          <img src={selfiePreview} alt="Portrait" className="h-full w-full object-cover" />
                        )}

                        {!selfiePreview && mode !== "webcam" && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-20 bg-gradient-to-b from-black/20 to-black/60">
                             <FiUpload className="text-white/10 text-8xl mb-10" />
                             <h4 className="text-white font-serif text-3xl italic mb-4">No Model Selected</h4>
                             <p className="text-white/30 text-[11px] uppercase tracking-widest leading-loose">Upload a front-facing portrait to begin transformation.</p>
                          </div>
                        )}

                        {/* Guide Overlay */}
                        {(mode === "webcam" || selfiePreview) && !isGenerating && (
                           <div className="absolute inset-0 pointer-events-none border-[20px] border-white/5 flex flex-col">
                              <div className="flex-1 flex items-center justify-center opacity-20">
                                 <div className="w-[80%] aspect-[3/4] border border-white/50 rounded-[4rem] border-dashed" />
                              </div>
                              <div className="p-10 text-center">
                                 <div className="inline-block bg-white/10 backdrop-blur-md px-8 py-3 rounded-full border border-white/10">
                                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.4em]">
                                        {mode === "webcam" ? "Position inside bounds" : "Portrait Confirmed"}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* Garment Mix Overlay (Subtle) */}
                        {productImage && (mode === "webcam" || selfiePreview) && !isGenerating && (
                          <div className="absolute inset-y-0 right-0 w-1/3 z-30 flex items-center pointer-events-none px-6">
                            <motion.img
                              src={productImage}
                              className="w-full object-contain opacity-20 filter blur-[1px] transform rotate-3"
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 4, repeat: Infinity }}
                            />
                          </div>
                        )}
                      </>
                    )}

                    {/* Fatal Error */}
                    {cameraError && (
                      <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black p-20 text-center">
                        <FiAlertTriangle className="text-accent text-7xl mb-10" />
                        <h4 className="text-white font-serif text-3xl mb-4">Device Access Restricted</h4>
                        <p className="text-white/40 text-[11px] leading-relaxed max-w-xs mb-12 uppercase tracking-widest">{cameraError}</p>
                        <label className="cursor-pointer px-12 py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-3xl hover:bg-accent transition-colors shadow-2xl">
                          Select from files
                          <input type="file" accept="image/*" className="hidden" onChange={onUploadSelfie} />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default VirtualTryOnModal;
