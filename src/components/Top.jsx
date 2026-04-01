// src/components/Top.jsx

import topBg from '../assets/about/TopImg.png';

const Top = ({ title, subtitle }) => {
  return (
    <section
      className="w-100 d-flex align-items-center justify-content-center text-center text-white"
      style={{
        backgroundImage: `url(${topBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '20.390625rem',
        marginTop: '-2.839rem',
      }}
    >
      <div className="container">
        <div className='section-header' style={{marginTop: '6rem'}}>
        {/* Title */}
        <h2
          className="white mb-2"
          
        >
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{color:'#FFFFFFB2'}}
          >
            {subtitle}
          </p>
        )}
        </div>
      </div>
    </section>
  );
};

export default Top;