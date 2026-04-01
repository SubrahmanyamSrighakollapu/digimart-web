import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ProductCard from '../../../components/ProductCard/ProductCard';
import productService from '../../../services/productService';
import agentService from '../../../services/agentService';

const AgentWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const [wishlistResponse, productsResponse] = await Promise.all([
        productService.getWishlistItems(),
        agentService.getAgentProducts()
      ]);

      if (wishlistResponse && wishlistResponse.status === 1 && wishlistResponse.result) {
        setWishlistItems(wishlistResponse.result);

        if (productsResponse && productsResponse.status === 1 && productsResponse.result) {
          const wishlistProductIds = wishlistResponse.result.map(item => item.productId);
          const wishlistProducts = productsResponse.result
            .filter(product => wishlistProductIds.includes(product.productId))
            .map(product => ({
              id: product.productId,
              img: product.productImages && product.productImages.length > 0 
                ? `${import.meta.env.VITE_API_BASE_URL}/${product.productImages[0].replace(/\\/g, '/')}` 
                : null,
              title: product.productTitle,
              name: product.productName,
              type: product.categoryName,
              quantity: `1 ${product.quantityType}`,
              status: 'In Stock',
              price: product.finalPrice,
              moq: '1 Ton',
              description: product.productDescription,
              categoryId: product.categoryId,
              categoryName: product.categoryName
            }));
          setProducts(wishlistProducts);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch wishlist';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wishlist-section" style={{ padding: '2rem' }}>
      <div className="mb-4">
        <h2 className="fw-bold" style={{ fontSize: '28px', color: '#000000' }}>
          My Wishlist
        </h2>
        <p className="text-muted">
          {loading ? 'Loading...' : `${products.length} items in your wishlist`}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-5">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <p className="text-muted mt-3">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="row g-4">
          {products.map(product => (
            <div key={product.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <ProductCard product={product} isAgentView={true} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentWishlist;
