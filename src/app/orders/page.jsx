'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Package, CheckCircle2, Clock } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const statusColor = (status) => ({
  Processing: '#d4af37',
  Shipped: '#3b82f6',
  Delivered: '#39ff14',
  Cancelled: '#e50914',
}[status] || '#a9b2c3');

function OrdersInner() {
  const searchParams = useSearchParams();
  const justOrdered = searchParams.get('success') === '1';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/orders/myorders');
        if (res.ok) setOrders(await res.json());
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="orders-page container animate-fade-in">
      <h1 className="orders-title">My Orders</h1>

      {justOrdered && (
        <div className="order-success">
          <CheckCircle2 size={20} /> Order placed successfully! Thank you for your purchase.
        </div>
      )}

      {loading ? (
        <p className="orders-loading">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div className="orders-empty glass-panel">
          <Package size={48} />
          <p>You haven’t placed any orders yet.</p>
          <Link href="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card glass-panel">
              <div className="order-head">
                <div>
                  <span className="order-id">#{String(order._id).slice(-8).toUpperCase()}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="order-status" style={{ color: statusColor(order.orderStatus), borderColor: statusColor(order.orderStatus) }}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((it, i) => (
                  <div key={i} className="order-item">
                    <div className="order-item-img"><img src={it.imageUrl} alt={it.name} /></div>
                    <span className="order-item-name">{it.name}</span>
                    <span className="order-item-qty">× {it.qty}</span>
                    <span className="order-item-price">₹{it.price * it.qty}</span>
                  </div>
                ))}
              </div>

              <div className="order-foot">
                <span className="order-pay">
                  {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Razorpay'}
                  <span className={`pay-badge ${order.isPaid ? 'paid' : 'pending'}`}>
                    {order.isPaid ? <><CheckCircle2 size={12} /> Paid</> : <><Clock size={12} /> {order.paymentStatus}</>}
                  </span>
                </span>
                <span className="order-total">Total: <strong>₹{order.totalPrice}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .orders-page { padding: 2.5rem 1.5rem 5rem; }
        .orders-title { font-size: 2.2rem; margin-bottom: 1.5rem; }
        .order-success { display: flex; align-items: center; gap: 0.6rem; background: rgba(57,255,20,0.08); border: 1px solid var(--accent-green); color: var(--accent-green); padding: 0.9rem 1.2rem; border-radius: 10px; margin-bottom: 1.5rem; }
        .orders-loading { color: var(--text-secondary); padding: 2rem 0; }
        .orders-empty { max-width: 460px; margin: 3rem auto; padding: 3rem; text-align: center; display: flex; flex-direction: column; gap: 1rem; align-items: center; color: var(--text-secondary); }
        .orders-list { display: flex; flex-direction: column; gap: 1.2rem; }
        .order-card { padding: 1.4rem 1.6rem; }
        .order-head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color); }
        .order-id { font-weight: 800; font-family: var(--font-heading); margin-right: 0.8rem; }
        .order-date { color: var(--text-muted); font-size: 0.85rem; }
        .order-status { font-size: 0.78rem; font-weight: 800; text-transform: uppercase; border: 1px solid; padding: 0.25rem 0.7rem; border-radius: 30px; letter-spacing: 0.05em; }
        .order-items { display: flex; flex-direction: column; gap: 0.7rem; padding: 1rem 0; }
        .order-item { display: grid; grid-template-columns: 44px 1fr auto auto; align-items: center; gap: 0.9rem; }
        .order-item-img { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        .order-item-img img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .order-item-name { font-size: 0.92rem; }
        .order-item-qty { color: var(--text-muted); font-size: 0.85rem; }
        .order-item-price { font-weight: 700; min-width: 60px; text-align: right; }
        .order-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border-color); flex-wrap: wrap; gap: 0.8rem; }
        .order-pay { display: flex; align-items: center; gap: 0.6rem; color: var(--text-secondary); font-size: 0.9rem; }
        .pay-badge { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 30px; }
        .pay-badge.paid { background: rgba(57,255,20,0.1); color: var(--accent-green); }
        .pay-badge.pending { background: rgba(212,175,55,0.12); color: var(--accent-gold); }
        .order-total { font-size: 1rem; color: var(--text-secondary); }
        .order-total strong { color: var(--text-primary); font-size: 1.15rem; }
      ` }} />
    </div>
  );
}

export default function Orders() {
  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <OrdersInner />
      </Suspense>
    </ProtectedRoute>
  );
}
