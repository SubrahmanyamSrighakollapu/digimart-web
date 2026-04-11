import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ShoppingBasket, Leaf } from 'lucide-react';
import FiltersSection from '../../../pages/shop/FiltersSection';
import AgentRiceAndGrains from './AgentRiceAndGrain';
import agentService from '../../../services/agentService';

const BuyFromFarmers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ searchQuery: '', selectedCategories: [], minPrice: '', maxPrice: '' });
  const [appliedFilters, setAppliedFilters] = useState({ searchQuery: '', selectedCategories: [], minPrice: '', maxPrice: '' });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await agentService.getAgentProducts();
      if (response?.status === 1 && response.result) {
        setProducts(response.result.map(p => ({
          id: p.productId,
          img: p.productImages?.length > 0
            ? `${import.meta.env.VITE_API_BASE_URL}/${p.productImages[0].replace(/\\/g, '/')}`
            : null,
          title: p.productTitle,
          name: p.productName,
          type: p.categoryName,
          quantity: `1 ${p.quantityType}`,
          status: 'In Stock',
          price: p.finalPrice,
          moq: '1 Ton',
          description: p.productDescription,
          categoryId: p.categoryId,
          categoryName: p.categoryName,
        })));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #EC5B13 0%, #F07030 60%, #32a862 100%)',
        borderRadius: '16px', padding: '24px 32px', marginBottom: '28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 6px 24px rgba(236,91,19,0.22)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '80px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', filter: 'blur(30px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20px', right: '10px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(50,168,98,0.15)', filter: 'blur(20px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBasket size={18} color="white" />
            </div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '-0.01em' }}>
              Place Orders
            </h1>
          </div>
          {/* <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
            Verified direct-from-farm sourcing · Bulk pricing for orders over 10 tons
          </p> */}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 16px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.25)' }}>
          <Leaf size={16} color="white" />
          <div>
            <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>Available Products</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: 'white' }}>{loading ? '...' : products.length}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', gap: '0', alignItems: 'flex-start' }}>
        <FiltersSection
          filters={filters}
          setFilters={setFilters}
          products={products}
          onApplyFilters={() => setAppliedFilters({ ...filters })}
        />
        <AgentRiceAndGrains filters={appliedFilters} products={products} loading={loading} />
      </div>
    </div>
  );
};

export default BuyFromFarmers;
