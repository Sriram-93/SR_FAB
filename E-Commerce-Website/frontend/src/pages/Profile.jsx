import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FiEdit3, FiSave, FiX, FiPackage } from 'react-icons/fi';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser?.userId) return;
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          api.get(`/user/${authUser.userId}`),
          api.get(`/orders/user/${authUser.userId}`),
        ]);
        setUser(profileRes.data);
        setFormData(profileRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authUser]);

  const handleSave = async () => {
    try {
      await api.put(`/user/${authUser.userId}`, {
        userName: formData.userName,
        userPhone: formData.userPhone,
        userGender: formData.userGender,
        userAddress: formData.userAddress,
        userCity: formData.userCity,
        userPincode: formData.userPincode,
        userState: formData.userState,
      });
      setUser({ ...user, ...formData });
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-accent" />
      </div>
    );
  }
  if (!user) return <p className="py-20 text-center text-muted">User not found</p>;

  const fields = [
    { key: 'userName', label: 'Name', editable: true },
    { key: 'userEmail', label: 'Email', editable: false },
    { key: 'userPhone', label: 'Phone', editable: true },
    { key: 'userGender', label: 'Gender', editable: true, type: 'select', options: ['Male', 'Female', 'Other'] },
    { key: 'userAddress', label: 'Address', editable: true },
    { key: 'userCity', label: 'City', editable: true },
    { key: 'userPincode', label: 'Pincode', editable: true },
    { key: 'userState', label: 'State', editable: true },
  ];

  const statusColor = (s) => {
    if (!s) return 'bg-gray-100 text-gray-600';
    switch (s.toLowerCase()) {
      case 'delivered': return 'bg-green-50 text-green-700';
      case 'shipped': return 'bg-blue-50 text-blue-700';
      case 'cancelled': return 'bg-red-50 text-red-700';
      default: return 'bg-amber-50 text-amber-700';
    }
  };

  return (
    <div className="animate-fade-in py-10">
      <div className="mx-auto max-w-2xl">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary">My Profile</h1>
            <p className="mt-1 text-sm text-muted">Manage your account details</p>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 border border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted transition hover:border-primary hover:text-primary">
              <FiEdit3 size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex items-center gap-2 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-accent">
                <FiSave size={14} /> Save
              </button>
              <button onClick={() => { setEditing(false); setFormData(user); }} className="flex items-center gap-2 border border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted transition hover:border-red-400 hover:text-red-500">
                <FiX size={14} /> Cancel
              </button>
            </div>
          )}
        </div>

        {/* ── Profile Details ── */}
        <div className="mt-8 space-y-4 border border-gray-100 p-6">
          {fields.map((f) => (
            <div key={f.key} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted">{f.label}</span>
              {editing && f.editable ? (
                f.type === 'select' ? (
                  <select name={f.key} value={formData[f.key] || ''} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    className="w-1/2 border border-gray-200 px-3 py-2 text-sm bg-white outline-none focus:border-accent">
                    <option value="">Select</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type="text" value={formData[f.key] || ''} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    className="w-1/2 border border-gray-200 px-3 py-2 text-sm outline-none focus:border-accent" />
                )
              ) : (
                <span className="text-sm text-primary">{user[f.key] || '—'}</span>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">Member Since</span>
            <span className="text-sm text-primary">{user.dateTime ? new Date(user.dateTime).toLocaleDateString('en-IN') : '—'}</span>
          </div>
        </div>

        {/* ── Order History ── */}
        <div className="mt-10">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
            <FiPackage size={18} /> Order History
          </h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No orders yet. Start shopping!</p>
          ) : (
            <div className="mt-4 space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border border-gray-100 p-4 transition hover:border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-primary">{order.orderId}</p>
                    <p className="text-xs text-muted">{new Date(order.date).toLocaleDateString('en-IN')} · {order.paymentType}</p>
                    {order.orderedProducts?.length > 0 && (
                      <p className="mt-1 text-xs text-muted">{order.orderedProducts.map(p => p.name).join(', ')}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                    {order.totalAmount > 0 && (
                      <p className="mt-1 text-sm font-semibold text-primary">₹{Math.round(order.totalAmount)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
