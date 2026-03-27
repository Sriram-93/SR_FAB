/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]); // Array of product objects
  const [loading, setLoading] = useState(false);
  const [pendingProductIds, setPendingProductIds] = useState(new Set());

  const fetchWishlist = useCallback(async () => {
    if (!user?.userId) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/wishlist/${user.userId}`);
      // res.data is now a direct list of products
      setWishlist(res.data);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = useCallback(
    async (productId) => {
      if (!user) {
        toast.info("Please sign in to save items");
        return;
      }

      if (!user.userId) {
        toast.info("Wishlist is available only for customer accounts");
        return;
      }

      if (pendingProductIds.has(productId)) {
        return;
      }

      setPendingProductIds((prev) => {
        const next = new Set(prev);
        next.add(productId);
        return next;
      });

      try {
        const res = await api.post("/wishlist/toggle", {
          userId: user.userId,
          productId,
        });

        if (res.data.added) {
          toast.success("Added to wishlist");
        } else {
          toast.info("Removed from wishlist");
        }
        fetchWishlist();
      } catch (error) {
        console.error("Failed to toggle wishlist", error);
        toast.error("An error occurred");
      } finally {
        setPendingProductIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }
    },
    [user, fetchWishlist, pendingProductIds],
  );

  const isInWishlist = useCallback(
    (productId) => {
      return wishlist.some((item) => item.productId === productId);
    },
    [wishlist],
  );

  const isWishlistPending = useCallback(
    (productId) => pendingProductIds.has(productId),
    [pendingProductIds],
  );

  const contextValue = useMemo(
    () => ({
      wishlist,
      toggleWishlist,
      isInWishlist,
      isWishlistPending,
      loading,
      refreshWishlist: fetchWishlist,
    }),
    [wishlist, toggleWishlist, isInWishlist, isWishlistPending, loading, fetchWishlist],
  );

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};
