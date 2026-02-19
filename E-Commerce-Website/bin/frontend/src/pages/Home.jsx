import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { FiArrowRight } from 'react-icons/fi';

const HERO_IMG = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80';
const CATEGORIES = [
  { name: "Men's Wear",    img: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=600&q=80', link: '/shop?cat=mens' },
  { name: "Women's Wear",  img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80', link: '/shop?cat=womens' },
  { name: 'Ethnic Wear',   img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80', link: '/shop?cat=ethnic' },
  { name: 'Kids Wear',     img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80', link: '/shop?cat=kids' },
  { name: 'Footwear',      img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', link: '/shop?cat=footwear' },
  { name: 'Accessories',   img: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80', link: '/shop?cat=accessories' },
];

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">

      {/* ── Hero ───────────────────────────── */}
      <section className="relative flex h-[90vh] items-center justify-center overflow-hidden">
        <img
          src={HERO_IMG}
          alt="SR FAB Fashion Collection"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="relative z-10 flex flex-col items-center text-center text-white px-4">
          <p className="mb-4 text-sm font-medium uppercase tracking-[.35em] text-accent-light animate-fade-in">
            New Collection 2026
          </p>
          <h1 className="font-serif text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl animate-fade-in"
              style={{ animationDelay: '.1s' }}>
            Fabric That<br />Defines You
          </h1>
          <p className="mt-4 max-w-md text-sm text-white/70 animate-fade-in" style={{ animationDelay: '.2s' }}>
            Premium garments crafted with passion. From everyday essentials to statement pieces.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-none border-2 border-white px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-white hover:text-primary animate-fade-in"
            style={{ animationDelay: '.3s' }}
          >
            Explore Collection <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* ── Marquee Bar ────────────────────── */}
      <div className="overflow-hidden bg-primary py-3">
        <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap text-xs font-medium uppercase tracking-[.3em] text-white/70">
          {Array(4).fill('Free Shipping on Orders Over ₹999  ·  100% Cotton & Premium Fabrics  ·  Easy 15-Day Returns  ·  ').map((t, i) => (
            <span key={i} className="mx-8">{t}</span>
          ))}
        </div>
      </div>

      {/* ── Categories ─────────────────────── */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">Shop by Category</h2>
          <p className="mt-3 text-muted">Curated collections for every occasion</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group relative h-64 overflow-hidden sm:h-80"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="font-serif text-xl font-semibold sm:text-2xl">{cat.name}</h3>
                <span className="mt-2 flex items-center gap-1 text-xs uppercase tracking-widest opacity-0 transition-all duration-300 group-hover:opacity-100">
                  Explore <FiArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trending Products ──────────────── */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold text-primary sm:text-4xl">Trending Now</h2>
              <p className="mt-3 text-muted">Hand-picked styles you'll love</p>
            </div>
            <Link to="/shop" className="hidden items-center gap-1 text-sm font-medium uppercase tracking-widest text-accent transition hover:text-primary sm:flex">
              View All <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.slice(0, 8).map((product, i) => (
              <ProductCard key={product.productId} product={product} index={i} />
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link to="/shop" className="inline-flex items-center gap-1 text-sm font-medium uppercase tracking-widest text-accent">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Newsletter ─────────────────────── */}
      <section className="bg-primary py-20 text-center text-white">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">Stay in Style</h2>
          <p className="mt-3 text-sm text-white/60">Subscribe for exclusive drops, styling tips & 10% off your first order.</p>
          <form className="mt-8 flex gap-0" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder-white/40 outline-none transition focus:border-accent"
            />
            <button
              type="submit"
              className="bg-accent px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-primary transition hover:bg-accent-light"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ── Footer ─────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">SR FAB</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="#">About Us</Link></li>
                <li><Link to="#">Our Story</Link></li>
                <li><Link to="#">Store Locator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">Help</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="#">Size Guide</Link></li>
                <li><Link to="#">Contact Us</Link></li>
                <li><Link to="#">Returns & Exchange</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">Legal</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="#">Privacy Policy</Link></li>
                <li><Link to="#">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">Follow Us</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Pinterest</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-gray-100 pt-6 text-center text-xs text-muted">
            © 2026 SR FAB. All rights reserved. Premium Garments & Fashion.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
