// src/HomePages/OurFarmBenefits.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import icon1 from '../../assets/MainPage/OurFarm/Icon1.png';
import icon2 from '../../assets/MainPage/OurFarm/Icon2.png';
import icon3 from '../../assets/MainPage/OurFarm/Icon3.png';
import farmImg from '../../assets/MainPage/OurFarm/Img.png';
import DiscoverMoreButton from '../../components/DiscoverMoreButton';

const OurFarmBenefits = () => {
    const benefits = [
        {
            icon: icon1,
            title: 'Quality Organic Food',
            text: 'We provide fresh, chemical-free organic produce grown using natural and sustainable farming methods.'
        },
        {
            icon: icon2,
            title: 'Professional Farmers',
            text: 'Our products come from experienced farmers who follow best agricultural practices for consistent quality.'
        },
        {
            icon: icon3,
            title: 'Quality Products',
            text: 'Every product is carefully selected, processed, and packed to meet high quality and safety standards.'
        }
    ];

    return (
        <div className="w-100 bg-white py-5 px-4 d-flex justify-content-center my-5" >
            <div className="row align-items-center justify-content-center mx-auto farm-wrapper mx-auto" style={{gap:'1.8rem'}}>
                {/* Left Section - Image */}
                <div className="col-lg-5">
                    <img 
                        src={farmImg} 
                        alt="Our Farm" 
                        className="w-100 d-block rounded"
                        style={{ height: '39rem', objectFit: 'cover' }}
                    />
                </div>

                {/* Right Section - Content */}
                <div className="col-lg-5 d-flex flex-column gap-2">
                    <p className="subtitle">
                        Our Farm Benefits
                    </p>
                    
                    <h2>
                        Why Choose Agri Market
                    </h2>
                    
                    <p>
                        We connect you directly with trusted farmers to deliver pure, high-quality agricultural products with complete transparency and care.
                    </p>

                    {/* Benefits List */}
                    <div className="d-flex flex-column gap-3 mt-3">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="d-flex gap-3 align-items-start">
                                <img 
                                    src={benefit.icon} 
                                    alt="" 
                                    className="point-icon flex-shrink-0"/>
                                <div className="d-flex flex-column">
                                    <h3 className="card-title">
                                        {benefit.title}
                                    </h3>
                                    <p>
                                        {benefit.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Button */}
                    <div className="mt-2">
                        <DiscoverMoreButton
                            text="Discover More"
                            href="/about"
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .farm-wrapper {
                    max-width: 100rem;
                    width: 100%;
                    
                }

                /* Large tablets and below */
                @media (max-width: 1024px) {
                    .farm-wrapper {
                        flex-direction: column;
                    }
                    .row.g-5 {
                        gap: 3rem !important;
                    }
                    .col-lg-6.d-flex.flex-column.gap-2 {
                        gap: 1.25rem !important;
                    }
                }

                /* Tablets */
                @media (max-width: 768px) {
                    
                    .col-lg-6 p:first-child {
                        font-size: 1.25rem !important;
                    }
                    
                    .w-100.py-5.px-4 {
                        padding: 4rem 1.5rem !important;
                    }
                }

                /* Mobile */
                @media (max-width: 480px) {
                    
                    .flex-shrink-0 {
                        width: 2rem !important;
                        height: 2rem !important;
                    }
                    .d-flex.gap-3.align-items-start {
                        gap: 1rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default OurFarmBenefits;