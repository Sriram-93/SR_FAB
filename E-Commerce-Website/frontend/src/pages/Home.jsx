import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import ProductGridSkeleton from "../components/skeletons/ProductGridSkeleton";
import QueryErrorState from "../components/QueryErrorState";
import { FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import { groupProductsByStyle } from "../utils/productGrouping";
import {
  useCategoriesQuery,
  useTrendingProductsQuery,
} from "../api/catalogQueries";
import { usePageSeo } from "../hooks/usePageSeo";
import { buildImageSrcSet, toOptimizedImageUrl } from "../utils/imageUtils";

const HERO_IMG =
  "https://res.cloudinary.com/de5x4aaqj/image/upload/v1774547905/sr-fab/site-assets/gen-3bda373a-ed64-4e44-8a05-7e48c2419dc5.jpg";

const CATEGORY_FALLBACKS = {
  "cotton t-shirts":
    "https://res.cloudinary.com/de5x4aaqj/image/upload/v1774547840/sr-fab/site-assets/gen-959b3be7-8f35-47fc-a2f4-a2bb6a032233.jpg",
  "cotton shirts":
    "https://res.cloudinary.com/de5x4aaqj/image/upload/v1774547795/sr-fab/site-assets/gen-09dd10e1-0681-4d44-88d3-ba532cc4e8a3.jpg",
  "cotton pants":
    "https://res.cloudinary.com/de5x4aaqj/image/upload/v1774547886/sr-fab/site-assets/gen-e46cf1b3-f83d-4bd6-b5a7-d5995a91941d.jpg",
  "cotton shorts":
    "https://res.cloudinary.com/de5x4aaqj/image/upload/v1774547879/sr-fab/site-assets/gen-9ac150d0-15c5-41b5-b5e5-d4dcfc5998f8.jpg",
  "cotton lounge & nightwear":
    "https://res.cloudinary.com/de5x4aaqj/image/upload/v1774547865/sr-fab/site-assets/gen-a56cf590-b2d9-422c-a564-a478461b7c00.jpg",
  activewear:
    "https://res.cloudinary.com/de5x4aaqj/image/upload/v1774547852/sr-fab/site-assets/gen-dde7c997-5f57-4b8a-b14c-16f373cc4359.jpg",
  outerwear:
    "https://res.cloudinary.com/de5x4aaqj/image/upload/v1774547783/sr-fab/site-assets/gen-d545766a-b57d-4e46-930e-af3d25abf646.jpg",
};

const Home = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    data: trendingProducts = [],
    isLoading: isProductsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useTrendingProductsQuery({ limit: 8 });

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useCategoriesQuery();

  usePageSeo({
    title: "SR FAB | Premium Fashion Ecommerce",
    description:
      "Discover SR FAB's premium collections with fast navigation, immersive previews, and modern ecommerce UX.",
    image: HERO_IMG,
    url: window.location.origin,
  });

  const resolveCategoryImage = (category) => {
    if (category?.categoryImage?.startsWith("http"))
      return category.categoryImage;
    const key = category?.categoryName?.toLowerCase() || "";
    return (
      CATEGORY_FALLBACKS[key] ||
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80"
    );
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await api.post("/subscribe", { email });
      toast.success("Subscribed successfully! 📩");
      setEmail("");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to subscribe");
    } finally {
      setSubmitting(false);
    }
  };

  const styleProducts = useMemo(
    () => groupProductsByStyle(trendingProducts),
    [trendingProducts],
  );

  const isCatalogLoading = isProductsLoading || isCategoriesLoading;
  const hasCatalogError = productsError || categoriesError;

  return (
    <div className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8">
      <div className="pointer-events-none absolute -left-56 top-[14%] h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-56 top-[48%] h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-[130px]" />

      {/* ── Hero ───────────────────────────── */}
      <section className="relative flex h-[90vh] items-center justify-center overflow-hidden">
        <img
          src={toOptimizedImageUrl(HERO_IMG, {
            width: 1280,
            height: 720,
            quality: 72,
          })}
          srcSet={buildImageSrcSet(HERO_IMG, "16:9")}
          sizes="100vw"
          alt="SR FAB Fashion Collection"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="relative z-10 flex flex-col items-center text-center text-white px-4">
          <p className="mb-4 text-sm font-medium uppercase tracking-[.35em] text-accent-light animate-fade-in">
            New Collection 2026
          </p>
          <h1
            className="font-serif text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl animate-fade-in"
            style={{ animationDelay: ".1s" }}
          >
            Fabric That
            <br />
            Defines You
          </h1>
          <p
            className="mt-4 max-w-md text-sm text-white/70 animate-fade-in"
            style={{ animationDelay: ".2s" }}
          >
            Premium garments crafted with passion. From everyday essentials to
            statement pieces.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-none border-2 border-white px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-white hover:text-primary animate-fade-in"
            style={{ animationDelay: ".3s" }}
          >
            Explore Collection <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* ── Marquee Bar ────────────────────── */}
      <div className="overflow-hidden bg-primary py-3">
        <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap text-xs font-medium uppercase tracking-[.3em] text-white/70">
          {Array(4)
            .fill(
              "Free Shipping on Orders Over ₹999  ·  100% Cotton & Premium Fabrics  ·  Easy 15-Day Returns  ·  ",
            )
            .map((t, i) => (
              <span key={i} className="mx-8">
                {t}
              </span>
            ))}
        </div>
      </div>

      {/* ── Categories ─────────────────────── */}
      <section
        id="categories"
        className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      >
        <div className="mb-16 text-center">
          <div className="mx-auto mb-8 h-[1px] w-36 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
            Discover
          </span>
          <h2 className="font-serif text-4xl font-bold text-primary sm:text-6xl mt-2 leading-none">
            Shop by Category
          </h2>
          <p className="mt-4 text-primary/65 max-w-2xl mx-auto text-sm leading-relaxed">
            Signature cotton edits crafted for modern essentials, elevated
            comfort, and premium everyday style.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {categories.map((cat, index) => (
            <Link
              key={cat.categoryId}
              to={`/shop?categoryId=${cat.categoryId}`}
              className={`group relative overflow-hidden rounded-2xl border border-primary/10 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_var(--gold-glow)] ${
                index === 0 ? "h-72 sm:col-span-2 sm:h-[30rem]" : "h-72 sm:h-96"
              }`}
            >
              <img
                src={toOptimizedImageUrl(resolveCategoryImage(cat), {
                  width: 720,
                  height: 960,
                  quality: 68,
                })}
                srcSet={buildImageSrcSet(resolveCategoryImage(cat), "3:4")}
                sizes={
                  index === 0
                    ? "(max-width: 640px) 92vw, (max-width: 1024px) 92vw, 60vw"
                    : "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                }
                alt={cat.categoryName}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                loading="lazy"
                fetchPriority="low"
                decoding="async"
              />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.15)_0%,transparent_28%,transparent_72%,rgba(255,255,255,0.14)_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 text-white h-1/2 flex flex-col justify-end">
                <span className="mb-2 inline-flex w-fit rounded-full border border-white/25 bg-black/25 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
                  C{String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-xl font-semibold sm:text-2xl">
                  {cat.categoryName}
                </h3>
                <span className="mt-2 flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Explore <FiArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trending Products ──────────────── */}
      <section className="relative bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lux-panel rounded-3xl p-6 sm:p-10">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                  Signature Picks
                </span>
                <h2 className="font-serif text-3xl font-bold text-primary sm:text-5xl mt-2 leading-none">
                  Trending Now
                </h2>
                <p className="mt-3 text-muted">
                  Hand-picked styles chosen for premium drape and comfort.
                </p>
              </div>
              <Link
                to="/shop"
                className="hidden items-center gap-1 text-sm font-medium uppercase tracking-widest text-accent transition hover:text-primary sm:flex"
              >
                View All <FiArrowRight size={14} />
              </Link>
            </div>

            {hasCatalogError ? (
              <QueryErrorState
                title="Unable to load trending products"
                message="Please retry to fetch the latest catalog picks."
                onRetry={() => {
                  refetchProducts();
                  refetchCategories();
                }}
              />
            ) : isCatalogLoading ? (
              <ProductGridSkeleton count={8} />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {styleProducts.map((product, i) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    index={i}
                  />
                ))}
              </div>
            )}

            <div className="mt-10 text-center sm:hidden">
              <Link
                to="/shop"
                className="inline-flex items-center gap-1 text-sm font-medium uppercase tracking-widest text-accent"
              >
                View All <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ─────────────────────── */}
      <section className="relative py-24 bg-surface text-primary border-y border-[var(--line)] overflow-hidden">
        <div className="pointer-events-none absolute -left-24 -top-16 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="mx-auto max-w-5xl px-6">
          <div className="lux-panel relative rounded-3xl px-6 py-14 text-center sm:px-10 lg:px-16">
            <div className="mx-auto mb-8 h-[1px] w-40 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
              Newsletter
            </span>
            <h2 className="font-serif text-4xl font-bold sm:text-6xl mt-2 leading-none">
              The Inner Circle
            </h2>
            <p className="mt-4 text-primary/70 max-w-lg mx-auto text-sm leading-relaxed">
              Subscribe to receive exclusive collection drops, limited editions,
              private previews, and editor-curated style notes.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center max-w-xl mx-auto"
            >
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full rounded-xl bg-[var(--elevated)] px-6 py-4 text-xs font-bold uppercase tracking-widest text-primary placeholder-primary/35 outline-none border border-[var(--line)] transition focus:border-[var(--line-strong)] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent),transparent_85%)] sm:flex-1"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl border border-[var(--line-strong)] bg-primary px-10 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-bg transition duration-300 hover:bg-accent hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Signing up..." : "Join Now"}
              </button>
            </form>
            <div className="mx-auto mt-8 h-[1px] w-40 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────── */}
      <footer className="border-t border-[var(--line)] bg-surface py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="lux-panel rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-2 gap-12 sm:grid-cols-4 lg:gap-24">
              <div className="col-span-2 sm:col-span-1">
                <Link
                  to="/"
                  className="font-serif text-2xl font-bold tracking-tight text-primary"
                >
                  SR <span className="text-accent">FAB</span>
                </Link>
                <p className="mt-6 text-xs leading-relaxed text-primary/65 max-w-xs">
                  Crafting luxury garments with timeless elegance. Our heritage
                  of quality meets the contemporary edge of 3D fashion.
                </p>
              </div>
              <div>
                <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/85">
                  Collection
                </h4>
                <ul className="space-y-4 text-[11px] font-medium text-primary/65">
                  <li className="hover:text-accent transition">
                    <Link to="/shop?categoryId=1">Cotton T-Shirts</Link>
                  </li>
                  <li className="hover:text-accent transition">
                    <Link to="/shop?categoryId=2">Cotton Shirts</Link>
                  </li>
                  <li className="hover:text-accent transition">
                    <Link to="/shop?categoryId=3">Cotton Pants</Link>
                  </li>
                  <li className="hover:text-accent transition">
                    <Link to="/shop?categoryId=4">Cotton Shorts</Link>
                  </li>
                  <li className="hover:text-accent transition">
                    <Link to="/shop?categoryId=5">Lounge & Nightwear</Link>
                  </li>
                  <li className="hover:text-accent transition">
                    <Link to="/shop">All Collections</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/85">
                  Concierge
                </h4>
                <ul className="space-y-4 text-[11px] font-medium text-primary/65">
                  <li className="hover:text-accent transition">
                    <Link to="#">Size Advisory</Link>
                  </li>
                  <li className="hover:text-accent transition">
                    <Link to="#">Shipping Policy</Link>
                  </li>
                  <li className="hover:text-accent transition">
                    <Link to="#">Exchanges</Link>
                  </li>
                  <li className="hover:text-accent transition">
                    <Link to="#">Contact Specialist</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/85">
                  Connect
                </h4>
                <ul className="space-y-4 text-[11px] font-medium text-primary/65">
                  <li className="hover:text-accent transition">
                    <a href="#">Instagram</a>
                  </li>
                  <li className="hover:text-accent transition">
                    <a href="#">Pinterest</a>
                  </li>
                  <li className="hover:text-accent transition">
                    <a href="#">LinkedIn</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t border-[var(--line)] pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-[10px] uppercase font-bold tracking-widest text-primary/40">
              <span>© 2026 SR FAB. All rights reserved.</span>
              <div className="flex gap-8">
                <Link to="#" className="hover:text-accent transition">
                  Privacy
                </Link>
                <Link to="#" className="hover:text-accent transition">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
