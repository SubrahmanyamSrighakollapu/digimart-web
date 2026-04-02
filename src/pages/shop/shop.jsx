// src/shop/Shop.jsx

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FiltersSection from './FiltersSection';
import OfferCard from './OfferCard';
import RiceAndGrain from './RiceAndGrain';
import productsData from '../../data/products.json';

const Shop = () => {
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

  const products = productsData.products;

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
        <RiceAndGrain filters={appliedFilters} />
      </div>
    </>
  );
};

export default Shop;