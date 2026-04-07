import { Minus, Plus, Star, StarHalf, Heart, ShoppingCart, ArrowLeft, Share2, Package, Tag, Ruler, Percent, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Img1 from '../../../assets/shop/Details/Img1.jpg';
import productService from '../../../services/productService';

const P  = '#EC5B13';
const PL = '#FEF0E9';
const G  = '#32a862';
const GL = '#e6f7ed';

const AgentItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => { fetchProductDetails(); }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await productService.getProductById(id);
      if (res?.status === 1 && res.result) {
        setProduct(res.result);
        if (res.result.productImages) {
          setProductImages(res.result.productImages.split(',').map(i => i.trim()));
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const getImagePath = (img) => {
    if (!img) return Img1;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return `${import.meta.env.VITE_API_BASE_URL}/${img.replace(/\\/g, '/')}`;
  };

  const renderStars = (rating = 4.5) => {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    return [
      ...Array.from({ length: full }, (_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />),
      ...(half ? [<StarHalf key="h" size={16} fill="#f59e0b" color="#f59e0b" />] : []),
      ...Array.from({ length: 5 - Math.ceil(rating) }, (_, i) => <Star key={`e${i}`} size={16} color="#e5e7eb" />),
    ];
  };

  const handleAddToCart = async () => {
    try {
      const res = await productService.addToCart(product.productId, quantity);
      if (res?.status === 1) { toast.success('Added to cart!'); navigate('/agent/cart'); }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add to cart'); }
  };

  const handleWishlist = async () => {
    try {
      const res = await productService.addToWishlist(product.productId);
      if (res?.status === 1) { setIsWishlisted(true); toast.success('Added to wishlist'); }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add to wishlist'); }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: `3px solid ${PL}`, borderTopColor: P, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading product...</p>
        </div>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <Package size={48} color="#e5e7eb" style={{ marginBottom: '16px' }} />
        <p style={{ fontSize: '18px', fontWeight: 600, color: '#374151' }}>Product not found</p>
        <button onClick={() => navigate('/agent/buy-from-farmers')} style={{ marginTop: '16px', padding: '10px 24px', backgroundColor: P, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          Back to Products
        </button>
      </div>
    );
  }

  const mainImg = productImages.length > 0 ? getImagePath(productImages[activeImg]) : Img1;

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/agent/buy-from-farmers')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px', padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer', transition: 'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = P; e.currentTarget.style.color = P; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
      >
        <ArrowLeft size={15} /> Back to Products
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '32px', alignItems: 'start' }}>

        {/* ── Left: Images + Description ─────────────────────── */}
        <div>
          {/* Main Image */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', backgroundColor: '#faf8f6', border: '1px solid #f0ede9', marginBottom: '14px', position: 'relative' }}>
            <img
              src={mainImg}
              alt={product.productTitle}
              style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
            />
            {/* Category pill */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', padding: '5px 14px', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '999px', fontSize: '12px', fontWeight: 700, color: '#374151', backdropFilter: 'blur(4px)' }}>
              {product.categoryName}
            </div>
            {/* Status */}
            <div style={{ position: 'absolute', top: '16px', right: '16px', padding: '5px 14px', backgroundColor: '#dcfce7', borderRadius: '999px', fontSize: '12px', fontWeight: 700, color: '#15803d' }}>
              {product.statusName || 'In Stock'}
            </div>
          </div>

          {/* Thumbnails */}
          {productImages.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
              {productImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: '72px', height: '72px', borderRadius: '10px', overflow: 'hidden',
                    border: `2px solid ${i === activeImg ? P : '#e5e7eb'}`,
                    cursor: 'pointer', transition: 'border-color 0.15s',
                    boxShadow: i === activeImg ? `0 0 0 3px ${PL}` : 'none',
                  }}
                >
                  <img src={getImagePath(img)} alt={`${product.productTitle} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.01em' }}>
            {product.productTitle}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>{renderStars(4.5)}</div>
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>4.5 · 1,234 reviews</span>
          </div>

          {/* Description */}
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #f0ede9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: '#1c1917', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Description</p>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: 1.7 }}>{product.productDescription}</p>
          </div>
        </div>

        {/* ── Right: Purchase Card ────────────────────────────── */}
        <div style={{ position: 'sticky', top: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f0ede9', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

            {/* Price header */}
            <div style={{ padding: '20px 24px', background: `linear-gradient(135deg, ${PL} 0%, #fff 100%)`, borderBottom: '1px solid #f0ede9' }}>
              <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>Price per ton</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '32px', fontWeight: 800, color: P, letterSpacing: '-0.02em' }}>₹{product.finalPrice}</span>
                {product.discount > 0 && (
                  <>
                    <span style={{ fontSize: '16px', color: '#9ca3af', textDecoration: 'line-through' }}>₹{product.price}</span>
                    <span style={{ padding: '2px 8px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: G, fontWeight: 500 }}>
                + GST {product.producGST}% applicable
              </p>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {/* Specs */}
              <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: '#1c1917', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Specifications</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[
                  { icon: Tag,     label: 'Category',     value: product.categoryName },
                  { icon: Ruler,   label: 'Qty Type',     value: product.quantityType },
                  { icon: Package, label: 'Product Code', value: product.productCode },
                  { icon: Percent, label: 'Discount',     value: `${product.discount}%` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ padding: '10px 12px', backgroundColor: '#faf8f6', borderRadius: '10px', border: '1px solid #f0ede9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Icon size={12} color={P} />
                      <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1c1917' }}>{value || 'N/A'}</p>
                  </div>
                ))}
              </div>

              {/* Quantity */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1c1917' }}>Quantity</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: '36px', height: '36px', border: 'none', background: '#faf8f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = PL}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#faf8f6'}
                  >
                    <Minus size={14} color="#374151" />
                  </button>
                  <span style={{ minWidth: '40px', textAlign: 'center', fontSize: '14px', fontWeight: 700, color: '#1c1917', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', padding: '0 8px', lineHeight: '36px' }}>
                    {quantity}
                  </span>
                  <button onClick={() => setQuantity(q => q + 1)} style={{ width: '36px', height: '36px', border: 'none', background: '#faf8f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = PL}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#faf8f6'}
                  >
                    <Plus size={14} color="#374151" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: PL, borderRadius: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>Total ({quantity} ton{quantity > 1 ? 's' : ''})</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: P }}>₹{(parseFloat(product.finalPrice) * quantity).toLocaleString()}</span>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={handleAddToCart}
                  style={{ width: '100%', padding: '13px', backgroundColor: P, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: `0 4px 14px rgba(236,91,19,0.3)`, transition: 'opacity 0.15s, transform 0.1s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
                <button
                  onClick={handleWishlist}
                  disabled={isWishlisted}
                  style={{ width: '100%', padding: '13px', backgroundColor: isWishlisted ? GL : '#fff', color: isWishlisted ? G : '#374151', border: `1px solid ${isWishlisted ? G : '#e5e7eb'}`, borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: isWishlisted ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (!isWishlisted) { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.backgroundColor = '#fff1f2'; e.currentTarget.style.color = '#ef4444'; } }}
                  onMouseLeave={e => { if (!isWishlisted) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#374151'; } }}
                >
                  {isWishlisted ? <><CheckCircle size={16} /> Added to Wishlist</> : <><Heart size={16} /> Add to Wishlist</>}
                </button>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0ede9' }}>
                {['Verified Farmer', 'Bulk Pricing', 'Quality Assured'].map(badge => (
                  <div key={badge} style={{ flex: 1, textAlign: 'center', padding: '6px 4px', backgroundColor: '#faf8f6', borderRadius: '8px', fontSize: '10px', fontWeight: 600, color: '#6b7280' }}>
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentItemDetails;
