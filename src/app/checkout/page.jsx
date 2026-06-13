'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, Loader2, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

function CheckoutInner() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const cartPayload = () => items.map(i => ({ productId: i._id, qty: i.qty }));

  const placeOrder = async (razorpay = null) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartPayload(),
        shippingAddress: form,
        paymentMethod,
        razorpay,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Could not place order');
    return data;
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleRazorpay = async () => {
    // 1. Ask the server to create a Razorpay order (amount computed server-side).
    const res = await fetch('/api/orders/razorpay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartPayload() }),
    });
    const rzp = await res.json();
    if (!res.ok) throw new Error(rzp.message || 'Payment init failed');

    // 2a. Mock mode (no real keys configured) — skip the widget, place order directly.
    if (rzp.mock) {
      const order = await placeOrder({
        orderId: rzp.orderId,
        paymentId: 'mock_payment_' + Date.now(),
        signature: 'mock_signature',
      });
      return order;
    }

    // 2b. Real Razorpay — open the hosted checkout widget.
    const ok = await loadRazorpayScript();
    if (!ok) throw new Error('Failed to load Razorpay. Check your connection.');

    return new Promise((resolve, reject) => {
      const rzpInstance = new window.Razorpay({
        key: rzp.keyId,
        amount: rzp.amount,
        currency: rzp.currency,
        name: 'Helloween Energy',
        description: 'Energy drink order',
        order_id: rzp.orderId,
        prefill: { name: form.fullName, email: user?.email, contact: form.phone },
        theme: { color: '#e50914' },
        handler: async (response) => {
          try {
            const order = await placeOrder({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            resolve(order);
          } catch (err) {
            reject(err);
          }
        },
        modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
      });
      rzpInstance.open();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setBusy(true);
    try {
      if (paymentMethod === 'COD') {
        await placeOrder(null);
      } else {
        await handleRazorpay();
      }
      clearCart();
      router.push('/orders?success=1');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page container">
        <div className="glass-panel empty-checkout">
          <p>Your cart is empty.</p>
          <button className="btn btn-primary" onClick={() => router.push('/products')}>Shop Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container animate-fade-in">
      <h1 className="checkout-title">Checkout</h1>
      {error && <div className="checkout-error">{error}</div>}

      <form className="checkout-layout" onSubmit={handleSubmit}>
        <div className="checkout-main">
          <section className="glass-panel checkout-section">
            <h2><Truck size={20} /> Shipping Address</h2>
            <div className="field-grid">
              <label>Full name<input value={form.fullName} onChange={e => update('fullName', e.target.value)} required /></label>
              <label>Phone<input value={form.phone} onChange={e => update('phone', e.target.value)} required /></label>
              <label className="full">Address<input value={form.address} onChange={e => update('address', e.target.value)} required /></label>
              <label>City<input value={form.city} onChange={e => update('city', e.target.value)} required /></label>
              <label>Postal code<input value={form.postalCode} onChange={e => update('postalCode', e.target.value)} required /></label>
            </div>
          </section>

          <section className="glass-panel checkout-section">
            <h2><CreditCard size={20} /> Payment Method</h2>
            <div className="pay-options">
              <label className={`pay-option ${paymentMethod === 'Razorpay' ? 'active' : ''}`}>
                <input type="radio" name="pay" checked={paymentMethod === 'Razorpay'} onChange={() => setPaymentMethod('Razorpay')} />
                <div>
                  <strong>Pay Online (Razorpay)</strong>
                  <span>Cards, UPI, netbanking — secure checkout</span>
                </div>
              </label>
              <label className={`pay-option ${paymentMethod === 'COD' ? 'active' : ''}`}>
                <input type="radio" name="pay" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                <div>
                  <strong>Cash on Delivery</strong>
                  <span>Pay with cash when your order arrives</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        <aside className="glass-panel checkout-summary">
          <h2>Summary</h2>
          <div className="summary-items">
            {items.map(i => (
              <div key={i._id} className="summary-item">
                <span>{i.name} × {i.qty}</span>
                <span>₹{i.price * i.qty}</span>
              </div>
            ))}
          </div>
          <div className="summary-row"><span>Subtotal</span><span>₹{totalPrice}</span></div>
          <div className="summary-row"><span>Shipping</span><span className="free">FREE</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{totalPrice}</span></div>
          <button type="submit" className="btn btn-primary place-btn" disabled={busy}>
            {busy ? <Loader2 size={18} className="spin" /> : <Lock size={16} />}
            {busy ? 'Processing...' : `Place Order · ₹${totalPrice}`}
          </button>
        </aside>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        .checkout-page { padding: 2.5rem 1.5rem 5rem; }
        .checkout-title { font-size: 2.2rem; margin-bottom: 1.5rem; }
        .checkout-error {
          background: rgba(229,9,20,0.12); border: 1px solid var(--accent-red);
          color: #ff8a90; padding: 0.8rem 1rem; border-radius: 8px; margin-bottom: 1.2rem;
        }
        .checkout-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start; }
        @media (max-width: 860px) { .checkout-layout { grid-template-columns: 1fr; } }
        .checkout-main { display: flex; flex-direction: column; gap: 1.5rem; }
        .checkout-section { padding: 1.6rem; }
        .checkout-section h2 { display: flex; align-items: center; gap: 0.5rem; font-size: 1.2rem; margin-bottom: 1.2rem; }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .field-grid label.full { grid-column: 1 / -1; }
        .field-grid label {
          display: flex; flex-direction: column; gap: 0.4rem;
          font-size: 0.8rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.04em; color: var(--text-secondary);
        }
        .field-grid input {
          background: var(--bg-tertiary); border: 1px solid var(--border-color);
          border-radius: 8px; padding: 0.75rem 0.9rem; color: var(--text-primary); font-size: 0.95rem;
        }
        .field-grid input:focus { border-color: var(--accent-red); }
        .pay-options { display: flex; flex-direction: column; gap: 0.9rem; }
        .pay-option {
          display: flex; align-items: center; gap: 0.9rem;
          border: 1px solid var(--border-color); border-radius: 10px;
          padding: 1rem; cursor: pointer; transition: var(--transition-fast);
        }
        .pay-option.active { border-color: var(--accent-red); background: rgba(229,9,20,0.06); }
        .pay-option input { accent-color: var(--accent-red); width: 18px; height: 18px; }
        .pay-option strong { display: block; }
        .pay-option span { font-size: 0.85rem; color: var(--text-secondary); }
        .checkout-summary { padding: 1.6rem; position: sticky; top: 100px; }
        .checkout-summary h2 { font-size: 1.3rem; margin-bottom: 1rem; }
        .summary-items { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color); }
        .summary-item { display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--text-secondary); }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 0.7rem; color: var(--text-secondary); }
        .summary-row .free { color: var(--accent-green); font-weight: 700; }
        .summary-row.total { color: var(--text-primary); font-weight: 800; font-size: 1.2rem; border-top: 1px solid var(--border-color); padding-top: 0.9rem; }
        .place-btn { width: 100%; margin-top: 0.8rem; }
        .empty-checkout { max-width: 420px; margin: 4rem auto; padding: 2.5rem; text-align: center; display: flex; flex-direction: column; gap: 1rem; align-items: center; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      ` }} />
    </div>
  );
}

export default function Checkout() {
  return (
    <ProtectedRoute>
      <CheckoutInner />
    </ProtectedRoute>
  );
}
