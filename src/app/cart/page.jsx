'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const Cart = () => {
  const { items, updateQty, removeFromCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const goToCheckout = () => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page container animate-fade-in">
        <div className="cart-empty glass-panel">
          <ShoppingBag size={56} />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven’t added any energy yet.</p>
          <Link href="/products" className="btn btn-primary">Shop Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container animate-fade-in">
      <h1 className="cart-title">Your Cart <span>({totalItems})</span></h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map(item => (
            <div key={item._id} className="cart-row glass-panel">
              <div className="cart-img"><img src={item.imageUrl} alt={item.name} /></div>
              <div className="cart-info">
                <h3>{item.name}</h3>
                <span className="cart-price">₹{item.price}</span>
              </div>
              <div className="cart-qty">
                <button onClick={() => updateQty(item._id, item.qty - 1)} aria-label="Decrease"><Minus size={14} /></button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item._id, item.qty + 1)} aria-label="Increase"><Plus size={14} /></button>
              </div>
              <div className="cart-line-total">₹{item.price * item.qty}</div>
              <button className="cart-remove" onClick={() => removeFromCart(item._id)} aria-label="Remove">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary glass-panel">
          <h2>Order Summary</h2>
          <div className="summary-row"><span>Subtotal</span><span>₹{totalPrice}</span></div>
          <div className="summary-row"><span>Shipping</span><span className="free">FREE</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{totalPrice}</span></div>
          <button className="btn btn-primary checkout-btn" onClick={goToCheckout}>
            Proceed to Checkout <ArrowRight size={18} />
          </button>
          <Link href="/products" className="continue-link">Continue shopping</Link>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .cart-page { padding: 2.5rem 1.5rem 5rem; }
        .cart-title { font-size: 2.2rem; margin-bottom: 2rem; }
        .cart-title span { color: var(--text-muted); }
        .cart-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start; }
        @media (max-width: 860px) { .cart-layout { grid-template-columns: 1fr; } }
        .cart-items { display: flex; flex-direction: column; gap: 1rem; }
        .cart-row {
          display: grid;
          grid-template-columns: 80px 1fr auto auto auto;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.2rem;
        }
        .cart-img { width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; }
        .cart-img img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .cart-info h3 { font-size: 1rem; text-transform: uppercase; }
        .cart-price { color: var(--text-secondary); font-size: 0.9rem; }
        .cart-qty {
          display: flex; align-items: center; gap: 0.8rem;
          background: var(--bg-tertiary); border: 1px solid var(--border-color);
          border-radius: 30px; padding: 0.3rem 0.6rem;
        }
        .cart-qty button {
          width: 26px; height: 26px; border-radius: 50%;
          background: rgba(255,255,255,0.06); color: var(--text-primary);
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .cart-qty button:hover { background: var(--accent-red); }
        .cart-line-total { font-weight: 800; min-width: 70px; text-align: right; }
        .cart-remove { color: var(--text-muted); cursor: pointer; }
        .cart-remove:hover { color: var(--accent-red); }
        @media (max-width: 560px) {
          .cart-row { grid-template-columns: 60px 1fr auto; row-gap: 0.6rem; }
          .cart-line-total { grid-column: 2 / 4; text-align: left; }
          .cart-remove { position: absolute; }
        }
        .cart-summary { padding: 1.6rem; position: sticky; top: 100px; }
        .cart-summary h2 { font-size: 1.3rem; margin-bottom: 1.2rem; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 0.8rem; color: var(--text-secondary); }
        .summary-row .free { color: var(--accent-green); font-weight: 700; }
        .summary-row.total {
          color: var(--text-primary); font-weight: 800; font-size: 1.2rem;
          border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 0.5rem;
        }
        .checkout-btn { width: 100%; margin-top: 1rem; }
        .continue-link { display: block; text-align: center; margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem; }
        .continue-link:hover { color: var(--text-primary); }
        .cart-empty {
          max-width: 480px; margin: 4rem auto; padding: 3rem; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--text-secondary);
        }
        .cart-empty h2 { color: var(--text-primary); }
      ` }} />
    </div>
  );
};

export default function CartPage() {
  return (
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  );
}
