// src/shop/FiltersSection.jsx

import { useState, useMemo } from 'react';
import icon from '../../assets/shop/Icon.png';

const FiltersSection = ({ filters = { searchQuery: '', selectedCategories: [], minPrice: '', maxPrice: '' }, setFilters, products = [], onApplyFilters }) => {
  const [sliderVal, setSliderVal] = useState(10000);

  const sliderMin = 0;
  const sliderMax = 100000;
  const sliderStep = 1000;

  // Extract unique categories from products
  const availableCategories = useMemo(() => {
    if (!products || products.length === 0) return [];
    const categoryMap = new Map();
    products.forEach(p => {
      if (p.categoryId && p.categoryName) {
        categoryMap.set(p.categoryId, { id: p.categoryId, name: p.categoryName });
      }
    });
    return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  console.log('Available Categories:', availableCategories);
  console.log('Products:', products);

  const handleSliderChange = (value) => {
    setSliderVal(Number(value));
    setFilters(prev => ({
      ...prev,
      minPrice: Number(value),
      maxPrice: prev.maxPrice || Number(value) + sliderStep * 5
    }));
  };

  const handleCategoryChange = (categoryName) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryName)
        ? prev.selectedCategories.filter(c => c !== categoryName)
        : [...prev.selectedCategories, categoryName]
    }));
  };

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, searchQuery: value }));
  };

  const handleMinPriceChange = (value) => {
    setFilters(prev => ({ ...prev, minPrice: value }));
  };

  const handleMaxPriceChange = (value) => {
    setFilters(prev => ({ ...prev, maxPrice: value }));
  };

  const handleReset = () => {
    const resetFilters = {
      searchQuery: '',
      selectedCategories: [],
      minPrice: '',
      maxPrice: ''
    };
    setFilters(resetFilters);
    setSliderVal(10000);
    // Trigger immediate apply on reset
    setTimeout(() => onApplyFilters(), 0);
  };

  return (
    <div
      className="filters-section bg-white"
      style={{ width: '25%', padding: '1rem 0.5rem 2rem 2.5rem' }}
    >
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search for products......"
          value={filters.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="text-dark mb-0">Filters</h5>
        <button className="btn reset-btn" onClick={handleReset}>
          Reset All
        </button>
      </div>

      {/* Filter Results Dropdown */}
      <div className="mb-4">
        <div className="filter-results d-flex align-items-center">
          <img src={icon} alt="Filter" className="me-2" style={{ width: '20px' }} />
          <span>Filter results..</span>
        </div>
      </div>

      {/* Product Categories */}
      {availableCategories.length > 0 && (
        <div className="filter-group mb-4">
          <p className="text-dark">Product Category</p>
          {availableCategories.map(category => (
            <div className="form-check mb-2 d-flex align-items-center" key={category.id}>
              <input
                className="form-check-input custom-radio"
                type="checkbox"
                id={`category-${category.id}`}
                checked={filters.selectedCategories.includes(category.name)}
                onChange={() => handleCategoryChange(category.name)}
              />
              <label className="filter-option" htmlFor={`category-${category.id}`}>
                {category.name}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Price Range */}
      <div className="filter-group mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="text-dark mb-0">Price Range</p>
        </div>

        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="currency-input-wrapper">
            <span className="currency-prefix">₹</span>
            <input
              type="number"
              className="form-control currency-input"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
            />
          </div>

          <span>-</span>

          <div className="currency-input-wrapper">
            <span className="currency-prefix">₹</span>
            <input
              type="number"
              className="form-control currency-input"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
            />
          </div>
        </div>

        <div className="range-slider-container position-relative mb-2">
          <input
            type="range"
            className="form-range"
            min={sliderMin}
            max={sliderMax}
            step={sliderStep}
            value={sliderVal}
            onChange={(e) => handleSliderChange(e.target.value)}
          />
        </div>
      </div>

      {/* Apply Filters Button */}
      <button 
        className="btn apply-filters-btn w-100"
        onClick={onApplyFilters}
        style={{
          background: '#4BAF47',
          color: 'white',
          fontWeight: '600',
          fontSize: '18px',
          borderRadius: '8px',
          padding: '0.75rem',
          border: 'none'
        }}
      >
        Apply Filters
      </button>

      {/* Internal CSS for non-Bootstrap styles */}
      <style jsx>{`
        .search-input {
          width: 20rem;
          max-width: 100%;
          height: 4rem;
          border-radius: 0.7rem;
          border: 0.5px solid #B4B4B4;
          background: #FFFFFF;
          padding: 0 1.5rem;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 22px;
          line-height: 30px;
          color: #565656;
        }

        .search-input::placeholder {
          color: #565656;
          opacity: 0.8;
        }

        .reset-btn {
          font-family: 'Manrope', sans-serif;
          font-weight: 500;
          font-size: 20px;
          color: #4BAF47;
          background: none;
          border: none;
          padding: 0;
        }

        .filter-results {
          width: 476px;
          max-width: 100%;
          height: 55px;
          background: #FCFCFA;
          border: 0.4px solid #717171;
          border-radius: 8px;
          padding: 0 1rem;
          font-family: 'Manrope', sans-serif;
          font-weight: 400;
          font-size: 18px;
          color: #4BAF47;
        }

        .filter-group {
          width: 476px;
          max-width: 100%;
          background: #FCFCFA;
          border: 0.4px solid #717171;
          border-radius: 8px;
          padding: 1rem;
        }

        .custom-radio {
          width: 16.67px;
          height: 16.67px;
          border: 2px solid #4BAF47;
          border-radius: 50%;
          appearance: none;
          cursor: pointer;
          flex-shrink: 0;
        }

        .custom-radio:checked {
          background-color: #4BAF47;
          border-color: #4BAF47;
        }

        .filter-option {
          font-family: 'Manrope', sans-serif;
          font-weight: 500;
          font-size: 18px;
          color: #565656;
          margin-left: 0.75rem;
          margin-bottom: 0;
          cursor: pointer;
        }

        .form-control {
          height: 2.5rem;
          font-size: 14px;
          border-radius: 0.5rem;
          border: 0.2px solid #000000;
        }

        .currency-input-wrapper { 
          position: relative; 
          flex: 1;
        }
        .currency-prefix {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          color: #565656;
          pointer-events: none;
          z-index: 2;
        }
        .currency-input { 
          padding-left: 2rem;
          width: 100%;
        }

        .range-slider-container {
          padding: 0.25rem 0;
          background: transparent;
        }

        .form-range {
          width: 100%;
          height: 0.5rem;
          background: transparent;
          position: relative;
        }

        .form-range::-webkit-slider-runnable-track {
          height: 0.5rem;
          background: linear-gradient(to right, #4BAF47 0%, #4BAF47 ${(sliderVal - sliderMin) / (sliderMax - sliderMin) * 100}%, #E5E5E5 ${(sliderVal - sliderMin) / (sliderMax - sliderMin) * 100}%, #E5E5E5 100%);
          border-radius: 0.25rem;
        }
        .form-range::-moz-range-track {
          height: 0.5rem;
          background: linear-gradient(to right, #4BAF47 0%, #4BAF47 ${(sliderVal - sliderMin) / (sliderMax - sliderMin) * 100}%, #E5E5E5 ${(sliderVal - sliderMin) / (sliderMax - sliderMin) * 100}%, #E5E5E5 100%);
          border-radius: 0.25rem;
        }

        .form-range::-webkit-slider-thumb {
          background: #4BAF47;
          border: 2px solid #4BAF47;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-top: -6px;
        }
        .form-range::-moz-range-thumb {
          background: #4BAF47;
          border: 2px solid #4BAF47;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }

        .apply-filters-btn:hover {
          background: #3d9639 !important;
        }

        @media (max-width: 992px) {
          .filters-section { width: 100% !important; padding-left: 1rem !important; padding-right: 1rem !important; }
          .filter-group, .filter-results { width: 100% !important; }
          .search-input { width: 100% !important; }
        }

        @media (max-width: 576px) {
          .filter-group { padding: 0.75rem !important; }
        }
      `}</style>
    </div>
  );
};

export default FiltersSection;
