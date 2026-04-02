// src/HomePages/BusinessAsAgent.jsx

import { color } from 'chart.js/helpers';
import agentIcon from '../../assets/groceryweb/tick1.png';
import agentImg from '../../assets/MainPage/grow_your_business_image.png';
import colors from '../../styles/colors';

const BusinessAsAgent = () => {
    const features = [
        { title: 'Bulk Purchase Benefits :', text: 'Access wholesale pricing on essential grocery items to maximize your profit margins.' },
        { title: 'Wide Product Range :', text: 'From grains and pulses to spices, oils, and packaged foods everything in one place.' },
        { title: 'Reliable Supply Chain :', text: 'Timely delivery and well-managed logistics ensure your shelves stay stocked.' },
        { title: 'Consistent Quality :', text: 'Carefully sourced products that meet quality standards for your customers.' },
    ];

    return (
        <section className="business-agent py-5 px-lg-5 px-3 my-4">
            <div className="container">
                <div className="row agent-row align-items-center g-4">
                    {/* Left: Content */}
                    <div className="col-lg-6">
                        <div className="agent-left">
                            <h2 style={{color:'#EC5609', fontSize:'1.5rem', fontWeight:'700'}}>Grow Your Business with Wholesale Groceries</h2>
                            <p>Partner with a reliable wholesale grocery supplier and expand your retail or distribution business with consistent quality, competitive pricing, and dependable delivery.</p>

                            <div className="features-list mt-3">
                                {features.map((feature, index) => (
                                    <div key={index} className="feature-item d-flex gap-3 align-items-start mb-3">
                                        <img src={agentIcon} alt="" className="point-tick-icon" />
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
.business-agent { width: 100%; margin: 0; background-color: #fff; }
.business-agent .container { max-width: 80.5rem; }

.agent-left { max-width: 35rem; }


.feature-item { gap: 1rem; }

.point-tick-icon{width: 2.5rem;
  height: 1.8rem;
  flex-shrink: 0;}


.image-wrapper { position: relative; width: 32.6875rem; height: 28.9375rem; max-width: 100%; }
.image-bg { position: absolute; right: -0.9375rem; bottom: -0.9375rem; width: 100%; height: 100%; background-color: ${colors.primary}; border-radius: 0.25rem; z-index: 0; }
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