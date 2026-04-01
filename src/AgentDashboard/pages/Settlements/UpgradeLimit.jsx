import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import lookupService from '../../../services/lookupService';

const UpgradeLimit = () => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [bankNames, setBankNames] = useState([]);
  const [formData, setFormData] = useState({
    accountType: '',
    bankAccountNo: '',
    contactNo: '',
    bankName: '',
    ifscCode: '',
    accountHolderName: '',
    panNumber: ''
  });

  useEffect(() => {
    fetchAccountTypes();
    fetchBankNames();
  }, []);

  const fetchAccountTypes = async () => {
    try {
      const response = await lookupService.getAccountTypes();
      if (response && response.status === 1 && response.result) {
        setAccountTypes(response.result);
      }
    } catch (error) {
      console.error('Error fetching account types:', error);
    }
  };

  const fetchBankNames = async () => {
    try {
      const response = await lookupService.getBankNames();
      if (response && response.status === 1 && response.result) {
        setBankNames(response.result);
      }
    } catch (error) {
      console.error('Error fetching bank names:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulate API call
      console.log('Upgrading limit with data:', formData);
      toast.success('Limit upgrade request submitted successfully!');
      
      // Reset form
      setFormData({
        accountType: '',
        bankAccountNo: '',
        contactNo: '',
        bankName: '',
        ifscCode: '',
        accountHolderName: '',
        panNumber: ''
      });
    } catch (error) {
      console.error('Error upgrading limit:', error);
      toast.error('Failed to submit limit upgrade request');
    }
  };

  const handleCancel = () => {
    setFormData({
      accountType: '',
      bankAccountNo: '',
      contactNo: '',
      bankName: '',
      ifscCode: '',
      accountHolderName: '',
      panNumber: ''
    });
    toast.info('Form cancelled');
  };
  return (
    <div style={styles.card}>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Settlement Account Type</label>
          <select 
            style={styles.input}
            name="accountType"
            value={formData.accountType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Account Type</option>
            {accountTypes.map((type) => (
              <option key={type.statusId} value={type.statusId}>
                {type.statusValue}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Bank A/C No.</label>
          <input 
            style={styles.input}
            name="bankAccountNo"
            value={formData.bankAccountNo}
            onChange={handleInputChange}
            placeholder="Enter bank account number"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Contact No.</label>
          <input 
            style={styles.input}
            name="contactNo"
            value={formData.contactNo}
            onChange={handleInputChange}
            placeholder="Enter contact number"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Bank Name</label>
          <select 
            style={styles.input}
            name="bankName"
            value={formData.bankName}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Bank Name</option>
            {bankNames.map((bank) => (
              <option key={bank.statusId} value={bank.statusId}>
                {bank.statusValue}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>IFSC Code</label>
          <input 
            style={styles.input}
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleInputChange}
            placeholder="Enter IFSC code"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>A/C Holder Name</label>
          <input 
            style={styles.input}
            name="accountHolderName"
            value={formData.accountHolderName}
            onChange={handleInputChange}
            placeholder="Enter account holder name"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>PAN Number</label>
          <input 
            style={styles.input}
            name="panNumber"
            value={formData.panNumber}
            onChange={handleInputChange}
            placeholder="Enter PAN number"
            required
          />
        </div>

        <div style={styles.note}>
          Note: Enter 10 digit PAN Number as per your Bank Account
        </div>

        <div style={styles.buttonRow}>
          <button type="button" style={styles.cancelBtn} onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" style={styles.submitBtn}>
            Submit
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
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    maxWidth: '700px'
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
  note: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '12px',
    marginBottom: '20px',
    fontWeight: '500'
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

export default UpgradeLimit;