import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterBankForm from "./RegisterBankForm";
import Settlement from "./Settlement";
import DeleteBank from "./DeleteBank";
import UpgradeLimit from "./UpgradeLimit";

const Settlements = () => {
  const [activeTab, setActiveTab] = useState("register");

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Settlements</h2>
        <p style={styles.subtitle}>Manage your bank accounts and settlement transactions</p>
      </div>
      
      <div style={styles.tabContainer}>
        <TabButton
          label="REGISTER BANK"
          active={activeTab === "register"}
          onClick={() => setActiveTab("register")}
        />
        <TabButton
          label="SETTLEMENT"
          active={activeTab === "settlement"}
          onClick={() => setActiveTab("settlement")}
        />
        <TabButton
          label="DELETE BANK"
          active={activeTab === "delete"}
          onClick={() => setActiveTab("delete")}
        />
        <TabButton
          label="UPGRADE LIMIT"
          active={activeTab === "upgrade"}
          onClick={() => setActiveTab("upgrade")}
        />
      </div>

      <div style={styles.content}>
        {activeTab === "register" && <RegisterBankForm />}
        {activeTab === "settlement" && <Settlement />}
        {activeTab === "delete" && <DeleteBank />}
        {activeTab === "upgrade" && <UpgradeLimit />}
      </div>
    </div>
  );
};

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      ...styles.tabButton,
      ...(active ? styles.tabButtonActive : {})
    }}
  >
    {label}
  </button>
);

const styles = {
  container: {
    padding: '24px',
    backgroundColor: '#f7f9fc',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  header: {
    marginBottom: '24px',
    width: '100%',
    maxWidth: '800px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2d3748',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  tabContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '800px',
    justifyContent: 'center'
  },
  tabButton: {
    padding: '10px 20px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#4a5568'
  },
  tabButtonActive: {
    background: '#10b981',
    color: 'white',
    borderColor: '#10b981'
  },
  content: {
    width: '100%',
    maxWidth: '800px'
  }
};

export default Settlements;