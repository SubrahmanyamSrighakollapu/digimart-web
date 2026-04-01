import 'bootstrap/dist/css/bootstrap.min.css';
import cardImg from '../../assets/MainPage/QualityProducts/CardImg.jpg';
import icon1 from '../../assets/MainPage/QualityProducts/Icon1.png';
import icon2 from '../../assets/MainPage/QualityProducts/Icon2.png';
import DiscoverMoreButton from '../../components/DiscoverMoreButton';

const QualityProducts = () => {
    const features = [
        {
            icon: icon1,
            title: 'Professional Farmers',
            text: 'Grown by experienced and trusted farmers.'
        },
        {
            icon: icon2,
            title: 'Solution for Farming',
            text: 'Smart solutions for modern farming needs.'
        }
    ];

    return (
        <div className="w-100 bg-white py-5 my-5">
            <div className="container d-flex justify-content-center align-items-center">
                <div className="row g-0 bg-white shadow rounded overflow-hidden mx-auto quality-card" style={{ width: '85%', maxWidth: '60rem' }}>
                    {/* Left Section - Image */}
                    <div className="col-lg-6 p-0 position-relative quality-img-wrapper">
                        <img
                            src={cardImg}
                            alt="Quality Products"
                            className="w-100 h-100 position-absolute top-0 start-0"
                            style={{ objectFit: 'cover', objectPosition: 'center top' }}
                        />
                    </div>

                    {/* Right Section - Content */}
                    <div className="col-lg-6 d-flex flex-column p-4 p-lg-5 gap-3">
                        <p className="subtitle">
                            Quality Products
                        </p>
                        
                        <h2>
                            Only Quality Food
                        </h2>
                        
                        <p>
                            Pure, chemical-free organic food grown using natural farming practices.
                        </p>

                        {/* Features List */}
                        <div className="d-flex flex-column gap-4 mt-2">
                            {features.map((feature, index) => (
                                <div key={index} className="d-flex align-items-start gap-3">
                                    <img 
                                        src={feature.icon} 
                                        alt={feature.title} 
                                        className="icon-img-big"
                                    />
                                    <div className="d-flex flex-column gap-2">
                                        <h3 className="card-title">
                                            {feature.title}
                                        </h3>
                                        <p>
                                            {feature.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Button */}
                        <div className="mt-3">
                            <DiscoverMoreButton 
                                text="Start Shopping Now"
                                href="/shop"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                /* Large screens: Image matches content height */
                @media (min-width: 992px) {
                    .quality-img-wrapper {
                        min-height: 100%;
                    }
                }

                /* Medium screens: Fixed reasonable height */
                @media (max-width: 991px) and (min-width: 577px) {
                    .quality-img-wrapper {
                        height: 22rem;
                    }
                }

                /* Small screens: Show top 70% of image with fixed height */
                @media (max-width: 576px) {
                    .quality-card { width: 90% !important; }
                    .quality-img-wrapper {
                        height: 18rem;
                    }
                    .quality-img-wrapper img {
                        object-position: center 20% !important;
                    }
                    .col-lg-6 p:first-child { font-size: 1.25rem !important; }
                    
                    .flex-shrink-0 { width: 3rem !important; height: 3rem !important; }
                }

                /* Tablet adjustments */
                @media (max-width: 768px) {
                    .quality-card { width: 90% !important; }
                }

                @media (max-width: 1024px) {
                    .quality-card { width: 90% !important; }
                }
            `}</style>
        </div>
    );
};

export default QualityProducts;