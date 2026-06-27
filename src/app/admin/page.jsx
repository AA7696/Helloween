'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck, Package, Mail, Plus, Edit2,
  Trash2, Eye, LayoutGrid, CheckCircle, RefreshCw, LogOut,
  ShoppingBag, Users, IndianRupee
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, login, logout, loading } = useAuth();
  const router = useRouter();
  
  // Login form state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // CRUD Form states
  const [editingItem, setEditingItem] = useState(null); // holds the product being edited
  const [showForm, setShowForm] = useState(false);

  // Product Form fields
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Energy Drink',
    caffeine: '32 mg/100 ml',
    price: 120,
    stock: 100,
    vitamins: 'B2, B3, B5, B6, B12',
    description: '',
    imageUrl: '',
    isFeatured: false
  });

  // Load Dashboard Data
  const loadDashboardData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const prodRes = await fetch('/api/products');
      const inqRes = await fetch('/api/inquiries');
      const ordersRes = await fetch('/api/orders');
      const usersRes = await fetch('/api/auth/users');

      if (prodRes.ok) setProducts(await prodRes.json());
      if (inqRes.ok) setInquiries(await inqRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (usersRes.ok) setCustomers(await usersRes.json());
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) return;
    setLoggingIn(true);
    setLoginError(null);
    
    const result = await login({ username: usernameInput, password: passwordInput });
    if (!result.success) {
      setLoginError(result.error || 'Invalid credentials');
    }
    setLoggingIn(false);
  };

  // Product CRUD Handlers
  // Upload a product image file from the admin's device.
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setProductForm((f) => ({ ...f, imageUrl: data.url }));
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.imageUrl) {
      alert('Please upload a product image.');
      return;
    }
    const url = editingItem ? `/api/products/${editingItem._id}` : '/api/products';
    const method = editingItem ? 'PUT' : 'POST';

    // Parse vitamins string into array
    const vitaminsArray = productForm.vitamins.split(',').map(v => v.trim()).filter(Boolean);

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productForm,
          vitamins: vitaminsArray
        })
      });

      if (response.ok) {
        setShowForm(false);
        setEditingItem(null);
        resetProductForm();
        loadDashboardData();
      } else {
        const errData = await response.json();
        alert(errData.message || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error, please try again.');
    }
  };

  const handleEditProduct = (prod) => {
    setEditingItem(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      caffeine: prod.caffeine,
      price: prod.price,
      stock: prod.stock,
      vitamins: prod.vitamins.join(', '),
      description: prod.description,
      imageUrl: prod.imageUrl,
      isFeatured: prod.isFeatured
    });
    setShowForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      category: 'Energy Drink',
      caffeine: '32 mg/100 ml',
      price: 120,
      stock: 100,
      vitamins: 'B2, B3, B5, B6, B12',
      description: '',
      imageUrl: '',
      isFeatured: false
    });
  };

  // Inquiries Actions
  const handleUpdateInquiryStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Unread' ? 'Read' : 'Replied';
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (response.ok) {
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry permanently?')) return;
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Orders: update fulfilment status
  const handleUpdateOrderStatus = async (id, orderStatus) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus })
      });
      if (response.ok) {
        loadDashboardData();
      } else {
        const errData = await response.json();
        alert(errData.message || 'Could not update order');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalRevenue = orders
    .filter(o => o.isPaid)
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  // A logged-in non-admin (customer) is not allowed here — bounce to home.
  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      router.replace('/');
    }
  }, [loading, user, router]);

  if (loading || (user && user.role !== 'admin')) {
    return null;
  }

  // Fallback admin login view (the /admin route is also guarded by middleware).
  if (!user) {
    return (
      <div className="login-page bg-hero animate-fade-in">
        <div className="login-card glass-panel">
          <div className="login-header">
            <span className="secure-badge">
              <ShieldCheck size={20} /> ADMIN PORTAL
            </span>
            <h2>SIGN IN TO CITY</h2>
          </div>
          <form onSubmit={handleLoginSubmit} className="login-form">
            {loginError && <p className="login-error">{loginError}</p>}
            
            <div className="form-group">
              <label htmlFor="username">Admin Username</label>
              <input
                type="text"
                id="username"
                required
                placeholder="Enter username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Security Password</label>
              <input
                type="password"
                id="password"
                required
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary login-btn" disabled={loggingIn}>
              {loggingIn ? 'Authenticating...' : 'Secure Access'}
            </button>
          </form>
          <div className="credentials-helper">
            <p><strong>Demo Mode Fallback Active:</strong> If database is disconnected, mock details are: <br />Username: <code>admin</code> | Password: <code>helladmin123</code></p>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .login-page {
            min-height: calc(100vh - 80px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          .login-card {
            width: 100%;
            max-width: 420px;
            padding: 3rem 2.5rem;
            border-color: rgba(255, 255, 255, 0.08);
          }
          .login-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          .secure-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            color: var(--accent-red);
            font-weight: 800;
            font-size: 0.8rem;
            letter-spacing: 0.1em;
            margin-bottom: 0.5rem;
          }
          .login-header h2 {
            font-size: 1.6rem;
            text-transform: uppercase;
          }
          .login-form {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
          }
          .login-error {
            background: rgba(229, 9, 20, 0.08);
            border: 1px solid rgba(229, 9, 20, 0.2);
            color: #ff4a52;
            padding: 0.6rem;
            border-radius: 6px;
            font-size: 0.85rem;
            text-align: center;
            font-weight: 500;
          }
          .login-btn {
            height: 46px;
            margin-top: 0.5rem;
          }
          .credentials-helper {
            margin-top: 1.5rem;
            padding-top: 1.2rem;
            border-top: 1px dashed var(--border-color);
            font-size: 0.75rem;
            color: var(--text-secondary);
            line-height: 1.5;
          }
          .credentials-helper code {
            color: var(--accent-gold);
            font-size: 0.8rem;
          }
        ` }} />
      </div>
    );
  }

  // 2. Rendering Main Dashboard view if authenticated
  return (
    <div className="admin-dashboard-page animate-fade-in">
      <div className="container dashboard-container">
        
        {/* Header */}
        <div className="dashboard-header glass-panel">
          <div className="header-info">
            <span className="auth-pill">Authenticated Admin</span>
            <h1>HELL HUB DASHBOARD</h1>
          </div>
          <button onClick={loadDashboardData} className="refresh-btn" title="Reload data">
            <RefreshCw size={18} className={loadingData ? 'spin' : ''} />
          </button>
        </div>

        {/* Sidebar Nav & Main Panel Grid */}
        <div className="dashboard-grid">
          {/* Sidebar */}
          <aside className="dashboard-sidebar glass-panel">
            <button
              className={`sidebar-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => { setActiveTab('overview'); setShowForm(false); }}
            >
              <LayoutGrid size={18} /> Overview
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => { setActiveTab('products'); setShowForm(false); }}
            >
              <Package size={18} /> Products ({products.length})
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => { setActiveTab('orders'); setShowForm(false); }}
            >
              <ShoppingBag size={18} /> Orders ({orders.length})
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'customers' ? 'active' : ''}`}
              onClick={() => { setActiveTab('customers'); setShowForm(false); }}
            >
              <Users size={18} /> Customers ({customers.length})
            </button>
            <button
              className={`sidebar-tab ${activeTab === 'inquiries' ? 'active' : ''}`}
              onClick={() => { setActiveTab('inquiries'); setShowForm(false); }}
            >
              <Mail size={18} /> Inquiries ({inquiries.length})
            </button>

            <div className="sidebar-footer">
              <div className="logged-in-user">
                <span>Signed in as:</span>
                <strong>{user.username}</strong>
              </div>
              <button onClick={logout} className="logout-sidebar-btn">
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </aside>

          {/* Main Area */}
          <main className="dashboard-panel glass-panel">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="tab-view overview-tab">
                <h2>System Overview</h2>
                <div className="stats-row">
                  <div className="stat-box glass-panel">
                    <ShoppingBag size={24} className="stat-box-icon text-red" />
                    <div className="stat-box-vals">
                      <h3>{orders.length}</h3>
                      <span>Total Orders</span>
                    </div>
                  </div>
                  <div className="stat-box glass-panel">
                    <IndianRupee size={24} className="stat-box-icon text-green" />
                    <div className="stat-box-vals">
                      <h3>₹{totalRevenue.toLocaleString('en-IN')}</h3>
                      <span>Revenue (Paid)</span>
                    </div>
                  </div>
                  <div className="stat-box glass-panel">
                    <Users size={24} className="stat-box-icon text-gold" />
                    <div className="stat-box-vals">
                      <h3>{customers.length}</h3>
                      <span>Customers</span>
                    </div>
                  </div>
                  <div className="stat-box glass-panel">
                    <Package size={24} className="stat-box-icon text-red" />
                    <div className="stat-box-vals">
                      <h3>{products.length}</h3>
                      <span>Products</span>
                    </div>
                  </div>
                  <div className="stat-box glass-panel">
                    <Mail size={24} className="stat-box-icon text-green" />
                    <div className="stat-box-vals">
                      <h3>{inquiries.filter(i => i.status === 'Unread').length}</h3>
                      <span>Unread Messages</span>
                    </div>
                  </div>
                </div>

                <div className="overview-shortcuts glass-panel">
                  <h4>Quick Operations Shortcuts</h4>
                  <div className="shortcuts-row">
                    <button onClick={() => { setActiveTab('products'); resetProductForm(); setEditingItem(null); setShowForm(true); }} className="btn btn-outline btn-sm">
                      <Plus size={14} /> Add Product Can
                    </button>
                    <button onClick={() => { setActiveTab('orders'); }} className="btn btn-outline btn-sm">
                      <ShoppingBag size={14} /> View Orders
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FORM CONTAINER (Shared for Products & News creation/edit) */}
            {showForm && (
              <div className="form-container-view animate-fade-in-up">
                <div className="form-header">
                  <h2>{editingItem ? 'Edit' : 'Add New'} Product Can</h2>
                  <button onClick={() => { setShowForm(false); setEditingItem(null); }} className="btn-cancel">Cancel</button>
                </div>

                <form onSubmit={handleProductSubmit} className="admin-form">
                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Product Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. HELL Classy"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Category *</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        >
                          <option value="Energy Drink">Energy Drink</option>
                          <option value="Functional Drink">Functional Drink</option>
                          <option value="Tonic Water">Tonic Water</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Caffeine Level</label>
                        <input
                          type="text"
                          placeholder="e.g. 32 mg/100 ml"
                          value={productForm.caffeine}
                          onChange={(e) => setProductForm({ ...productForm, caffeine: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Vitamins (Comma Separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. B2, B3, B5, B6"
                          value={productForm.vitamins}
                          onChange={(e) => setProductForm({ ...productForm, vitamins: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Price (₹) *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="1"
                          placeholder="e.g. 120"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Stock</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="e.g. 100"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Product Image *</label>
                      <div className="image-upload">
                        {productForm.imageUrl && (
                          <div className="image-preview">
                            <img src={productForm.imageUrl} alt="Product preview" />
                          </div>
                        )}
                        <label className="upload-dropzone">
                          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                          {uploadingImage
                            ? 'Uploading…'
                            : productForm.imageUrl
                              ? 'Change image'
                              : 'Click to upload an image from your device'}
                        </label>
                        {uploadError && <span className="upload-error">{uploadError}</span>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        required
                        rows="4"
                        placeholder="Write dynamic product description..."
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="form-checkbox">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={productForm.isFeatured}
                        onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      />
                      <label htmlFor="isFeatured">Featured product (Display on landing slider)</label>
                    </div>

                    <button type="submit" className="btn btn-primary submit-btn">
                      {editingItem ? 'Update Flavour' : 'Add Flavour'}
                    </button>
                  </form>
              </div>
            )}

            {/* PRODUCTS LIST TAB */}
            {activeTab === 'products' && !showForm && (
              <div className="tab-view list-tab">
                <div className="tab-title-header">
                  <h2>Products Inventory</h2>
                  <button onClick={() => { resetProductForm(); setEditingItem(null); setShowForm(true); }} className="btn btn-primary btn-sm">
                    <Plus size={14} /> Add Product Can
                  </button>
                </div>

                <div className="admin-list-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Caffeine</th>
                        <th>Featured</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(prod => (
                        <tr key={prod._id}>
                          <td>
                            <div className="table-img-box">
                              <img src={prod.imageUrl} alt={prod.name} />
                            </div>
                          </td>
                          <td><strong>{prod.name}</strong></td>
                          <td><span className="cat-badge">{prod.category}</span></td>
                          <td>{prod.caffeine}</td>
                          <td>{prod.isFeatured ? <span className="feat-yes">Yes</span> : <span className="feat-no">No</span>}</td>
                          <td>
                            <div className="action-buttons-group">
                              <button onClick={() => handleEditProduct(prod)} className="icon-action-btn edit-btn" title="Edit">
                                <Edit2 size={14} />
                              </button>
                              <button onClick={() => handleDeleteProduct(prod._id)} className="icon-action-btn delete-btn" title="Delete">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && !showForm && (
              <div className="tab-view list-tab">
                <h2>Customer Orders</h2>
                {orders.length === 0 ? (
                  <p className="no-inquiries-text">No orders placed yet.</p>
                ) : (
                  <div className="admin-list-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Payment</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order._id}>
                            <td><strong>#{String(order._id).slice(-8).toUpperCase()}</strong></td>
                            <td>
                              <div className="cust-cell">
                                <strong>{order.user?.name || order.shippingAddress?.fullName || '—'}</strong>
                                <span className="cust-email">{order.user?.email || ''}</span>
                                <span className="cust-email">{order.shippingAddress?.phone}</span>
                                <span className="cust-email">{order.shippingAddress?.city} · {order.shippingAddress?.postalCode}</span>
                              </div>
                            </td>
                            <td>
                              <div className="order-items-cell">
                                {order.items.map((it, i) => (
                                  <span key={i}>{it.name} × {it.qty}</span>
                                ))}
                              </div>
                            </td>
                            <td><strong>₹{order.totalPrice}</strong></td>
                            <td>
                              <span className="pay-method">{order.paymentMethod}</span>
                              <span className={`status-pill ${order.isPaid ? 'pill-replied' : 'pill-read'}`}>
                                {order.isPaid ? 'Paid' : order.paymentStatus}
                              </span>
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>
                              <select
                                className="order-status-select"
                                value={order.orderStatus}
                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* CUSTOMERS TAB */}
            {activeTab === 'customers' && !showForm && (
              <div className="tab-view list-tab">
                <h2>Registered Customers</h2>
                {customers.length === 0 ? (
                  <p className="no-inquiries-text">No customers have registered yet.</p>
                ) : (
                  <div className="admin-list-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Orders</th>
                          <th>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map(cust => {
                          const orderCount = orders.filter(o => (o.user?._id || o.user) === cust._id).length;
                          return (
                            <tr key={cust._id}>
                              <td><strong>{cust.name || '—'}</strong></td>
                              <td>{cust.email}</td>
                              <td>{orderCount}</td>
                              <td>{cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* INQUIRIES LIST TAB */}
            {activeTab === 'inquiries' && (
              <div className="tab-view inquiries-tab">
                <h2>Customer Inquiries</h2>
                
                <div className="inquiries-list">
                  {inquiries.length > 0 ? (
                    inquiries.map(inq => (
                      <div key={inq._id} className={`inquiry-card glass-panel status-${inq.status.toLowerCase()}`}>
                        <div className="inquiry-header">
                          <div className="sender-meta">
                            <strong>{inq.name}</strong>
                            <span className="sender-email">&lt;{inq.email}&gt;</span>
                            <span className="inquiry-cat-badge">{inq.category}</span>
                          </div>
                          <div className="inquiry-date-actions">
                            <span className="inq-date">{new Date(inq.createdAt).toLocaleString()}</span>
                            <div className="inq-actions">
                              <button
                                onClick={() => handleUpdateInquiryStatus(inq._id, inq.status)}
                                className="inq-action-btn"
                                title={`Mark as ${inq.status === 'Unread' ? 'Read' : 'Replied'}`}
                              >
                                {inq.status === 'Unread' ? <Eye size={16} /> : <CheckCircle size={16} className="text-green" />}
                              </button>
                              <button onClick={() => handleDeleteInquiry(inq._id)} className="inq-action-btn delete" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="inquiry-message">
                          <p>{inq.message}</p>
                        </div>
                        <div className="inquiry-status-row">
                          <span className={`status-pill pill-${inq.status.toLowerCase()}`}>
                            {inq.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-inquiries-text">Inbox is empty. No customer inquiries received.</p>
                  )}
                </div>
              </div>
            )}

          </main>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-dashboard-page {
          padding: 3rem 0;
          min-height: calc(100vh - 80px);
        }
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        /* Header styling */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.8rem 2.5rem;
          border-color: rgba(255, 255, 255, 0.08);
        }
        .auth-pill {
          display: inline-block;
          font-family: var(--font-heading);
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid rgba(57, 255, 20, 0.2);
          color: var(--accent-green);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          margin-bottom: 0.5rem;
        }
        .dashboard-header h1 {
          font-size: 1.8rem;
          text-transform: uppercase;
        }
        .refresh-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .refresh-btn:hover {
          border-color: var(--accent-red);
          color: var(--accent-red);
        }
        .refresh-btn .spin {
          animation: spin 1s linear infinite;
        }

        /* Layout Grid */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 992px) {
          .dashboard-grid {
            grid-template-columns: 280px 1fr;
          }
        }
        
        /* Sidebar styling */
        .dashboard-sidebar {
          padding: 2rem 1.5rem;
          border-color: rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          height: fit-content;
        }
        .sidebar-tab {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          width: 100%;
          padding: 0.8rem 1.2rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-secondary);
          text-align: left;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .sidebar-tab:hover, .sidebar-tab.active {
          background-color: var(--accent-red);
          color: white;
          box-shadow: 0 4px 10px var(--accent-red-glow);
        }
        .sidebar-footer {
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .logged-in-user {
          font-size: 0.8rem;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
        }
        .logged-in-user strong {
          color: var(--text-primary);
          font-size: 0.95rem;
          margin-top: 0.2rem;
        }
        .logout-sidebar-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem;
          border-radius: 8px;
          border: 1px solid rgba(229, 9, 20, 0.2);
          background: rgba(229, 9, 20, 0.05);
          color: #ff4a52;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .logout-sidebar-btn:hover {
          background: var(--accent-red);
          color: white;
          border-color: var(--accent-red);
        }
        
        /* Main Dashboard Panel */
        .dashboard-panel {
          padding: 2.5rem;
          border-color: rgba(255,255,255,0.05);
          min-height: 500px;
        }
        @media (max-width: 576px) {
          .dashboard-panel { padding: 1.5rem; }
        }
        .tab-view h2 {
          font-size: 1.5rem;
          text-transform: uppercase;
          margin-bottom: 2rem;
          border-left: 4px solid var(--accent-red);
          padding-left: 0.8rem;
        }
        
        /* Stat boxes (Overview) */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .stat-box {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          padding: 1.8rem;
          border-color: rgba(255,255,255,0.03);
        }
        .stat-box-icon {
          padding: 0.8rem;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
        }
        .stat-box-vals h3 {
          font-size: 2rem;
          font-weight: 900;
        }
        .stat-box-vals span {
          font-size: 0.8rem;
          text-transform: uppercase;
          color: var(--text-secondary);
          font-weight: 700;
        }
        .overview-shortcuts {
          padding: 2rem;
          border-color: rgba(255, 255, 255, 0.03);
        }
        .overview-shortcuts h4 {
          text-transform: uppercase;
          margin-bottom: 1.2rem;
          font-size: 1rem;
        }
        .shortcuts-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        /* Table Styles (List Tabs) */
        .tab-title-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1rem;
        }
        .tab-title-header h2 {
          margin-bottom: 0;
        }
        .admin-list-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }
        .admin-table th, .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        .admin-table th {
          text-transform: uppercase;
          font-weight: 700;
          color: var(--text-secondary);
          font-size: 0.8rem;
          letter-spacing: 0.05em;
        }
        .table-img-box {
          width: 50px;
          height: 50px;
          border-radius: 6px;
          background: radial-gradient(circle, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.3rem;
        }
        .table-img-box img {
          max-height: 100%;
          object-fit: contain;
        }
        .cat-badge {
          background: rgba(197, 160, 89, 0.08);
          color: var(--accent-gold);
          border: 1px solid var(--accent-gold-glow);
          padding: 0.2rem 0.6rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .feat-yes { color: var(--accent-green); font-weight: 700; }
        .feat-no { color: var(--text-muted); }
        .action-buttons-group {
          display: flex;
          gap: 0.6rem;
        }
        .icon-action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .icon-action-btn:hover {
          color: white;
        }
        .icon-action-btn.edit-btn:hover {
          background: var(--accent-gold);
          border-color: var(--accent-gold);
        }
        .icon-action-btn.delete-btn:hover {
          background: var(--accent-red);
          border-color: var(--accent-red);
        }
        .table-title-val {
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Form styling */
        .form-container-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1rem;
        }
        .btn-cancel {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          text-transform: uppercase;
        }
        .btn-cancel:hover {
          color: var(--accent-red);
        }
        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .form-row-2 {
            grid-template-columns: 1fr 1fr;
          }
        }
        .admin-form .form-group input,
        .admin-form .form-group select,
        .admin-form .form-group textarea {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.95rem;
          width: 100%;
        }
        .admin-form .form-group input:focus,
        .admin-form .form-group select:focus,
        .admin-form .form-group textarea:focus {
          border-color: var(--accent-red);
          box-shadow: 0 0 10px var(--accent-red-glow);
        }
        .form-checkbox {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
        }
        .form-checkbox input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        .form-checkbox label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        /* Image upload control */
        .image-upload { display: flex; flex-direction: column; gap: 0.8rem; }
        .image-preview {
          width: 130px; height: 130px; border-radius: 10px;
          background: radial-gradient(circle, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
          border: 1px solid var(--border-color);
          display: flex; align-items: center; justify-content: center; padding: 0.6rem;
        }
        .image-preview img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .upload-dropzone {
          display: flex; align-items: center; justify-content: center; text-align: center;
          padding: 1.1rem 1rem; border: 1px dashed var(--border-color); border-radius: 10px;
          background: var(--bg-tertiary); color: var(--text-secondary);
          font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: var(--transition-fast);
        }
        .upload-dropzone:hover { border-color: var(--accent-red); color: var(--text-primary); }
        .upload-error { color: #ff6b71; font-size: 0.85rem; }

        /* Inquiries Tab Inbox */
        .inquiries-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .inquiry-card {
          padding: 2rem;
          border-color: rgba(255, 255, 255, 0.04);
          position: relative;
          border-left: 4px solid var(--border-color);
        }
        .inquiry-card.status-unread {
          border-left-color: var(--accent-red);
          background: rgba(229, 9, 20, 0.01);
        }
        .inquiry-card.status-read {
          border-left-color: var(--accent-gold);
        }
        .inquiry-card.status-replied {
          border-left-color: var(--accent-green);
        }
        .inquiry-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1rem;
        }
        .sender-meta {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .sender-email {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .inquiry-cat-badge {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          text-transform: uppercase;
          font-weight: 700;
        }
        .inquiry-date-actions {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }
        .inq-date {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .inq-actions {
          display: flex;
          gap: 0.5rem;
        }
        .inq-action-btn {
          width: 30px;
          height: 30px;
          border-radius: 4px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
          color: var(--text-secondary);
        }
        .inq-action-btn:hover {
          color: var(--text-primary);
          border-color: var(--accent-red);
        }
        .inq-action-btn.delete:hover {
          background: var(--accent-red);
          border-color: var(--accent-red);
        }
        .inquiry-message {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 0.95rem;
        }
        .inquiry-status-row {
          margin-top: 1rem;
        }
        .status-pill {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          padding: 0.2rem 0.6rem;
          border-radius: 30px;
        }
        .pill-unread {
          background: rgba(229, 9, 20, 0.1);
          color: #ff4a52;
          border: 1px solid rgba(229, 9, 20, 0.2);
        }
        .pill-read {
          background: rgba(197, 160, 89, 0.1);
          color: var(--accent-gold);
          border: 1px solid var(--accent-gold-glow);
        }
        .pill-replied {
          background: rgba(57, 255, 20, 0.1);
          color: var(--accent-green);
          border: 1px solid rgba(57, 255, 20, 0.2);
        }
        .no-inquiries-text {
          text-align: center;
          padding: 4rem 0;
          color: var(--text-secondary);
          font-weight: 500;
        }

        /* Orders & Customers tables */
        .cust-cell {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .cust-email {
          color: var(--text-muted);
          font-size: 0.78rem;
        }
        .order-items-cell {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          font-size: 0.82rem;
          color: var(--text-secondary);
          max-width: 220px;
        }
        .pay-method {
          display: block;
          font-weight: 700;
          font-size: 0.82rem;
          margin-bottom: 0.3rem;
        }
        .order-status-select {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 0.45rem 0.7rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        .order-status-select:focus { border-color: var(--accent-red); }
      ` }} />
    </div>
  );
};

export default AdminDashboard;
