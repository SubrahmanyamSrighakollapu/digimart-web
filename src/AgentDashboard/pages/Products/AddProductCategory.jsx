import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Edit, Trash2, Plus, X, FolderOpen, FolderPlus, Tag } from 'lucide-react';
import productService from '../../../services/productService';

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

const Field = ({ label, required, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label}{required && <span style={{ color: P, marginLeft: '2px' }}>*</span>}
    </label>
    {children}
  </div>
);

const Toggle = ({ checked, onChange, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>{label}</span>
    <label style={{ position: 'relative', display: 'inline-block', width: '42px', height: '22px', cursor: 'pointer', flexShrink: 0 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={{ position: 'absolute', inset: 0, borderRadius: '22px', backgroundColor: checked ? P : '#d1d5db', transition: 'background 0.25s' }} />
      <span style={{ position: 'absolute', top: '2px', left: checked ? '22px' : '2px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white', transition: 'left 0.25s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </label>
    <span style={{ fontSize: '12px', fontWeight: 600, color: checked ? G : '#9ca3af' }}>{checked ? 'Active' : 'Inactive'}</span>
  </div>
);

// Shared modal shell
const Modal = ({ open, onClose, title, icon: Icon, children }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(26,15,10,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(2px)', padding: '16px' }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '16px', width: '520px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(236,91,19,0.15)', border: '1px solid #f0ede9', animation: 'slideUp 0.2s ease-out' }}>
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid #f0ede9', background: `linear-gradient(to right, ${PL}, #fff)`, position: 'sticky', top: 0, zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, ${P}, #F07030)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={14} color="white" />
            </div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1c1917' }}>{title}</h2>
          </div>
          <button onClick={onClose} style={{ width: '30px', height: '30px', borderRadius: '7px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
            <X size={13} />
          </button>
        </div>
        <div style={{ padding: '22px' }}>{children}</div>
      </div>
    </div>
  );
};

// Shared table
const DataTable = ({ headers, children, loading, empty }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#faf8f6' }}>
          {headers.map(h => (
            <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: P, borderBottom: '1px solid #f0ede9', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={headers.length} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Loading...</td></tr>
        ) : empty ? (
          <tr><td colSpan={headers.length}>
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: PL, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <FolderOpen size={22} color={P} />
              </div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1c1917' }}>No items found</p>
            </div>
          </td></tr>
        ) : children}
      </tbody>
    </table>
  </div>
);

const ActionBtns = ({ onEdit, onDelete }) => (
  <div style={{ display: 'flex', gap: '4px' }}>
    <button onClick={onEdit} style={{ width: '30px', height: '30px', borderRadius: '7px', backgroundColor: '#eff6ff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#dbeafe'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#eff6ff'}
    ><Edit size={13} color="#1e40af" /></button>
    <button onClick={onDelete} style={{ width: '30px', height: '30px', borderRadius: '7px', backgroundColor: '#fee2e2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fecaca'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
    ><Trash2 size={13} color="#dc2626" /></button>
  </div>
);

const StatusBadge = ({ active }) => (
  <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, backgroundColor: active ? GL : '#fee2e2', color: active ? G : '#dc2626' }}>
    {active ? 'Active' : 'Inactive'}
  </span>
);

const AddProductCategory = () => {
  const [showPopup, setShowPopup]               = useState(false);
  const [showSubPopup, setShowSubPopup]         = useState(false);
  const [showDeletePopup, setShowDeletePopup]   = useState(false);
  const [deleteId, setDeleteId]                 = useState(null);
  const [categories, setCategories]             = useState([]);
  const [subCategories, setSubCategories]       = useState([]);
  const [loading, setLoading]                   = useState(false);
  const [editingCategory, setEditingCategory]   = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [formData, setFormData]                 = useState({ name: '', description: '', status: true });
  const [subForm, setSubForm]                   = useState({ categoryId: '', name: '', description: '', status: true });

  useEffect(() => { fetchCategories(); fetchSubCategories(); }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await productService.getAllProductCategories();
      if (res?.status === 1 && res.result) setCategories(res.result.filter(c => c.isParent === 1));
    } catch {} finally { setLoading(false); }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await productService.getAllProductCategories();
      if (res?.status === 1 && res.result) setSubCategories(res.result.filter(c => c.isParent === 0));
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await productService.manageProductCategory({ categoryId: editingCategory?.categoryId || 0, parentId: 0, categoryName: formData.name, categoryDescription: formData.description, isParent: true, isActive: formData.status });
      if (res?.status === 1) { toast.success(editingCategory ? 'Category updated!' : 'Category added!'); await fetchCategories(); closePopup(); }
      else toast.error(res.message || 'Failed to save category');
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving category'); }
    finally { setLoading(false); }
  };

  const handleSubSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await productService.manageProductCategory({ categoryId: editingSubCategory?.categoryId || 0, parentId: parseInt(subForm.categoryId), categoryName: subForm.name, categoryDescription: subForm.description, isParent: false, isActive: subForm.status });
      if (res?.status === 1) { toast.success(editingSubCategory ? 'Sub-category updated!' : 'Sub-category added!'); await fetchSubCategories(); closeSubPopup(); }
      else toast.error(res.message || 'Failed to save sub-category');
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving sub-category'); }
    finally { setLoading(false); }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const res = await productService.deleteProductCategory(deleteId);
      if (res?.status === 1) { toast.success('Deleted!'); await fetchCategories(); await fetchSubCategories(); }
      else toast.error(res.message || 'Failed to delete');
    } catch (err) { toast.error(err.response?.data?.message || 'Error deleting'); }
    finally { setLoading(false); setShowDeletePopup(false); setDeleteId(null); }
  };

  const closePopup    = () => { setShowPopup(false); setEditingCategory(null); setFormData({ name: '', description: '', status: true }); };
  const closeSubPopup = () => { setShowSubPopup(false); setEditingSubCategory(null); setSubForm({ categoryId: '', name: '', description: '', status: true }); };

  const handleEdit = (cat) => { setEditingCategory(cat); setFormData({ name: cat.categoryName, description: cat.categoryDescription, status: cat.isActive === 1 }); setShowPopup(true); };
  const handleEditSub = (sub) => { setEditingSubCategory(sub); setSubForm({ categoryId: sub.parentId.toString(), name: sub.categoryName, description: sub.categoryDescription, status: sub.isActive === 1 }); setShowSubPopup(true); };
  const getCategoryName = (parentId) => categories.find(c => c.categoryId === parentId)?.categoryName || 'N/A';

  const SectionHeader = ({ title, count, onAdd, btnLabel, icon: Icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: `linear-gradient(135deg, ${P}, #F07030)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color="white" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1c1917' }}>{title}</h2>
          <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{count} items</p>
        </div>
      </div>
      <button onClick={onAdd} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', backgroundColor: P, color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', boxShadow: `0 4px 12px rgba(236,91,19,0.28)`, transition: 'opacity 0.15s, transform 0.1s' }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <Plus size={14} /> {btnLabel}
      </button>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Categories */}
      <div>
        <SectionHeader title="Product Categories" count={categories.length} onAdd={() => setShowPopup(true)} btnLabel="Add Category" icon={FolderPlus} />
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #f0ede9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <DataTable headers={['Category Name', 'Description', 'Status', 'Actions']} loading={loading} empty={categories.length === 0}>
            {categories.map((cat, i) => (
              <tr key={cat.categoryId} style={{ borderBottom: i < categories.length - 1 ? '1px solid #faf8f6' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#faf8f6'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '13px 18px', fontWeight: 700, color: '#1c1917', fontSize: '13px' }}>{cat.categoryName || '—'}</td>
                <td style={{ padding: '13px 18px', color: '#6b7280', fontSize: '13px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.categoryDescription || '—'}</td>
                <td style={{ padding: '13px 18px' }}><StatusBadge active={cat.isActive === 1} /></td>
                <td style={{ padding: '13px 18px' }}><ActionBtns onEdit={() => handleEdit(cat)} onDelete={() => { setDeleteId(cat.categoryId); setShowDeletePopup(true); }} /></td>
              </tr>
            ))}
          </DataTable>
        </div>
      </div>

      {/* Sub-Categories */}
      <div>
        <SectionHeader title="Product Sub-Categories" count={subCategories.length} onAdd={() => setShowSubPopup(true)} btnLabel="Add Sub-Category" icon={Tag} />
        <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #f0ede9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <DataTable headers={['Sub-Category Name', 'Parent Category', 'Description', 'Status', 'Actions']} loading={loading} empty={subCategories.length === 0}>
            {subCategories.map((sub, i) => (
              <tr key={sub.categoryId} style={{ borderBottom: i < subCategories.length - 1 ? '1px solid #faf8f6' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#faf8f6'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '13px 18px', fontWeight: 700, color: '#1c1917', fontSize: '13px' }}>{sub.categoryName || '—'}</td>
                <td style={{ padding: '13px 18px' }}><span style={{ padding: '3px 10px', backgroundColor: PL, color: P, borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>{getCategoryName(sub.parentId)}</span></td>
                <td style={{ padding: '13px 18px', color: '#6b7280', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.categoryDescription || '—'}</td>
                <td style={{ padding: '13px 18px' }}><StatusBadge active={sub.isActive === 1} /></td>
                <td style={{ padding: '13px 18px' }}><ActionBtns onEdit={() => handleEditSub(sub)} onDelete={() => { setDeleteId(sub.categoryId); setShowDeletePopup(true); }} /></td>
              </tr>
            ))}
          </DataTable>
        </div>
      </div>

      {/* Category Modal */}
      <Modal open={showPopup} onClose={closePopup} title={editingCategory ? 'Edit Category' : 'Add Category'} icon={FolderPlus}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Field label="Category Name" required>
            <input name="name" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Grains & Cereals" style={inp} onFocus={focusStyle} onBlur={blurStyle} required minLength={2} />
          </Field>
          <Field label="Description">
            <textarea name="description" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Describe this category (optional)" rows={3} style={{ ...inp, resize: 'vertical', minHeight: '72px' }} onFocus={focusStyle} onBlur={blurStyle} />
          </Field>
          <Toggle checked={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.checked }))} label="Status" />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '14px', borderTop: '1px solid #f0ede9' }}>
            <button type="button" onClick={closePopup} style={{ padding: '9px 20px', backgroundColor: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '9px 20px', backgroundColor: loading ? '#d1d5db' : P, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 4px 12px rgba(236,91,19,0.28)` }}>
              {loading ? 'Saving...' : editingCategory ? 'Update' : 'Add Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Sub-Category Modal */}
      <Modal open={showSubPopup} onClose={closeSubPopup} title={editingSubCategory ? 'Edit Sub-Category' : 'Add Sub-Category'} icon={Tag}>
        <form onSubmit={handleSubSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Field label="Parent Category" required>
            <select value={subForm.categoryId} onChange={e => setSubForm(p => ({ ...p, categoryId: e.target.value }))} style={inp} onFocus={focusStyle} onBlur={blurStyle} required>
              <option value="">Select Parent Category</option>
              {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
            </select>
          </Field>
          <Field label="Sub-Category Name" required>
            <input value={subForm.name} onChange={e => setSubForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Basmati Rice" style={inp} onFocus={focusStyle} onBlur={blurStyle} required minLength={2} />
          </Field>
          <Field label="Description">
            <textarea value={subForm.description} onChange={e => setSubForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe this sub-category (optional)" rows={3} style={{ ...inp, resize: 'vertical', minHeight: '72px' }} onFocus={focusStyle} onBlur={blurStyle} />
          </Field>
          <Toggle checked={subForm.status} onChange={e => setSubForm(p => ({ ...p, status: e.target.checked }))} label="Status" />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '14px', borderTop: '1px solid #f0ede9' }}>
            <button type="button" onClick={closeSubPopup} style={{ padding: '9px 20px', backgroundColor: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '9px 20px', backgroundColor: loading ? '#d1d5db' : P, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 4px 12px rgba(236,91,19,0.28)` }}>
              {loading ? 'Saving...' : editingSubCategory ? 'Update' : 'Add Sub-Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      {showDeletePopup && (
        <div onClick={() => setShowDeletePopup(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(26,15,10,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(2px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '380px', maxWidth: '90vw', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={22} color="#dc2626" />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#1c1917' }}>Delete Category</h3>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b7280', lineHeight: 1.5 }}>Are you sure you want to delete this category? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowDeletePopup(false)} style={{ padding: '10px 24px', backgroundColor: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmDelete} disabled={loading} style={{ padding: '10px 24px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductCategory;
