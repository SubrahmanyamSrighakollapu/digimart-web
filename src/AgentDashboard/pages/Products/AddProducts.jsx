import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Edit, Trash2, Plus, X, Package, ImagePlus, Tag, DollarSign, Info } from 'lucide-react';
import productService from '../../../services/productService';
import lookupService from '../../../services/lookupService';

const P  = '#EC5B13';
const PL = '#FEF0E9';
const G  = '#32a862';
const GL = '#e6f7ed';

const inp = {
  width: '100%', padding: '10px 13px', border: '1px solid #e5e7eb',
  borderRadius: '8px', fontSize: '13px', outline: 'none',
  backgroundColor: '#fff', color: '#1c1917', boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const focusStyle = (e) => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; };
const blurStyle  = (e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; };

const Field = ({ label, required, children, fullWidth }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', gridColumn: fullWidth ? '1 / -1' : undefined }}>
    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label}{required && <span style={{ color: P, marginLeft: '2px' }}>*</span>}
    </label>
    {children}
  </div>
);

const SectionHead = ({ icon: Icon, title, color = P }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '10px', borderBottom: `1px solid #f0ede9` }}>
    <div style={{ width: '28px', height: '28px', borderRadius: '7px', backgroundColor: PL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={14} color={color} />
    </div>
    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1c1917', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
  </div>
);

const AddProducts = () => {
  const [showPopup, setShowPopup]         = useState(false);
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [quantities, setQuantities]       = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [imageInputs, setImageInputs]     = useState([{ id: 1 }]);
  const [formData, setFormData] = useState({
    name: '', title: '', description: '', quantityId: '', price: '',
    discount: '', finalPrice: '', gst: '', categoryId: '', statusId: '', images: []
  });

  useEffect(() => { fetchProducts(); fetchQuantities(); fetchSubCategories(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts();
      if (res?.status === 1 && res.result) setProducts(res.result);
    } catch { console.error('Error fetching products'); }
    finally { setLoading(false); }
  };

  const fetchQuantities = async () => {
    try {
      const res = await lookupService.getProductQuantityTypes();
      if (res.status === 1 && res.result) setQuantities(res.result);
    } catch {}
  };

  const fetchSubCategories = async () => {
    try {
      const res = await productService.getAllProductCategories();
      if (res?.status === 1 && res.result) setSubCategories(res.result.filter(c => c.isParent === 0));
    } catch {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'price' || name === 'discount') {
        const price    = parseFloat(name === 'price' ? value : updated.price) || 0;
        const discount = parseFloat(name === 'discount' ? value : updated.discount) || 0;
        updated.finalPrice = (price - (price * discount / 100)).toFixed(2);
      }
      return updated;
    });
  };

  const handleFileChange = (e, inputId) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(prev => {
      const imgs = [...prev.images];
      const idx  = imgs.findIndex(i => i.inputId === inputId);
      if (idx >= 0) imgs[idx] = { file, inputId };
      else imgs.push({ file, inputId });
      return { ...prev, images: imgs };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingProduct) {
        const res = await productService.updateProduct({
          productId: editingProduct.productId,
          productName: formData.name, productTitle: formData.title,
          productDescription: formData.description, quantityId: parseInt(formData.quantityId),
          price: parseFloat(formData.price), discount: parseFloat(formData.discount) || 0,
          finalPrice: parseFloat(formData.finalPrice), productGst: parseFloat(formData.gst),
          categoryId: parseInt(formData.categoryId), statusId: parseInt(formData.statusId) || 1, isActive: true
        });
        if (res?.status === 1) { toast.success('Product updated!'); await fetchProducts(); resetForm(); }
        else toast.error('Failed to update product');
      } else {
        const fd = new FormData();
        fd.append('productName', formData.name); fd.append('productTitle', formData.title);
        fd.append('productDescription', formData.description); fd.append('quantityId', formData.quantityId);
        fd.append('price', formData.price); fd.append('discount', formData.discount || 0);
        fd.append('finalPrice', formData.finalPrice); fd.append('productGst', formData.gst);
        fd.append('categoryId', formData.categoryId); fd.append('statusId', formData.statusId || 1);
        fd.append('isActive', true);
        formData.images.forEach(img => fd.append('productImages', img.file));
        const res = await productService.onboardProduct(fd);
        if (res?.status === 1) { toast.success('Product added!'); await fetchProducts(); resetForm(); }
        else toast.error('Failed to add product');
      }
    } catch (err) { toast.error(err.response?.data?.message || err.message || 'Error saving product'); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ name: '', title: '', description: '', quantityId: '', price: '', discount: '', finalPrice: '', gst: '', categoryId: '', statusId: '', images: [] });
    setImageInputs([{ id: 1 }]); setEditingProduct(null); setShowPopup(false);
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setFormData({ name: p.productName, title: p.productTitle, description: p.productDescription, quantityId: p.quantityTypeId.toString(), price: p.price, discount: p.discount, finalPrice: p.finalPrice, gst: p.producGST, categoryId: p.categoryId.toString(), statusId: p.statusId.toString(), images: [] });
    setShowPopup(true);
  };

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `linear-gradient(135deg, ${P}, #F07030)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={18} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1c1917' }}>Products</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>{products.length} products listed</p>
          </div>
        </div>
        <button onClick={() => setShowPopup(true)} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 20px', backgroundColor: P, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', boxShadow: `0 4px 14px rgba(236,91,19,0.3)`, transition: 'opacity 0.15s, transform 0.1s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f0ede9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: '#faf8f6' }}>
                {['Product Name', 'Title', 'Category', 'Price', 'Discount', 'Final Price', 'GST', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: P, borderBottom: '1px solid #f0ede9', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>Loading products...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={8}>
                  <div style={{ textAlign: 'center', padding: '64px 24px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: PL, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                      <Package size={24} color={P} />
                    </div>
                    <p style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 600, color: '#1c1917' }}>No products yet</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>Click "Add Product" to list your first product</p>
                  </div>
                </td></tr>
              ) : products.map((p, i) => (
                <tr key={p.productId} style={{ borderBottom: i < products.length - 1 ? '1px solid #faf8f6' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#faf8f6'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '13px 18px', fontWeight: 600, color: '#1c1917', fontSize: '13px' }}>{p.productName}</td>
                  <td style={{ padding: '13px 18px', color: '#6b7280', fontSize: '13px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.productTitle}</td>
                  <td style={{ padding: '13px 18px' }}><span style={{ padding: '3px 10px', backgroundColor: PL, color: P, borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>{p.categoryName}</span></td>
                  <td style={{ padding: '13px 18px', fontSize: '13px', color: '#6b7280' }}>₹{p.price}</td>
                  <td style={{ padding: '13px 18px', fontSize: '13px', color: '#6b7280' }}>{p.discount}%</td>
                  <td style={{ padding: '13px 18px', fontSize: '14px', fontWeight: 700, color: G }}>₹{p.finalPrice}</td>
                  <td style={{ padding: '13px 18px', fontSize: '13px', color: '#6b7280' }}>{p.producGST}%</td>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => handleEdit(p)} style={{ width: '30px', height: '30px', borderRadius: '7px', backgroundColor: '#eff6ff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#dbeafe'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
                      ><Edit size={13} color="#1e40af" /></button>
                      <button onClick={() => setProducts(products.filter(x => x.productId !== p.productId))} style={{ width: '30px', height: '30px', borderRadius: '7px', backgroundColor: '#fee2e2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fecaca'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
                      ><Trash2 size={13} color="#dc2626" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showPopup && (
        <div onClick={resetForm} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(26,15,10,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(2px)', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '16px', width: '680px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(236,91,19,0.15)', border: '1px solid #f0ede9', animation: 'slideUp 0.2s ease-out' }}>
            <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f0ede9', background: `linear-gradient(to right, ${PL}, #fff)`, position: 'sticky', top: 0, zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `linear-gradient(135deg, ${P}, #F07030)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={15} color="white" />
                </div>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#1c1917' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              </div>
              <button onClick={resetForm} style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Basic Info */}
              <div>
                <SectionHead icon={Tag} title="Basic Information" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Field label="Product Name" required>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Basmati Rice" style={inp} onFocus={focusStyle} onBlur={blurStyle} required />
                  </Field>
                  <Field label="Product Title" required>
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Premium Basmati Rice 1121" style={inp} onFocus={focusStyle} onBlur={blurStyle} required />
                  </Field>
                  <Field label="Description" fullWidth>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the product quality, origin, specifications..." rows={3} style={{ ...inp, resize: 'vertical', minHeight: '72px' }} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>
                </div>
              </div>

              {/* Category & Specs */}
              <div>
                <SectionHead icon={Tag} title="Category & Specifications" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <Field label="Sub-Category" required>
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} style={inp} onFocus={focusStyle} onBlur={blurStyle} required>
                      <option value="">Select Sub-Category</option>
                      {subCategories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                    </select>
                  </Field>
                  <Field label="Quantity Type" required>
                    <select name="quantityId" value={formData.quantityId} onChange={handleChange} style={inp} onFocus={focusStyle} onBlur={blurStyle} required>
                      <option value="">Select Quantity Type</option>
                      {quantities.map(q => <option key={q.statusId} value={q.statusId}>{q.statusValue}</option>)}
                    </select>
                  </Field>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <SectionHead icon={DollarSign} title="Pricing Information" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <Field label="Price (₹)" required>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" step="0.01" min="0" style={inp} onFocus={focusStyle} onBlur={blurStyle} required />
                  </Field>
                  <Field label="Discount (%)">
                    <input type="number" name="discount" value={formData.discount} onChange={handleChange} placeholder="0" step="0.01" min="0" max="100" style={inp} onFocus={focusStyle} onBlur={blurStyle} />
                  </Field>
                  <Field label="GST (%)" required>
                    <input type="number" name="gst" value={formData.gst} onChange={handleChange} placeholder="0" step="0.01" min="0" style={inp} onFocus={focusStyle} onBlur={blurStyle} required />
                  </Field>
                </div>
                {/* Final Price display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: GL, borderRadius: '10px', border: `1px solid ${G}33` }}>
                  <Info size={15} color={G} />
                  <span style={{ fontSize: '13px', color: '#374151' }}>Final Price (auto-calculated):</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: G, marginLeft: 'auto' }}>₹{formData.finalPrice || '0.00'}</span>
                </div>
              </div>

              {/* Images */}
              {!editingProduct && (
                <div>
                  <SectionHead icon={ImagePlus} title="Product Images" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {imageInputs.map((input, idx) => {
                      const uploaded = formData.images.find(i => i.inputId === input.id);
                      return (
                        <div key={input.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: `1px dashed ${uploaded ? G : '#d1d5db'}`, borderRadius: '9px', backgroundColor: uploaded ? GL : '#faf8f6', cursor: 'pointer', transition: 'all 0.15s' }}
                            onMouseEnter={e => { if (!uploaded) e.currentTarget.style.borderColor = P; }}
                            onMouseLeave={e => { if (!uploaded) e.currentTarget.style.borderColor = '#d1d5db'; }}
                          >
                            <input type="file" accept="image/*" onChange={e => handleFileChange(e, input.id)} style={{ display: 'none' }} required={idx === 0} />
                            <ImagePlus size={16} color={uploaded ? G : '#9ca3af'} />
                            <span style={{ fontSize: '13px', color: uploaded ? G : '#9ca3af', fontWeight: uploaded ? 600 : 400 }}>
                              {uploaded ? `✓ ${uploaded.file.name}` : `Image ${idx + 1} — click to upload`}
                            </span>
                          </label>
                          {idx === imageInputs.length - 1 ? (
                            <button type="button" onClick={() => setImageInputs(p => [...p, { id: Math.max(...p.map(i => i.id)) + 1 }])} style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: PL, border: `1px solid ${P}33`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: P, fontWeight: 700, fontSize: '18px', flexShrink: 0 }}>+</button>
                          ) : (
                            <button type="button" onClick={() => { setImageInputs(p => p.filter(i => i.id !== input.id)); setFormData(p => ({ ...p, images: p.images.filter(i => i.inputId !== input.id) })); }} style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#fee2e2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <X size={14} color="#dc2626" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #f0ede9' }}>
                <button type="button" onClick={resetForm} style={{ padding: '10px 22px', backgroundColor: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '9px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                >Cancel</button>
                <button type="submit" disabled={loading} style={{ padding: '10px 22px', backgroundColor: loading ? '#d1d5db' : P, color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, fontSize: '13px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 4px 12px rgba(236,91,19,0.3)`, transition: 'opacity 0.15s' }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProducts;
