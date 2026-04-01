import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import calendar from "../../../assets/AgentDashboard/Dashboard/calender.png";
import orders from "../../../assets/AgentDashboard/Dashboard/orders.png";
import revenue from "../../../assets/AgentDashboard/Dashboard/revenue.png";
import farmer from "../../../assets/AgentDashboard/Dashboard/farmer.png";
import agent from "../../../assets/AgentDashboard/Dashboard/agent.png";

import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

const Reports = () => {
  const pieData = {
    datasets: [
      {
        data: [20, 20, 60],
        backgroundColor: ["#FFC533", "#FF5F8A", "#7A49E5"],
        borderWidth: 0,
        cutout: "70%",
        rotation: -60,
      },
    ],
  };

  const pieOptions = {
    responsive: false,
    plugins: { legend: { display: false } },
  };

  return (
    <div style={pageWrapper}>
      <div style={container}>
        <h4>Transaction reports</h4>
        {/* <p style={{ color: "#777", marginBottom: 24 }}>
          Track performance, financials, and business growth insights.
        </p> */}

        <div style={filterBar}>
          <DateRangeInput label="Date range" icon={calendar} />
          <Input label="Crop Type" placeholder="Enter the crop type" />
          <Select label="Farmer / Agent" />
          <Input label="Region" placeholder="Enter Region" />
        </div>

        <div style={kpiRow}>
          <KPI title="Total Orders" value="1234" percent="10%" img={orders} color="#1b5e20" />
          <KPI title="Total revenue" value="₹ 98,000" percent="12%" img={revenue} color="#f9a825" />
          <KPI title="Farmer payments" value="₹ 57,000" percent="5%" img={farmer} color="#1e88e5" />
          <KPI title="Agent margin" value="₹ 80,000" percent="10%" img={agent} color="#8e24aa" />
        </div>

        <div style={tableRow}>
          <Table
            title="Recent Transactions"
            headers={["Transaction ID", "Order ID", "Agent", "Product", "Amount", "Payment Mode", "Status", "Date"]}
            rows={[
              ["TXN001", "ORD123", "Ramesh Kumar", "Basmati Rice", "₹ 15,000", "UPI", "Completed", "2024-01-15"],
              ["TXN002", "ORD124", "Suresh Patel", "Wheat", "₹ 8,500", "Bank Transfer", "Pending", "2024-01-14"],
              ["TXN003", "ORD125", "Mahesh Singh", "Toor Dal", "₹ 12,300", "Cash", "Completed", "2024-01-13"]
            ]}
          />
        </div>

        <div style={twoColGrid}>
          <div style={card}>
            <CardHeader title="Crop-wise Sales" />
            <div style={{ padding: 16 }}>
              <CropRow label="Basmati Rice" value="8 Tons" percent="80%" color="#4CAF50" />
              <CropRow label="Toor Dal" value="5 Tons" percent="55%" color="#F44336" />
              <CropRow label="Wheat" value="3 Tons" percent="35%" color="#006064" />
            </div>
          </div>

          <div style={revenueCard}>
            <h4>Revenue Split</h4>
            <p style={{ fontSize: 13, color: "#777", marginBottom: 24 }}>
              Breakdown of earnings distribution
            </p>

            <div style={revenueGrid}>
              <Doughnut data={pieData} options={pieOptions} width={205} height={205} />
              <div>
                <Legend color="#FFC533" text="Farmer payout" value="20%" />
                <Legend color="#FF5F8A" text="Agent margin" value="20%" />
                <Legend color="#7A49E5" text="Platform fees" value="60%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardHeader = ({ title }) => (
  <div
    style={{
      height: 48,
      padding: "12px 16px",
      borderBottom: "1px solid #ddd",
      fontWeight: 600,
      fontSize: 16,
    }}
  >
    {title}
  </div>
);

const KPI = ({ title, value, percent, img, color }) => (
  <div style={{ ...kpiCard, borderLeft: `4px solid ${color}` }}>
    <img src={img} alt={title} width="20" />
    <div style={trendBadge}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B5E20" strokeWidth="2.5">
        <polyline points="3 17 9 11 13 15 21 7" />
        <polyline points="14 7 21 7 21 14" />
      </svg>
      {percent}
    </div>
    <p style={{ marginTop: 16 }}>{title}</p>
    <h5>{value}</h5>
  </div>
);

const DateRangeInput = ({ label, icon }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <div style={inputBox}>
      <input placeholder="mm/dd/yy" style={inputField} />
      <img src={icon} alt="calendar" width="16" />
    </div>
  </div>
);

const Input = ({ label, placeholder }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input className="form-control" placeholder={placeholder} />
  </div>
);

const Select = ({ label }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <select style={selectStyle}>
      <option>All Agents</option>
    </select>
  </div>
);

const CropRow = ({ label, value, percent, color }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div style={{ height: 8, background: "#eee", borderRadius: 4 }}>
      <div style={{ width: percent, height: 8, background: color, borderRadius: 4 }} />
    </div>
  </div>
);

const Legend = ({ color, text, value }) => (
  <div style={legendRow}>
    <div style={{ ...legendBox, background: color }} />
    <div>{text}</div>
    <div style={{ textAlign: "right", fontWeight: 600 }}>{value}</div>
  </div>
);

const Table = ({ title, headers, rows }) => (
  <div style={tableCard}>
    <div style={tableHeader}>{title}</div>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h} style={tableHead}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j} style={tableCell}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const pageWrapper = {
  background: "#fafaf7",
  minHeight: "100vh",
  overflowX: "hidden",
};

const container = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: 24,
};

const filterBar = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 16,
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 16,
  marginBottom: 32,
};

const kpiRow = { display: "flex", gap: 24, marginBottom: 32 };

const twoColGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 24,
  marginBottom: 32,
};

const card = {
  background: "#fff",
  border: "1px solid #000",
  borderRadius: 10,
};

const revenueCard = {
  background: "#fff",
  border: "1px solid #000",
  borderRadius: 10,
  padding: 24,
};

const revenueGrid = {
  display: "grid",
  gridTemplateColumns: "240px 1fr",
  gap: 40,
  alignItems: "center",
};

const kpiCard = {
  width: 270,
  height: 164,
  background: "#fff",
  borderRadius: 12,
  padding: 16,
  position: "relative",
};

const trendBadge = {
  position: "absolute",
  top: 12,
  right: 12,
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: "#C8E6C9",
  padding: "4px 10px",
  borderRadius: 8,
  fontWeight: 600,
};

const labelStyle = { fontSize: 13, color: "#777" };

const inputBox = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #ced4da",
  borderRadius: 6,
  padding: "0 12px",
  height: 38,
};

const inputField = { border: "none", outline: "none", flex: 1 };

const selectStyle = {
  width: "100%",
  height: 38,
  border: "1px solid #ced4da",
  borderRadius: 6,
  appearance: "none",
};

const legendRow = {
  display: "grid",
  gridTemplateColumns: "56px 1fr 64px",
  alignItems: "center",
  marginBottom: 28,
};

const legendBox = { width: 40, height: 40, borderRadius: 6 };

const tableRow = { display: "block", marginBottom: 24 };

const tableCard = {
  width: "100%",
  background: "#fff",
  border: "1px solid #000",
  borderRadius: 10,
};

const tableHeader = {
  height: 60,
  padding: "16px 20px",
  borderBottom: "1px solid #000",
  fontWeight: 600,
  fontSize: "18px"
};

const tableHead = { padding: "12px 16px", color: "#2e7d32", fontSize: "14px", fontWeight: "600" };

const tableCell = { padding: "12px 16px", fontSize: "14px" };

export default Reports;