// src/AdminDashboard/pages/UserServiceSettings/UserServiceSettings.jsx
import React, { useState } from 'react';

const UserServiceSettings = () => {
  const [services, setServices] = useState([
    { name: 'Crop Listing', description: 'Add, edit, and manage crop products', enabled: true },
    { name: 'Seed & Fertilizer Order', description: 'Order seeds, fertilizers, and pesticides', enabled: false },
    { name: 'Equipment Rental', description: 'Rent tractors and farming equipment', enabled: true },
    { name: 'Soil Testing', description: 'Request soil quality testing service', enabled: false },
    { name: 'Payout / Settlement', description: 'Receive payments for crop sales', enabled: false },
  ]);

  const toggleService = (index) => {
    setServices(prev =>
      prev.map((service, i) =>
        i === index ? { ...service, enabled: !service.enabled } : service
      )
    );
  };

  return (
    <>
      <style jsx>{`
        .settings-container {
          padding: 40px 20px;
          background-color: #f7f9fc;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .content {
          max-width: 1000px;
          margin: 0 auto;
        }

        .title {
          font-size: 28px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 32px;
        }

        .card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .card-header {
          margin-bottom: 24px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 8px;
        }

        .card-description {
          font-size: 14px;
          color: #718096;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead th {
          text-align: left;
          padding: 16px 0;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
        }

        tbody td {
          padding: 20px 0;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        .service-name {
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
        }

        .service-desc {
          font-size: 14px;
          color: #718096;
          margin-top: 4px;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 500;
        }

        .status-enabled { color: #54CF17; }
        .status-disabled { color: #ef4444; }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot-enabled { background-color: #54CF17; }
        .dot-disabled { background-color: #ef4444; }

        /* Toggle Switch */
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 56px;
          height: 30px;
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
          transition: 0.3s;
          border-radius: 30px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 24px;
          width: 24px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #54CF17;
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        @media (max-width: 768px) {
          table, thead, tbody, th, td, tr { display: block; }
          thead tr { position: absolute; top: -9999px; left: -9999px; }
          tr { padding: 20px 0; border-bottom: 2px solid #e2e8f0; }
          td {
            padding: 12px 0;
            position: relative;
            padding-left: 50%;
            text-align: right;
          }
          td:before {
            content: attr(data-label);
            position: absolute;
            left: 0;
            width: 50%;
            padding-left: 16px;
            font-weight: 600;
            color: #4a5568;
            text-align: left;
          }
          .toggle-switch {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      `}</style>

      <div className="settings-container">
        <div className="content">
          <h1 className="title">User Service Settings</h1>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Service Control</h2>
              <p className="card-description">
                Enable or disable services for the selected user
              </p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={index}>
                    <td data-label="Service Name">
                      <div className="service-name">{service.name}</div>
                    </td>
                    <td data-label="Description">
                      <div className="service-desc">{service.description}</div>
                    </td>
                    <td data-label="Status">
                      <div className={`status ${service.enabled ? 'status-enabled' : 'status-disabled'}`}>
                        <span className={`dot ${service.enabled ? 'dot-enabled' : 'dot-disabled'}`}></span>
                        {service.enabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </td>
                    <td data-label="Action">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={service.enabled}
                          onChange={() => toggleService(index)}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserServiceSettings;