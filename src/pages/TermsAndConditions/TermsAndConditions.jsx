import termsData from '../../data/termsAndConditions.json';

const TermsAndConditions = () => {
  const { banner, sections } = termsData;

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
            <ul key={index} className="mb-3" style={{ listStyleType: 'disc', paddingLeft: '2rem' }}>
              {item.items.map((point, idx) => (
                <li key={idx} className="terms-content-text mb-2" style={{ paddingLeft: '0.5rem' }}>
                  {point}
                </li>
              ))}
            </ul>
          );

        case 'contact':
          return (
            <div key={index} className="mb-3 p-3 rounded" style={{ background: '#F8F9FA', borderLeft: '4px solid #4BAF47' }}>
              {item.details.company && (
                <p className="terms-content-text mb-1">
                  <strong className="text-dark">{item.details.company}</strong>
                </p>
              )}
              {item.details.name && (
                <p className="terms-content-text mb-1">
                  <strong className="text-dark">Name:</strong> {item.details.name}
                </p>
              )}
              <p className="terms-content-text mb-1">
                <strong className="text-dark">Email:</strong> {item.details.email}
              </p>
              <p className="terms-content-text mb-1">
                <strong className="text-dark">Phone:</strong> {item.details.phone}
              </p>
              <p className="terms-content-text mb-1">
                <strong className="text-dark">Address:</strong> {item.details.address}
              </p>
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
        <h2 className="mb-3">{banner.title}</h2>
        <div className="column">
          <div className="col-md-6 mb-2 mb-md-0">
            <p className="green mb-0">
              Last Updated: {banner.lastUpdated}
            </p>
          </div>
          <div className="col-md-6">
            <p className="green mb-0">
              Please read these terms Carefully before using our  platform for bulk grain Purchasing and logistic services. 
            </p>
          </div>
        </div>
      </div>

      {/* Terms Sections */}
      <div className="terms-content">
        {sections.map((section) => (
          <div key={section.id} className="terms-section">
            <div className="d-flex flex-column align-items-start mb-4 " >
              <div className='d-flex align-items-center mb-3'> 
              {/* Icon Background with Number */}
              <div className="icon-bg me-3 flex-shrink-0" style={{width:'2.5rem', height:'2.5rem'}}>
                <p className="text-dark mb-0 fw-semibold">{section.id}</p>
              </div>
              <h4 >{section.title}</h4>
              </div>
              {/* Section Title and Content */}
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

export default TermsAndConditions;