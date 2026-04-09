import refundData from '../../data/refundPolicy.json';

const RefundPolicy = () => {
  const { banner, sections } = refundData;

  const renderContent = (content) => {
    return content.map((item, index) => {
      switch (item.type) {

        case 'paragraph':
          return (
            <p key={index} className="terms-content-text mb-3">
              {item.text}
            </p>
          );

        case 'points':
          return (
            <ul key={index} className="mb-3" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              {item.items.map((point, idx) => (
                <li key={idx} className="terms-content-text mb-2" style={{ paddingLeft: '0.5rem' }}>
                  {point}
                </li>
              ))}
            </ul>
          );

        case 'subpoints':
          return (
            <ul key={index} className="mb-3" style={{ listStyleType: 'disc', paddingLeft: '2.5rem' }}>
              {item.items.map((point, idx) => (
                <li key={idx} className="terms-content-text mb-2" style={{ paddingLeft: '0.5rem' }}>
                  {point}
                </li>
              ))}
            </ul>
          );

        case 'subsection':
          return (
            <div key={index} className="mb-3" style={{ paddingLeft: '0.5rem', borderLeft: '3px solid #32a862', marginBottom: '1rem' }}>
              <p className="mb-1" style={{ fontWeight: 700, color: '#1c1917', fontSize: '0.95rem' }}>
                {item.subtitle}
              </p>
              {item.text && (
                <p className="terms-content-text mb-0">{item.text}</p>
              )}
              {item.items && (
                <ul className="mb-0 mt-1" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                  {item.items.map((point, idx) => (
                    <li key={idx} className="terms-content-text mb-1" style={{ paddingLeft: '0.5rem' }}>
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );

        case 'step':
          return (
            <div key={index} className="d-flex align-items-start gap-3 mb-3">
              <div style={{
                minWidth: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #EC5B13, #32a862)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0, marginTop: '2px'
              }}>
                {item.label.replace('.', '')}
              </div>
              <p className="terms-content-text mb-0">{item.text}</p>
            </div>
          );

        case 'note':
          return (
            <div key={index} className="mb-3 p-3 rounded d-flex align-items-start gap-2"
              style={{ background: '#fef9ec', border: '1px solid #fde68a', borderLeft: '4px solid #d97706' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚠</span>
              <p className="mb-0" style={{ color: '#92400e', fontSize: '0.9rem', lineHeight: '1.6', fontWeight: 500 }}>
                <strong>Note: </strong>{item.text}
              </p>
            </div>
          );

        case 'contact':
          return (
            <div key={index} className="mb-3 p-3 rounded" style={{ background: '#F8F9FA', borderLeft: '4px solid #32a862' }}>
              {item.details.company && (
                <p className="terms-content-text mb-1">
                  <strong className="text-dark">{item.details.company}</strong>
                </p>
              )}
              {item.details.email && (
                <p className="terms-content-text mb-1">
                  <strong className="text-dark">Email: </strong>{item.details.email}
                </p>
              )}
              {item.details.phone && (
                <p className="terms-content-text mb-1">
                  <strong className="text-dark">Phone: </strong>{item.details.phone}
                </p>
              )}
              {item.details.hours && (
                <p className="terms-content-text mb-1">
                  <strong className="text-dark">Business Hours: </strong>{item.details.hours}
                </p>
              )}
              {item.details.address && (
                <p className="terms-content-text mb-1">
                  <strong className="text-dark">Address: </strong>{item.details.address}
                </p>
              )}
            </div>
          );

        default:
          return null;
      }
    });
  };

  return (
    <div className="container py-4">
      {/* Banner Card */}
      <div className="banner-card px-4 py-4 mb-5">
        <h2 className="mb-2">{banner.title}</h2>
        {banner.subtitle && (
          <p className="mb-1" style={{ color: '#565656', fontSize: '0.95rem' }}>{banner.subtitle}</p>
        )}
        <p className="green mb-0">Last Updated: {banner.lastUpdated}</p>
      </div>

      {/* Refund Sections */}
      <div className="terms-content">
        {sections.map((section) => (
          <div key={section.id} className="terms-section">
            <div className="d-flex flex-column align-items-start mb-4">
              <div className='d-flex align-items-center mb-3'>
                <div className="icon-bg me-3 flex-shrink-0" style={{ width: '2.5rem', height: '2.5rem' }}>
                  <p className="text-dark mb-0 fw-semibold">{section.id}</p>
                </div>
                <h4>{section.title}</h4>
              </div>
              <div className="flex-grow-1 px-5">
                {renderContent(section.content)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .terms-content-text {
          color: #565656;
          line-height: 1.7;
          font-size: 1rem;
          font-weight: 400;
        }
        @media (max-width: 768px) {
          .terms-content-text {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RefundPolicy;
