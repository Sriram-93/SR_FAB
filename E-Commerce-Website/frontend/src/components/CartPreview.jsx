import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import { toOptimizedImageUrl } from "../utils/imageUtils";

const CART_PREVIEW_FALLBACK =
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=120&q=60";

const CartPreview = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchCart = useCallback(async () => {
    if (!user?.userId) {
      setItems([]);
      setTotal(0);
      return;
    }
    try {
      const res = await api.get(`/cart/${user.userId}`);
      setItems(res.data);
      const sum = res.data.reduce(
        (acc, item) =>
          acc + (item.product?.productPriceAfterDiscount || 0) * item.quantity,
        0,
      );
      setTotal(sum);
    } catch (err) {
      console.error("Cart fetch error", err);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && user?.userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchCart();
    }
  }, [isOpen, user, fetchCart]);

  const updateQty = async (cartId, newQty) => {
    try {
      await api.put(`/cart/${cartId}`, { quantity: newQty });
      fetchCart();
    } catch {
      /* silent */
    }
  };

  const removeItem = async (cartId) => {
    try {
      await api.delete(`/cart/${cartId}`);
      fetchCart();
      refreshCart();
    } catch {
      /* silent */
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="animate-slide-in fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface border-l border-[var(--line)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-5">
          <h2 className="font-serif text-xl font-bold text-primary">
            Your Bag
          </h2>
          <button
            onClick={onClose}
            className="text-primary/45 transition hover:text-accent"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!user || items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <FiShoppingBag size={48} className="mb-4 text-primary/20" />
              <p className="text-sm font-medium text-primary">
                {!user ? "Sign in to view your bag" : "Your bag is empty"}
              </p>
              <Link
                to={!user ? "/login" : "/shop"}
                onClick={onClose}
                className="mt-4 text-xs font-semibold uppercase tracking-widest text-accent transition hover:text-primary"
              >
                {!user ? "Sign In" : "Browse Collections"}
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--line)]">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <img
                    src={toOptimizedImageUrl(
                      item.product?.productImages || CART_PREVIEW_FALLBACK,
                      { width: 120, height: 160, quality: 60 },
                    )}
                    alt={item.product?.productName}
                    className="h-24 w-20 shrink-0 rounded object-cover bg-primary/5"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.src = CART_PREVIEW_FALLBACK;
                    }}
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      {item.product?.brand && (
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                          {item.product.brand}
                        </p>
                      )}
                      <p className="text-sm font-medium text-primary line-clamp-1">
                        {item.product?.productName}
                      </p>
                      {/* Variant info */}
                      {item.variant && (
                        <p className="mt-0.5 text-[11px] text-muted">
                          {item.variant.size && `Size: ${item.variant.size}`}
                          {item.variant.size && item.variant.color && " · "}
                          {item.variant.color && `Color: ${item.variant.color}`}
                        </p>
                      )}
                      <p className="mt-0.5 text-sm font-semibold text-accent">
                        ₹{item.product?.productPriceAfterDiscount || 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-[var(--line)] text-xs">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 text-primary/55 transition hover:text-accent disabled:opacity-30"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-8 text-center font-medium text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-primary/55 transition hover:text-accent"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-primary/25 transition hover:text-red-500"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {user && items.length > 0 && (
          <div className="border-t border-[var(--line)] px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-muted">Subtotal</span>
              <span className="text-lg font-bold text-primary">
                ₹{total.toFixed(2)}
              </span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full bg-primary py-4 text-center text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-accent"
            >
              Checkout
            </Link>
            <Link
              to="/cart"
              onClick={onClose}
              className="mt-3 block w-full border border-[var(--line)] py-3 text-center text-xs font-semibold uppercase tracking-widest text-primary transition hover:border-[var(--line-strong)] hover:text-accent"
            >
              View Full Bag →
            </Link>
            <button
              onClick={onClose}
              className="mt-2 block w-full text-center text-xs text-muted transition hover:text-primary"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartPreview;
