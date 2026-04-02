import { useState, useMemo } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import productsData from '../../data/products.json';

const RiceAndGrain = ({ filters }) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const products = productsData.products;

  // Filter products based on applied filters
  const filteredProducts = useMemo(() => {
    console.log('Filtering with:', filters);
    console.log('All products:', products);
    
    return products.filter(product => {
      // Search filter
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          (product.title && product.title.toLowerCase().includes(query)) ||
          (product.name && product.name.toLowerCase().includes(query)) ||
          (product.categoryName && product.categoryName.toLowerCase().includes(query));
        
        if (!matchesSearch) {
          console.log('Product filtered out by search:', product.title);
          return false;
        }
      }

      // Category filter
      if (filters.selectedCategories && filters.selectedCategories.length > 0) {
        if (!filters.selectedCategories.includes(product.categoryName)) {
          console.log('Product filtered out by category:', product.title, product.categoryName);
          return false;
        }
      }

      // Price filter
      const productPrice = parseFloat(product.price);
      if (filters.minPrice && filters.minPrice !== '') {
        const minPrice = parseFloat(filters.minPrice);
        if (productPrice < minPrice) {
          console.log('Product filtered out by min price:', product.title, productPrice, '<', minPrice);
          return false;
        }
      }
      if (filters.maxPrice && filters.maxPrice !== '') {
        const maxPrice = parseFloat(filters.maxPrice);
        if (productPrice > maxPrice) {
          console.log('Product filtered out by max price:', product.title, productPrice, '>', maxPrice);
          return false;
        }
      }

      return true;
    });
  }, [products, filters]);

  const loadMore = () => setVisibleCount(prev => Math.min(prev + 6, filteredProducts.length));
  const showLess = () => setVisibleCount(6);

  return (
    <div className="rice-grain-section" style={{ width: '75%', padding: '1rem' }}>
      {/* Top Banner */}
      <div 
        className="banner-card px-4 py5"
      >
        <h2 className="mb-2 fs-3">Wholesale Rice & Grains</h2>
        <p className="green mb-0 col-8 fs-5" >
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
          {`${filteredProducts.length} Products Found`}
        </h5>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No products found matching your filters</p>
        </div>
      ) : (
        <div className="row g-4 justify-content-center">
          {filteredProducts.slice(0, visibleCount).map(product => (
            <div key={product.id} className="col-12 col-sm-6 col-lg-4">
              <ProductCard product={product} />
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
      `}</style>
    </div>
  );
};

export default RiceAndGrain;