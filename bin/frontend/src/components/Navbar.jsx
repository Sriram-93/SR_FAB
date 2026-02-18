import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiLogOut, FiSearch } from 'react-icons/fi';

const Navbar = ({ onCartOpen }) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const scrollToCategories = () => {
    setMobileOpen(false);
    // If we're already on Home, just scroll
    if (window.location.pathname === '/') {
      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate home, then scroll after render
      navigate('/');
      setTimeout(() => {
        document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">

          {/* Logo */}
          <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-primary lg:text-3xl">
            SR <span className="text-accent">FAB</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-widest text-gray-700 md:flex">
            <Link to="/" className="transition hover:text-accent">Home</Link>
            <button onClick={scrollToCategories} className="transition hover:text-accent">Categories</button>
            <Link to="/shop" className="transition hover:text-accent">Collections</Link>
            {user?.role === 'ROLE_ADMIN' && (
              <Link to="/admin" className="transition hover:text-accent">Admin</Link>
            )}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <button className="hidden text-gray-700 transition hover:text-accent md:block" aria-label="Search">
              <FiSearch size={20} />
            </button>

            {user ? (
              <button onClick={handleLogout} className="hidden text-gray-700 transition hover:text-red-500 md:block" aria-label="Logout" title="Logout">
                <FiLogOut size={20} />
              </button>
            ) : (
              <Link to="/login" className="hidden text-gray-700 transition hover:text-accent md:block" aria-label="Account">
                <FiUser size={20} />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={onCartOpen}
              className="relative text-gray-700 transition hover:text-accent"
              aria-label="Cart"
            >
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700 md:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="animate-fade-in border-t border-gray-100 bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm font-medium uppercase tracking-widest text-gray-700">
            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <button onClick={scrollToCategories}>Categories</button>
            <Link to="/shop" onClick={() => setMobileOpen(false)}>Collections</Link>
            {!user ? (
              <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
            ) : (
              <>
                {user.role === 'ROLE_ADMIN' && <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin</Link>}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-left text-red-500">Logout</button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
