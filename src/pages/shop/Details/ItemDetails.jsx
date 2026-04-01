// src/pages/shop/Details/Details.jsx
import { Minus, Plus, Star, StarHalf } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fb from '../../../assets/footer/fb.png';
import insta from '../../../assets/footer/Insta.png';
import pinterest from '../../../assets/footer/pintrest.png';
import twitter from '../../../assets/footer/twitter.png';
import Img1 from '../../../assets/shop/Details/Img1.jpg';
import Img2 from '../../../assets/shop/Details/Img2.jpg';
import Button from '../../../components/Button/Button';
import { useCart } from '../../../context/CartContext';
import productsData from '../../../data/products.json';
import { getImageUrl } from '../../../utils/imageLoader';
import FeaturedProducts from './FeaturedProducts';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundProduct = productsData.products.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
    
    if (foundProduct) {
      const cartQty = getItemQuantity(foundProduct.id);
      if (cartQty > 0) {
        setQuantity(cartQty);
      }
    }
  }, [id, getItemQuantity]);

  if (!product) {
    return <div className="container py-5"><p>Loading...</p></div>;
  }

  const getImagePath = (imgName) => {
    const url = getImageUrl(imgName);
    return url || '';
  };

  const renderStars = (rating) => {
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

  const handleAddToCart = () => {
    addToCart(product, quantity);
    
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="mb-4">
              <img
                src={getImagePath(product.img)}
                alt={product.title}
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

            <h4 className="mb-4">{product.title}</h4>

            <div className="row align-items-left g-4 mb-4">
              <div className="col-lg-2 col-4 text-center">
                <img src={Img1} alt="Detail 1" className="w-100 rounded detail-thumb" />
              </div>
              <div className="col-lg-2 col-4 text-center">
                <img src={getImagePath(product.img)} alt={product.title} className="w-100 rounded detail-thumb" />
              </div>
              <div className="col-lg-2 col-4 text-center">
                <img src={Img2} alt="Detail 2" className="w-100 rounded detail-thumb" />
              </div>
            </div>

            <p className="text-dark fw-semibold mb-2">Product Description</p>
            <p className="text-muted col-lg-11 col-8">{product.description}</p>
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
              <h3 className="mb-3" style={{ fontSize: '1.5rem' }}>{product.title}</h3>

              <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                <div className="d-flex align-items-center">
                  {renderStars(product.rating)}
                </div>
                <p className="mb-0 small text-muted">({product.reviews} Reviews)</p>
                <p className="mb-0 small text-success fw-semibold">{product.status}</p>
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
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">₹{product.price}</h4>
                  <p className="mb-0 small text-success">
                    Minimum Order Quantity: {product.minOrderQty}
                  </p>
                </div>
              </div>

              <p className="text-dark fw-semibold mb-3">Product Specifications</p>
              <div className="mb-4">
                <div className="row">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div className="col-6 mb-3" key={key}>
                      <p className="mb-0 small text-capitalize text-muted">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="mb-0 small text-dark fw-semibold">{value}</p>
                    </div>
                  ))}
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
                  text="Add to Wishlist"
                  onClick={() => alert('Added to wishlist!')}
                  bgColor="#EEC044"
                  className="w-100"
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

      <FeaturedProducts currentProductId={product.id} />
    </>
  );
};

export default Details;