import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import lookupService from '../../../services/lookupService';
import agentService from '../../../services/agentService';

const RegisterBankForm = () => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [bankNames, setBankNames] = useState([]);
  const [formData, setFormData] = useState({
    accountType: '',
    contactNo: '',
    accountHolderName: '',
    bankAccountNo: '',
    confirmBankAccountNo: '',
    bankName: '',
    ifscCode: '',
    panNo: ''
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
    
    if (formData.bankAccountNo !== formData.confirmBankAccountNo) {
      toast.error('Bank account numbers do not match');
      return;
    }
    
    try {
      const payload = {
        bankId: 0,
        bankNameId: parseInt(formData.bankName),
        holderName: formData.accountHolderName,
        accountNo: formData.bankAccountNo,
        ifscCode: formData.ifscCode,
        acTypeId: parseInt(formData.accountType),
        isVerified: false,
        panNo: formData.panNo,
        contactNo: formData.contactNo
      };
      
      const response = await agentService.submitUpdateBankDetails(payload);
      
      if (response && response.status === 1) {
        toast.success(response.message || 'Bank registered successfully!');
        setFormData({
          accountType: '',
          contactNo: '',
          accountHolderName: '',
          bankAccountNo: '',
          confirmBankAccountNo: '',
          bankName: '',
          ifscCode: '',
          panNo: ''
        });
      } else {
        toast.error(response.message || 'Failed to register bank');
      }
    } catch (error) {
      console.error('Error registering bank:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to register bank';
      toast.error(errorMessage);
    }
  };

  const handleVerifyBeneficiary = () => {
    if (!formData.bankAccountNo || !formData.ifscCode) {
      toast.error('Please fill bank account number and IFSC code');
      return;
    }
    toast.success('Beneficiary verified successfully!');
  };

  const handleCancel = () => {
    setFormData({
      accountType: '',
      contactNo: '',
      accountHolderName: '',
      bankAccountNo: '',
      confirmBankAccountNo: '',
      bankName: '',
      ifscCode: '',
      panNo: ''
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
          <label style={styles.label}>Confirm Bank A/C No.</label>
          <input 
            style={styles.input}
            name="confirmBankAccountNo"
            value={formData.confirmBankAccountNo}
            onChange={handleInputChange}
            placeholder="Confirm bank account number"
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
            <option value="">Search Bank Name</option>
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
          <label style={styles.label}>PAN Number</label>
          <input 
            style={styles.input}
            name="panNo"
            value={formData.panNo}
            onChange={handleInputChange}
            placeholder="Enter PAN number"
            required
          />
        </div>

        <div style={styles.buttonRow}>
          <button type="button" style={styles.cancelBtn} onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" style={styles.submitBtn}>
            Register Beneficiary
          </button>
          <button type="button" style={styles.verifyBtn} onClick={handleVerifyBeneficiary}>
            Verify Beneficiary
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
  },
  verifyBtn: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: '1px solid #10b981',
    background: 'white',
    color: '#10b981',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

export default RegisterBankForm;