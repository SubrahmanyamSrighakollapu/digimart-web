import bgImg from '../../assets/MainPage/WhatWeOffer/BgImg.png';
import card1Icon from '../../assets/MainPage/WhatWeOffer/Card1Icon.png';
import card1Img from '../../assets/MainPage/WhatWeOffer/Card1Img.png';
import card2Icon from '../../assets/MainPage/WhatWeOffer/Card2Icon.png';
import card2Img from '../../assets/MainPage/WhatWeOffer/Card2Img.jpg';

const WhatWeOffer = () => {
    const cards = [
        {
            img: card1Img,
            icon: card1Icon,
            title: 'Agriculture Products',
            text: 'High-quality agricultural products sourced directly from farms, ensuring freshness, purity, and consistent supply for bulk buyers.'
        },
        {
            img: card2Img,
            icon: card2Icon,
            title: 'Organic Products',
            text: 'Naturally grown organic products sourced directly from certified farms, free from chemicals and synthetic additives.'
        }
    ];

    return (
        <section 
            className="py-5 position-relative" 
            style={{
                width: '100%',
                margin: '3rem 0',
                minHeight: '30.0625rem',
                backgroundImage: `url(${bgImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: 1,
                padding: '2rem',
                boxSizing: 'border-box'
            }}
        >
            <div className="container">
                <div className="mx-auto" style={{ maxWidth: '80rem' }}>
                    {/* Header Section */}
                    <div className='section-header'>
                        <p className="subtitle mb-1">
                            Our Services
                        </p>
                        <h2>
                            What We Offer
                        </h2>
                    </div>

                    {/* Cards Section */}
                    <div className="d-flex justify-content-center flex-wrap" style={{ gap: '6rem' }}>
                        {cards.map((card, index) => (
                            <article 
                                key={index} 
                                className="card border-0 shadow position-relative d-flex flex-column overflow-visible m-3"
                                style={{
                                    width: '28.5rem',
                                    height: '34rem',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '0.625rem',
                                    boxShadow: '0 0.25rem 1.5rem rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                }}
                            >
                                <div 
                                    className="position-relative w-100"
                                    style={{ height: '60%' }}
                                >
                                    <img 
                                        src={card.img} 
                                        alt={card.title} 
                                        className="w-100 h-100"
                                        style={{
                                            objectFit: 'cover',
                                            borderTopLeftRadius: '0.625rem',
                                            borderTopRightRadius: '0.625rem'
                                        }}
                                    />
                                    <img 
                                        src={card.icon} 
                                        alt={`${card.title} Icon`} 
                                        className="icon-img-big position-absolute"
                                        style={{
                                            bottom: '-2rem',
                                            right: '1.5rem',
                                            objectFit: 'contain',
                                            zIndex: 2
                                        }}
                                    />
                                </div>
                                <div 
                                    className="card-body d-flex flex-column"
                                    style={{
                                        padding: '2rem',
                                        gap: '1rem'
                                    }}
                                >
                                    <h3 className="card-title">
                                        {card.title}
                                    </h3>
                                    <p style={{color:'#565656'}}>
                                        {card.text}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                /* Responsive adjustments */
                @media (max-width: 1200px) {
                    .d-flex.flex-wrap { gap: 3rem !important; }
                }

                @media (max-width: 992px) {
                    .card { 
                        width: 22rem !important; 
                        height: auto !important; 
                    }
                    .position-relative.w-100 { height: 14rem !important; }
                    .card img:first-child { border-radius: 0.625rem !important; }
                }

                @media (max-width: 768px) {
                    .d-flex.flex-wrap { gap: 2rem !important; }
                    .card { width: 100% !important; }
                    .position-relative.w-100 { height: 12rem !important; }
                }

                @media (max-width: 480px) {
                    .position-relative.w-100 { height: 10rem !important; }
                    section p { font-size: 1.25rem !important; }
                }
            `}</style>
        </section>
    );
};

export default WhatWeOffer;