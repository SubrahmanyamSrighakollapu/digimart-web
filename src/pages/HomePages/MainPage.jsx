// HomePages/MainPage.jsx
import BusinessAsAgent from "./BusinessAsAgent";
import QualityProducts from "./QualityProducts";
import colors from '../../styles/colors';
import Hero from "./Hero";
import WhyChooseUs from "./WhyChooseUs";
import ShopByCategory from "./ShopByCategory";
import ThreeSimpleSteps from "./ThreeSimpleSteps";
import Testimonials from "./Testimonials";

const MainPage = () => {
  return (
    <div style={styles.container}>
      {/* Navbar is fixed in Layout; render sections in normal flow */}
      <Hero />
      <WhyChooseUs />
      <ShopByCategory />
      <ThreeSimpleSteps/>
      <QualityProducts />
      <Testimonials />
      <BusinessAsAgent />
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    minHeight: 'auto',
    backgroundColor: colors.bgWhite,
  },
};

export default MainPage;