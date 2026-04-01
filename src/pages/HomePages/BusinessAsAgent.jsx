// src/HomePages/BusinessAsAgent.jsx

import agentIcon from '../../assets/MainPage/Agent/Icon.png';
import agentImg from '../../assets/MainPage/Agent/Img.png';

const BusinessAsAgent = () => {
    const features = [
        { title: 'Exclusive Bulk Pricing', text: 'Get special wholesale rates not available in the open market.' },
        { title: 'Logistics Support', text: 'We manage transportation and delivery so you can focus on sales.' },
        { title: 'Transparent Margins', text: 'Clear pricing with no hidden charges or surprises.' },
        { title: 'High Market Demand', text: 'Leverage the growing demand for organic and farm-fresh products.' },
    ];

    return (
        <section className="business-agent py-5 px-lg-5 px-3 my-4">
            <div className="container">
                <div className="row agent-row align-items-center g-4">
                    {/* Left: Content */}
                    <div className="col-lg-6">
                        <div className="agent-left">
                            <h2>Grow Your Business as an Agent</h2>
                            <p>Join a trusted network of agri-agents and scale your trading business with direct access to farmers, bulk supplies, and reliable support.</p>

                            <div className="features-list mt-3">
                                {features.map((feature, index) => (
                                    <div key={index} className="feature-item d-flex gap-3 align-items-start mb-3">
                                        <img src={agentIcon} alt="" className="point-icon" />
                                        <div className="feature-content">
                                            <h3 className="card-title">{feature.title}</h3>
                                            <p>{feature.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="col-lg-6 d-flex justify-content-end">
                        <div className="image-wrapper">
                            <div className="image-bg" />
                            <img src={agentImg} alt="Agent Business" className="agent-image" />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{businessAgentCss}</style>
        </section>
    );
};


export const businessAgentCss = `
.business-agent { width: 100%; margin: 0; background-color: #F8F7F0; }
.business-agent .container { max-width: 80.5rem; }

.agent-left { max-width: 35rem; }


.feature-item { gap: 1rem; }


.image-wrapper { position: relative; width: 32.6875rem; height: 28.9375rem; max-width: 100%; }
.image-bg { position: absolute; right: -0.9375rem; bottom: -0.9375rem; width: 100%; height: 100%; background-color: #4BAF47; border-radius: 0.25rem; z-index: 0; }
.agent-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 0.25rem; z-index: 1; }

/* Responsive adjustments */
@media (max-width: 1024px) {
  .agent-row { flex-direction: column-reverse; }
  .agent-row { gap: 4rem !important; }
  .agent-left { gap: 1.5rem; }
  .image-wrapper { width: 100%; height: 22rem; }
  .image-bg { right: -0.625rem; bottom: -0.625rem; }
  .business-agent { padding-left: 1.5rem; padding-right: 1.5rem; }
}


@media (max-width: 480px) {
  .image-wrapper { height: 18rem; }
  .image-bg { right: -0.5rem; bottom: -0.5rem; }
}
`;

export default BusinessAsAgent;