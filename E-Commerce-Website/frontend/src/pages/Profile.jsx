import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FiEdit3, FiSave, FiX, FiPackage } from "react-icons/fi";

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
        console.error("Failed to load profile", err);
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
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-accent" />
      </div>
    );
  }
  if (!user)
    return <p className="py-20 text-center text-muted">User not found</p>;

  const fields = [
    { key: "userName", label: "Name", editable: true },
    { key: "userEmail", label: "Email", editable: false },
    { key: "userPhone", label: "Phone", editable: true },
    {
      key: "userGender",
      label: "Gender",
      editable: true,
      type: "select",
      options: ["Male", "Female", "Other"],
    },
    { key: "userAddress", label: "Address", editable: true },
    { key: "userCity", label: "City", editable: true },
    { key: "userPincode", label: "Pincode", editable: true },
    { key: "userState", label: "State", editable: true },
  ];

  const statusColor = (s) => {
    if (!s) return "bg-primary/5 text-primary/40 border border-primary/10";
    switch (s.toLowerCase()) {
      case "delivered":
        return "bg-green-500/10 text-green-500 border border-green-500/20";
      case "shipped":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      default:
        return "bg-accent/10 text-accent border border-accent/20";
    }
  };

  return (
    <div className="animate-fade-in py-10">
      <div className="mx-auto max-w-2xl">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-muted">
              Manage your account details
            </p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 border border-primary/10 bg-surface px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 transition-all duration-300 hover:border-accent hover:text-accent rounded-sm shadow-sm hover:shadow"
            >
              <FiEdit3 size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-primary px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-bg transition-all duration-300 hover:bg-accent rounded-sm shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <FiSave size={14} /> Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData(user);
                }}
                className="flex items-center gap-2 border border-primary/10 bg-surface px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 transition-all duration-300 hover:border-red-500/30 hover:text-red-500 hover:bg-red-500/5 rounded-sm"
              >
                <FiX size={14} /> Cancel
              </button>
            </div>
          )}
        </div>

        {/* ── Profile Details ── */}
        <div className="mt-10 space-y-4 border border-primary/5 bg-surface p-8 rounded-2xl shadow-xl">
          {fields.map((f) => (
            <div
              key={f.key}
              className="flex items-center justify-between border-b border-primary/5 pb-4 last:border-0 last:pb-0"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                {f.label}
              </span>
              {editing && f.editable ? (
                f.type === "select" ? (
                  <select
                    name={f.key}
                    value={formData[f.key] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [f.key]: e.target.value })
                    }
                    className="w-1/2 border border-primary/10 bg-surface px-4 py-3 text-sm text-primary outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_20px_rgba(201,169,110,0.05)] rounded-none"
                  >
                    <option value="">Select</option>
                    {f.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData[f.key] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [f.key]: e.target.value })
                    }
                    className="w-1/2 border border-primary/10 bg-surface px-4 py-3 text-sm text-primary outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_20px_rgba(201,169,110,0.05)] rounded-none"
                  />
                )
              ) : (
                <span className="text-sm font-semibold text-primary">
                  {user[f.key] || "—"}
                </span>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
              Member Since
            </span>
            <span className="text-sm font-semibold text-primary">
              {user.dateTime
                ? new Date(user.dateTime).toLocaleDateString("en-IN")
                : "—"}
            </span>
          </div>
        </div>

        {/* ── Order History ── */}
        <div className="mt-10">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
            <FiPackage size={18} /> Order History
          </h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              No orders yet. Start shopping!
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border border-primary/5 bg-surface p-6 rounded-xl transition-all duration-300 hover:border-accent hover:shadow-lg"
                >
                  <div>
                    <p className="text-sm font-bold text-primary">
                      {order.orderId}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mt-1">
                      {new Date(order.date).toLocaleDateString("en-IN")} ·{" "}
                      {order.paymentType}
                    </p>
                    {order.orderedProducts?.length > 0 && (
                      <p className="mt-2 text-xs font-medium text-primary/70">
                        {order.orderedProducts.map((p) => p.name).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${statusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                    {order.totalAmount > 0 && (
                      <p className="mt-2 text-lg font-black text-accent">
                        ₹{Math.round(order.totalAmount)}
                      </p>
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
