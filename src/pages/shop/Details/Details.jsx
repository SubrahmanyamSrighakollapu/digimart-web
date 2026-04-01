import 'bootstrap/dist/css/bootstrap.min.css';
import Top from '../../../components/Top';
import ItemDetails from './ItemDetails';

const Details = () => {
  return (
    <>
      <Top
        subtitle="Home / Shop / Agriculture / Rice"
        title="Details"
      />
      <ItemDetails />
    </>
  );
};

export default Details;