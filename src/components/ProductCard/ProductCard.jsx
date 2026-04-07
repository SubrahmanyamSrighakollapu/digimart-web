import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Heart, Eye, ShoppingCart, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageLoader';
import productService from '../../services/productService';

const P  = '#EC5B13';
const PL = '#FEF0E9';

const ProductCard = ({ product, isAgentView = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const getImagePath = (img) => {
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return getImageUrl(img) || null;
  };

  const handleCardClick = () => {
    navigate(isAgentView ? `/agent/agent-item-details/${product.id}` : `/details/${product.id}`);
  };

  const handleAction = (e) => {
    e.stopPropagation();
    if (isAgentView) {
      navigate(`/agent/agent-item-details/${product.id}`);
    } else {
      addToCart(product, 1);
    }
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    try {
      const res = await productService.addToWishlist(product.id);
      if (res?.status === 1) { setIsWishlisted(true); toast.success('Added to wishlist'); }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to add to wishlist');
    }
  };

  const imgSrc = getImagePath(product.img);

  return (
    <div
      onClick={handleCardClick}
      style={{
        backgroundColor: '#fff', borderRadius: '14px', overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.07)', border: '1px solid #f0ede9',
        cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex', flexDirection: 'column', maxWidth: '320px', margin: '0 auto',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(236,91,19,0.14)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.07)'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '220px', backgroundColor: '#faf8f6', overflow: 'hidden' }}>
        {imgSrc && !imgError ? (
          <img
            src={imgSrc}
            alt={product.title}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: PL }}>
            <Package size={44} color={P} style={{ opacity: 0.35 }} />
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
            cursor: 'pointer', backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff1f2'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.92)'}
        >
          <Heart size={15} color={isWishlisted ? '#ef4444' : '#9ca3af'} fill={isWishlisted ? '#ef4444' : 'none'} />
        </button>

        {/* Stock badge */}
        <div style={{
          position: 'absolute', bottom: '10px', left: '10px',
          padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
          backgroundColor: product.status === 'In Stock' ? '#dcfce7' : '#fee2e2',
          color: product.status === 'In Stock' ? '#15803d' : '#b91c1c',
        }}>
          {product.status}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: 700, color: '#1c1917', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.title}
        </p>
        <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#9ca3af' }}>{product.quantity}</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#faf8f6', borderRadius: '8px', marginBottom: '12px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '10px', color: '#9ca3af', fontWeight: 500 }}>Price / Ton</p>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: P }}>₹{product.price}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '10px', color: '#9ca3af', fontWeight: 500 }}>MOQ</p>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#374151' }}>{product.moq}</p>
          </div>
        </div>

        <button
          onClick={handleAction}
          style={{
            width: '100%', padding: '10px', backgroundColor: P, color: 'white',
            border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            transition: 'opacity 0.15s', marginTop: 'auto',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          {isAgentView ? <><Eye size={14} /> View Details</> : <><ShoppingCart size={14} /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    img: PropTypes.string,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    quantity: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    moq: PropTypes.string.isRequired,
  }).isRequired,
  isAgentView: PropTypes.bool,
};

export default ProductCard;
