// AgentProducts.jsx
import React, { useState, useEffect } from 'react';
import { Download, Search, X, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import productService from '../../../services/productService';
import lookupService from '../../../services/lookupService';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../../components/Pagination/Pagination';

const AgentProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [productStatuses, setProductStatuses] = useState([]);
  const [statusIds, setStatusIds] = useState({ pending: null, approved: null, rejected: null });

  useEffect(() => {
    fetchProductStatuses();
    fetchProducts();
  }, []);

  const fetchProductStatuses = async () => {
    try {
      const response = await lookupService.getProductStatusTypes();
      if (response && response.status === 1 && response.result) {
        setProductStatuses(response.result);
        const ids = {};
        response.result.forEach(status => {
          if (status.statusValue === 'Pending') ids.pending = status.statusId;
          if (status.statusValue === 'Approved') ids.approved = status.statusId;
          if (status.statusValue === 'Rejected') ids.rejected = status.statusId;
        });
        setStatusIds(ids);
      }
    } catch (error) {
      console.error('Error fetching product statuses:', error);
    }
  };

  const fetchProducts = async (statusId = null) => {
    try {
      setLoading(true);
      const response = await productService.getProducts();
      if (response && response.status === 1 && response.result) {
        let filteredProducts = response.result;
        if (statusId) {
          filteredProducts = response.result.filter(p => p.statusId === statusId);
        }
        setProducts(filteredProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch products';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (filter) => {
    setStatusFilter(filter);
    if (filter === 'all') {
      fetchProducts();
    } else if (filter === 'pending') {
      fetchProducts(statusIds.pending);
    } else if (filter === 'approved') {
      fetchProducts(statusIds.approved);
    } else if (filter === 'rejected') {
      fetchProducts(statusIds.rejected);
    }
  };

  const handleApproveReject = async (productId, statusId) => {
    try {
      setLoading(true);
      const response = await productService.approveRejectProduct(productId, statusId);
      if (response && response.status === 1) {
        toast.success(response.message || 'Product status updated successfully');
        fetchProducts(statusFilter === 'all' ? null : statusIds[statusFilter]);
      } else {
        toast.error(response.message || 'Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update product status';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Group products by createdBy (agent)
  const groupedByAgent = products.reduce((acc, product) => {
    const agentId = product.createdBy;
    if (!acc[agentId]) {
      acc[agentId] = {
        agentId: agentId,
        agentName: `Agent ${agentId}`,
        products: [],
        totalProducts: 0,
        totalPrice: 0
      };
    }
    acc[agentId].products.push(product);
    acc[agentId].totalProducts += 1;
    acc[agentId].totalPrice += parseFloat(product.finalPrice || 0);
    return acc;
  }, {});

  const agentRecords = Object.values(groupedByAgent);

  const openModal = (agent) => {
    setSelectedAgent(agent);
  };

  const closeModal = () => {
    setSelectedAgent(null);
  };

  const filteredRecords = agentRecords.filter(agent => {
    const matchesSearch = agent.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const { currentPage, totalPages, currentRecords, handlePageChange } = usePagination(filteredRecords, 5);

  const handleExportToExcel = () => {
    try {
      const exportData = [];
      
      agentRecords.forEach(agent => {
        exportData.push({
          'Agent ID': agent.agentId,
          'Agent Name': agent.agentName,
          'Total Products': agent.totalProducts,
          'Total Price': `₹${agent.totalPrice.toFixed(2)}`,
          'Product Name': '',
          'Category': '',
          'Price': '',
          'Final Price': '',
          'Status': ''
        });
        
        agent.products.forEach(product => {
          exportData.push({
            'Agent ID': '',
            'Agent Name': '',
            'Total Products': '',
            'Total Price': '',
            'Product Name': product.productName,
            'Category': product.categoryName || 'N/A',
            'Price': `₹${product.price}`,
            'Final Price': `₹${product.finalPrice}`,
            'Status': product.statusName || 'Pending'
          });
        });
        
        exportData.push({
          'Agent ID': '',
          'Agent Name': '',
          'Total Products': '',
          'Total Price': '',
          'Product Name': '',
          'Category': '',
          'Price': '',
          'Final Price': '',
          'Status': ''
        });
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Agent Products');
      
      const fileName = `Agent_Products_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export data');
    }
  };

  return (
    <>
      <style>{`
        .agent-products-page {
          padding: 24px 32px;
          background: #f5f7fa;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 15px;
          margin: 0;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .export-btn:hover { background: #059669; }

        .filter-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .status-btn {
          padding: 8px 20px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.15s;
        }

        .status-btn.all     { background: #e5e7eb; color: #374151; }
        .status-btn.pending  { background: #fef3c7; color: #92400e; }
        .status-btn.rejected { background: #fee2e2; color: #991b1b; }
        .status-btn.approved { background: #d1fae5; color: #065f46; }

        .status-btn.active {
          box-shadow: 0 0 0 3px rgba(16,185,129,0.3);
        }

        .search-wrapper {
          flex: 1;
          min-width: 280px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          overflow-x: auto;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          min-width: 900px;
        }

        .table th, .table td {
          padding: 16px 20px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        .table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
          white-space: nowrap;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-pending  { background: #fef3c7; color: #92400e; }
        .status-approved { background: #d1fae5; color: #065f46; }
        .status-rejected { background: #fee2e2; color: #991b1b; }

        .view-btn {
          color: #3b82f6;
          background: none;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }

        .action-btn {
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          margin-right: 6px;
          white-space: nowrap;
        }

        .action-btn:last-child {
          margin-right: 0;
        }

        .actions-row {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .approve-btn { background: #10b981; color: white; }
        .approve-btn:disabled { background: #9ca3af; cursor: not-allowed; opacity: 0.6; }
        .reject-btn  { background: #ef4444; color: white; }
        .reject-btn:disabled { background: #9ca3af; cursor: not-allowed; opacity: 0.6; }
        .pending-btn { background: #f59e0b; color: white; }
        .pending-btn:disabled { background: #9ca3af; cursor: not-allowed; opacity: 0.6; }
        .view-only   { background: #6b7280; color: white; cursor: default; }
        .view-reason { background: #f59e0b; color: white; }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #64748b;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-table {
          width: 100%;
          border-collapse: collapse;
        }

        .modal-table th,
        .modal-table td {
          padding: 14px 16px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
        }

        .product-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .remove-btn {
          color: #ef4444;
          background: none;
          border: none;
          cursor: pointer;
        }
      `}</style>

      <div className="agent-products-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Agent Product</h1>
            <p className="page-subtitle">
              Review and approve products purchased by agents
            </p>
          </div>

          <button className="export-btn" onClick={handleExportToExcel}>
            <Download size={18} />
            Export
          </button>
        </div>

        <div className="filter-bar">
          <button 
            className={`status-btn all ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleStatusFilter('all')}
          >
            All
          </button>
          <button 
            className={`status-btn pending ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => handleStatusFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`status-btn rejected ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => handleStatusFilter('rejected')}
          >
            Rejected
          </button>
          <button 
            className={`status-btn approved ${statusFilter === 'approved' ? 'active' : ''}`}
            onClick={() => handleStatusFilter('approved')}
          >
            Approved
          </button>

          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search Agent Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Agent ID</th>
                <th>Agent Name</th>
                <th>Total Products</th>
                <th>Total Price</th>
                <th>Access</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                    Loading products...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                    No products found
                  </td>
                </tr>
              ) : (
                currentRecords.map((agent, index) => (
                  <tr key={index}>
                    <td>{agent.agentId}</td>
                    <td>{agent.agentName}</td>
                    <td>{agent.totalProducts}</td>
                    <td>₹{agent.totalPrice.toFixed(2)}</td>
                    <td>
                      <button 
                        className="view-btn"
                        onClick={() => openModal(agent)}
                      >
                        View Products
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Modal */}
        {selectedAgent && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {selectedAgent.agentName} - Products ({selectedAgent.totalProducts})
                </h2>
                <button className="close-btn" onClick={closeModal}>
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Final Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAgent.products.map((product, idx) => {
                      const isApproved = product.statusId === statusIds.approved;
                      const isRejected = product.statusId === statusIds.rejected;
                      const isPending = product.statusId === statusIds.pending;
                      
                      return (
                        <tr key={idx}>
                          <td>{product.productName}</td>
                          <td>{product.categoryName || 'N/A'}</td>
                          <td>₹{product.price}</td>
                          <td>₹{product.finalPrice}</td>
                          <td>
                            <span className={`status-badge status-${product.statusName?.toLowerCase() || 'pending'}`}>
                              {product.statusName || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <div className="actions-row">
                              <button 
                                className="action-btn approve-btn"
                                onClick={() => handleApproveReject(product.productId, statusIds.approved)}
                                disabled={loading || isApproved}
                              >
                                Approve
                              </button>
                              <button 
                                className="action-btn pending-btn"
                                onClick={() => handleApproveReject(product.productId, statusIds.pending)}
                                disabled={loading || isPending}
                              >
                                Pending
                              </button>
                              <button 
                                className="action-btn reject-btn"
                                onClick={() => handleApproveReject(product.productId, statusIds.rejected)}
                                disabled={loading || isRejected}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AgentProducts;