import { Minus, Plus, Star, StarHalf } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import fb from '../../../assets/footer/fb.png';
import insta from '../../../assets/footer/Insta.png';
import pinterest from '../../../assets/footer/pintrest.png';
import twitter from '../../../assets/footer/twitter.png';
import Img1 from '../../../assets/shop/Details/Img1.jpg';
import Img2 from '../../../assets/shop/Details/Img2.jpg';
import Button from '../../../components/Button/Button';
import productService from '../../../services/productService';

const AgentItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      if (response && response.status === 1 && response.result) {
        setProduct(response.result);
        // Parse comma-separated images
        if (response.result.productImages) {
          const images = response.result.productImages.split(',').map(img => img.trim());
          setProductImages(images);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch product';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getImagePath = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
    return `${import.meta.env.VITE_API_BASE_URL}/${imgPath.replace(/\\/g, '/')}`;
  };

  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={19.2} fill="#FFD700" color="#FFD700" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" size={19.2} fill="#FFD700" color="#FFD700" />);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={19.2} color="#FFD700" />);
    }
    return stars;
  };

  const handleAddToCart = async () => {
    try {
      const response = await productService.addToCart(product.productId, quantity);
      if (response && response.status === 1) {
        toast.success('Added to cart successfully');
        navigate('/agent/cart');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add to cart';
      toast.error(errorMessage);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await productService.addToWishlist(product.productId);
      if (response && response.status === 1) {
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add to wishlist';
      toast.error(errorMessage);
    }
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="container py-5"><p>Product not found</p></div>;
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="mb-4">
            <img
              src={productImages.length > 0 ? getImagePath(productImages[0]) : Img1}
              alt={product.productTitle}
              className="w-100 rounded"
              style={{
                maxWidth: '49rem',
                height: 'auto',
                maxHeight: '565px',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
          </div>

          <h4 className="mb-4">{product.productTitle}</h4>

          <div className="row align-items-left g-4 mb-4">
            {productImages.map((img, index) => (
              <div key={index} className="col-lg-2 col-4 text-center">
                <img 
                  src={getImagePath(img)} 
                  alt={`${product.productTitle} ${index + 1}`} 
                  className="w-100 rounded detail-thumb" 
                  style={{ cursor: 'pointer', objectFit: 'cover', height: '100px' }}
                />
              </div>
            ))}
          </div>

          <p className="text-dark fw-semibold mb-2">Product Description</p>
          <p className="text-muted col-lg-11 col-8">{product.productDescription}</p>
        </div>

        <div className="col-lg-4">
          <div 
            className="card p-4 sticky-top"
            style={{
              maxWidth: '528px',
              borderRadius: '8px',
              border: '0.5px solid #9B9B9B',
              boxShadow: '0px 0.8px 4px 0px #00000040',
              top: '100px'
            }}
          >
            <h3 className="mb-3" style={{ fontSize: '1.5rem' }}>{product.productName}</h3>

            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div className="d-flex align-items-center">
                {renderStars(4.5)}
              </div>
              <p className="mb-0 small text-muted">(1234 Reviews)</p>
              <p className="mb-0 small text-success fw-semibold">{product.statusName}</p>
            </div>

            <div 
              className="p-3 mb-4"
              style={{
                background: '#F0F0F0',
                borderRadius: '8px',
                maxWidth: '421px'
              }}
            >
              <p className="mb-2 small">Pricing</p>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h4 className="mb-0">₹{product.finalPrice}</h4>
                  {product.discount > 0 && (
                    <p className="mb-0 small text-muted text-decoration-line-through">₹{product.price}</p>
                  )}
                </div>
                <p className="mb-0 small text-success">
                  GST: {product.producGST}%
                </p>
              </div>
            </div>

            <p className="text-dark fw-semibold mb-3">Product Specifications</p>
            <div className="mb-4">
              <div className="row">
                <div className="col-6 mb-3">
                  <p className="mb-0 small text-muted">Category</p>
                  <p className="mb-0 small text-dark fw-semibold">{product.categoryName}</p>
                </div>
                <div className="col-6 mb-3">
                  <p className="mb-0 small text-muted">Quantity Type</p>
                  <p className="mb-0 small text-dark fw-semibold">{product.quantityType}</p>
                </div>
                <div className="col-6 mb-3">
                  <p className="mb-0 small text-muted">Product Code</p>
                  <p className="mb-0 small text-dark fw-semibold">{product.productCode}</p>
                </div>
                <div className="col-6 mb-3">
                  <p className="mb-0 small text-muted">Discount</p>
                  <p className="mb-0 small text-dark fw-semibold">{product.discount}%</p>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="mb-0 text-dark fw-semibold">Choose Quantity</p>
              <div 
                className="d-flex align-items-center"
                style={{
                  border: '1px solid #ECE7E2',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                <button 
                  className="btn btn-sm px-3"
                  onClick={decrementQty}
                  style={{ border: 'none', background: 'transparent' }}
                >
                  <Minus size={16} />
                </button>
                <span className="px-3 border-start border-end" style={{ borderColor: '#ECE7E2' }}>
                  {quantity}
                </span>
                <button 
                  className="btn btn-sm px-3"
                  onClick={incrementQty}
                  style={{ border: 'none', background: 'transparent' }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="d-flex flex-column gap-3 mb-4">
              <Button 
                text="Add To Cart"
                onClick={handleAddToCart}
                bgColor="#4BAF47"
                className="w-100"
              />
              <Button 
                text={isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
                onClick={handleAddToWishlist}
                bgColor={isWishlisted ? "#ccc" : "#EEC044"}
                className="w-100"
                disabled={isWishlisted}
              />
            </div>

            <div className="d-flex flex-row justify-content-between align-items-centre">
              <h4 style={{ fontSize: '1.1rem' }}>Share with Friends</h4>
              <div className="d-flex gap-3">
                <a href="#" className="text-decoration-none">
                  <img src={fb} alt="Facebook" style={{ width: '32px', height: '32px' }} />
                </a>
                <a href="#" className="text-decoration-none">
                  <img src={twitter} alt="Twitter" style={{ width: '32px', height: '32px' }} />
                </a>
                <a href="#" className="text-decoration-none">
                  <img src={insta} alt="Instagram" style={{ width: '32px', height: '32px' }} />
                </a>
                <a href="#" className="text-decoration-none">
                  <img src={pinterest} alt="Pinterest" style={{ width: '32px', height: '32px' }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentItemDetails;
