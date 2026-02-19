import { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FiBox, FiGrid, FiList, FiTrash2, FiEdit3, FiPlus, FiTag, FiBarChart2, FiAlertTriangle, FiEye, FiX } from 'react-icons/fi';
import { getProductImage } from '../utils/productImages';

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');

  // ── Form States ──

  // ── Form States ──
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);

  const [editItem, setEditItem] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);

  const emptyProduct = { productName: '', productDescription: '', productPrice: '', productDiscount: '', brand: '', fabricType: '', productImages: '', categoryId: '', variants: [{ size: '', color: '', sku: '', stock: '' }] };
  const emptyCategory = { categoryName: '', categoryDescription: '', categoryImage: '' };
  const emptyCoupon = { code: '', discountPercent: '', minOrderAmount: '0', maxDiscount: '0', active: true, validFrom: '', validUntil: '' };

  const [productForm, setProductForm] = useState(emptyProduct);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [couponForm, setCouponForm] = useState(emptyCoupon);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [catRes, prodRes, orderRes, couponRes, analyticsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products'),
        api.get('/orders').catch(() => ({ data: [] })),
        api.get('/admin/coupons').catch(() => ({ data: [] })),
        api.get('/admin/analytics').catch(() => ({ data: null })),
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
      setCoupons(couponRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) { console.error(err); }
  };

  // ── Image Upload ──
  // ── Product CRUD ──
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...productForm, productPrice: parseFloat(productForm.productPrice) || 0, productDiscount: parseFloat(productForm.productDiscount) || 0, variants: productForm.variants.map(v => ({ ...v, stock: parseInt(v.stock) || 0 })) };
      if (editItem) {
        await api.put(`/products/${editItem.productId}?categoryId=${productForm.categoryId}`, payload);
        toast.success('Product updated');
      } else {
        await api.post(`/products?categoryId=${productForm.categoryId}`, payload);
        toast.success('Product added');
      }
      setShowProductForm(false); setEditItem(null); setProductForm(emptyProduct); fetchData();
    } catch (err) { toast.error(err?.response?.data?.error || 'Failed'); }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  const editProduct = (p) => {
    setProductForm({ productName: p.productName, productDescription: p.productDescription || '', productPrice: p.productPrice, productDiscount: p.productDiscount || 0, brand: p.brand || '', fabricType: p.fabricType || '', productImages: p.productImages || '', categoryId: p.category?.categoryId || '', variants: p.variants?.length ? p.variants : [{ size: '', color: '', sku: '', stock: '' }] });
    setEditItem(p); setShowProductForm(true);
  };

  // ── Category CRUD ──
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.put(`/categories/${editItem.categoryId}`, categoryForm);
        toast.success('Category updated');
      } else {
        await api.post('/categories', categoryForm);
        toast.success('Category added');
      }
      setShowCategoryForm(false); setEditItem(null); setCategoryForm(emptyCategory); fetchData();
    } catch (err) { toast.error(err?.response?.data?.error || 'Failed'); }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  // ── Coupon CRUD ──
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...couponForm, discountPercent: parseFloat(couponForm.discountPercent), minOrderAmount: parseFloat(couponForm.minOrderAmount) || 0, maxDiscount: parseFloat(couponForm.maxDiscount) || 0, validFrom: couponForm.validFrom ? new Date(couponForm.validFrom).toISOString() : null, validUntil: couponForm.validUntil ? new Date(couponForm.validUntil).toISOString() : null };
      if (editItem) {
        await api.put(`/admin/coupons/${editItem.id}`, payload);
        toast.success('Coupon updated');
      } else {
        await api.post('/admin/coupons', payload);
        toast.success('Coupon created');
      }
      setShowCouponForm(false); setEditItem(null); setCouponForm(emptyCoupon); fetchData();
    } catch (err) { toast.error(err?.response?.data?.error || 'Failed'); }
  };

  const deleteCoupon = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try { await api.delete(`/admin/coupons/${id}`); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed'); }
  };

  // ── Order Status ──
  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchData();
    } catch { toast.error('Failed to update'); }
  };

  // ── Stock Update ──
  const updateStock = async (variantId, stock) => {
    try {
      await api.put(`/products/variants/${variantId}/stock`, { stock: parseInt(stock) });
      toast.success('Stock updated');
      fetchData();
    } catch { toast.error('Failed'); }
  };

  const addVariant = () => setProductForm({ ...productForm, variants: [...productForm.variants, { size: '', color: '', sku: '', stock: '' }] });
  const removeVariant = (i) => setProductForm({ ...productForm, variants: productForm.variants.filter((_, idx) => idx !== i) });
  const updateVariant = (i, field, val) => { const v = [...productForm.variants]; v[i] = { ...v[i], [field]: val }; setProductForm({ ...productForm, variants: v }); };

  const tabs = [
    { id: 'analytics',  label: 'Analytics',   icon: FiBarChart2 },
    { id: 'products',   label: 'Products',    icon: FiBox },
    { id: 'categories', label: 'Categories',  icon: FiGrid },
    { id: 'orders',     label: 'Orders',      icon: FiList },
    { id: 'coupons',    label: 'Coupons',     icon: FiTag },
  ];

  const statusColor = (s) => {
    if (!s) return 'bg-gray-100 text-gray-600';
    switch (s.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  const inputClass = 'w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent bg-white';

  return (
    <div className="mx-auto max-w-7xl animate-fade-in py-10">
      <h1 className="mb-8 font-serif text-3xl font-bold text-primary">Admin Dashboard</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-56 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'bg-white text-muted hover:bg-gray-50 hover:text-primary'}`}>
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Content ── */}
        <main className="flex-1 border border-gray-100 bg-white p-6 shadow-sm min-h-[60vh]">

          {/* ═════ ANALYTICS ═════ */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="mb-6 text-lg font-bold text-primary">Store Analytics</h2>
              {analytics ? (
                <>
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                      { label: 'Products', val: analytics.totalProducts, color: 'bg-blue-50 text-blue-700' },
                      { label: 'Orders', val: analytics.totalOrders, color: 'bg-green-50 text-green-700' },
                      { label: 'Revenue', val: `₹${Math.round(analytics.totalRevenue || 0).toLocaleString('en-IN')}`, color: 'bg-amber-50 text-amber-700' },
                      { label: 'Users', val: analytics.totalUsers, color: 'bg-purple-50 text-purple-700' },
                    ].map((s) => (
                      <div key={s.label} className={`p-5 ${s.color}`}>
                        <p className="text-xs font-semibold uppercase tracking-widest opacity-70">{s.label}</p>
                        <p className="mt-1 text-2xl font-bold">{s.val}</p>
                      </div>
                    ))}
                  </div>
                  {analytics.recentOrders?.length > 0 && (
                    <div className="mt-8">
                      <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted">Recent Orders</h3>
                      <div className="space-y-2">
                        {analytics.recentOrders.map(o => (
                          <div key={o.id} className="flex items-center justify-between border border-gray-50 p-3">
                            <div>
                              <span className="text-sm font-medium text-primary">#{o.orderId}</span>
                              <span className="ml-3 text-xs text-muted">{o.user?.userName}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${statusColor(o.status)}`}>{o.status}</span>
                              {o.totalAmount > 0 && <span className="text-sm font-semibold">₹{Math.round(o.totalAmount)}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : <p className="text-sm text-muted">Loading analytics...</p>}
            </div>
          )}

          {/* ═════ PRODUCTS ═════ */}
          {activeTab === 'products' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-primary">Manage Products <span className="ml-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">{products.length}</span></h2>
                <button onClick={() => { setShowProductForm(true); setEditItem(null); setProductForm(emptyProduct); }} className="flex items-center gap-1 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-accent transition">
                  <FiPlus size={14} /> Add Product
                </button>
              </div>

              {/* Product Form */}
              {showProductForm && (
                <form onSubmit={handleProductSubmit} className="mb-6 border border-gray-100 p-5 space-y-4 bg-gray-50">
                  <h3 className="font-semibold text-primary">{editItem ? 'Edit Product' : 'New Product'}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Product Name" value={productForm.productName} onChange={e => setProductForm({...productForm, productName: e.target.value})} className={inputClass} required />
                    <select value={productForm.categoryId} onChange={e => setProductForm({...productForm, categoryId: e.target.value})} className={inputClass} required>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                    </select>
                    <input placeholder="Price (₹)" type="number" value={productForm.productPrice} onChange={e => setProductForm({...productForm, productPrice: e.target.value})} className={inputClass} required />
                    <input placeholder="Discount (%)" type="number" value={productForm.productDiscount} onChange={e => setProductForm({...productForm, productDiscount: e.target.value})} className={inputClass} />
                    <input placeholder="Brand" value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} className={inputClass} />
                    <input placeholder="Fabric Type" value={productForm.fabricType} onChange={e => setProductForm({...productForm, fabricType: e.target.value})} className={inputClass} />
                  </div>
                  <textarea placeholder="Description" value={productForm.productDescription} onChange={e => setProductForm({...productForm, productDescription: e.target.value})} className={inputClass + ' h-20'} />
                  
                  <input placeholder="Image URL" value={productForm.productImages} onChange={e => setProductForm({...productForm, productImages: e.target.value})} className={inputClass} />

                  {/* Variants */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase text-muted">Variants</span>
                      <button type="button" onClick={addVariant} className="text-xs text-accent font-semibold hover:text-primary">+ Add Variant</button>
                    </div>
                    {productForm.variants.map((v, i) => (
                      <div key={i} className="grid grid-cols-5 gap-2 mb-2">
                        <input placeholder="Size" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} className={inputClass} />
                        <input placeholder="Color" value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} className={inputClass} />
                        <input placeholder="SKU" value={v.sku} onChange={e => updateVariant(i, 'sku', e.target.value)} className={inputClass} />
                        <input placeholder="Stock" type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} className={inputClass} />
                        {productForm.variants.length > 1 && <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600 text-xs">Remove</button>}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="bg-primary px-6 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-accent transition">{editItem ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => { setShowProductForm(false); setEditItem(null); }} className="border border-gray-200 px-6 py-2 text-xs font-semibold uppercase tracking-widest text-muted hover:text-primary transition">Cancel</button>
                  </div>
                </form>
              )}

              {/* Product List */}
              <div className="space-y-3">
                {products.map(p => (
                  <div key={p.productId} className="flex items-center justify-between border border-gray-100 p-4 transition hover:border-accent/50">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 overflow-hidden rounded bg-gray-100">
                        {p.productImages ? (
                          <img src={p.productImages.startsWith('http') ? p.productImages : getProductImage(p.productId, 48, 48)} alt={p.productName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-300"><FiBox /></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-primary">{p.productName}</p>
                        <p className="text-sm text-accent">₹{p.productPrice}{p.productDiscount > 0 && <span className="ml-2 text-xs text-green-600">(-{p.productDiscount}%)</span>}</p>
                        {/* Low stock badge */}
                        {p.variants?.some(v => v.stock <= 5) && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-red-600 font-semibold mt-1"><FiAlertTriangle size={10} /> Low Stock</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => editProduct(p)} className="text-gray-400 transition hover:text-accent"><FiEdit3 size={16} /></button>
                      <button onClick={() => deleteProduct(p.productId)} className="text-gray-400 transition hover:text-red-500"><FiTrash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════ CATEGORIES ═════ */}
          {activeTab === 'categories' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-primary">Manage Categories</h2>
                <button onClick={() => { setShowCategoryForm(true); setEditItem(null); setCategoryForm(emptyCategory); }} className="flex items-center gap-1 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-accent transition">
                  <FiPlus size={14} /> Add Category
                </button>
              </div>

              {showCategoryForm && (
                <form onSubmit={handleCategorySubmit} className="mb-6 border border-gray-100 p-5 space-y-4 bg-gray-50">
                  <h3 className="font-semibold text-primary">{editItem ? 'Edit Category' : 'New Category'}</h3>
                  <input placeholder="Category Name" value={categoryForm.categoryName} onChange={e => setCategoryForm({...categoryForm, categoryName: e.target.value})} className={inputClass} required />
                  <textarea placeholder="Description" value={categoryForm.categoryDescription} onChange={e => setCategoryForm({...categoryForm, categoryDescription: e.target.value})} className={inputClass + ' h-20'} />
                  
                  <input placeholder="Image URL" value={categoryForm.categoryImage} onChange={e => setCategoryForm({...categoryForm, categoryImage: e.target.value})} className={inputClass} />

                  <div className="flex gap-2">
                    <button type="submit" className="bg-primary px-6 py-2 text-xs font-semibold uppercase text-white hover:bg-accent transition">{editItem ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => { setShowCategoryForm(false); setEditItem(null); }} className="border border-gray-200 px-6 py-2 text-xs font-semibold uppercase text-muted hover:text-primary transition">Cancel</button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {categories.map(c => (
                  <div key={c.categoryId} className="relative flex flex-col items-center border border-gray-100 p-6 text-center transition hover:border-accent group">
                    <span className="font-medium text-primary">{c.categoryName}</span>
                    {c.categoryDescription && <p className="mt-1 text-xs text-muted">{c.categoryDescription}</p>}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                      <button onClick={() => { setEditItem(c); setCategoryForm({ categoryName: c.categoryName, categoryDescription: c.categoryDescription || '', categoryImage: c.categoryImage || '' }); setShowCategoryForm(true); }} className="text-gray-400 hover:text-accent"><FiEdit3 size={14} /></button>
                      <button onClick={() => deleteCategory(c.categoryId)} className="text-gray-400 hover:text-red-500"><FiTrash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═════ ORDERS ═════ */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="mb-6 text-lg font-bold text-primary">Manage Orders</h2>
              <div className="overflow-x-auto border border-gray-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-muted">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Order ID</th>
                      <th className="px-4 py-3 font-semibold">Customer</th>
                      <th className="px-4 py-3 font-semibold">Amount</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td className="px-4 py-3 font-medium text-primary">#{o.orderId}</td>
                        <td className="px-4 py-3 text-muted">{o.user?.userName || 'N/A'}</td>
                        <td className="px-4 py-3 font-medium">₹{Math.round(o.totalAmount || 0)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${statusColor(o.status)}`}>{o.status || 'Pending'}</span>
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          <button onClick={() => setViewOrder(o)} className="text-gray-400 hover:text-accent" title="View Details"><FiEye size={16} /></button>
                          <select value={o.status || ''} onChange={e => updateOrderStatus(o.id, e.target.value)}
                            className="border border-gray-200 px-2 py-1 text-xs bg-white outline-none w-28">
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
          {activeTab === 'coupons' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-primary">Manage Coupons</h2>
                <button onClick={() => { setShowCouponForm(true); setEditItem(null); setCouponForm(emptyCoupon); }} className="flex items-center gap-1 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-accent transition">
                  <FiPlus size={14} /> Create Coupon
                </button>
              </div>

              {showCouponForm && (
                <form onSubmit={handleCouponSubmit} className="mb-6 border border-gray-100 p-5 space-y-4 bg-gray-50">
                  <h3 className="font-semibold text-primary">{editItem ? 'Edit Coupon' : 'New Coupon'}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Code (e.g. SAVE20)" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} className={inputClass} required />
                    <input placeholder="Discount %" type="number" value={couponForm.discountPercent} onChange={e => setCouponForm({...couponForm, discountPercent: e.target.value})} className={inputClass} required />
                    <input placeholder="Min Order ₹" type="number" value={couponForm.minOrderAmount} onChange={e => setCouponForm({...couponForm, minOrderAmount: e.target.value})} className={inputClass} />
                    <input placeholder="Max Discount ₹" type="number" value={couponForm.maxDiscount} onChange={e => setCouponForm({...couponForm, maxDiscount: e.target.value})} className={inputClass} />
                    <div><label className="text-xs text-muted">Valid From</label><input type="date" value={couponForm.validFrom} onChange={e => setCouponForm({...couponForm, validFrom: e.target.value})} className={inputClass} /></div>
                    <div><label className="text-xs text-muted">Valid Until</label><input type="date" value={couponForm.validUntil} onChange={e => setCouponForm({...couponForm, validUntil: e.target.value})} className={inputClass} /></div>
                  </div>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={couponForm.active} onChange={e => setCouponForm({...couponForm, active: e.target.checked})} /> Active</label>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-primary px-6 py-2 text-xs font-semibold uppercase text-white hover:bg-accent transition">{editItem ? 'Update' : 'Create'}</button>
                    <button type="button" onClick={() => { setShowCouponForm(false); setEditItem(null); }} className="border border-gray-200 px-6 py-2 text-xs text-muted hover:text-primary transition">Cancel</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {coupons.map(c => (
                  <div key={c.id} className="flex items-center justify-between border border-gray-100 p-4">
                    <div>
                      <span className="font-mono text-sm font-bold text-primary">{c.code}</span>
                      <span className="ml-3 text-sm text-accent">{c.discountPercent}% off</span>
                      {c.minOrderAmount > 0 && <span className="ml-2 text-xs text-muted">min ₹{c.minOrderAmount}</span>}
                      {c.maxDiscount > 0 && <span className="ml-2 text-xs text-muted">max ₹{c.maxDiscount}</span>}
                      <span className={`ml-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditItem(c); setCouponForm({ code: c.code, discountPercent: c.discountPercent, minOrderAmount: c.minOrderAmount || 0, maxDiscount: c.maxDiscount || 0, active: c.active, validFrom: c.validFrom ? c.validFrom.slice(0, 10) : '', validUntil: c.validUntil ? c.validUntil.slice(0, 10) : '' }); setShowCouponForm(true); }} className="text-gray-400 hover:text-accent"><FiEdit3 size={14} /></button>
                      <button onClick={() => deleteCoupon(c.id)} className="text-gray-400 hover:text-red-500"><FiTrash2 size={14} /></button>
                    </div>
                  </div>
                ))}
                {coupons.length === 0 && <p className="text-sm text-muted text-center py-8">No coupons yet. Create one!</p>}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── View Order Modal ── */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white p-6 shadow-xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setViewOrder(null)} className="absolute right-4 top-4 text-gray-400 hover:text-red-500"><FiX size={20} /></button>
            <h3 className="mb-4 font-serif text-xl font-bold text-primary">Order #{viewOrder.orderId}</h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs font-bold uppercase text-muted">Customer</p>
                <p className="font-medium">{viewOrder.user?.userName}</p>
                <p className="text-sm text-gray-600">{viewOrder.user?.userEmail}</p>
                <p className="text-sm text-gray-600">{viewOrder.user?.userPhone}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted">Shipping Address</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{viewOrder.shippingAddress || viewOrder.user?.userAddress || 'N/A'}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-xs font-bold uppercase text-muted">Items</p>
              <div className="border border-gray-100 divide-y divide-gray-100">
                {viewOrder.orderedProducts?.map((p, i) => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <div className="h-12 w-12 bg-gray-100 flex-shrink-0">
                      <img src={getProductImage(p.product?.productId, 48, 48)} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-primary">{p.name}</p>
                      <p className="text-xs text-muted">Size: {p.size || '-'} · Qty: {p.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">₹{Math.round(p.price)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <div>
                <p className="text-xs text-muted">Payment: <span className="font-semibold text-primary">{viewOrder.paymentType}</span></p>
                <p className="text-xs text-muted">Date: {new Date(viewOrder.date).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">Subtotal: ₹{Math.round(viewOrder.totalAmount + (viewOrder.discountAmount || 0))}</p>
                {viewOrder.discountAmount > 0 && <p className="text-sm text-green-600">Discount: -₹{Math.round(viewOrder.discountAmount)}</p>}
                <p className="text-lg font-bold text-primary">Total: ₹{Math.round(viewOrder.totalAmount)}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
               <button onClick={() => setViewOrder(null)} className="bg-primary px-6 py-2 text-xs font-semibold uppercase text-white hover:bg-accent transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
