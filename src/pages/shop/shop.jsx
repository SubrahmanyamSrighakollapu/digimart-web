// src/shop/Shop.jsx

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import FiltersSection from './FiltersSection';
import OfferCard from './OfferCard';
import RiceAndGrain from './RiceAndGrain';
import agentService from '../../services/agentService';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedCategories: [],
    minPrice: '',
    maxPrice: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({
    searchQuery: '',
    selectedCategories: [],
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await agentService.getAgentProducts();
      if (response && response.status === 1 && response.result) {
        const formattedProducts = response.result.map(product => ({
          id: product.productId,
          img: product.productImages && product.productImages.length > 0 
            ? `${import.meta.env.VITE_API_BASE_URL}/${product.productImages[0].replace(/\\/g, '/')}` 
            : null,
          title: product.productTitle,
          name: product.productName,
          type: product.categoryName,
          quantity: `1 ${product.quantityType}`,
          status: 'In Stock',
          price: product.finalPrice,
          moq: '1 Ton',
          description: product.productDescription,
          categoryId: product.categoryId,
          categoryName: product.categoryName
        }));
        setProducts(formattedProducts);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch products';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  return (
    <>
      <OfferCard />
      <div className="d-flex flex-column flex-lg-row">
        <FiltersSection 
          filters={filters} 
          setFilters={setFilters} 
          products={products}
          onApplyFilters={handleApplyFilters}
        />
        <RiceAndGrain filters={appliedFilters} products={products} loading={loading} />
      </div>
    </>
  );
};

export default Shop;