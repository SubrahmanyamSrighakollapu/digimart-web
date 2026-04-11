const CustomerOrdersCards = ({ data }) => {
  // Card data in array format - Dynamic
  const cardsData = data ? [
    {
      id: 1,
      title: "New customer orders",
      headers: ["Order ID", "Customer", "Product", "QTY", "Action"],
      dataKeys: ["orderId", "customer", "product", "qty", "action"],
      orders: data.newCustomerOrders.map(order => ({
        orderId: order.orderId,
        customer: order.customer,
        product: order.product,
        qty: order.qty,
        action: order.action
      }))
    },
    {
      id: 2,
      title: "Pending Wholeseller Purchase",
      headers: ["Wholeseller", "Product", "Price", "Status", "Action"],
      dataKeys: ["farmer", "product", "price", "status", "action"],
      orders: data.pendingFarmerPurchases.map(purchase => ({
        farmer: purchase.farmer,
        product: purchase.product,
        price: `₹ ${parseFloat(purchase.price).toLocaleString('en-IN')}`,
        status: purchase.status,
        action: purchase.action
      }))
    }
  ] : [];

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa' }}>
      <style>{`
        .orders-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .orders-card-header {
          padding: 1.5rem 1.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .orders-card-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .orders-table {
          width: 100%;
          margin: 0;
        }

        .orders-table thead th {
          background: #f9fafb;
          color: #6b7280;
          font-size: 0.8125rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 0.875rem 1rem;
          border-bottom: 2px solid #e5e7eb;
          text-align: left;
        }

        .orders-table tbody td {
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
          color: #374151;
          font-size: 0.9375rem;
          vertical-align: middle;
        }

        .orders-table tbody tr:last-child td {
          border-bottom: none;
        }

        .orders-table tbody tr:hover {
          background: #f9fafb;
        }

        .action-link {
          color: #10b981;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
        }

        .action-link:hover {
          color: #059669;
          text-decoration: underline;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 500;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        @media (max-width: 768px) {
          .orders-table thead th,
          .orders-table tbody td {
            padding: 0.75rem 0.5rem;
            font-size: 0.8125rem;
          }
        }
      `}</style>

      <div className="row g-4">
        {cardsData.map((card) => (
          <div key={card.id} className="col-12 col-xl-6">
            <div className="orders-card">
              <div className="orders-card-header">
                <h3 className="orders-card-title">{card.title}</h3>
              </div>

              <div className="table-responsive">
                <table className="orders-table">
                  <thead>
                    <tr>
                      {card.headers.map((header, idx) => (
                        <th key={idx}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {card.orders.map((order, index) => (
                      <tr key={index}>
                        {card.dataKeys.map((key, idx) => (
                          <td key={idx}>
                            {key === 'action' ? (
                              <span className="action-link">{order[key]}</span>
                            ) : key === 'status' ? (
                              <span className="status-badge status-pending">{order[key]}</span>
                            ) : (
                              order[key]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerOrdersCards;