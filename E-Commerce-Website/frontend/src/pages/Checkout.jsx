import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiChevronLeft, FiCheck, FiTag } from "react-icons/fi";
import PaymentModal from "../components/PaymentModal";

const Checkout = () => {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState("COD");
  const [loading, setLoading] = useState(false);

  // ── Address ──
  const [address, setAddress] = useState("");
  useEffect(() => {
    if (user?.userId) {
      api
        .get(`/user/${user.userId}`)
        .then((res) => {
          const u = res.data;
          const parts = [
            u.userAddress,
            u.userCity,
            u.userState,
            u.userPincode,
          ].filter(Boolean);
          setAddress(parts.join(", ") || "");
        })
        .catch(() => {});
    }
  }, [user]);

  // ── First-order discount ──
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  useEffect(() => {
    if (user?.userId) {
      api
        .get(`/orders/user/${user.userId}/count`)
        .then((res) => {
          setIsFirstOrder(res.data.count === 0);
        })
        .catch(() => {});
    }
  }, [user]);

  // ── Cart items for subtotal ──
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  useEffect(() => {
    if (user?.userId) {
      api
        .get(`/cart/${user.userId}`)
        .then((res) => {
          setCartItems(res.data);
          setSubtotal(
            res.data.reduce(
              (sum, i) =>
                sum + (i.product?.productPriceAfterDiscount || 0) * i.quantity,
              0,
            ),
          );
        })
        .catch(() => {});
    }
  }, [user]);

  // ── Coupon ──
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await api.post("/coupons/validate", {
        code: couponCode,
        orderTotal: subtotal,
      });
      if (res.data.valid) {
        setCouponDiscount(res.data.discountAmount);
        setCouponApplied(true);
        toast.success(
          `Coupon applied! ₹${Math.round(res.data.discountAmount)} off`,
        );
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "Invalid coupon");
      setCouponDiscount(0);
      setCouponApplied(false);
    }
  };

  // ── Calculate totals ──
  const firstOrderDiscount =
    isFirstOrder && !couponApplied ? subtotal * 0.1 : 0;
  const totalDiscount = couponApplied ? couponDiscount : firstOrderDiscount;
  const finalTotal = subtotal - totalDiscount;

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const handleOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }

    if (paymentType === "COD") {
      submitOrder();
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const submitOrder = async () => {
    setLoading(true);
    try {
      await api.post("/orders/place", {
        userId: user.userId,
        paymentType,
        from: "cart",
        couponCode: couponApplied ? couponCode : null,
        shippingAddress: address,
      });

      if (paymentType !== "COD") {
        setIsPaymentSuccess(true);
        setTimeout(() => {
          toast.success("Order placed successfully! 🎉");
          refreshCart();
          navigate("/");
        }, 2000);
      } else {
        toast.success("Order placed successfully! 🎉");
        refreshCart();
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to place order");
      setIsPaymentModalOpen(false); // Close modal on error to show toast clearly
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg animate-fade-in py-12">
      <Link
        to="/cart"
        className="mb-8 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-muted transition hover:text-primary"
      >
        <FiChevronLeft size={14} /> Back to bag
      </Link>

      <h1 className="font-serif text-3xl font-bold text-primary">Checkout</h1>
      <p className="mt-2 text-sm text-muted">Complete your order</p>

      <div className="mt-10 space-y-6">
        {/* ── Address ── */}
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
            Shipping Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="Enter your full delivery address"
            className="w-full resize-none border border-primary/10 bg-surface px-5 py-4 text-sm text-primary outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_20px_rgba(201,169,110,0.05)] rounded-none placeholder:text-primary/20"
          />
          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-primary/30">
            You can edit the delivery address above. Changes will be saved to
            your profile.
          </p>
        </div>

        {/* ── First-order banner ── */}
        {isFirstOrder && !couponApplied && (
          <div className="border border-green-500/20 bg-green-500/5 p-5 rounded-lg">
            <p className="text-xs font-black uppercase tracking-widest text-green-500">
              🎉 First Order Discount
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-green-500/70">
              10% off is automatically applied to your first order.
            </p>
          </div>
        )}

        {/* ── Coupon ── */}
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
            Coupon Code
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <FiTag
                className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40"
                size={14}
              />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="w-full border border-primary/10 pl-10 pr-4 py-4 text-sm text-primary uppercase outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_20px_rgba(201,169,110,0.05)] bg-surface rounded-none placeholder:text-primary/20 disabled:opacity-50"
                disabled={couponApplied}
              />
            </div>
            {couponApplied ? (
              <button
                onClick={() => {
                  setCouponApplied(false);
                  setCouponDiscount(0);
                  setCouponCode("");
                }}
                className="border border-red-500/20 bg-red-500/5 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 transition-all hover:bg-red-500 hover:text-white"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={applyCoupon}
                className="border border-primary/10 bg-surface px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:border-accent hover:text-accent hover:bg-accent/5"
              >
                Apply
              </button>
            )}
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div className="border border-primary/5 bg-surface p-6 space-y-4 rounded-xl shadow-lg">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
            Order Summary
          </h3>
          <div className="flex justify-between text-sm">
            <span className="text-primary/60 font-medium">
              Subtotal ({cartItems.length} items)
            </span>
            <span className="font-bold text-primary">
              ₹{Math.round(subtotal)}
            </span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-500 font-medium">
                {couponApplied ? `Coupon (${couponCode})` : "First Order (10%)"}
              </span>
              <span className="font-bold text-green-500">
                -₹{Math.round(totalDiscount)}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-primary/5 pt-4 text-sm">
            <span className="font-black text-primary">Total</span>
            <span className="text-xl font-black text-accent">
              ₹{Math.round(finalTotal)}
            </span>
          </div>
        </div>

        {/* ── Payment ── */}
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
            Payment Method
          </label>
          <div className="flex gap-3">
            {["COD", "Card", "UPI"].map((type) => (
              <button
                key={type}
                onClick={() => setPaymentType(type)}
                className={`flex-1 border py-4 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded ${
                  paymentType === type
                    ? "border-accent bg-accent text-bg shadow-lg scale-105"
                    : "border-primary/10 bg-surface text-primary/60 hover:border-primary/30"
                }`}
              >
                {paymentType === type && (
                  <FiCheck className="mr-1 inline" size={12} />
                )}
                {type === "COD"
                  ? "Cash on Delivery"
                  : type === "Card"
                    ? "Credit Card"
                    : "UPI"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-primary py-5 text-[12px] font-bold uppercase tracking-[0.2em] text-bg transition-all duration-300 hover:bg-accent hover:-translate-y-1 hover:shadow-xl disabled:bg-primary/20 disabled:hover:translate-y-0 disabled:shadow-none"
        >
          {loading ? "Processing…" : `Pay ₹${Math.round(finalTotal)}`}
        </button>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSubmit={submitOrder}
        amount={finalTotal}
        isSubmitting={loading}
        isSuccess={isPaymentSuccess}
      />
    </div>
  );
};

export default Checkout;
