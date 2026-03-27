/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import {
  FiBox,
  FiGrid,
  FiList,
  FiTrash2,
  FiEdit3,
  FiPlus,
  FiTag,
  FiBarChart2,
  FiAlertTriangle,
  FiEye,
  FiX,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsState, setAnalyticsState] = useState("loading");
  const [adminError, setAdminError] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");

  // ── Form States ──

  // ── Form States ──
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);

  const [editItem, setEditItem] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);

  const emptyProduct = {
    productName: "",
    productDescription: "",
    productPrice: "",
    productDiscount: "",
    brand: "",
    fabricType: "",
    productImages: "",
    categoryId: "",
    variants: [{ size: "", color: "", sku: "", stock: "" }],
  };
  const emptyCategory = {
    categoryName: "",
    categoryDescription: "",
    categoryImage: "",
  };
  const emptyCoupon = {
    code: "",
    discountPercent: "",
    minOrderAmount: "0",
    maxDiscount: "0",
    active: true,
    validFrom: "",
    validUntil: "",
  };

  const [productForm, setProductForm] = useState(emptyProduct);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [couponForm, setCouponForm] = useState(emptyCoupon);
  const hasFetchedInitially = useRef(false);

  const fetchData = useCallback(async () => {
    setAnalyticsState("loading");
    setAdminError("");

    const [catRes, prodRes, orderRes, couponRes, analyticsRes] =
      await Promise.allSettled([
        api.get("/categories"),
        api.get("/products/paged?page=0&size=40", { timeout: 12000 }),
        api.get("/orders"),
        api.get("/admin/coupons"),
        api.get("/admin/analytics", { timeout: 20000 }),
      ]);

    setCategories(catRes.status === "fulfilled" ? catRes.value.data : []);

    if (prodRes.status === "fulfilled") {
      setProducts(prodRes.value.data?.content || []);
    } else {
      try {
        // Keep admin usable with a smaller fallback query if the primary request fails.
        const fallbackProducts = await api.get(
          "/products/paged?page=0&size=20",
          {
            timeout: 10000,
          },
        );
        setProducts(fallbackProducts.data?.content || []);
      } catch {
        setProducts([]);
      }
      setAdminError("Products are slow to load. Showing partial data.");
    }

    if (orderRes.status === "fulfilled") {
      setOrders(orderRes.value.data || []);
    } else {
      setOrders([]);
      setAdminError(
        (prev) => prev || "Orders API failed. Check admin authorization.",
      );
    }

    if (couponRes.status === "fulfilled") {
      setCoupons(couponRes.value.data || []);
    } else {
      setCoupons([]);
      setAdminError(
        (prev) => prev || "Coupons API failed. Check admin authorization.",
      );
    }

    if (analyticsRes.status === "fulfilled") {
      setAnalytics(analyticsRes.value.data);
      setAnalyticsState("ready");
    } else {
      setAnalytics(null);
      if (
        analyticsRes.reason?.response?.status === 401 ||
        analyticsRes.reason?.response?.status === 403
      ) {
        setAnalyticsState("forbidden");
      } else {
        setAnalyticsState("error");
      }
      setAdminError(
        (prev) => prev || "Analytics API failed. Check admin authorization.",
      );
    }
  }, []);

  useEffect(() => {
    if (hasFetchedInitially.current) {
      return;
    }
    hasFetchedInitially.current = true;
    fetchData();
  }, [fetchData]);

  // ── Image Upload ──
  // ── Product CRUD ──
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        productPrice: parseFloat(productForm.productPrice) || 0,
        productDiscount: parseFloat(productForm.productDiscount) || 0,
        variants: productForm.variants.map((v) => ({
          ...v,
          stock: parseInt(v.stock) || 0,
        })),
      };
      if (editItem) {
        await api.put(
          `/products/${editItem.productId}?categoryId=${productForm.categoryId}`,
          payload,
        );
        toast.success("Product updated");
      } else {
        await api.post(
          `/products?categoryId=${productForm.categoryId}`,
          payload,
        );
        toast.success("Product added");
      }
      setShowProductForm(false);
      setEditItem(null);
      setProductForm(emptyProduct);
      fetchData();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error || err?.message || "Failed to save product";
      console.error("Product save error:", err);
      toast.error(errorMsg);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const editProduct = async (p) => {
    try {
      const { data: fullProduct } = await api.get(`/products/${p.productId}`, {
        timeout: 7000,
      });

      setProductForm({
        productName: fullProduct.productName,
        productDescription: fullProduct.productDescription || "",
        productPrice: fullProduct.productPrice,
        productDiscount: fullProduct.productDiscount || 0,
        brand: fullProduct.brand || "",
        fabricType: fullProduct.fabricType || "",
        productImages: fullProduct.productImages || "",
        categoryId: fullProduct.category?.categoryId || "",
        variants: fullProduct.variants?.length
          ? fullProduct.variants
          : [{ size: "", color: "", sku: "", stock: "" }],
      });
      setEditItem(fullProduct);
      setShowProductForm(true);
    } catch {
      toast.error("Could not load full product details for editing");
    }
  };

  // ── Category CRUD ──
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/categories/${editItem.categoryId}`, categoryForm);
        toast.success("Category updated");
      } else {
        await api.post("/categories", categoryForm);
        toast.success("Category added");
      }
      setShowCategoryForm(false);
      setEditItem(null);
      setCategoryForm(emptyCategory);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed");
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  // ── Coupon CRUD ──
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...couponForm,
        discountPercent: parseFloat(couponForm.discountPercent),
        minOrderAmount: parseFloat(couponForm.minOrderAmount) || 0,
        maxDiscount: parseFloat(couponForm.maxDiscount) || 0,
        validFrom: couponForm.validFrom
          ? new Date(couponForm.validFrom).toISOString()
          : null,
        validUntil: couponForm.validUntil
          ? new Date(couponForm.validUntil).toISOString()
          : null,
      };
      if (editItem) {
        await api.put(`/admin/coupons/${editItem.id}`, payload);
        toast.success("Coupon updated");
      } else {
        await api.post("/admin/coupons", payload);
        toast.success("Coupon created");
      }
      setShowCouponForm(false);
      setEditItem(null);
      setCouponForm(emptyCoupon);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed");
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Failed");
    }
  };

  // ── Order Status ──
  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchData();
    } catch {
      toast.error("Failed to update");
    }
  };

  const addVariant = () =>
    setProductForm({
      ...productForm,
      variants: [
        ...productForm.variants,
        { size: "", color: "", sku: "", stock: "" },
      ],
    });
  const removeVariant = (i) =>
    setProductForm({
      ...productForm,
      variants: productForm.variants.filter((_, idx) => idx !== i),
    });
  const updateVariant = (i, field, val) => {
    const v = [...productForm.variants];
    v[i] = { ...v[i], [field]: val };
    setProductForm({ ...productForm, variants: v });
  };

  const tabs = [
    { id: "analytics", label: "Analytics", icon: FiBarChart2 },
    { id: "products", label: "Products", icon: FiBox },
    { id: "categories", label: "Categories", icon: FiGrid },
    { id: "orders", label: "Orders", icon: FiList },
    { id: "coupons", label: "Coupons", icon: FiTag },
  ];

  const statusColor = (s) => {
    if (!s) return "bg-primary/10 text-primary/70";
    switch (s.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const inputClass =
    "w-full border border-primary/10 bg-surface px-4 py-3 text-sm text-primary outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_20px_rgba(201,169,110,0.05)] rounded-none placeholder:text-primary/20";

  return (
    <div className="mx-auto max-w-7xl animate-fade-in py-10">
      <h1 className="mb-8 font-serif text-3xl font-bold text-primary">
        Admin Dashboard
      </h1>

      {adminError && (
        <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {adminError}
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-64 shrink-0 transition-opacity duration-700">
          <nav className="space-y-1 sm:sticky sm:top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-primary text-bg shadow-xl scale-[1.02]"
                    : "bg-surface text-primary/70 hover:bg-primary/5 hover:text-primary border border-primary/10"
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Content ── */}
        <main className="flex-1 border border-primary/5 bg-surface p-8 shadow-sm min-h-[60vh] rounded-2xl lg:p-12">
          {/* ═════ ANALYTICS ═════ */}
          {activeTab === "analytics" && (
            <div>
              <h2 className="mb-6 text-lg font-bold text-primary">
                Store Analytics
              </h2>
              {analyticsState === "loading" ? (
                <p className="text-sm text-muted">Loading analytics...</p>
              ) : analyticsState === "forbidden" ? (
                <p className="text-sm text-red-500">
                  Analytics requires admin authorization. Please login again
                  with an admin account.
                </p>
              ) : analyticsState === "error" ? (
                <p className="text-sm text-red-500">
                  Could not load analytics right now. Please retry.
                </p>
              ) : analytics ? (
                <>
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                      {
                        label: "Products",
                        val: analytics.totalProducts,
                        color:
                          "bg-primary/5 text-primary border border-primary/5",
                      },
                      {
                        label: "Orders",
                        val: analytics.totalOrders,
                        color:
                          "bg-accent/10 text-accent border border-accent/10",
                      },
                      {
                        label: "Revenue",
                        val: `₹${Math.round(analytics.totalRevenue || 0).toLocaleString("en-IN")}`,
                        color: "bg-primary text-bg shadow-xl",
                      },
                      {
                        label: "Users",
                        val: analytics.totalUsers,
                        color:
                          "bg-primary/5 text-primary border border-primary/5",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className={`p-6 transition duration-500 hover:scale-105 ${s.color}`}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                          {s.label}
                        </p>
                        <p className="mt-2 text-2xl font-black">{s.val}</p>
                      </div>
                    ))}
                  </div>
                  {analytics.recentOrders?.length > 0 && (
                    <div className="mt-12">
                      <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-primary/55">
                        Transaction Overview
                      </h3>
                      <div className="border border-primary/5 rounded-2xl overflow-hidden shadow-sm">
                        {analytics.recentOrders.map((o) => (
                          <div
                            key={o.id}
                            className="flex items-center justify-between border-b border-primary/5 p-4 last:border-0 hover:bg-primary/5 transition duration-300"
                          >
                            <div>
                              <span className="text-sm font-medium text-primary">
                                #{o.orderId}
                              </span>
                              <span className="ml-3 text-xs text-muted">
                                {o.user?.userName}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${statusColor(o.status)}`}
                              >
                                {o.status}
                              </span>
                              {o.totalAmount > 0 && (
                                <span className="text-sm font-semibold">
                                  ₹{Math.round(o.totalAmount)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted">
                  No analytics data available.
                </p>
              )}
            </div>
          )}

          {/* ═════ PRODUCTS ═════ */}
          {activeTab === "products" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-primary">
                  Manage Products{" "}
                  <span className="ml-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary/80 border border-primary/10">
                    {products.length}
                  </span>
                </h2>
                <button
                  onClick={() => {
                    setShowProductForm(true);
                    setEditItem(null);
                    setProductForm(emptyProduct);
                  }}
                  className="flex items-center gap-1 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-bg hover:bg-accent transition"
                >
                  <FiPlus size={14} /> Add Product
                </button>
              </div>

              {/* Product Form */}
              {showProductForm && (
                <form
                  onSubmit={handleProductSubmit}
                  className="mb-6 border border-primary/10 p-5 space-y-4 bg-primary/5"
                >
                  <h3 className="font-semibold text-primary">
                    {editItem ? "Edit Product" : "New Product"}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="Product Name"
                      value={productForm.productName}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          productName: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                    <select
                      value={productForm.categoryId}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          categoryId: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.categoryId} value={c.categoryId}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                    <input
                      placeholder="Price (₹)"
                      type="number"
                      value={productForm.productPrice}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          productPrice: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                    <input
                      placeholder="Discount (%)"
                      type="number"
                      value={productForm.productDiscount}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          productDiscount: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                    <input
                      placeholder="Brand"
                      value={productForm.brand}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          brand: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                    <input
                      placeholder="Fabric Type"
                      value={productForm.fabricType}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          fabricType: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={productForm.productDescription}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        productDescription: e.target.value,
                      })
                    }
                    className={inputClass + " h-20"}
                  />

                  <input
                    placeholder="Image URL"
                    value={productForm.productImages}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        productImages: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                  {/* Variants */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase text-muted">
                        Variants
                      </span>
                      <button
                        type="button"
                        onClick={addVariant}
                        className="text-xs text-accent font-semibold hover:text-primary"
                      >
                        + Add Variant
                      </button>
                    </div>
                    {productForm.variants.map((v, i) => (
                      <div key={i} className="grid grid-cols-5 gap-2 mb-2">
                        <input
                          placeholder="Size"
                          value={v.size}
                          onChange={(e) =>
                            updateVariant(i, "size", e.target.value)
                          }
                          className={inputClass}
                        />
                        <input
                          placeholder="Color"
                          value={v.color}
                          onChange={(e) =>
                            updateVariant(i, "color", e.target.value)
                          }
                          className={inputClass}
                        />
                        <input
                          placeholder="SKU"
                          value={v.sku}
                          onChange={(e) =>
                            updateVariant(i, "sku", e.target.value)
                          }
                          className={inputClass}
                        />
                        <input
                          placeholder="Stock"
                          type="number"
                          value={v.stock}
                          onChange={(e) =>
                            updateVariant(i, "stock", e.target.value)
                          }
                          className={inputClass}
                        />
                        {productForm.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(i)}
                            className="text-red-400 hover:text-red-600 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-primary px-6 py-2 text-xs font-semibold uppercase tracking-widest text-bg hover:bg-accent transition"
                    >
                      {editItem ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditItem(null);
                      }}
                      className="border border-primary/15 px-6 py-2 text-xs font-semibold uppercase tracking-widest text-muted hover:text-primary transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Product Cards - First 10 */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                {products.slice(0, 10).map((p) => (
                  <div
                    key={p.productId}
                    className="group border border-primary/10 hover:border-accent/50 transition overflow-hidden rounded-2xl bg-surface/50"
                  >
                    {/* Image */}
                    <div className="h-32 w-full overflow-hidden bg-primary/5 border-b border-primary/10">
                      {p.productImages ? (
                        <img
                          src={p.productImages}
                          alt={p.productName}
                          className="h-full w-full object-cover group-hover:scale-110 transition duration-300"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1523381210434-271e8be1f52b";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-primary/25">
                          <FiBox size={40} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 space-y-2">
                      <p className="font-semibold text-primary text-sm line-clamp-2 min-h-9">
                        {p.productName}
                      </p>
                      <div>
                        <p className="text-xs text-accent font-bold">
                          ₹{p.productPrice}
                          {p.productDiscount > 0 && (
                            <span className="ml-1 text-green-600">
                              (-{p.productDiscount}%)
                            </span>
                          )}
                        </p>
                        {p.variants?.some((v) => v.stock <= 5) && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-red-600 font-semibold mt-1">
                            <FiAlertTriangle size={9} /> Low Stock
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t border-primary/5">
                        <button
                          onClick={() => editProduct(p)}
                          className="flex-1 flex items-center justify-center gap-1 text-primary/70 hover:text-accent text-xs font-semibold py-1.5 hover:bg-primary/5 rounded transition"
                          title="Edit"
                        >
                          <FiEdit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p.productId)}
                          className="flex-1 flex items-center justify-center gap-1 text-primary/70 hover:text-red-500 text-xs font-semibold py-1.5 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <FiTrash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {products.length > 10 && (
                <p className="mt-6 text-center text-sm text-primary/50">
                  Showing 10 of {products.length} products
                </p>
              )}
            </div>
          )}

          {/* ═════ CATEGORIES ═════ */}
          {activeTab === "categories" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-primary">
                  Manage Categories
                </h2>
                <button
                  onClick={() => {
                    setShowCategoryForm(true);
                    setEditItem(null);
                    setCategoryForm(emptyCategory);
                  }}
                  className="flex items-center gap-1 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-bg hover:bg-accent transition"
                >
                  <FiPlus size={14} /> Add Category
                </button>
              </div>

              {showCategoryForm && (
                <form
                  onSubmit={handleCategorySubmit}
                  className="mb-6 border border-primary/10 p-5 space-y-4 bg-primary/5"
                >
                  <h3 className="font-semibold text-primary">
                    {editItem ? "Edit Category" : "New Category"}
                  </h3>
                  <input
                    placeholder="Category Name"
                    value={categoryForm.categoryName}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        categoryName: e.target.value,
                      })
                    }
                    className={inputClass}
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={categoryForm.categoryDescription}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        categoryDescription: e.target.value,
                      })
                    }
                    className={inputClass + " h-20"}
                  />

                  <input
                    placeholder="Image URL"
                    value={categoryForm.categoryImage}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        categoryImage: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-primary px-6 py-2 text-xs font-semibold uppercase text-bg hover:bg-accent transition"
                    >
                      {editItem ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoryForm(false);
                        setEditItem(null);
                      }}
                      className="border border-primary/15 px-6 py-2 text-xs font-semibold uppercase text-muted hover:text-primary transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                {categories.map((c) => (
                  <div
                    key={c.categoryId}
                    className="relative flex flex-col items-center border border-primary/10 bg-surface p-8 text-center transition-all duration-500 hover:border-accent hover:shadow-2xl group rounded-2xl"
                  >
                    <span className="font-serif text-xl font-bold text-primary">
                      {c.categoryName}
                    </span>
                    {c.categoryDescription && (
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-primary/65 leading-relaxed">
                        {c.categoryDescription}
                      </p>
                    )}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                      <button
                        onClick={() => {
                          setEditItem(c);
                          setCategoryForm({
                            categoryName: c.categoryName,
                            categoryDescription: c.categoryDescription || "",
                            categoryImage: c.categoryImage || "",
                          });
                          setShowCategoryForm(true);
                        }}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/5 text-primary/60 hover:text-accent hover:bg-accent/10 transition"
                      >
                        <FiEdit3 size={14} />
                      </button>
                      <button
                        onClick={() => deleteCategory(c.categoryId)}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/5 text-primary/60 hover:text-red-500 hover:bg-red-500/10 transition"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════ ORDERS ═════ */}
          {activeTab === "orders" && (
            <div>
              <h2 className="mb-6 text-lg font-bold text-primary">
                Manage Orders
              </h2>
              <div className="overflow-x-auto border border-primary/5 rounded-2xl">
                <table className="w-full text-left text-[11px] font-medium tracking-wide">
                  <thead className="bg-primary/5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/65">
                    <tr>
                      <th className="px-6 py-5">Order Reference</th>
                      <th className="px-6 py-5">Client</th>
                      <th className="px-6 py-5">Investment</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5 bg-surface text-primary">
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td className="px-4 py-3 font-medium text-primary">
                          #{o.orderId}
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {o.user?.userName || "N/A"}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          ₹{Math.round(o.totalAmount || 0)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${statusColor(o.status)}`}
                          >
                            {o.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          <button
                            onClick={() => setViewOrder(o)}
                            className="text-primary/45 hover:text-accent"
                            title="View Details"
                          >
                            <FiEye size={16} />
                          </button>
                          <select
                            value={o.status || ""}
                            onChange={(e) =>
                              updateOrderStatus(o.id, e.target.value)
                            }
                            className="border border-primary/15 px-2 py-1 text-xs bg-surface text-primary outline-none w-28"
                          >
                            <option value="Order Placed">Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═════ COUPONS ═════ */}
          {activeTab === "coupons" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-primary">
                  Manage Coupons
                </h2>
                <button
                  onClick={() => {
                    setShowCouponForm(true);
                    setEditItem(null);
                    setCouponForm(emptyCoupon);
                  }}
                  className="flex items-center gap-1 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-bg hover:bg-accent transition"
                >
                  <FiPlus size={14} /> Create Coupon
                </button>
              </div>

              {showCouponForm && (
                <form
                  onSubmit={handleCouponSubmit}
                  className="mb-6 border border-primary/10 p-5 space-y-4 bg-primary/5"
                >
                  <h3 className="font-semibold text-primary">
                    {editItem ? "Edit Coupon" : "New Coupon"}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="Code (e.g. SAVE20)"
                      value={couponForm.code}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      className={inputClass}
                      required
                    />
                    <input
                      placeholder="Discount %"
                      type="number"
                      value={couponForm.discountPercent}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          discountPercent: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                    <input
                      placeholder="Min Order ₹"
                      type="number"
                      value={couponForm.minOrderAmount}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          minOrderAmount: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                    <input
                      placeholder="Max Discount ₹"
                      type="number"
                      value={couponForm.maxDiscount}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          maxDiscount: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                    <div>
                      <label className="text-xs text-muted">Valid From</label>
                      <input
                        type="date"
                        value={couponForm.validFrom}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            validFrom: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted">Valid Until</label>
                      <input
                        type="date"
                        value={couponForm.validUntil}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            validUntil: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={couponForm.active}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          active: e.target.checked,
                        })
                      }
                    />{" "}
                    Active
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-primary px-6 py-2 text-xs font-semibold uppercase text-bg hover:bg-accent transition"
                    >
                      {editItem ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCouponForm(false);
                        setEditItem(null);
                      }}
                      className="border border-primary/15 px-6 py-2 text-xs text-muted hover:text-primary transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {coupons.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between border border-primary/5 bg-surface p-6 rounded-2xl group transition-all duration-300 hover:border-accent hover:shadow-xl"
                  >
                    <div>
                      <span className="font-mono text-xs font-black uppercase tracking-wider text-primary bg-primary/5 px-2 py-1 rounded">
                        {c.code}
                      </span>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-sm font-bold text-accent">
                          {c.discountPercent}% OFF
                        </span>
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest ${
                            c.active
                              ? "bg-green-500/10 text-green-500"
                              : "bg-primary/10 text-primary/60"
                          }`}
                        >
                          {c.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="mt-1 flex gap-2 text-[9px] font-bold uppercase tracking-widest text-primary/55">
                        {c.minOrderAmount > 0 && (
                          <span>MIN ₹{c.minOrderAmount}</span>
                        )}
                        {c.maxDiscount > 0 && <span>MAX ₹{c.maxDiscount}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditItem(c);
                          setCouponForm({
                            code: c.code,
                            discountPercent: c.discountPercent,
                            minOrderAmount: c.minOrderAmount || 0,
                            maxDiscount: c.maxDiscount || 0,
                            active: c.active,
                            validFrom: c.validFrom
                              ? c.validFrom.slice(0, 10)
                              : "",
                            validUntil: c.validUntil
                              ? c.validUntil.slice(0, 10)
                              : "",
                          });
                          setShowCouponForm(true);
                        }}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/5 text-primary/60 hover:text-accent hover:bg-accent/10 transition"
                      >
                        <FiEdit3 size={14} />
                      </button>
                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/5 text-primary/60 hover:text-red-500 hover:bg-red-500/10 transition"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {coupons.length === 0 && (
                  <p className="text-sm text-primary/65 text-center py-8 col-span-full">
                    No coupons yet. Create one!
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── View Order Modal ── */}
      {viewOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/80 p-4 backdrop-blur-xl transition-all duration-500">
          <div className="w-full max-w-2xl bg-surface border border-primary/10 p-8 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto rounded-3xl lg:p-12">
            <button
              onClick={() => setViewOrder(null)}
              className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-primary/5 text-primary/60 hover:text-accent hover:bg-accent/10 transition"
            >
              <FiX size={20} />
            </button>
            <h3 className="mb-8 font-serif text-3xl font-bold text-primary">
              Order Details
              <span className="ml-4 text-xs font-bold uppercase tracking-widest text-primary/20 bg-primary/5 px-3 py-1 rounded">
                #{viewOrder.orderId}
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-6 mb-8 bg-primary/5 p-6 rounded-2xl">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/65">
                  Customer
                </p>
                <p className="font-bold text-primary">
                  {viewOrder.user?.userName}
                </p>
                <p className="text-xs text-primary/70 mt-1">
                  {viewOrder.user?.userEmail}
                </p>
                <p className="text-xs text-primary/70 mt-1">
                  {viewOrder.user?.userPhone}
                </p>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/65">
                  Shipping Address
                </p>
                <p className="text-xs text-primary/70 leading-relaxed whitespace-pre-wrap">
                  {viewOrder.shippingAddress ||
                    viewOrder.user?.userAddress ||
                    "N/A"}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/65">
                Items Details
              </p>
              <div className="border border-primary/5 divide-y divide-primary/5 rounded-2xl overflow-hidden bg-surface">
                {viewOrder.orderedProducts?.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-5 p-4 hover:bg-primary/5 transition duration-300"
                  >
                    <div className="h-16 w-16 bg-primary/5 flex-shrink-0 rounded-xl overflow-hidden border border-primary/10">
                      <img
                        src={
                          p.product?.productImages ||
                          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&q=80"
                        }
                        alt={p.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://res.cloudinary.com/de5x4aaqj/image/upload/v1774547829/sr-fab/site-assets/gen-39017cfd-219f-483f-ab00-a97b9fba13ce.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-primary">{p.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/65 mt-1">
                        Size: {p.size || "-"} · Qty: {p.quantity}
                      </p>
                    </div>
                    <p className="font-black text-sm text-accent">
                      ₹{Math.round(p.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-primary/10 pt-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/65">
                  Payment:{" "}
                  <span className="font-black text-primary ml-2">
                    {viewOrder.paymentType}
                  </span>
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/65">
                  Date:{" "}
                  <span className="text-primary ml-2">
                    {new Date(viewOrder.date).toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs font-bold text-primary/70">
                  Subtotal:{" "}
                  <span className="text-primary ml-2">
                    ₹
                    {Math.round(
                      viewOrder.totalAmount + (viewOrder.discountAmount || 0),
                    )}
                  </span>
                </p>
                {viewOrder.discountAmount > 0 && (
                  <p className="text-xs font-bold text-accent">
                    Discount: -₹{Math.round(viewOrder.discountAmount)}
                  </p>
                )}
                <p className="text-2xl font-black text-primary mt-2">
                  Total: ₹{Math.round(viewOrder.totalAmount)}
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setViewOrder(null)}
                className="bg-primary px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-bg hover:bg-accent transition hover:-translate-y-1 hover:shadow-xl active:scale-95"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
