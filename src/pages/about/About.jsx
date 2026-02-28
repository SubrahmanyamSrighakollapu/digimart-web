// src/about/About.jsx

import Top from '../../components/Top';
import AboutUsHero from './AboutUsHero';
import GetToKnowUs from './GetToKnowUs';
import OurApproach from './OurApproach';
import OurCoreValues from './OurCoreValues';
import OurJourney from './OurJourney';
import OurPurpose from './OurPurpose';
import OurTestimonials from './OurTestimonials';
import WhatMakesUsDifferent from './WhatMakesUsDifferent';


const About = () => {
  return (
    <div className="bg-white" style={{width: '100%' }}>
      <AboutUsHero />
      <OurPurpose />
      <OurApproach />
      <OurJourney />
      <OurCoreValues/>
    </div>
  );
};
export default About;