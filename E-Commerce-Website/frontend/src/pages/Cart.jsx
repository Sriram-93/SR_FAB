import { useCallback, useEffect, useState } from "react";
/* eslint-disable react-hooks/set-state-in-effect */
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowLeft,
} from "react-icons/fi";
import { getProductImage } from "../utils/productImages";

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    if (user?.userId) {
      try {
        const res = await api.get(`/cart/${user.userId}`);
        setCartItems(res.data);
        const sum = res.data.reduce(
          (acc, item) =>
            acc + item.product.productPriceAfterDiscount * item.quantity,
          0,
        );
        setTotal(sum);
      } catch (err) {
        console.error(err);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  const updateQuantity = async (cartId, newQty) => {
    try {
      await api.put(`/cart/${cartId}`, { quantity: newQty });
      fetchCart();
    } catch {
      toast.error("Failed to update");
    }
  };

  const removeItem = async (cartId) => {
    try {
      await api.delete(`/cart/${cartId}`);
      fetchCart();
      refreshCart();
    } catch {
      toast.error("Failed to remove");
    }
  };

  if (!user) return null;

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <FiShoppingBag size={48} className="mb-4 text-primary/20" />
        <h2 className="text-xl font-bold text-primary">Your bag is empty</h2>
        <p className="mt-2 text-primary/40 font-medium">
          Looks like you haven't picked any garments yet.
        </p>
        <Link
          to="/"
          className="mt-8 bg-primary px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-bg transition hover:bg-accent hover:-translate-y-1 hover:shadow-xl duration-300"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-in py-12">
      <h1 className="mb-8 font-serif text-3xl font-bold text-primary">
        Shopping Bag
      </h1>

      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Cart Items */}
        <div className="flex-1 space-y-8">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-6 border-b border-primary/5 pb-8"
            >
              <div className="h-32 w-24 bg-surface flex-shrink-0 rounded-xl overflow-hidden border border-primary/10">
                <img
                  src={item.product?.productImages || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=150&q=60"}
                  alt={item.product?.productName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=150&q=60";
                  }}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    {item.product.brand && (
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/80">
                        {item.product.brand}
                      </p>
                    )}
                    <h3 className="font-semibold text-primary">
                      {item.product.productName}
                    </h3>
                    {/* Variant info */}
                    {item.variant && (
                      <p className="mt-0.5 text-xs text-muted">
                        {item.variant.size && `Size: ${item.variant.size}`}
                        {item.variant.size && item.variant.color && " · "}
                        {item.variant.color && `Color: ${item.variant.color}`}
                      </p>
                    )}
                  </div>
                  <p className="font-bold text-primary">
                    ₹{item.product.productPriceAfterDiscount}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-primary/10 bg-surface rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 text-primary/40 transition hover:text-accent disabled:opacity-30"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-primary">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-primary/40 transition hover:text-accent"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[10px] font-bold uppercase tracking-widest text-primary/40 underline decoration-primary/20 underline-offset-4 transition hover:text-red-500 hover:decoration-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-accent"
          >
            <FiArrowLeft /> Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="h-fit w-full rounded-2xl bg-surface border border-primary/5 p-8 lg:w-96 shadow-xl">
          <h2 className="mb-6 font-serif text-xl font-bold text-primary">
            Order Summary
          </h2>
          <div className="space-y-4 border-b border-primary/5 pb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-primary/60 font-medium tracking-wide">Subtotal</span>
              <span className="font-bold text-primary">
                ₹{total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary/60 font-medium tracking-wide">Shipping</span>
              <span className="font-bold text-primary">
                {total >= 999 ? "Free" : "₹99"}
              </span>
            </div>
          </div>
          <div className="mb-8 mt-6 flex justify-between text-lg font-black text-primary">
            <span>Total</span>
            <span>₹{(total >= 999 ? total : total + 99).toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-primary py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-bg transition hover:bg-accent hover:-translate-y-1 hover:shadow-xl duration-300"
          >
            Proceed to Checkout
          </button>
          {total < 999 && (
            <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-accent">
              Add ₹{(999 - total).toFixed(0)} more for free shipping
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
