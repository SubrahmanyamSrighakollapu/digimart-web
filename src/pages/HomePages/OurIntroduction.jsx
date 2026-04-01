import mainImg from '../../assets/MainPage/OurIntro/our_introduction1.jpg';
import overlayImg from '../../assets/MainPage/OurIntro/our_introduction2.jpg';
import bulkIcon from '../../assets/MainPage/OurIntro/our_introductionIcon.png';
import vectorIcon from '../../assets/MainPage/OurIntro/our_introductionVector.png';
import pointIcon from '../../assets/MainPage/OurIntro/Point_Icon_Yellow.png';
import DiscoverMoreButton from '../../components/DiscoverMoreButton';

const OurIntroduction = () => {
    return (
        <section className="our-intro py-5" style={{width: '85%', maxWidth: '70rem', padding: '2rem 1rem', margin: '3rem auto', zIndex: 1, backgroundColor: '#ffffff'}}>
            <div className="container">
                <div className="row align-items-center gy-4 gx-lg-5">
                    {/* Left: Images */}
                    <div className="col-lg-6 d-flex justify-content-center">
                        <div className="position-relative" style={{maxWidth: '34.375rem', width: '100%'}}>
                            <img
                                src={mainImg}
                                alt="Farm Introduction 1"
                                className="img-fluid rounded-circle main-img d-block mx-auto"
                            />

                            <img
                                src={overlayImg}
                                alt="Farm Introduction 2"
                                className="rounded-circle overlay-img d-block"
                            />
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="col-lg-6 pe-lg-5" style={{maxWidth: '37.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                        <p className="subtitle mb-2">Our Introductions</p>

                        <h2 className='mb-2'>Direct Farm Sourcing for Trusted Agents</h2>

                        <h3 className="small green">Connecting agents directly with trusted farmers.</h3>

                        <p>We enable agents to source farm-fresh agricultural and organic products straight from verified farmers. Our platform simplifies bulk purchasing, ensures transparent pricing, and guarantees quality through direct-from-farm sourcing.</p>

                        {/* Features */}
                        <div className="d-flex gap-4 my-1 mb-3 flex-column flex-md-row">
                            <div className="d-flex align-items-center gap-3 flex-grow-1">
                                <img src={vectorIcon} alt="Direct Farmer Sourcing" className="icon-img-big" />
                                <h4>Direct Farmer Sourcing</h4>
                            </div>

                            <div className="d-flex align-items-center gap-3 flex-grow-1">
                                <img src={bulkIcon} alt="Bulk & Wholesale Supply" className="icon-img-big" />
                                <h4>Bulk & Wholesale Supply</h4>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="d-flex flex-column gap-2 mb-3">
                            <div className="d-flex align-items-start gap-3">
                                <img src={pointIcon} alt="Checkmark" className="point-icon" />
                                <p className="text-dark">Farm-direct products with transparent pricing</p>
                            </div>

                            <div className="d-flex align-items-start gap-3">
                                <img src={pointIcon} alt="Checkmark" className="point-icon" />
                                <p className="text-dark">Naturally grown, quality-verified, and traceable</p>
                            </div>
                        </div>

                        <DiscoverMoreButton text="Discover More" href="/about" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                /* Small, focused CSS for image sizes and overlay positioning (kept minimal) */
                .main-img {
                    width: 100%;
                    max-width: 34.375rem; /* restored from original */
                    height: auto;
                    aspect-ratio: 1/1;
                    object-fit: cover;
                    display: block;
                    border-radius: 50%;
                    z-index: 2;
                }

                .overlay-img {
                    position: absolute;
                    left: -1.5rem;
                    bottom: -5rem;
                    width: 13.25rem;
                    height: 13.25rem;
                    object-fit: cover;
                    border: 0.5rem solid #ffffff;
                    box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.08);
                    z-index: 3;
                }

                /* Responsive adjustments */
                @media (max-width: 992px) {
                    .main-img { max-width: 25rem; }
                    .overlay-img { left: 2rem; bottom: -0.1rem; width: 9rem; height: 9rem; }
                }

                @media (max-width: 576px) {
                    .main-img { max-width: 18rem; }
                    .overlay-img {
                        position: absolute;
                        left: 30%;
                        transform: translateX(-50%);
                        bottom: -1.25rem;
                        width: 6rem;
                        height: 6rem;
                    }
                }
            `}</style>
        </section>
    );
};

// Keep an empty export for compatibility
export const styles = {};

export default OurIntroduction;