// src/shop/Shop.jsx

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FiltersSection from './FiltersSection';
import OfferCard from './OfferCard';
import RiceAndGrain from './RiceAndGrain';
import productsData from '../../data/products.json';
import { useNavigate } from 'react-router-dom';
import { Lock, ShoppingCart } from 'lucide-react';

const isLoggedIn = () => !!sessionStorage.getItem('token');

const Shop = () => {
  const navigate = useNavigate();

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

  const loggedIn = isLoggedIn();

  // ── NOT LOGGED IN UI ─────────────────────────────
  if (!loggedIn) {
    return (
      <div style={{ position: 'relative', minHeight: '80vh', overflow: 'hidden' }}>
        
        {/* Blurred background */}
        <div style={{
          filter: 'blur(6px)',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.5
        }}>
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
        </div>

        {/* Login overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.55)',
          padding: '100px 40px',
        }}>
          <div style={{
            background: '#fff',
            padding: '40px 30px',
            borderRadius: '18px',
            textAlign: 'center',
            maxWidth: '380px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)'
          }}>
            
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#FEF0E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <ShoppingCart size={28} color="#EC5B13" />
            </div>

            <h3 style={{ marginBottom: 10 }}>Explore Products</h3>
            <p style={{ fontSize: 14, color: '#6b7280' }}>
              Please log in to browse products and apply filters.
            </p>

            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                marginTop: 18,
                padding: '12px',
                background: '#EC5B13',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <Lock size={16} /> Login to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LOGGED IN UI ─────────────────────────────
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