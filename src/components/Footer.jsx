'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer-section">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="footer-logo" aria-label="Helloween home">
            <img src="/Images/Helloween-removebg-preview.png" alt="Helloween" className="footer-logo-img" />
          </Link>
          <p className="brand-pitch">
            Gives you power like HELL. Top-quality ingredients, zero preservatives,
            fortified with 5 B-vitamins, packaged in infinitely recyclable aluminium.
          </p>
          <div className="social-row">
            <a href="https://facebook.com/hellenergy" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="https://instagram.com/hellenergy" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram"><Instagram size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/products">Products Portfolio</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Info</h3>
          <ul className="contact-list">
            <li><MapPin size={16} className="contact-icon" /><span>Plasto Touch Industries, Meerut , UP</span></li>
            <li><Phone size={16} className="contact-icon" /><span>+91 7500266869</span></li>
            <li><Mail size={16} className="contact-icon" /><span>care@helloween@gmail.com</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-container">
          <p>&copy; {new Date().getFullYear()} HELLOWEEN Energy Clone. All Rights Reserved. Prepared for educational purposes.</p>
          <button onClick={scrollToTop} className="scroll-top-btn" aria-label="Scroll to top"><ArrowUp size={16} /></button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .footer-section { background-color: var(--bg-secondary); border-top: 1px solid var(--border-color); padding: 4rem 0 0 0; color: var(--text-secondary); font-size: 0.9rem; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1.5fr; gap: 4rem; padding-bottom: 4rem; }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr; gap: 2.5rem; } }
        .footer-brand { display: flex; flex-direction: column; gap: 1.2rem; }
        .footer-logo { display: inline-flex; align-items: center; }
        .footer-logo-img { height: 68px; width: auto; display: block; }
        .brand-pitch { line-height: 1.6; }
        .social-row { display: flex; gap: 1rem; margin-top: 0.5rem; }
        .social-icon { width: 40px; height: 40px; border-radius: 50%; background: var(--bg-tertiary); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; color: var(--text-primary); transition: var(--transition-fast); }
        .social-icon:hover { background: var(--accent-red); color: var(--text-primary); box-shadow: 0 0 15px var(--accent-red-glow); transform: translateY(-3px); }
        .footer-links h3, .footer-contact h3 { color: var(--text-primary); font-size: 1.1rem; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .footer-links ul { list-style: none; display: flex; flex-direction: column; gap: 0.8rem; }
        .footer-links ul a:hover { color: var(--text-primary); padding-left: 5px; }
        .contact-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
        .contact-list li { display: flex; align-items: flex-start; gap: 0.8rem; }
        .contact-icon { color: var(--accent-red); margin-top: 3px; }
        .footer-bottom { border-top: 1px solid var(--border-color); padding: 1.5rem 0; background-color: var(--bg-primary); }
        .bottom-container { display: flex; justify-content: space-between; align-items: center; }
        @media (max-width: 576px) { .bottom-container { flex-direction: column; gap: 1rem; text-align: center; } }
        .scroll-top-btn { width: 36px; height: 36px; border-radius: 50%; background: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-primary); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition-fast); }
        .scroll-top-btn:hover { background: var(--accent-red); box-shadow: 0 0 10px var(--accent-red); transform: translateY(-2px); }
      ` }} />
    </footer>
  );
};

export default Footer;
