import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCreditCard, FiSmartphone, FiCheckCircle, FiLoader } from "react-icons/fi";

const PaymentModal = ({ isOpen, onClose, onPaymentSubmit, amount, isSubmitting, isSuccess }) => {
  const [method, setMethod] = useState("card"); // 'card' or 'upi'
  const [step, setStep] = useState(1); // 1: Input, 2: Processing, 3: Success
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  // Sync internal step with external props
  useEffect(() => {
    if (isOpen) {
      if (isSuccess) {
        setStep(3);
      } else if (isSubmitting) {
        setStep(2);
      } else {
        setStep(1);
      }
    }
  }, [isOpen, isSubmitting, isSuccess]);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "number") {
      formattedValue = value.replace(/\D/g, "").substring(0, 16).replace(/(.{4})/g, "$1 ").trim();
    } else if (name === "expiry") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4).replace(/(.{2})/g, "$2/").replace(/\/$/, "");
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 3);
    }
    setCardData({ ...cardData, [name]: formattedValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPaymentSubmit();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md overflow-hidden bg-surface shadow-2xl rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-primary/5 p-6">
          <div>
            <h2 className="text-lg font-bold text-primary">Secure Payment</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Total to pay: <span className="text-accent">₹{Math.round(amount)}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-primary/40 transition hover:text-primary">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Method Selector */}
                <div className="mb-8 flex gap-2">
                  <button
                    onClick={() => setMethod("card")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      method === "card"
                        ? "border-accent bg-accent/5 text-accent shadow-[0_0_20px_rgba(201,169,110,0.1)]"
                        : "border-primary/5 text-primary/40 hover:border-primary/10"
                    }`}
                  >
                    <FiCreditCard size={16} /> Card
                  </button>
                  <button
                    onClick={() => setMethod("upi")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      method === "upi"
                        ? "border-accent bg-accent/5 text-accent shadow-[0_0_20px_rgba(201,169,110,0.1)]"
                        : "border-primary/5 text-primary/40 hover:border-primary/10"
                    }`}
                  >
                    <FiSmartphone size={16} /> UPI
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {method === "card" ? (
                    <>
                      {/* Interactive Card View */}
                      <div className="relative mb-6 h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1c1e] to-black p-6 shadow-xl shadow-black/40">
                        <div className="relative z-10 flex h-full flex-col justify-between">
                          <div className="flex justify-between">
                            <div className="h-10 w-12 rounded bg-white/10" />
                            <div className="text-xs font-black italic text-white/40">PREMIUM</div>
                          </div>
                          <div className="text-lg font-bold tracking-[0.2em] text-white/90">
                            {cardData.number || "**** **** **** ****"}
                          </div>
                          <div className="flex justify-between">
                            <div>
                              <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">Holder</div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                                {cardData.name || "YOUR NAME"}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[8px] font-bold uppercase tracking-widest text-white/30">Expiry</div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                                {cardData.expiry || "MM/YY"}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Abstract circle backgrounds */}
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          name="number"
                          placeholder="Card Number"
                          value={cardData.number}
                          onChange={handleCardChange}
                          required
                          className="w-full rounded-xl border border-primary/10 bg-surface px-4 py-3 text-sm text-primary placeholder:text-primary/20 focus:border-accent outline-none transition-all"
                        />
                        <div className="flex gap-3">
                          <input
                            type="text"
                            name="expiry"
                            placeholder="MM/YY"
                            value={cardData.expiry}
                            onChange={handleCardChange}
                            required
                            className="w-2/3 rounded-xl border border-primary/10 bg-surface px-4 py-3 text-sm text-primary placeholder:text-primary/20 focus:border-accent outline-none transition-all"
                          />
                          <input
                            type="password"
                            name="cvv"
                            placeholder="CVV"
                            value={cardData.cvv}
                            onChange={handleCardChange}
                            required
                            className="w-1/3 rounded-xl border border-primary/10 bg-surface px-4 py-3 text-sm text-primary placeholder:text-primary/20 focus:border-accent outline-none transition-all"
                          />
                        </div>
                        <input
                          type="text"
                          name="name"
                          placeholder="Card Holder Name"
                          value={cardData.name}
                          onChange={handleCardChange}
                          required
                          className="w-full rounded-xl border border-primary/10 bg-surface px-4 py-3 text-sm text-primary placeholder:text-primary/20 focus:border-accent outline-none transition-all uppercase"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6 pt-4">
                      <div className="flex justify-center py-6">
                        <div className="relative flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-primary/5 bg-white p-2">
                           {/* Simulated QR Code for visual flair */}
                           <div className="grid h-full w-full grid-cols-6 grid-rows-6 gap-1 p-2">
                              {[...Array(36)].map((_, i) => (
                                <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? "bg-black" : "bg-transparent"}`} />
                              ))}
                           </div>
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-md">
                              <FiSmartphone className="text-accent" size={24} />
                           </div>
                        </div>
                      </div>
                      <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                        Scan the code or enter your ID
                      </p>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        required
                        className="w-full rounded-xl border border-primary/10 bg-surface px-4 py-3 text-sm text-primary placeholder:text-primary/20 focus:border-accent outline-none transition-all text-center"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="mt-6 w-full rounded-xl bg-primary py-4 text-xs font-bold uppercase tracking-[0.2em] text-bg transition-all hover:bg-accent hover:-translate-y-1 hover:shadow-xl active:scale-95"
                  >
                    Verify & Pay ₹{Math.round(amount)}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center justify-center space-y-6 py-12"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-20 w-20 rounded-full border-4 border-accent/20 border-t-accent"
                  />
                  <FiLoader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent" size={24} />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-primary">Processing Payment</h3>
                  <p className="mt-2 text-xs font-medium text-muted">Awaiting confirmation from your bank...</p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center space-y-6 py-12"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <FiCheckCircle size={48} />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-primary">Payment Successful</h3>
                  <p className="mt-2 text-xs font-medium text-muted">Thank you! Your transaction is complete.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Meta */}
        <div className="bg-primary/[0.02] p-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/20">
            Encrypted • Secure • Premium
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
