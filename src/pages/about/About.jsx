// src/about/About.jsx

import Top from '../../components/Top';
import GetToKnowUs from './GetToKnowUs';
import OurPurpose from './OurPurpose';
import OurTestimonials from './OurTestimonials';
import WhatMakesUsDifferent from './WhatMakesUsDifferent';


const About = () => {
  return (
    <div className="bg-white" style={{width: '100%' }}>
      <Top
        title="About"
        subtitle="Connecting farmers, agents, and consumers through ethical organic trade."
      />
      <GetToKnowUs />
      <OurPurpose />
      <WhatMakesUsDifferent />
      <OurTestimonials />
    </div>
  );
};
export default About;