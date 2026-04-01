import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import api from '../../../services/api';

const Settlement = () => {
  const [bankDetails, setBankDetails] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [transferModes, setTransferModes] = useState([]);
  const [walletDetails, setWalletDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    totalAmount: '',
    finalAmount: '',
    transactionModeId: ''
  });

  useEffect(() => {
    fetchBankDetails();
    fetchTransferModes();
    loadWalletDetails();
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

  const fetchTransferModes = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await api.get('/lookup/loadTransferModes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response && response.status === 1 && response.result) {
        setTransferModes(response.result);
      }
    } catch (error) {
      console.error('Error fetching transfer modes:', error);
    }
  };

  const loadWalletDetails = () => {
    const wallet = sessionStorage.getItem('walletDetails');
    if (wallet) {
      setWalletDetails(JSON.parse(wallet));
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBank) {
      toast.error('Please select a bank account');
      return;
    }

    if (!formData.totalAmount || !formData.finalAmount || !formData.transactionModeId) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const payload = {
        bankId: selectedBank.bankId,
        gatewayId: 1,
        totalAmount: parseFloat(formData.totalAmount),
        finalAmount: parseFloat(formData.finalAmount),
        transactionModeId: parseInt(formData.transactionModeId)
      };

      const response = await api.post('/payment/initiatePayoutProcess', payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response && response.status === 1) {
        toast.success('Settlement processed successfully!');
        handleCancel();
      } else {
        toast.error(response.message || 'Failed to process settlement');
      }
    } catch (error) {
      console.error('Error processing settlement:', error);
      toast.error('Failed to process settlement');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSearchTerm('');
    setSelectedBank(null);
    setFormData({
      totalAmount: '',
      finalAmount: '',
      transactionModeId: ''
    });
    toast.info('Form cancelled');
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Settlement Request</h2>
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
            <div style={styles.row}>
              <div style={styles.col}>
                <label style={styles.label}>Settlement Account Type</label>
                <input
                  style={{...styles.input, backgroundColor: '#f3f4f6', cursor: 'not-allowed'}}
                  value={selectedBank.acTypeName}
                  disabled
                />
              </div>
              <div style={styles.col}>
                <label style={styles.label}>Bank A/C No.</label>
                <input
                  style={{...styles.input, backgroundColor: '#f3f4f6', cursor: 'not-allowed'}}
                  value={selectedBank.accountNo}
                  disabled
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.col}>
                <label style={styles.label}>Contact No.</label>
                <input
                  style={{...styles.input, backgroundColor: '#f3f4f6', cursor: 'not-allowed'}}
                  value={selectedBank.contactNo}
                  disabled
                />
              </div>
              <div style={styles.col}>
                <label style={styles.label}>Bank Name</label>
                <input
                  style={{...styles.input, backgroundColor: '#f3f4f6', cursor: 'not-allowed'}}
                  value={selectedBank.bankName}
                  disabled
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.col}>
                <label style={styles.label}>IFSC Code</label>
                <input
                  style={{...styles.input, backgroundColor: '#f3f4f6', cursor: 'not-allowed'}}
                  value={selectedBank.ifscCode}
                  disabled
                />
              </div>
              <div style={styles.col}>
                <label style={styles.label}>Total Settlement Balance</label>
                <input
                  style={{...styles.input, backgroundColor: '#f3f4f6', cursor: 'not-allowed'}}
                  value={walletDetails?.netBalance || '0.00'}
                  disabled
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.col}>
                <label style={styles.label}>Total Amount <span style={{color: '#ef4444'}}>*</span></label>
                <input
                  type="number"
                  style={styles.input}
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  placeholder="Enter total amount"
                  required
                />
              </div>
              <div style={styles.col}>
                <label style={styles.label}>Final Amount <span style={{color: '#ef4444'}}>*</span></label>
                <input
                  type="number"
                  style={styles.input}
                  name="finalAmount"
                  value={formData.finalAmount}
                  onChange={handleInputChange}
                  placeholder="Enter final amount"
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Transfer Mode <span style={{color: '#ef4444'}}>*</span></label>
              <select
                style={styles.input}
                name="transactionModeId"
                value={formData.transactionModeId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Transfer Mode</option>
                {transferModes.map((mode) => (
                  <option key={mode.statusId} value={mode.statusId}>
                    {mode.statusValue}
                  </option>
                ))}
              </select>
            </div>

            <p style={styles.warning}>
              You cannot make any settlement exceeding your Total Settlement Balance
            </p>
          </>
        )}

        <div style={styles.buttonRow}>
          <button type="button" style={styles.cancelBtn} onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" style={styles.submitBtn} disabled={loading || !selectedBank}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1a1a1a'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px'
  },
  col: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
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
    marginBottom: '20px'
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
  submitBtn: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    background: '#10b981',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

export default Settlement;
