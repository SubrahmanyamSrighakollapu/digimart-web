import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import api from '../../../services/api';

const DeleteBank = () => {
  const [bankDetails, setBankDetails] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const response = await api.get(`/agents/getBankDetailsByUserId?userId=${user.userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response && response.status === 1 && response.result) {
        setBankDetails(response.result);
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      toast.error('Failed to fetch bank details');
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);

    if (value.trim()) {
      const filtered = bankDetails.filter(bank =>
        bank.holderName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBanks(filtered);
    } else {
      setFilteredBanks([]);
    }
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setSearchTerm(`${bank.holderName} - ${bank.bankName}`);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBank) {
      toast.error('Please select a bank account to delete');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await api.get(`/agents/deleteAgentBankDetail?bankId=${selectedBank.bankId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response && response.status === 1) {
        toast.success('Bank account deleted successfully!');
        setShowConfirmModal(false);
        handleCancel();
        fetchBankDetails(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to delete bank account');
      }
    } catch (error) {
      console.error('Error deleting bank:', error);
      toast.error('Failed to delete bank account');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSearchTerm('');
    setSelectedBank(null);
    setShowConfirmModal(false);
    toast.info('Form cancelled');
  };

  return (
    <>
      <div style={styles.card}>
        <h2 style={styles.title}>Delete Bank Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Account Holder Name Search */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Account Holder Name <span style={{color: '#ef4444'}}>*</span></label>
            <div style={{position: 'relative'}}>
              <input
                style={styles.input}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search account holder name"
                required
              />
              {showDropdown && filteredBanks.length > 0 && (
                <div style={styles.dropdown}>
                  {filteredBanks.map((bank) => (
                    <div
                      key={bank.bankId}
                      style={styles.dropdownItem}
                      onClick={() => handleBankSelect(bank)}
                    >
                      {bank.holderName} - {bank.bankName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedBank && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Settlement Account Type</label>
                <input
                  style={{...styles.input, backgroundColor: '#f3f4f6', cursor: 'not-allowed'}}
                  value={selectedBank.acTypeName}
                  disabled
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Bank A/C No.</label>
                <input
                  style={{...styles.input, backgroundColor: '#f3f4f6', cursor: 'not-allowed'}}
                  value={selectedBank.accountNo}
                  disabled
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Bank Name</label>
                <input
                  style={{...styles.input, backgroundColor: '#f3f4f6', cursor: 'not-allowed'}}
                  value={selectedBank.bankName}
                  disabled
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>IFSC Code</label>
                <input
                  style={{...styles.input, backgroundColor: '#f3f4f6', cursor: 'not-allowed'}}
                  value={selectedBank.ifscCode}
                  disabled
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Contact No.</label>
                <input
                  style={{...styles.input, backgroundColor: '#f3f4f6', cursor: 'not-allowed'}}
                  value={selectedBank.contactNo}
                  disabled
                />
              </div>

              <p style={styles.warning}>
                Warning: This action cannot be undone. Please confirm before deleting this bank account.
              </p>
            </>
          )}

          <div style={styles.buttonRow}>
            <button type="button" style={styles.cancelBtn} onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" style={styles.deleteBtn} disabled={!selectedBank}>
              Delete Bank
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={styles.modalOverlay} onClick={() => setShowConfirmModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Confirm Deletion</h3>
            <p style={styles.modalText}>
              Are you sure you want to delete the bank account for <strong>{selectedBank?.holderName}</strong> 
              ({selectedBank?.accountNo})?
            </p>
            <p style={styles.modalWarning}>This action cannot be undone.</p>
            <div style={styles.modalButtons}>
              <button 
                style={styles.modalCancelBtn} 
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                style={styles.modalDeleteBtn} 
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    maxWidth: '700px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1a1a1a'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#495057'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.2s',
    outline: 'none'
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginTop: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  dropdownItem: {
    padding: '10px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.2s',
    borderBottom: '1px solid #f3f4f6'
  },
  warning: {
    color: '#ef4444',
    fontSize: '13px',
    marginTop: '16px',
    marginBottom: '8px',
    padding: '12px',
    background: '#fef2f2',
    borderRadius: '8px',
    border: '1px solid #fecaca'
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0'
  },
  cancelBtn: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    background: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  deleteBtn: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    background: '#ef4444',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1a1a1a'
  },
  modalText: {
    fontSize: '14px',
    color: '#4a5568',
    marginBottom: '12px',
    lineHeight: '1.5'
  },
  modalWarning: {
    fontSize: '13px',
    color: '#ef4444',
    marginBottom: '24px',
    fontWeight: '500'
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  },
  modalCancelBtn: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    background: 'white',
    fontWeight: '600',
    cursor: 'pointer'
  },
  modalDeleteBtn: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: 'none',
    background: '#ef4444',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default DeleteBank;
