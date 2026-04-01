import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Edit, Trash2 } from 'lucide-react';
import productService from '../../../services/productService';

const AddProductCategory = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showSubCategoryPopup, setShowSubCategoryPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: true
  });
  const [subCategoryFormData, setSubCategoryFormData] = useState({
    categoryId: '',
    name: '',
    description: '',
    status: true
  });

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProductCategories();
      if (response && response.status === 1 && response.result) {
        const parentCategories = response.result.filter(cat => cat.isParent === 1);
        setCategories(parentCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await productService.getAllProductCategories();
      if (response && response.status === 1 && response.result) {
        const subCats = response.result.filter(cat => cat.isParent === 0);
        setSubCategories(subCats);
      }
    } catch (error) {
      console.error('Error fetching sub-categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const categoryData = {
        categoryId: editingCategory ? editingCategory.categoryId : 0,
        parentId: 0,
        categoryName: formData.name,
        categoryDescription: formData.description,
        isParent: true,
        isActive: formData.status
      };
      
      const response = await productService.manageProductCategory(categoryData);
      
      if (response && response.status === 1) {
        await fetchCategories();
        toast.success(editingCategory ? 'Category updated successfully!' : 'Category added successfully!');
        setFormData({ name: '', description: '', status: true });
        setEditingCategory(null);
        setShowPopup(false);
      } else {
        toast.error(response.message || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error saving category';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const subCategoryData = {
        categoryId: editingSubCategory ? editingSubCategory.categoryId : 0,
        parentId: parseInt(subCategoryFormData.categoryId),
        categoryName: subCategoryFormData.name,
        categoryDescription: subCategoryFormData.description,
        isParent: false,
        isActive: subCategoryFormData.status
      };
      
      const response = await productService.manageProductCategory(subCategoryData);
      
      if (response && response.status === 1) {
        await fetchSubCategories();
        toast.success(editingSubCategory ? 'Sub-category updated successfully!' : 'Sub-category added successfully!');
        setSubCategoryFormData({ categoryId: '', name: '', description: '', status: true });
        setEditingSubCategory(null);
        setShowSubCategoryPopup(false);
      } else {
        toast.error(response.message || 'Failed to save sub-category');
      }
    } catch (error) {
      console.error('Error saving sub-category:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error saving sub-category';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.categoryName,
      description: category.categoryDescription,
      status: category.isActive === 1
    });
    setShowPopup(true);
  };

  const handleEditSubCategory = (subCategory) => {
    setEditingSubCategory(subCategory);
    setSubCategoryFormData({
      categoryId: subCategory.parentId.toString(),
      name: subCategory.categoryName,
      description: subCategory.categoryDescription,
      status: subCategory.isActive === 1
    });
    setShowSubCategoryPopup(true);
  };

  const handleDelete = (categoryId) => {
    setDeleteId(categoryId);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = await productService.deleteProductCategory(deleteId);
      if (response && response.status === 1) {
        await fetchCategories();
        await fetchSubCategories();
        toast.success('Category deleted successfully!');
      } else {
        toast.error(response.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error deleting category';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setShowDeletePopup(false);
      setDeleteId(null);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', status: true });
  };

  const handleCloseSubCategoryPopup = () => {
    setShowSubCategoryPopup(false);
    setEditingSubCategory(null);
    setSubCategoryFormData({ categoryId: '', name: '', description: '', status: true });
  };

  const getCategoryName = (parentId) => {
    const category = categories.find(cat => cat.categoryId === parentId);
    return category ? category.categoryName : 'N/A';
  };

  return (
    <>
      <style jsx="true">{`
        .page-container {
          padding: 24px;
          background-color: #f7f9fc;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .page-title {
          font-size: 24px;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
        }
        .add-btn {
          background-color: #10b981;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .add-btn:hover {
          background-color: #059669;
          transform: translateY(-1px);
        }
        .table-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        .table th,
        .table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        .table th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #4a5568;
        }
        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .status-active {
          background-color: #d1fae5;
          color: #065f46;
        }
        .status-inactive {
          background-color: #fee2e2;
          color: #991b1b;
        }
        .action-btn {
          padding: 4px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          margin-right: 8px;
          transition: all 0.2s;
        }
        // .edit-btn {
        //   background-color: #3b82f6;
        //   color: white;
        // }
        // .edit-btn:hover {
        //   background-color: #2563eb;
        // }
        // .delete-btn {
        //   background-color: #ef4444;
        //   color: white;
        // }
        // .delete-btn:hover {
        //   background-color: #dc2626;
        // }
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  z-index: 9999;
}

.popup {
  background: #ffffff;
  width: 650px;
  max-width: 95%;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 6px;
  padding: 24px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  animation: slideUp 0.2s ease-out;
}

.popup-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 18px;
  text-align: left;
}
        .form-group {
          margin-bottom: 20px;
        }

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #495057;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13,110,253,.25);
}
        .form-group textarea {
          height: 80px;
          resize: vertical;
        }
        .toggle-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .toggle-switch {
          position: relative;
          width: 48px;
          height: 24px;
        }
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e0;
          transition: .3s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #10b981;
        }
        input:checked + .slider:before {
          transform: translateX(24px);
        }
        .popup-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .btn-cancel {
          background-color: #f3f4f6;
          color: #6b7280;
          border: 2px solid #e5e7eb;
          padding: 8px 18px;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          background-color: #e5e7eb;
          transform: translateY(-1px);
        }

        .btn-submit {
          background-color: #10b981;
          color: white;
          border: 2px solid #10b981;
          padding: 8px 18px;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-submit:hover {
          background-color: #059669;
          border-color: #059669;
          transform: translateY(-1px);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .delete-popup {
          background: white;
          border-radius: 12px;
          padding: 24px;
          width: 400px;
          max-width: 90vw;
          text-align: center;
        }
        .delete-popup h3 {
          margin: 0 0 16px 0;
          color: #2d3748;
          font-size: 18px;
        }
        .delete-popup p {
          margin: 0 0 24px 0;
          color: #4a5568;
        }
        .btn-no {
          background-color: #e2e8f0;
          color: #4a5568;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-right: 12px;
        }
        .btn-yes {
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Form Validation Styles */
        input:required:invalid:not(:placeholder-shown):not(:focus),
        select:required:invalid:not(:focus),
        textarea:required:invalid:not(:placeholder-shown):not(:focus) {
          border-color: #ef4444;
        }

        input:valid:not(:placeholder-shown),
        select:valid,
        textarea:valid:not(:placeholder-shown) {
          border-color: #10b981;
        }

        input:focus:invalid,
        select:focus:invalid,
        textarea:focus:invalid {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Product Categories</h1>
          <button className="add-btn" onClick={() => setShowPopup(true)}>
            + Add Product Category
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No categories found</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.categoryId}>
                    <td>{category.categoryName || 'Unnamed Category'}</td>
                    <td>{category.categoryDescription || 'No description'}</td>
                    <td>
                      <span className={`status-badge ${category.isActive === 1 ? 'status-active' : 'status-inactive'}`}>
                        {category.isActive === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn edit-btn" onClick={() => handleEdit(category)}>
                        <Edit size={18} />
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(category.categoryId)}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="page-header" style={{ marginTop: '40px' }}>
          <h1 className="page-title">Product Sub-Categories</h1>
          <button className="add-btn" onClick={() => setShowSubCategoryPopup(true)}>
            + Add Sub-Category
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Sub-Category Name</th>
                <th>Parent Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td>
                </tr>
              ) : subCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No sub-categories found</td>
                </tr>
              ) : (
                subCategories.map((subCategory) => (
                  <tr key={subCategory.categoryId}>
                    <td>{subCategory.categoryName || 'Unnamed Sub-Category'}</td>
                    <td>{getCategoryName(subCategory.parentId)}</td>
                    <td>{subCategory.categoryDescription || 'No description'}</td>
                    <td>
                      <span className={`status-badge ${subCategory.isActive === 1 ? 'status-active' : 'status-inactive'}`}>
                        {subCategory.isActive === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn edit-btn" onClick={() => handleEditSubCategory(subCategory)}>
                        <Edit size={18} />
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(subCategory.categoryId)}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showPopup && (
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
              <h2 className="popup-title">{editingCategory ? 'Edit Product Category' : 'Add Product Category'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter category name"
                    required
                    minLength="2"
                  />
                </div>
                <div className="form-group">
                  <label>Category Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter category description (optional)"
                  />
                </div>
                <div className="form-group">
                  <div className="toggle-group">
                    <label>Status</label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked }))}
                      />
                      <span className="slider"></span>
                    </label>
                    <span>{formData.status ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div className="popup-actions">
                  <button type="button" className="btn-cancel" onClick={handleClosePopup}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Add Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeletePopup && (
          <div className="popup-overlay" onClick={() => setShowDeletePopup(false)}>
            <div className="delete-popup" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Category</h3>
              <p>Are you sure you want to delete this category?</p>
              <div>
                <button className="btn-no" onClick={() => setShowDeletePopup(false)}>
                  No
                </button>
                <button className="btn-yes" onClick={confirmDelete} disabled={loading}>
                  {loading ? 'Deleting...' : 'Yes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showSubCategoryPopup && (
          <div className="popup-overlay" onClick={handleCloseSubCategoryPopup}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
              <h2 className="popup-title">{editingSubCategory ? 'Edit Sub-Category' : 'Add Sub-Category'}</h2>
              <form onSubmit={handleSubCategorySubmit}>
                <div className="form-group">
                  <label>Parent Category *</label>
                  <select
                    value={subCategoryFormData.categoryId}
                    onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '15px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sub-Category Name *</label>
                  <input
                    type="text"
                    value={subCategoryFormData.name}
                    onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter sub-category name"
                    required
                    minLength="2"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={subCategoryFormData.description}
                    onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter description (optional)"
                  />
                </div>
                <div className="form-group">
                  <div className="toggle-group">
                    <label>Status</label>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={subCategoryFormData.status}
                        onChange={(e) => setSubCategoryFormData(prev => ({ ...prev, status: e.target.checked }))}
                      />
                      <span className="slider"></span>
                    </label>
                    <span>{subCategoryFormData.status ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div className="popup-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseSubCategoryPopup}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Saving...' : editingSubCategory ? 'Update Sub-Category' : 'Add Sub-Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddProductCategory;