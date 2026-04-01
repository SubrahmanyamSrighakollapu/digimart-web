// src/HomePages/BusinessAsAgent.jsx

import agentIcon from '../../assets/MainPage/Agent/Icon.png';
import FarmerImg from '../../assets/services/Img1.jpg';

const SupportForFarmers = () => {
    const features = [
        { title: 'Short-term crop loans', text: 'Low-interest loans aligned with season needs.' },
        { title: 'Input-based credit', text: 'Seeds and fertilizers, repay after harvest.' },
        { title: 'Fair repayment cycles', text: 'Flexible terms based on crop predictability.' },
        
    ];

    return (
        <section className="business-agent py-5 px-lg-8 px-8 my-4">
            <div className="container">
                <div className="row agent-row align-items-center g-2">
                    {/* Left: Content */}
                    <div className="col-lg-6">
                        <div className="agent-left">
                            <h2 className="mb-2" style={{lineHeight:'3rem'}}>Credit & Financial Support for Farmers</h2>
                            <p >We bridge the gap between farmers and fair capital. Our platform offers tailored financial products designed specifically for the agricultural cycle, ensuring farmers have resources when they need them most.</p>

                            <div className="features-list mt-3">
                                {features.map((feature, index) => (
                                    <div key={index} className="feature-item d-flex gap-3 align-items-start mb-3">
                                        <img src={agentIcon} alt="" className="point-icon" />
                                        <div className="feature-content">
                                            <h3 className="card-title mb-0">{feature.title}</h3>
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
                             
                            <img src={FarmerImg} alt="Agent Business" className="agent-image" />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{SupportForFarmersCss}</style>
        </section>
    );
};


export const SupportForFarmersCss = `
.business-agent { width: 100%; margin: 0; background-color: #F8F7F0; }
.business-agent .container { max-width: 80.5rem; }

.agent-left { max-width: 35rem; }


.feature-item { gap: 1rem; }


.image-wrapper { position: relative; width: 32.6875rem; height: 28.9375rem; max-width: 100%; }
.agent-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 1rem; z-index: 1; }

/* Responsive adjustments */
@media (max-width: 1024px) {
  .agent-row { flex-direction: column-reverse; }
  .agent-row { gap: 4rem !important; }
  .agent-left { gap: 1.5rem; }
  
  .business-agent { padding-left: 1.5rem; padding-right: 1.5rem; }
}

@media (max-width: 480px) {
  .image-wrapper { height: 18rem; }
}
`;

export default SupportForFarmers;