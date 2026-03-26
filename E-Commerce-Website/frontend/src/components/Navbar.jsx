import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import {
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiSearch,
  FiSun,
  FiMoon,
} from "react-icons/fi";

const Navbar = ({ onCartOpen }) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    if (!searchOpen) return;

    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 2) return;

    navigate(`/shop?search=${encodeURIComponent(trimmed)}`, { replace: true });
  }, [debouncedQuery, navigate, searchOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const scrollToCategories = () => {
    setMobileOpen(false);
    // If we're already on Home, just scroll
    if (window.location.pathname === "/") {
      document
        .getElementById("categories")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate home, then scroll after render
      navigate("/");
      setTimeout(() => {
        document
          .getElementById("categories")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-surface/90 backdrop-blur-xl border-b border-[var(--line)] shadow-[0_8px_30px_-24px_var(--gold-glow)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-2xl font-bold tracking-tight text-primary lg:text-3xl"
          >
            SR <span className="text-accent">FAB</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-primary/70 md:flex">
            <Link to="/" className="transition hover:text-accent">
              Home
            </Link>
            <button
              onClick={scrollToCategories}
              type="button"
              className="cursor-pointer transition hover:text-accent"
            >
              Categories
            </button>
            <Link to="/shop" className="transition hover:text-accent">
              Collections
            </Link>
            {user?.role === "ROLE_ADMIN" && (
              <Link to="/admin" className="transition hover:text-accent">
                Admin panel
              </Link>
            )}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--elevated)] text-primary transition hover:border-[var(--line-strong)] hover:text-accent"
              aria-label="Toggle Theme"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {searchOpen ? (
              <form
                onSubmit={handleSearch}
                className="hidden md:flex items-center border border-[var(--line)] bg-[var(--elevated)] rounded-full px-4 py-1.5 transition-all w-64 animate-fade-in"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Inspiration..."
                  aria-label="Search products"
                  className="w-full bg-transparent text-xs font-bold uppercase tracking-widest outline-none placeholder:text-primary/30"
                  autoFocus
                />
                <button
                  type="submit"
                  className="text-primary hover:text-accent"
                >
                  <FiSearch size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                  }}
                  className="ml-2 text-primary/40 hover:text-red-500"
                >
                  <FiX size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden text-primary transition hover:text-accent md:block"
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>
            )}

            {user ? (
              <>
                {user.role !== "ROLE_ADMIN" && (
                  <Link
                    to="/profile"
                    className="hidden text-primary transition hover:text-accent md:block"
                    aria-label="Profile"
                    title="My Profile"
                  >
                    <FiUser size={20} />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="hidden text-primary transition hover:text-red-500 md:block"
                  aria-label="Logout"
                  title="Logout"
                >
                  <FiLogOut size={20} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden text-primary transition hover:text-accent md:block"
                aria-label="Account"
              >
                <FiUser size={20} />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={onCartOpen}
              type="button"
              className="relative text-primary transition hover:text-accent"
              aria-label="Cart"
            >
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-black text-white shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              type="button"
              className="text-primary md:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="animate-fade-in border-t border-[var(--line)] bg-surface md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm font-medium uppercase tracking-widest text-primary/80">
            <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }} className="flex items-center border border-[var(--line)] bg-[var(--elevated)] rounded-full px-4 py-2 w-full mb-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none placeholder:text-primary/30 text-primary"
              />
              <button type="submit" className="text-primary hover:text-accent ml-2">
                <FiSearch size={16} />
              </button>
            </form>
            <Link to="/" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <button type="button" onClick={scrollToCategories}>
              Categories
            </button>
            <Link to="/shop" onClick={() => setMobileOpen(false)}>
              Collections
            </Link>
            {!user ? (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
            ) : (
              <>
                {user.role !== "ROLE_ADMIN" && (
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>
                    My Profile
                  </Link>
                )}
                {user.role === "ROLE_ADMIN" && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}>
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="text-left text-red-500"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
