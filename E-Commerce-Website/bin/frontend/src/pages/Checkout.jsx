import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';

const Checkout = () => {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState('COD');
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    setLoading(true);
    try {
      await api.post('/orders/place', { userId: user.userId, paymentType, from: 'cart' });
      toast.success('Order placed successfully!');
      refreshCart();
      navigate('/');
    } catch (err) {
      toast.error('Failed to place order');
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
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-primary">Shipping Address</label>
          <textarea
            readOnly
            value={user?.userAddress || 'Registered address'}
            rows={3}
            className="w-full resize-none border border-gray-200 bg-surface px-4 py-3 text-sm text-muted"
          />
          <p className="mt-1 text-xs text-muted">Using your registered address.</p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-primary">Payment Method</label>
          <div className="flex gap-3">
            {['COD', 'Card'].map((type) => (
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
                {type === 'COD' ? 'Cash on Delivery' : 'Credit Card'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-primary py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-accent disabled:bg-gray-300"
        >
          {loading ? 'Processing…' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
