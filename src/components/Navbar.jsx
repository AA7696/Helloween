'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield, LogOut, ShoppingCart, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => (pathname === path ? 'active' : '');

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className="navbar glass-navbar">
        <div className="container nav-container">
          {/* Logo */}
          <Link href="/" className="nav-logo" onClick={closeMenu} aria-label="Helloween home">
            <img src="/Images/Helloween-removebg-preview.png" alt="Helloween" className="nav-logo-img" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="nav-links-desktop">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.path} className={`nav-link ${isActive(link.path)}`}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="nav-actions-desktop">
            <Link href="/cart" className="cart-btn" aria-label="Cart">
              <ShoppingCart size={20} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>

            {!user && (
              <Link href="/login" className="btn btn-outline btn-sm">Login</Link>
            )}
            {user && user.role === 'admin' && (
              <div className="admin-pill">
                <Link href="/admin" className="admin-link">
                  <Shield size={16} />
                  <span>Admin</span>
                </Link>
                <button onClick={logout} className="logout-btn" title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            )}
            {user && user.role === 'customer' && (
              <>
                <span className="nav-greeting">Hi, {(user.name || 'there').split(' ')[0]}</span>
                <div className="admin-pill">
                  <Link href="/orders" className="admin-link" title="Order history">
                    <Package size={16} />
                    <span>My Orders</span>
                  </Link>
                  <button onClick={logout} className="logout-btn" title="Logout">
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="nav-mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`nav-overlay-mobile ${isOpen ? 'open' : ''}`}>
        <div className="mobile-links">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.path} className={`mobile-link ${isActive(link.path)}`} onClick={closeMenu}>
              {link.name}
            </Link>
          ))}
          <div className="mobile-actions">
            <Link href="/cart" className="mobile-link admin-mobile-link" onClick={closeMenu}>
              <ShoppingCart size={18} /> Cart{totalItems > 0 ? ` (${totalItems})` : ''}
            </Link>
            {user && user.role === 'customer' && (
              <Link href="/orders" className="mobile-link admin-mobile-link" onClick={closeMenu}>
                <Package size={18} /> My Orders
              </Link>
            )}
            {user && user.role === 'admin' && (
              <Link href="/admin" className="mobile-link admin-mobile-link" onClick={closeMenu}>
                <Shield size={18} /> Admin Dashboard
              </Link>
            )}
            {user ? (
              <button onClick={() => { logout(); closeMenu(); }} className="mobile-logout-btn">
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link href="/login" className="btn btn-primary w-full" onClick={closeMenu}>
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .navbar { position: fixed; top: 0; left: 0; right: 0; height: 80px; z-index: 100; display: flex; align-items: center; transition: var(--transition-medium); }
        .glass-navbar { background: rgba(11, 12, 16, 0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .nav-container { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .nav-logo { display: flex; align-items: center; }
        .nav-logo-img { height: 62px; width: auto; display: block; }
        .nav-links-desktop { display: flex; gap: 2rem; }
        @media (max-width: 900px) { .nav-links-desktop, .nav-actions-desktop { display: none; } }
        .nav-link { font-size: 0.95rem; font-weight: 600; color: var(--text-secondary); position: relative; padding: 0.5rem 0; text-transform: uppercase; letter-spacing: 0.05em; }
        .nav-link:hover, .nav-link.active { color: var(--text-primary); }
        .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background-color: var(--accent-red); box-shadow: 0 0 8px var(--accent-red); transition: var(--transition-fast); }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
        .btn-sm { padding: 0.5rem 1.2rem; font-size: 0.8rem; }
        .nav-actions-desktop { display: flex; align-items: center; gap: 1rem; }
        .nav-greeting { color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; white-space: nowrap; }
        @media (max-width: 900px) { .nav-greeting { display: none; } }
        .cart-btn { position: relative; color: var(--text-primary); display: flex; align-items: center; transition: var(--transition-fast); }
        .cart-btn:hover { color: var(--accent-red); }
        .cart-badge { position: absolute; top: -8px; right: -10px; background: var(--accent-red); color: #fff; font-size: 0.65rem; font-weight: 800; min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; padding: 0 4px; box-shadow: 0 0 8px var(--accent-red-glow); }
        .admin-pill { display: flex; align-items: center; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 50px; padding: 0.3rem 0.6rem 0.3rem 1rem; gap: 0.8rem; }
        .admin-link { display: flex; align-items: center; gap: 0.4rem; font-weight: 600; font-size: 0.85rem; color: var(--text-primary); }
        .admin-link:hover { color: var(--accent-red); }
        .logout-btn { background: rgba(229, 9, 20, 0.1); color: var(--accent-red); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition-fast); }
        .logout-btn:hover { background: var(--accent-red); color: var(--text-primary); }
        .nav-mobile-toggle { display: none; color: var(--text-primary); cursor: pointer; align-items: center; }
        @media (max-width: 900px) { .nav-mobile-toggle { display: flex; } }
        /* tighter, balanced navbar on phones/small screens */
        @media (max-width: 600px) {
          .nav-logo-img { height: 46px; }
          .nav-container { padding: 0; }
          .container.nav-container { padding: 0 1rem; }
        }
        @media (max-width: 380px) {
          .nav-logo-img { height: 40px; }
        }
        .nav-overlay-mobile { position: fixed; top: 80px; left: 0; right: 0; bottom: 0; background: var(--bg-primary); z-index: 99; transform: translateY(-100%); opacity: 0; visibility: hidden; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; padding: 2rem; }
        .nav-overlay-mobile.open { transform: translateY(0); opacity: 1; visibility: visible; }
        .mobile-links { display: flex; flex-direction: column; gap: 1.8rem; }
        .mobile-link { font-size: 1.5rem; font-weight: 800; text-transform: uppercase; color: var(--text-secondary); }
        .mobile-link:hover, .mobile-link.active { color: var(--text-primary); padding-left: 0.5rem; }
        .mobile-actions { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 1rem; }
        .admin-mobile-link { display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); }
        .mobile-logout-btn { display: flex; align-items: center; gap: 0.5rem; color: var(--accent-red); font-weight: 700; text-transform: uppercase; cursor: pointer; padding: 0.5rem 0; }
        .w-full { width: 100%; }
      ` }} />
    </>
  );
};

export default Navbar;
