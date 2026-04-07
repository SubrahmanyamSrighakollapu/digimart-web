import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';
import productService from '../../../services/productService';
import { getImageUrl } from '../../../utils/imageLoader';

const P = '#EC5B13';
const PL = '#FEF0E9';
const G = '#32a862';
const GL = '#e6f7ed';

const AgentRiceAndGrains = ({
  filters = { searchQuery: '', selectedCategories: [], minPrice: '', maxPrice: '' },
  products = [],
  loading = false,
}) => {
  const [visibleCount, setVisibleCount] = useState(9);
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (filters.searchQuery?.trim()) {
        const q = filters.searchQuery.toLowerCase();
        if (!p.title?.toLowerCase().includes(q) && !p.name?.toLowerCase().includes(q) && !p.categoryName?.toLowerCase().includes(q)) return false;
      }
      if (filters.selectedCategories?.length > 0 && !filters.selectedCategories.includes(p.categoryName)) return false;
      const price = parseFloat(p.price);
      if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;
      return true;
    });
  }, [products, filters]);

  const visible = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const getImagePath = (img) => {
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return getImageUrl(img) || img;
  };

  if (loading) {
    return (
      <div style={{ flex: 1, padding: '0 0 0 8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ height: '200px', backgroundColor: '#f3f4f6', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ padding: '16px' }}>
                <div style={{ height: '14px', backgroundColor: '#f3f4f6', borderRadius: '6px', marginBottom: '8px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ height: '12px', backgroundColor: '#f3f4f6', borderRadius: '6px', width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
              </div>
            </div>
          ))}
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, padding: '0 0 0 8px', minWidth: 0 }}>
      {/* Results bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: PL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={15} color={P} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>
              {filteredProducts.length} Products Found
            </p>
            {filters.selectedCategories?.length > 0 && (
              <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>
                in {filters.selectedCategories.join(', ')}
              </p>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {filters.selectedCategories?.map(cat => (
            <span key={cat} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', backgroundColor: PL, color: P, borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f0ede9' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: PL, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Package size={28} color={P} />
          </div>
          <p style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 700, color: '#1c1917' }}>No products found</p>
          <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>Try adjusting your filters or search query</p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
            {visible.map(product => (
              <ProductCard key={product.id} product={product} getImagePath={getImagePath} navigate={navigate} />
            ))}
          </div>

          {/* Load More / Show Less */}
          {filteredProducts.length > 9 && (
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => hasMore ? setVisibleCount(v => Math.min(v + 9, filteredProducts.length)) : setVisibleCount(9)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 32px', backgroundColor: '#fff', color: '#374151',
                  border: '1px solid #e5e7eb', borderRadius: '999px',
                  fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = P; e.currentTarget.style.color = P; e.currentTarget.style.boxShadow = `0 4px 16px rgba(236,91,19,0.15)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
              >
                {hasMore ? <><ChevronDown size={16} /> Load More Products</> : <><ChevronUp size={16} /> Show Less</>}
              </button>
              <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#9ca3af' }}>
                Showing {Math.min(visibleCount, filteredProducts.length)} of {filteredProducts.length} products
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Inline Product Card ──────────────────────────────────────
const ProductCard = ({ product, getImagePath, navigate }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgSrc = getImagePath(product.img);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    try {
      const res = await productService.addToWishlist(product.id);
      if (res?.status === 1) { setWishlisted(true); toast.success('Added to wishlist'); }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add to wishlist'); }
  };

  return (
    <div
      onClick={() => navigate(`/agent/agent-item-details/${product.id}`)}
      style={{
        backgroundColor: '#fff', borderRadius: '14px', overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.07)', border: '1px solid #f0ede9',
        cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(236,91,19,0.14)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.07)'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '200px', backgroundColor: '#faf8f6', overflow: 'hidden' }}>
        {imgSrc && !imgError ? (
          <img
            src={imgSrc}
            alt={product.title}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: PL }}>
            <Package size={40} color={P} style={{ opacity: 0.4 }} />
          </div>
        )}

        {/* Category badge */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '3px 10px', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '999px', fontSize: '11px', fontWeight: 600, color: '#374151', backdropFilter: 'blur(4px)' }}>
          {product.type}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          style={{
            position: 'absolute', top: '10px', right: '10px',
            width: '34px', height: '34px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.92)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'all 0.15s',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff1f2'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.92)'}
        >
          <Heart size={15} color={wishlisted ? '#ef4444' : '#9ca3af'} fill={wishlisted ? '#ef4444' : 'none'} />
        </button>

        {/* In Stock badge */}
        <div style={{ position: 'absolute', bottom: '10px', left: '10px', padding: '3px 10px', backgroundColor: '#dcfce7', borderRadius: '999px', fontSize: '11px', fontWeight: 600, color: '#15803d' }}>
          {product.status}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: '#1c1917', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.title}
        </p>
        <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#9ca3af' }}>{product.quantity}</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#faf8f6', borderRadius: '8px', marginBottom: '14px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '10px', color: '#9ca3af', fontWeight: 500 }}>Price / Ton</p>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: P }}>₹{product.price}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '10px', color: '#9ca3af', fontWeight: 500 }}>MOQ</p>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#374151' }}>{product.moq}</p>
          </div>
        </div>

        <button
          onClick={e => { e.stopPropagation(); navigate(`/agent/agent-item-details/${product.id}`); }}
          style={{
            width: '100%', padding: '10px', backgroundColor: P, color: 'white',
            border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            transition: 'opacity 0.15s', marginTop: 'auto',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <Eye size={14} /> View Details
        </button>
      </div>
    </div>
  );
};

export default AgentRiceAndGrains;
