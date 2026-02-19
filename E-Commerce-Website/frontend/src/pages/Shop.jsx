import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { FiChevronLeft } from 'react-icons/fi';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const [selectedCat, setSelectedCat] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Error fetching shop data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const filtered = products.filter((p) => {
    const matchesCat = selectedCat === 'all' || p.category?.categoryId === parseInt(selectedCat);
    const matchesSearch = !searchQuery || 
                          p.productName?.toLowerCase().includes(searchQuery) || 
                          p.brand?.toLowerCase().includes(searchQuery) ||
                          p.productDescription?.toLowerCase().includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-accent" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in py-10">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/" className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-accent transition hover:text-primary">
            <FiChevronLeft size={14} /> Home
          </Link>
          <h1 className="font-serif text-3xl font-bold text-primary sm:text-4xl">
            {searchQuery ? `Search: "${searchQuery}"` : 'All Collections'}
          </h1>
          <p className="mt-1 text-sm text-muted">{filtered.length} styles found</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
              selectedCat === 'all'
                ? 'bg-primary text-white'
                : 'border border-gray-200 text-muted hover:border-primary hover:text-primary'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.categoryId}
              onClick={() => setSelectedCat(String(cat.categoryId))}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
                selectedCat === String(cat.categoryId)
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 text-muted hover:border-primary hover:text-primary'
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <p className="text-lg font-medium text-primary">No products found</p>
          <p className="mt-2 text-sm text-muted">Try selecting a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.productId} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
