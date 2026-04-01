import Icon10 from '../../../assets/AgentDashboard/Dashboard/Icon10.png';
import Icon7 from '../../../assets/AgentDashboard/Dashboard/Icon7.png';
import Icon8 from '../../../assets/AgentDashboard/Dashboard/Icon8.png';
import Icon9 from '../../../assets/AgentDashboard/Dashboard/Icon9.png';
import LineImg from '../../../assets/AgentDashboard/Dashboard/Line.png';
import MapImg from '../../../assets/AgentDashboard/Dashboard/Map.png';

const DashboardOverview = ({ data }) => {
  // Live Deliveries Data - Dynamic
  const deliveries = data ? data.liveDeliveries.map((delivery, index) => ({
    id: index + 1,
    orderId: delivery.orderId,
    status: delivery.status,
    statusColor: delivery.status === 'PENDING' ? '#FF8432' : '#4BAF47',
    location: delivery.location,
    time: new Date(delivery.pickupTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
    timeColor: delivery.status === 'PENDING' ? '#FFB032' : '#565656'
  })) : [];

  // Payment Cards Data - Dynamic
  const paymentCards = data ? [
    {
      id: 1,
      title: "Customer payment",
      amount: data.finance.customerPayment.amount.toLocaleString('en-IN'),
      status: data.finance.customerPayment.status,
      statusBg: "#B2FBAF5E",
      statusColor: "#4BAF47"
    },
    {
      id: 2,
      title: "Agent Margin",
      amount: parseFloat(data.finance.agentMargin.amount).toLocaleString('en-IN'),
      status: data.finance.agentMargin.status,
      statusBg: "#7E7E7E5E",
      statusColor: "#484848"
    },
    {
      id: 3,
      title: "Farmer payout",
      amount: data.finance.farmerPayout.amount.toLocaleString('en-IN'),
      status: data.finance.farmerPayout.status,
      statusBg: "#FCE2A65E",
      statusColor: "#EEC044"
    }
  ] : [];

  // Flow Steps Data
  const flowSteps = [
    {
      id: 1,
      icon: Icon7,
      bg: "#D9DBFF",
      border: "2px solid #1B30B2",
      text: "Customer Pays"
    },
    {
      id: 2,
      icon: Icon8,
      bg: "#4A4A4A",
      border: "2px solid #4A4A4A",
      text: "Platform Security"
    }
  ];

  // Flow Cards Data
  const flowCards = [
    {
      id: 1,
      icon: Icon9,
      bg: "#4BAF4733",
      border: "1px solid #0A6806",
      text: "Farmer Credit"
    },
    {
      id: 2,
      icon: Icon10,
      bg: "#F7F8F6",
      border: "1px solid #4C4C4C",
      text: "Agent Margin"
    }
  ];

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="row g-2">
        {/* Left Side - Live Deliveries */}
        <div className="col-12 col-lg-4">
                      <div className="card shadow-sm" 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #000000',
              padding: '20px'
            }}
          >
            {/* Title */}
            <p className="text-inter-26 mb-3 text-start">Live Deliveries</p>

            {/* Delivery Items */}
            <div className="d-flex flex-column gap-2">
              {deliveries.length > 0 ? deliveries.map((delivery) => (
                <div 
                  key={delivery.id}
                  style={{
                    borderRadius: '10px',
                    padding: '15px',
                    backgroundColor: '#FAFAFA'
                  }}
                >
                  {/* Order and Status Row */}
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <p className="table-cell text-gray-20">{delivery.orderId}</p>
                    <p className="mb-0" style={{ color: delivery.timeColor }}>{delivery.status}</p>
                  </div>

                  {/* Status Bar */}
                  <div 
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '10px',
                      backgroundColor: delivery.statusColor,
                    }}
                  />

                  {/* Location and Time Row */}
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <p className="table-cell text-gray-20">{delivery.location}</p>
                    <p className="mb-0" style={{ color: delivery.timeColor }}>{delivery.time}</p>
                  </div>
                </div>
              )) : (
                <p className="text-muted text-center">No live deliveries</p>
              )}
            </div>

            {/* Map */}
            <div className="mt-3" >
              <img 
                src={MapImg} 
                alt="Delivery Map"
                style={{
                  width: '100%',
                  maxHeight: '8rem',
                  borderRadius: '10px',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-12 col-lg-8 dashboard-col">
          {/* Payment Cards Row */}
          <div className="row g-3 g-md-3 mb-3">
            {paymentCards.map((card) => (
              <div key={card.id} className="col-12 col-sm-6 col-md-4 mb-3 mb-md-3">
                <div 
                  className="card shadow-sm" 
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '0.8px solid #878787',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Title */}
                  <p className="text-inter-22 mb-3 text-start">{card.title}</p>

                  {/* Amount */}
                  <p className="text-number mb-3 text-start">₹ {card.amount}</p>

                  {/* Status Badge */}
                  <div 
                    style={{
                      backgroundColor: card.statusBg,
                      borderRadius: '50px',
                      padding: '8px 16px',
                      width: 'fit-content',
                      textAlign: 'center'
                    }}
                  >
                    <p 
                      className="mb-0" 
                      style={{ 
                        color: card.statusColor,
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      {card.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Flow Diagram */}
          <div 
            className="card shadow-sm" 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #000000',
              padding: '40px',
              marginBottom: '15px'
            }}
          >
            <div className="payment-flow-container d-flex align-items-center justify-content-center gap-2">
              {/* Flow Steps with Icons and Arrows */}
              {flowSteps.map((step, index) => (
                <>
                  {/* Icon and Text */}
                  <div key={step.id} className="d-flex flex-column align-items-center gap-2 flow-step">
                    <div 
                      style={{
                        width: '4rem',
                        height: '4rem',
                        borderRadius: '50%',
                        backgroundColor: step.bg,
                        border: step.border,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img 
                        src={step.icon} 
                        alt={step.text}
                        style={{ width: '2rem', height: '2rem' }}
                      />
                    </div>
                    <p className="text-inter-22 mb-0 text-center">{step.text}</p>
                  </div>

                  {/* Arrow Line */}
                  <img 
                    key={`arrow-${step.id}`}
                    src={LineImg} 
                    alt="arrow"
                    className="flow-arrow"
                    style={{ height: '20px', width: '5rem' }}
                  />
                </>
              ))}

              {/* Flow Cards */}
              {flowCards.map((card) => (
                <>
                  <div key={card.id} className="d-flex flex-column align-items-center gap-2 flow-step">
                    <div 
                      style={{
                        backgroundColor: card.bg,
                        border: card.border,
                        borderRadius: '10px',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <img 
                        src={card.icon} 
                        alt={card.text}
                        style={{ width: '2rem', height: '2rem' }}
                      />
                      <p className="text-inter-22 mb-0 text-center">{card.text}</p>
                    </div>
                  </div>
                  
                </>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 991px) {
          .dashboard-col {
            width: 90% !important;
            margin-left: auto !important;
            margin-right: auto !important;
            margin-bottom: 20px !important;
          }
        }

        @media (max-width: 768px) {
          .payment-flow-container {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .flow-step {
            margin-bottom: 20px !important;
          }

          .flow-arrow {
            transform: rotate(90deg);
            margin: 10px 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardOverview;