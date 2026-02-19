import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    userName: '', userEmail: '', userPassword: '', userPhone: '',
    userGender: '', userAddress: '', userCity: '', userPincode: '', userState: ''
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) navigate('/login');
  };

  const fields = [
    { name: 'userName',     label: 'Full Name', type: 'text',     placeholder: 'Jane Doe' },
    { name: 'userEmail',    label: 'Email',     type: 'email',    placeholder: 'you@example.com' },
    { name: 'userPassword', label: 'Password',  type: 'password', placeholder: '••••••••' },
    { name: 'userPhone',    label: 'Phone',     type: 'tel',      placeholder: '9876543210' },
  ];

  const addressFields = [
    { name: 'userCity',    label: 'City',    placeholder: 'Chennai' },
    { name: 'userPincode', label: 'Pincode', placeholder: '600001' },
    { name: 'userState',   label: 'State',   placeholder: 'Tamil Nadu' },
  ];

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-primary">Create Account</h1>
          <p className="mt-2 text-sm text-muted">Join the SR FAB family</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-primary">{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                required
                placeholder={f.placeholder}
                className="w-full border border-gray-200 px-4 py-3 text-sm text-primary outline-none transition focus:border-accent"
              />
            </div>
          ))}

          {/* Gender */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-primary">Gender</label>
            <select
              name="userGender"
              value={formData.userGender}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 px-4 py-3 text-sm text-primary outline-none transition focus:border-accent bg-white"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-primary">Address</label>
            <textarea
              name="userAddress"
              value={formData.userAddress}
              onChange={handleChange}
              required
              rows={2}
              placeholder="123 Main St"
              className="w-full resize-none border border-gray-200 px-4 py-3 text-sm text-primary outline-none transition focus:border-accent"
            />
          </div>

          {/* City / Pincode / State */}
          <div className="grid grid-cols-3 gap-3">
            {addressFields.map((f) => (
              <div key={f.name}>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-primary">{f.label}</label>
                <input
                  type="text"
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  required
                  placeholder={f.placeholder}
                  className="w-full border border-gray-200 px-4 py-3 text-sm text-primary outline-none transition focus:border-accent"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-primary py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-accent"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent transition hover:text-primary">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
