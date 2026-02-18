import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    refreshCart();
  }, [user]);

  const refreshCart = async () => {
    if (!user?.userId) {
      setCartCount(0);
      return;
    }
    try {
      const res = await api.get(`/cart/${user.userId}`);
      const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  const addToCart = async (productId, variantId, quantity = 1) => {
    if (!user) {
      toast.warning('Please sign in to add items to your bag');
      return;
    }
    try {
      await api.post('/cart/add', {
        userId: user.userId,
        productId,
        variantId,
        quantity
      });
      toast.success('Added to bag');
      refreshCart();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add item');
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
