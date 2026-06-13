'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, HelpCircle, X, Info, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Products = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [addedId, setAddedId] = useState(null);

  const handleAdd = (e, product) => {
    if (e) e.stopPropagation();
    // The cart requires an account — send guests to login first.
    if (!user) {
      router.push('/login?redirect=/products');
      return;
    }
    addToCart(product, 1);
    setAddedId(product._id);
    setTimeout(() => setAddedId((cur) => (cur === product._id ? null : cur)), 1200);
  };

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch products on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim() !== '') {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'caffeine-desc') {
      // Extract numeric value from "32 mg/100 ml" or "38.4 mg/100 ml"
      const getCaffeineValue = (str) => {
        const val = parseFloat(str);
        return isNaN(val) ? 0 : val;
      };
      result.sort((a, b) => getCaffeineValue(b.caffeine) - getCaffeineValue(a.caffeine));
    } else {
      // default: newest
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, sortBy, products]);

  const categories = ['All', 'Energy Drink', 'Functional Drink'];

  // Vitamin descriptions lookup
  const getVitaminDesc = (vit) => {
    const v = vit.toLowerCase();
    if (v.includes('b2')) return 'Riboflavin: aids the maintenance of healthy vision and energy production.';
    if (v.includes('b3')) return 'Niacin: supports healthy skin functions and nervous system stability.';
    if (v.includes('b5')) return 'Pantothenic Acid: promotes mental performance and decreases mental exhaustion.';
    if (v.includes('b6')) return 'Vitamin B6: helps decrease fatigue, exhaustion, and boosts the immune system.';
    if (v.includes('b12')) return 'Vitamin B12: aids metabolic energy production and nerve protection.';
    if (v.includes('a')) return 'Vitamin A: essential for vision health and immune defenses.';
    if (v.includes('c')) return 'Vitamin C: natural antioxidant, protects cells and supports collagen synthesis.';
    if (v.includes('d')) return 'Vitamin D: aids calcium absorption and maintains bone integrity.';
    if (v.includes('e')) return 'Vitamin E: strong antioxidant protecting lipids from oxidative stress.';
    return 'Essential nutrient supporting overall vitality and metabolism.';
  };

  return (
    <div className="products-page animate-fade-in">
      <div className="container">
        {/* Header */}
        <div className="text-center-wrapper">
          <h2 className="section-title">THE HELL PORTFOLIO</h2>
          <p className="section-subtitle">
            Explore our diverse ranges of high-energy drinks and
            vitamins-enriched functional cans.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="filter-controls glass-panel">
          {/* Categories selectors */}
          <div className="category-selectors">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'All' ? 'All Cans' : cat}
              </button>
            ))}
          </div>

          {/* Search and Sort Inputs */}
          <div className="search-sort-group">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search flavours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="sort-wrapper">
              <SlidersHorizontal size={18} className="sort-icon" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest Launches</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
                <option value="name-desc">Alphabetical (Z-A)</option>
                <option value="caffeine-desc">Highest Caffeine</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading energy portfolio...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(prod => (
              <div
                key={prod._id}
                className="product-card glass-panel"
                onClick={() => setSelectedProduct(prod)}
              >
                <div className="product-image-container">
                  <img src={prod.imageUrl} alt={prod.name} />
                </div>
                <div className="product-body">
                  <span className="product-category">{prod.category}</span>
                  <h3>{prod.name}</h3>
                  <div className="product-pills">
                    <span className="pill caffeine-badge">{prod.caffeine}</span>
                    <span className="pill vitamin-badge">{prod.vitamins.length} Vitamins</span>
                  </div>
                  <div className="product-buy-row">
                    <span className="product-price">₹{prod.price}</span>
                    <button
                      className={`add-cart-btn ${addedId === prod._id ? 'added' : ''}`}
                      onClick={(e) => handleAdd(e, prod)}
                    >
                      {addedId === prod._id ? <><Check size={15} /> Added</> : <><ShoppingCart size={15} /> Add</>}
                    </button>
                  </div>
                </div>
                <button className="card-details-link" onClick={() => setSelectedProduct(prod)}>
                  <Info size={14} /> View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <HelpCircle size={48} />
            <p>No products match your selected filters.</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content glass-panel animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>
              <X size={24} />
            </button>
            <div className="modal-grid">
              {/* Left Column: Image */}
              <div className="modal-image-box">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} />
              </div>

              {/* Right Column: Details */}
              <div className="modal-info-box">
                <span className="info-category">{selectedProduct.category}</span>
                <h2>{selectedProduct.name}</h2>
                
                <div className="caffeine-stats">
                  <span className="stat-label">Caffeine level:</span>
                  <span className="stat-value text-glow-red">{selectedProduct.caffeine}</span>
                </div>

                <div className="modal-buy-row">
                  <span className="modal-price">₹{selectedProduct.price}</span>
                  <button
                    className={`btn btn-primary modal-add-btn ${addedId === selectedProduct._id ? 'added' : ''}`}
                    onClick={() => handleAdd(null, selectedProduct)}
                  >
                    {addedId === selectedProduct._id ? <><Check size={16} /> Added to Cart</> : <><ShoppingCart size={16} /> Add to Cart</>}
                  </button>
                </div>

                <div className="info-section">
                  <h3>Flavour Profile & Description</h3>
                  <p>{selectedProduct.description}</p>
                </div>

                <div className="info-section">
                  <h3>Fortified Vitamins Complex</h3>
                  <ul className="vitamin-list">
                    {selectedProduct.vitamins.map((vit, i) => (
                      <li key={i}>
                        <strong>{vit}:</strong> {getVitaminDesc(vit)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sustainability-box">
                  <strong>Sustainability Note:</strong> Packaging consists of infinitely 
                  recyclable aluminium cans, keeping the planet as clean as our pasteurization process.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .products-page {
          padding: 3rem 0 5rem 0;
        }
        
        /* Filter Controls */
        .filter-controls {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1.5rem;
          margin-bottom: 3rem;
          border-color: rgba(255, 255, 255, 0.05);
        }
        @media (min-width: 992px) {
          .filter-controls {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
        .category-selectors {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
        }
        .cat-pill {
          padding: 0.6rem 1.2rem;
          border-radius: 30px;
          border: 1px solid var(--border-color);
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .cat-pill:hover, .cat-pill.active {
          background-color: var(--accent-red);
          border-color: var(--accent-red);
          color: white;
          box-shadow: 0 0 12px var(--accent-red-glow);
        }
        .search-sort-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .search-input-wrapper {
          display: flex;
          align-items: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 0 1rem;
          border-radius: 30px;
          height: 42px;
          min-width: 250px;
        }
        .search-input-wrapper input {
          flex-grow: 1;
          font-size: 0.9rem;
          padding-left: 0.5rem;
        }
        .search-icon {
          color: var(--text-muted);
        }
        .sort-wrapper {
          display: flex;
          align-items: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 0 1rem;
          border-radius: 30px;
          height: 42px;
        }
        .sort-wrapper select {
          background: transparent;
          font-size: 0.9rem;
          font-weight: 600;
          padding-left: 0.5rem;
          cursor: pointer;
          height: 100%;
        }
        .sort-icon {
          color: var(--text-muted);
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 2rem;
        }
        .product-card {
          cursor: pointer;
          overflow: hidden;
          transition: var(--transition-medium);
          position: relative;
          padding: 0;
          border-color: rgba(255, 255, 255, 0.03);
          min-height: 380px;
          display: flex;
          flex-direction: column;
        }
        .product-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent-red);
          box-shadow: 0 10px 25px var(--accent-red-glow);
        }
        .product-image-container {
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
          padding: 1.5rem;
          overflow: hidden;
        }
        .product-image-container img {
          max-height: 100%;
          object-fit: contain;
          transition: var(--transition-medium);
        }
        .product-card:hover .product-image-container img {
          transform: scale(1.08) rotate(3deg);
        }
        .product-body {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .product-category {
          color: var(--accent-gold);
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 700;
        }
        .product-card h3 {
          font-size: 1.2rem;
          text-transform: uppercase;
          line-height: 1.3;
        }
        .product-pills {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
        }
        .product-pills .pill {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
        }
        .product-buy-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.6rem;
          margin-top: 0.9rem;
        }
        .product-price {
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: 1.3rem;
          color: var(--text-primary);
        }
        .add-cart-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: var(--accent-red);
          color: #fff;
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          padding: 0.5rem 0.9rem;
          border-radius: 30px;
          cursor: pointer;
          transition: var(--transition-fast);
          z-index: 2;
        }
        .add-cart-btn:hover { background: var(--accent-red-hover); box-shadow: 0 0 12px var(--accent-red-glow); }
        .add-cart-btn.added { background: var(--accent-green); color: #0b0c10; }
        .modal-buy-row {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          padding: 0.5rem 0;
        }
        .modal-price {
          font-family: var(--font-heading);
          font-weight: 900;
          font-size: 1.8rem;
          color: var(--text-primary);
        }
        .modal-add-btn.added { background: var(--accent-green); color: #0b0c10; }
        .card-details-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 0.7rem;
          color: var(--text-muted);
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          cursor: pointer;
          align-self: flex-start;
        }
        .card-details-link:hover { color: var(--accent-red); }
        .card-hover-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 42px;
          background: var(--accent-red);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          transform: translateY(100%);
          transition: var(--transition-medium);
        }
        .product-card:hover .card-hover-indicator {
          transform: translateY(0);
        }

        /* Loading / Empty States */
        .loading-state, .empty-state {
          padding: 5rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          color: var(--text-secondary);
        }
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid var(--bg-tertiary);
          border-top: 4px solid var(--accent-red);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Modal backdrop and Content */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .modal-content {
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 3rem;
          border-color: rgba(255, 255, 255, 0.1);
        }
        @media (max-width: 768px) {
          .modal-content {
            padding: 2rem 1.5rem;
          }
        }
        .modal-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          cursor: pointer;
          color: var(--text-secondary);
          transition: var(--transition-fast);
        }
        .modal-close:hover {
          color: var(--accent-red);
        }
        .modal-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }
        @media (min-width: 768px) {
          .modal-grid {
            grid-template-columns: 1fr 1.2fr;
          }
        }
        .modal-image-box {
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
          border-radius: var(--card-radius);
          padding: 2rem;
          height: 380px;
        }
        .modal-image-box img {
          max-height: 100%;
          object-fit: contain;
        }
        .modal-info-box {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .info-category {
          color: var(--accent-gold);
          text-transform: uppercase;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
        }
        .modal-info-box h2 {
          font-size: 2rem;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .caffeine-stats {
          display: flex;
          gap: 0.8rem;
          font-size: 1rem;
          font-weight: 600;
        }
        .stat-value {
          color: var(--accent-red);
        }
        .info-section h3 {
          font-size: 1.1rem;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
          color: var(--text-primary);
          border-left: 3px solid var(--accent-red);
          padding-left: 0.6rem;
        }
        .info-section p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .vitamin-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .vitamin-list li strong {
          color: var(--text-primary);
        }
        .sustainability-box {
          background: rgba(57, 255, 20, 0.05);
          border: 1px dashed var(--accent-green-glow);
          padding: 1rem;
          border-radius: 10px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .sustainability-box strong {
          color: var(--accent-green);
        }
      ` }} />
    </div>
  );
};

export default Products;
