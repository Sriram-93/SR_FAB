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
    <div className="flex min-h-[90vh] items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-sm animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Registration</span>
          <h1 className="font-serif text-4xl font-bold text-primary mt-2">Join the Family</h1>
          <p className="mt-3 text-sm text-primary/50 font-medium">Create your account to unlock personalized studio tools.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-5">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-primary/70">{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  required
                  placeholder={f.placeholder}
                  className="w-full border border-primary/10 bg-surface px-5 py-4 text-sm text-primary outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_20px_rgba(201,169,110,0.1)] rounded-none placeholder:text-primary/20"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Gender */}
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-primary/70">Gender</label>
              <select
                name="userGender"
                value={formData.userGender}
                onChange={handleChange}
                required
                className="w-full border border-primary/10 bg-surface px-5 py-4 text-sm text-primary outline-none transition-all duration-300 focus:border-accent rounded-none appearance-none"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-primary/70">Phone</label>
              <input
                type="tel"
                name="userPhone"
                value={formData.userPhone}
                onChange={handleChange}
                required
                placeholder="9876543210"
                className="w-full border border-primary/10 bg-surface px-5 py-4 text-sm text-primary outline-none transition-all duration-300 focus:border-accent rounded-none placeholder:text-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-primary/70">City / State</label>
            <div className="grid grid-cols-2 gap-5">
              <input
                type="text"
                name="userCity"
                value={formData.userCity}
                onChange={handleChange}
                required
                placeholder="City"
                className="w-full border border-primary/10 bg-surface px-5 py-4 text-sm text-primary outline-none transition-all duration-300 focus:border-accent rounded-none placeholder:text-primary/20"
              />
              <input
                type="text"
                name="userState"
                value={formData.userState}
                onChange={handleChange}
                required
                placeholder="State"
                className="w-full border border-primary/10 bg-surface px-5 py-4 text-sm text-primary outline-none transition-all duration-300 focus:border-accent rounded-none placeholder:text-primary/20"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-bg transition-all duration-300 hover:bg-accent hover:-translate-y-1 hover:shadow-xl active:scale-95 mt-4"
          >
            Create Account
          </button>
        </form>

        <p className="mt-10 text-center text-[11px] font-medium text-primary/40 uppercase tracking-widest">
          Already a member?{' '}
          <Link to="/login" className="text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-all">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
