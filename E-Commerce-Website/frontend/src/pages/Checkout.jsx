import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiChevronLeft, FiCheck, FiTag } from 'react-icons/fi';

const Checkout = () => {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState('COD');
  const [loading, setLoading] = useState(false);

  // ── Address ──
  const [address, setAddress] = useState('');
  useEffect(() => {
    if (user?.userId) {
      api.get(`/user/${user.userId}`).then(res => {
        const u = res.data;
        const parts = [u.userAddress, u.userCity, u.userState, u.userPincode].filter(Boolean);
        setAddress(parts.join(', ') || '');
      }).catch(() => {});
    }
  }, [user]);

  // ── First-order discount ──
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  useEffect(() => {
    if (user?.userId) {
      api.get(`/orders/user/${user.userId}/count`).then(res => {
        setIsFirstOrder(res.data.count === 0);
      }).catch(() => {});
    }
  }, [user]);

  // ── Cart items for subtotal ──
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  useEffect(() => {
    if (user?.userId) {
      api.get(`/cart/${user.userId}`).then(res => {
        setCartItems(res.data);
        setSubtotal(res.data.reduce((sum, i) => sum + (i.product?.productPriceAfterDiscount || 0) * i.quantity, 0));
      }).catch(() => {});
    }
  }, [user]);

  // ── Coupon ──
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await api.post('/coupons/validate', { code: couponCode, orderTotal: subtotal });
      if (res.data.valid) {
        setCouponDiscount(res.data.discountAmount);
        setCouponApplied(true);
        toast.success(`Coupon applied! ₹${Math.round(res.data.discountAmount)} off`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Invalid coupon');
      setCouponDiscount(0);
      setCouponApplied(false);
    }
  };

  // ── Calculate totals ──
  const firstOrderDiscount = isFirstOrder && !couponApplied ? subtotal * 0.10 : 0;
  const totalDiscount = couponApplied ? couponDiscount : firstOrderDiscount;
  const finalTotal = subtotal - totalDiscount;

  const handleOrder = async () => {
    if (!address.trim()) { toast.error('Please enter a shipping address'); return; }
    setLoading(true);
    try {
      const res = await api.post('/orders/place', {
        userId: user.userId,
        paymentType,
        from: 'cart',
        couponCode: couponApplied ? couponCode : null,
        shippingAddress: address,
      });
      toast.success('Order placed successfully! 🎉');
      refreshCart();
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg animate-fade-in py-12">
      <Link to="/cart" className="mb-8 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-muted transition hover:text-primary">
        <FiChevronLeft size={14} /> Back to bag
      </Link>

      <h1 className="font-serif text-3xl font-bold text-primary">Checkout</h1>
      <p className="mt-2 text-sm text-muted">Complete your order</p>

      <div className="mt-10 space-y-6">
        {/* ── Address ── */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-primary">Shipping Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="Enter your full delivery address"
            className="w-full resize-none border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <p className="mt-1 text-xs text-muted">You can edit the delivery address above. Changes will be saved to your profile.</p>
        </div>

        {/* ── First-order banner ── */}
        {isFirstOrder && !couponApplied && (
          <div className="border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-700">🎉 First Order Discount!</p>
            <p className="mt-1 text-xs text-green-600">10% off is automatically applied to your first order.</p>
          </div>
        )}

        {/* ── Coupon ── */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-primary">Coupon Code</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="w-full border border-gray-200 pl-9 pr-4 py-3 text-sm uppercase outline-none focus:border-accent bg-white"
                disabled={couponApplied}
              />
            </div>
            {couponApplied ? (
              <button onClick={() => { setCouponApplied(false); setCouponDiscount(0); setCouponCode(''); }}
                className="border border-red-200 px-6 py-3 text-xs font-semibold uppercase text-red-500 transition hover:bg-red-50">Remove</button>
            ) : (
              <button onClick={applyCoupon}
                className="border border-gray-200 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary transition hover:border-accent hover:text-accent">Apply</button>
            )}
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div className="border border-gray-100 p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted">Order Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Subtotal ({cartItems.length} items)</span>
            <span className="font-medium text-primary">₹{Math.round(subtotal)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">
                {couponApplied ? `Coupon (${couponCode})` : 'First Order (10%)'}
              </span>
              <span className="font-medium text-green-600">-₹{Math.round(totalDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-100 pt-3 text-sm">
            <span className="font-semibold text-primary">Total</span>
            <span className="text-lg font-bold text-primary">₹{Math.round(finalTotal)}</span>
          </div>
        </div>

        {/* ── Payment ── */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-primary">Payment Method</label>
          <div className="flex gap-3">
            {['COD', 'Card', 'UPI'].map((type) => (
              <button
                key={type}
                onClick={() => setPaymentType(type)}
                className={`flex-1 border py-3 text-sm font-medium transition ${
                  paymentType === type
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-gray-200 text-muted hover:border-gray-300'
                }`}
              >
                {paymentType === type && <FiCheck className="mr-1 inline" size={14} />}
                {type === 'COD' ? 'Cash on Delivery' : type === 'Card' ? 'Credit Card' : 'UPI'}
              </button>
            ))}
          </div>
          {(paymentType === 'Card' || paymentType === 'UPI') && (
            <div className="mt-4 rounded border border-blue-100 bg-blue-50 p-4 text-xs text-blue-700">
              <span className="font-bold">Note:</span> Payment gateway integration is simulated. No actual payment will be processed.
            </div>
          )}
        </div>

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-primary py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-accent disabled:bg-gray-300"
        >
          {loading ? 'Processing…' : `Pay ₹${Math.round(finalTotal)}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
