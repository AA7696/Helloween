'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['General Inquiry', 'Partnership', 'Cofilling', 'Feedback', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          category: 'General Inquiry',
          message: ''
        });
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Inquiry submit error:', err);
      setError(err.message || 'Unable to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page animate-fade-in">
      <div className="container contact-grid-layout">
        {/* Left Column: Context details */}
        <div className="contact-info-panel">
          <span className="contact-tag">Get in Touch</span>
          <h1>CONNECT WITH <span className="text-glow-red">HELL</span></h1>
          <p className="contact-info-desc">
            Have questions about regional distributions? Interested in private-label 
            beverage filling (Cofilling)? Or just want to say hi? Fill out the contact form, 
            and our team will reply within 2 business days.
          </p>

          <div className="info-cards-stack">
            <div className="info-mini-card glass-panel">
              <h4>B2B Cofilling Services</h4>
              <p>For advanced contract canning options, reach out via our 'Cofilling' message filter.</p>
            </div>
            <div className="info-mini-card glass-panel">
              <h4>Regional HQ</h4>
              <p>HELL ENERGY India Private Limited, Bandra Kurla Complex, Mumbai, MH, 400051.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="contact-form-panel glass-panel">
          {success ? (
            <div className="success-state animate-fade-in">
              <CheckCircle size={56} className="success-icon" />
              <h2>INQUIRY TRANSMITTED</h2>
              <p>
                Your inquiry has been stored securely. Our customer care desk 
                or B2B development team will review it shortly.
              </p>
              <button onClick={() => setSuccess(false)} className="btn btn-primary">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h3>Send a Message</h3>

              {error && (
                <div className="form-error-banner animate-fade-in">
                  <AlertTriangle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Inquiry Subject *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message / Requirements *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="5"
                  placeholder="Tell us about your requirements..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary submit-btn"
              >
                {submitting ? 'Transmitting...' : (
                  <>
                    Transmit Inquiry <Send size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .contact-page {
          padding: 4rem 0 6rem 0;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
        }
        .contact-grid-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
          align-items: center;
        }
        @media (min-width: 992px) {
          .contact-grid-layout {
            grid-template-columns: 1fr 1.1fr;
          }
        }
        
        /* Left Column */
        .contact-info-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .contact-tag {
          font-family: var(--font-heading);
          font-weight: 800;
          text-transform: uppercase;
          font-size: 0.85rem;
          color: var(--accent-red);
          letter-spacing: 0.1em;
          border-left: 3px solid var(--accent-red);
          padding-left: 0.8rem;
        }
        .contact-info-panel h1 {
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.1;
        }
        .contact-info-desc {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.7;
        }
        .info-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          margin-top: 1rem;
        }
        .info-mini-card {
          padding: 1.5rem;
          border-color: rgba(255, 255, 255, 0.03);
        }
        .info-mini-card h4 {
          font-size: 1rem;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
          color: var(--text-primary);
        }
        .info-mini-card p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
        }
        
        /* Right Column Form */
        .contact-form-panel {
          padding: 3rem;
          border-color: rgba(255, 255, 255, 0.08);
        }
        @media (max-width: 576px) {
          .contact-form-panel {
            padding: 2rem 1.5rem;
          }
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .contact-form h3 {
          font-size: 1.5rem;
          text-transform: uppercase;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.8rem;
          margin-bottom: 0.5rem;
        }
        .form-error-banner {
          background: rgba(229, 9, 20, 0.08);
          border: 1px solid rgba(229, 9, 20, 0.2);
          color: #ff4a52;
          padding: 0.8rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-group input, 
        .form-group select, 
        .form-group textarea {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          padding: 0.8rem 1.2rem;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: var(--transition-fast);
          width: 100%;
        }
        .form-group input:focus, 
        .form-group select:focus, 
        .form-group textarea:focus {
          border-color: var(--accent-red);
          box-shadow: 0 0 10px var(--accent-red-glow);
          background-color: var(--bg-primary);
        }
        .form-group select {
          cursor: pointer;
          color: var(--text-primary);
        }
        .form-group select option {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }
        .submit-btn {
          margin-top: 1rem;
          height: 48px;
        }
        
        /* Success State Styling */
        .success-state {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          gap: 1.5rem;
        }
        .success-icon {
          color: var(--accent-green);
          filter: drop-shadow(0 0 10px var(--accent-green-glow));
        }
        .success-state h2 {
          font-size: 1.8rem;
          text-transform: uppercase;
          color: var(--text-primary);
        }
        .success-state p {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.6;
          max-width: 450px;
          margin-bottom: 1rem;
        }
      ` }} />
    </div>
  );
};

export default Contact;
