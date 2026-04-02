// src/components/ProductCard/ProductCard.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageLoader';
import productService from '../../services/productService';

const ProductCard = ({ product, isAgentView = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleCardClick = () => {
    // Navigate based on context
    if (isAgentView) {
      navigate(`/agent/agent-item-details/${product.id}`);
    } else {
      navigate(`/details/${product.id}`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (isAgentView) {
      // For agent view, navigate to details page instead
      navigate(`/agent/agent-item-details/${product.id}`);
    } else {
      // For normal shop, add to cart directly
      addToCart(product, 1);
    }
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    try {
      const response = await productService.addToWishlist(product.id);
      if (response && response.status === 1) {
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add to wishlist';
      toast.error(errorMessage);
    }
  };

  const getImagePath = (imgName) => {
    console.log('ProductCard received img:', imgName);
    if (imgName && (imgName.startsWith('http://') || imgName.startsWith('https://'))) {
      console.log('Using direct URL:', imgName);
      return imgName;
    }
    const url = getImageUrl(imgName);
    console.log('Using local asset:', url);
    return url || '';
  }; 

  return (
    <div 
      className="product-card h-100 d-flex flex-column" 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-image-wrap" style={{ position: 'relative', overflow: 'visible' }}>
        <img
          src={getImagePath(product.img)}
          alt={product.title}
          className="card-img-top"
          style={{
            width: '100%',
            height: '254px',
            objectFit: 'cover',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            display: 'block'
          }}
        />

        {product.agent && (
          <img
            src={getImagePath(product.agent)}
            alt="Agent"
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              width: '4rem',
              height: '4rem',
              borderRadius: '8px',
              border: '3px solid white',
              objectFit: 'cover',
              boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
              zIndex: 9999,
              pointerEvents: 'auto'
            }}
          />
        )}

        {/* Wishlist Heart */}
        <div
          onClick={handleWishlistClick}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '46px',
            height: '46px',
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0px 2px 6px rgba(0,0,0,0.12)',
            zIndex: 9999,
            cursor: 'pointer',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={isWishlisted ? '#FF0000' : 'none'} stroke={isWishlisted ? '#FF0000' : '#000000'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      </div>
      <div className="card-body px-3 pt-2 pb-4 d-flex flex-column">
        <p className="text-dark mb-1 fw-normal">{product.title}</p>
        <div className="d-flex justify-content-between text-muted mb-2 small">
          <span>{product.type}</span>
          <span>{product.quantity}</span>
        </div>
        <div 
          className={`status-badge mb-1 ${product.status === 'In Stock' ? 'in-stock' : 'out-stock'}`}
          style={{
            alignSelf: 'flex-start',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {product.status}
        </div>
        <hr className="my-3" />
        <div className="d-flex justify-content-between text-success small mb-2">
          <span>Price Per Ton</span>
          <span>MOQ</span>
        </div>
        <div className="d-flex justify-content-between fw-semibold mb-3">
          <span>₹{product.price}</span>
          <span>{product.moq}</span>
        </div>
        <button 
          className="btn add-to-cart-btn mt-auto"
          onClick={handleAddToCart}
          style={{
            background: '#EC5B13',
            color: 'white',
            fontWeight: '600',
            borderRadius: '8px',
            padding: '0.5rem',
            border: 'none'
          }}
        >
          {isAgentView ? 'View Details' : 'Add To Cart'}
        </button>
      </div>

      <style>{`
        .product-card {
          position: relative;
          z-index: 1;
          max-width: 20rem;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .product-card:hover {
          transform: translateY(-4px);
        }

        .in-stock {
          background: #f8bc9e
          border: 0.4px solid #EC5B13;
          color: #EC5B13;
        }

        .out-stock {
          background: #FFD4B4;
          border: 0.4px solid #FF6600;
          color: #CC0000;
        }

        .add-to-cart-btn:hover {
          background: #EC5B13 !important;
        }
      `}</style>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    quantity: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    moq: PropTypes.string.isRequired,
  }).isRequired,
  isAgentView: PropTypes.bool,
};

export default ProductCard;