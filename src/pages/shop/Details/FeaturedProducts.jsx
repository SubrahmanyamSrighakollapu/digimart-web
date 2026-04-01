// src/pages/shop/Details/FeaturedProducts.jsx
import PropTypes from 'prop-types';
import ProductCard from '../../../components/ProductCard/ProductCard';
import productsData from '../../../data/products.json';

const FeaturedProducts = ({ currentProductId }) => {
  const featuredProducts = productsData.products
    .filter(p => p.id !== currentProductId && p.status === 'In Stock')
    .slice(0, 3);

  return (
    <div className="container py-5">
      <h3 className="mb-4">Featured Products</h3>
      <div className="row g-4">
        {featuredProducts.map(product => (
          <div key={product.id} className="col-12 col-md-6 col-lg-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

FeaturedProducts.propTypes = {
  currentProductId: PropTypes.number.isRequired,
};

export default FeaturedProducts;