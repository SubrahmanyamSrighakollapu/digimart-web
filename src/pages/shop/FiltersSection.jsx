import { useState, useMemo } from 'react';
import { Search, RotateCcw, SlidersHorizontal, Tag, X } from 'lucide-react';

const P = '#EC5B13';
const PL = '#FEF0E9';
const G = '#32a862';
const GL = '#e6f7ed';

const FiltersSection = ({ filters = { searchQuery: '', selectedCategories: [], minPrice: '', maxPrice: '' }, setFilters, products = [], onApplyFilters }) => {
  const [sliderVal, setSliderVal] = useState(10000);
  const sliderMin = 0;
  const sliderMax = 100000;
  const sliderStep = 1000;
  const sliderPct = ((sliderVal - sliderMin) / (sliderMax - sliderMin)) * 100;

  const availableCategories = useMemo(() => {
    const map = new Map();
    products.forEach(p => { if (p.categoryId && p.categoryName) map.set(p.categoryId, { id: p.categoryId, name: p.categoryName }); });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const handleSliderChange = (value) => {
    setSliderVal(Number(value));
    setFilters(prev => ({ ...prev, minPrice: Number(value), maxPrice: prev.maxPrice || Number(value) + sliderStep * 5 }));
  };

  const handleReset = () => {
    setFilters({ searchQuery: '', selectedCategories: [], minPrice: '', maxPrice: '' });
    setSliderVal(10000);
    setTimeout(() => onApplyFilters(), 0);
  };

  const activeFilterCount = (filters.selectedCategories?.length || 0) + (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0);

  return (
    <div style={{ width: '280px', minWidth: '280px', padding: '0 20px 24px 0', flexShrink: 0 }}>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Search products..."
          value={filters.searchQuery}
          onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
          style={{
            width: '100%', padding: '11px 36px 11px 36px',
            border: '1px solid #e5e7eb', borderRadius: '10px',
            fontSize: '13px', outline: 'none', backgroundColor: '#fff',
            color: '#1c1917', boxSizing: 'border-box', transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
          onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
        />
        {filters.searchQuery && (
          <button onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={15} color={P} />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>Filters</span>
          {activeFilterCount > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: P, color: 'white', fontSize: '10px', fontWeight: 700 }}>
              {activeFilterCount}
            </span>
          )}
        </div>
        <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: P, fontWeight: 600, padding: '4px 8px', borderRadius: '6px', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = PL}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Categories */}
      {availableCategories.length > 0 && (
        <div style={{ backgroundColor: '#fff', border: '1px solid #f0ede9', borderRadius: '12px', padding: '16px', marginBottom: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Tag size={13} color={P} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1c1917', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {availableCategories.map(cat => {
              const checked = filters.selectedCategories.includes(cat.name);
              return (
                <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 8px', borderRadius: '8px', transition: 'background 0.12s', backgroundColor: checked ? PL : 'transparent' }}
                  onMouseEnter={e => { if (!checked) e.currentTarget.style.backgroundColor = '#faf8f6'; }}
                  onMouseLeave={e => { if (!checked) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div
                    onClick={() => setFilters(prev => ({ ...prev, selectedCategories: prev.selectedCategories.includes(cat.name) ? prev.selectedCategories.filter(c => c !== cat.name) : [...prev.selectedCategories, cat.name] }))}
                    style={{
                      width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                      border: `2px solid ${checked ? P : '#d1d5db'}`,
                      backgroundColor: checked ? P : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s', cursor: 'pointer',
                    }}
                  >
                    {checked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <span style={{ fontSize: '13px', color: checked ? P : '#374151', fontWeight: checked ? 600 : 400 }}>{cat.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div style={{ backgroundColor: '#fff', border: '1px solid #f0ede9', borderRadius: '12px', padding: '16px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#1c1917', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price Range</span>
        </div>

        {/* Min / Max inputs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          {[
            { label: 'Min', key: 'minPrice' },
            { label: 'Max', key: 'maxPrice' },
          ].map(({ label, key }) => (
            <div key={key} style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#9ca3af', pointerEvents: 'none' }}>₹</span>
              <input
                type="number"
                placeholder={label}
                value={filters[key]}
                onChange={e => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
                style={{ width: '100%', padding: '8px 8px 8px 22px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', outline: 'none', boxSizing: 'border-box', color: '#1c1917' }}
                onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 2px ${PL}`; }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          ))}
        </div>

        {/* Slider */}
        <div style={{ position: 'relative', paddingBottom: '4px' }}>
          <div style={{ position: 'relative', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '999px', marginBottom: '8px' }}>
            <div style={{ position: 'absolute', left: 0, width: `${sliderPct}%`, height: '100%', backgroundColor: P, borderRadius: '999px' }} />
          </div>
          <input
            type="range" min={sliderMin} max={sliderMax} step={sliderStep} value={sliderVal}
            onChange={e => handleSliderChange(e.target.value)}
            style={{ position: 'absolute', top: '-4px', left: 0, width: '100%', opacity: 0, cursor: 'pointer', height: '20px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af' }}>
            <span>₹0</span>
            <span style={{ color: P, fontWeight: 600 }}>₹{sliderVal.toLocaleString()}</span>
            <span>₹1L</span>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={onApplyFilters}
        style={{
          width: '100%', padding: '12px', backgroundColor: P, color: 'white',
          border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px',
          cursor: 'pointer', transition: 'opacity 0.15s, transform 0.1s',
          boxShadow: `0 4px 14px rgba(236,91,19,0.3)`,
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FiltersSection;
