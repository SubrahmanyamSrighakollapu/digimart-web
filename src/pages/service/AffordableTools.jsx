// src/HomePages/BusinessAsAgent.jsx

import agentIcon from '../../assets/MainPage/Agent/Icon.png';
import ToolImg from '../../assets/services/Img5.png';

const AffordableTools = () => {
    const features = [
        { title: 'Equipment Rental', text: 'Pay-per-use access to tractors, harvesters, and drones.' },
        { title: 'Bulk Input Sourcing', text: 'Group buying power for seeds and organic fertilizers.' },
        { title: 'Quality Assurance', text: 'All supplies are verified for organic certification standards.' },
        
    ];

    return (
        <section className="business-agent py-5 px-lg-5 px-3 my-4">
            <div className="container">
                <div className="row agent-row align-items-center g-4">

                    {/* left: Image */}
                    <div className="col-lg-6 d-flex justify-content-end">
                        <div className="image-wrapper">
                            <div className="overlay-1" />
                            <div className="overlay-2" />
                            <img src={ToolImg} alt="Agent Business" className="agent-image overlay-img" />
                        </div>
                    </div>


                    {/* Right: Content */}
                    <div className="col-lg-6">
                        <div className="agent-left">
                            <h2 className=" mb-2">Affordable Tools.Better Productivity.</h2>
                            <p >Access essential farming equipment and quality inputs without the heavy financial burden. We connect you with verified suppliers and rental options.</p>

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

                    
                </div>
            </div>

            <style jsx>{AffordableToolsCss}</style>
        </section>
    );
};


export const AffordableToolsCss = `
.business-agent { width: 100%; margin: 0; background-color: #F8F7F0; }
.business-agent .container { max-width: 80.5rem; }

.agent-left { max-width: 35rem; }


.feature-item { gap: 1rem; }


.image-wrapper { position: relative; width: 32.6875rem; height: 28.9375rem; max-width: 100%; overflow: visible; }

/* Layered overlays placed behind the main image (aligned to image back) */
.overlay-1 {
  position: absolute;
  left: -4.9rem;
  top: -2rem;
  width: calc(100% + 3rem);
  height: calc(100% + 1rem);
  transform: rotate(-2.28deg);
  background: #C2BEFF47;
  border-radius: 30px;
  z-index: 0;
}

.overlay-2 {
  position: absolute;
  left: -2.5rem;
  top: 0.5rem;
  width: calc(100% + 1rem);
  height: calc(90% + 0.5rem);
  background: #FFFFFF;
  border-radius: 30px;
  z-index: 1;
}

/* The actual image (top layer) aligned to cover the wrapper */
.overlay-img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 90%;
  opacity: 1;
  border-radius: 30px;
  z-index: 2;
  object-fit: contain;
}

/* Keep original agent-image selector for fallback/responsiveness */
.agent-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 1rem; z-index: 1; }

/* Responsive adjustments */
@media (max-width: 1024px) {
  .agent-row { flex-direction: column-reverse; }
  .agent-row { gap: 4rem !important; }
  .agent-left { gap: 1.5rem; }
  
  .business-agent { padding-left: 1.5rem; padding-right: 1.5rem; }

  /* Scale overlays down on medium screens and slightly shift behind image */
  .overlay-1 { left: -2rem; top: -1rem; width: calc(100% + 4rem); height: calc(100% + 2rem); }
  .overlay-2 { left: -1rem; top: 0.5rem; width: calc(100% + 2rem); height: calc(100% + 1rem); }
  .overlay-img { width: 100%; height: 100%; left: 0; top: 0; }
}

@media (max-width: 768px) {
 

  /* Tablet: center overlays and scale by percent */
  .overlay-1, .overlay-2, .overlay-img { left: 50%; transform: translateX(-50%); }
  .overlay-1, .overlay-2 { width: 80%; left: 50%; height: auto; }
  .overlay-img { width: 75%; height: auto; top: 10px; }
}

@media (max-width: 480px) {
  
  .image-wrapper { height: 18rem; }

  /* Mobile: make overlays responsive and centered */
  .overlay-1, .overlay-2 { width: 90%; left: 50%; transform: translateX(-50%); }
  .overlay-img { width: 85%; left: 50%; transform: translateX(-50%); top: 6px; }
  .image-wrapper { height: auto; }
}



@media (max-width: 480px) {
  .image-wrapper { height: 18rem; }
}
`;

export default AffordableTools;