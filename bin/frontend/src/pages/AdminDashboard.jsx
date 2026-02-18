import { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FiBox, FiGrid, FiList, FiTrash2 } from 'react-icons/fi';
import { getProductImage } from '../utils/productImages';

const AdminDashboard = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        // Fetch Categories
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories", err);
        }

        // Fetch Products
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products", err);
        }

        // Fetch Orders
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders", err);
            // toast.error("Failed to load orders"); // Optional: don't spam toasts
        }
    };

    const tabs = [
        { id: 'products',   label: 'Products',   icon: FiBox },
        { id: 'categories', label: 'Categories', icon: FiGrid },
        { id: 'orders',     label: 'Orders',     icon: FiList },
    ];

    return (
        <div className="mx-auto max-w-7xl animate-fade-in py-10">
            <h1 className="mb-8 font-serif text-3xl font-bold text-primary">Admin Dashboard</h1>

            <div className="flex flex-col gap-8 lg:flex-row">
                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-64">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition ${
                                    activeTab === tab.id
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-white text-muted hover:bg-gray-50 hover:text-primary'
                                }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content Area */}
                <main className="flex-1 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                    {activeTab === 'products' && (
                        <div>
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-primary">Manage Products</h2>
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-primary">
                                    {products.length} Items
                                </span>
                            </div>
                            <div className="space-y-4">
                                {products.map((p) => (
                                    <div key={p.productId} className="flex items-center justify-between rounded-md border border-gray-100 p-4 transition hover:border-accent/50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 overflow-hidden rounded bg-gray-100">
                                                {p.productId ? (
                                                    <img src={getProductImage(p.productId, 48, 48)} alt={p.productName} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-gray-300"><FiBox /></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-primary">{p.productName}</p>
                                                <p className="text-sm text-accent">${p.productPrice}</p>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 transition hover:text-red-500">
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'categories' && (
                        <div>
                             <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-primary">Manage Categories</h2>
                                <button className="text-xs font-semibold uppercase tracking-widest text-accent hover:text-primary">+ Add New</button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                {categories.map((c) => (
                                    <div key={c.categoryId} className="flex flex-col items-center rounded-md border border-gray-100 p-6 text-center transition hover:border-accent">
                                        <span className="font-medium text-primary">{c.categoryName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                            <h2 className="mb-6 text-lg font-bold text-primary">Recent Orders</h2>
                            <div className="overflow-hidden rounded-md border border-gray-100">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-xs uppercase text-muted">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Order ID</th>
                                            <th className="px-4 py-3 font-semibold">Status</th>
                                            <th className="px-4 py-3 font-semibold">User ID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.map((o) => (
                                            <tr key={o.id}>
                                                <td className="px-4 py-3 font-medium text-primary">#{o.orderId}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                                        o.status === 'Shipped' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {o.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted">{o.user?.userId || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
