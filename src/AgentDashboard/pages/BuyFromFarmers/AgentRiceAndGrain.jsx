import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../../components/ProductCard/ProductCard';

const AgentRiceAndGrains = ({ filters = { searchQuery: '', selectedCategories: [], minPrice: '', maxPrice: '' }, products = [], loading = false }) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();

  // Filter products based on applied filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          (product.title && product.title.toLowerCase().includes(query)) ||
          (product.name && product.name.toLowerCase().includes(query)) ||
          (product.categoryName && product.categoryName.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (filters.selectedCategories && filters.selectedCategories.length > 0) {
        if (!filters.selectedCategories.includes(product.categoryName)) return false;
      }

      const productPrice = parseFloat(product.price);
      if (filters.minPrice && filters.minPrice !== '' && productPrice < parseFloat(filters.minPrice)) return false;
      if (filters.maxPrice && filters.maxPrice !== '' && productPrice > parseFloat(filters.maxPrice)) return false;

      return true;
    });
  }, [products, filters]);

  const loadMore = () => setVisibleCount(prev => Math.min(prev + 6, filteredProducts.length));
  const showLess = () => setVisibleCount(6);



  const handleCardClick = (productId) => {
  navigate(`/agent/agent-item-details/${productId}`);  // This is now correct after route fix
};

  const handleWishlistClick = (e, productId) => {
    e.stopPropagation();
    // Add wishlist functionality here
    console.log('Added to wishlist:', productId);
  };

  return (
    <div className="rice-grain-section" style={{ width: '75%', padding: '0.75rem' }}>
      {/* Top Banner */}
      <div className="banner-card px-3 py-3 mb-3">
        <h1 className="mb-1" style={{ fontSize: '25px', fontWeight: '600' }}>Wholesale Rice & Grains</h1>
        <p className="green mb-0 col-10" style={{ fontSize: '18px', lineHeight: '1.4' }}>
          Verified direct-from-farm sourcing for enterprise buyers. Bulk pricing available for orders over 10 tons.
        </p>
      </div>

      {/* Products Found */}
      <div className="mb-3">
        <h5 
          className="fw-semibold"
          style={{
            fontSize: '16px',
            color: '#000000'
          }}
        >
          {loading ? 'Loading...' : `${filteredProducts.length} Products Found`}
        </h5>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No products found matching your filters</p>
        </div>
      ) : (
        <div className="row g-4">
        {filteredProducts.slice(0, visibleCount).map(product => (
          <div key={product.id} className="col-12 col-sm-6 col-lg-4">
            <div 
              className="agent-product-card-wrapper" 
              style={{ position: 'relative', cursor: 'pointer', overflow: 'visible' }}
            >
              {/* Product Card */}
              <ProductCard product={product} isAgentView={true} />
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Load More / Show Less Button */}
      <div className="text-center mt-5">
        {visibleCount < filteredProducts.length ? (
          <button 
            className="btn load-more-btn"
            onClick={loadMore}
            style={{
              width: '379px',
              maxWidth: '100%',
              height: '4rem',
              background: 'white',
              border: '0.5px solid #BCBCBC',
              borderRadius: '50px',
              boxShadow: '0px 1px 4px 0px #00000040',
              fontWeight: '600',
              fontSize: '18px'
            }}
          >
            Load More Products
          </button>
        ) : (
          <button 
            className="btn load-more-btn"
            onClick={showLess}
            style={{
              width: '379px',
              maxWidth: '100%',
              height: '4rem',
              background: 'white',
              border: '0.5px solid #BCBCBC',
              borderRadius: '50px',
              boxShadow: '0px 1px 4px 0px #00000040',
              fontWeight: '600',
              fontSize: '18px'
            }}
          >
            Show Less
          </button>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 992px) {
          .rice-grain-section {
            width: 100% !important;
            padding: 1rem !important;
          }
        }

        .agent-product-card-wrapper:hover {
          transform: translateY(-5px);
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default AgentRiceAndGrains;