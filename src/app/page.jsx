'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Instagram, Play, Facebook, Youtube, ArrowRight, ArrowUpRight } from 'lucide-react';

const instagramCollage = [
  '/Images/685629620_905274889191836_6175359703166959496_nlow.webp.webp',
  '/Images/696113805_18584809768050652_2597273358760586776_nlow.webp.webp',
  '/Images/703924554_1443145994251538_6543131044330043262_nlow.webp.webp',
  '/Images/705429010_18588731590050652_3770887267154642599_nlow.webp.webp',
];

const bottomFeed = [
  { img: '/Images/708222990_18590013001050652_8599168591628951400_nlow.webp.webp', tag: '20 years on repeat' },
  { img: '/Images/709066345_18590650924050652_8233094196692257454_nlow.webp.webp', tag: 'limited drop' },
  { img: '/Images/685629620_905274889191836_6175359703166959496_nlow.webp.webp', tag: '', video: true },
  { img: '/Images/696113805_18584809768050652_2597273358760586776_nlow.webp.webp', tag: 'new gen' },
  { img: '/Images/703924554_1443145994251538_6543131044330043262_nlow.webp.webp', tag: 'social team' },
  { img: '/Images/705429010_18588731590050652_3770887267154642599_nlow.webp.webp', tag: '', video: true },
];

const Home = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const els = rootRef.current?.querySelectorAll('[data-reveal]') || [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="home-container page-exact-clone" ref={rootRef}>

      {/* 1. HERO (unchanged) */}
      <section className="exact-hero">
        <div className="hero-glow" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-eyebrow">HELLOWEEN ENERGY · LIMITED EDITION</span>
            <h1 className="hero-headline">
              GIVES YOU POWER<br />LIKE <span className="hero-hell">HELL</span>
            </h1>
            <p className="hero-sub">
              5 B-vitamins. No preservatives. 100% recyclable aluminium.
              Meet the new HELL Helloween Classic limited edition.
            </p>
            <Link href="/products" className="btn-products-exact hero-cta">DISCOVER THE RANGE</Link>
          </div>
          <div className="hero-cans">
            <img className="hero-can hero-can-back" src="/Images/HELL_Carnival_ED_Cotton_Candy_2026_HU_Packshot_01.png.png" alt="HELL Cotton Candy" />
            <img className="hero-can hero-can-front" src="/Images/hell-helloween-classic.png" alt="HELL Helloween Classic Limited Edition" />
          </div>
        </div>
        <div className="hero-brand-lockup">
          <img src="/Images/Helloween-removebg-preview.png" alt="Helloween" className="lockup-logo-img" />
          <span className="lockup-url">helloween.com</span>
        </div>
      </section>

      {/* 2. PRODUCTS BAND (redesigned) */}
      <section className="prod-band" data-reveal>
        <span className="prod-edge" />
        <div className="container prod-inner">
          <div className="prod-copy">
            <span className="prod-eyebrow">◆ OUR PORTFOLIO</span>
            <h2>PRODUCTS</h2>
            <p>
              With top-quality ingredients, no preservatives, and fortified with 5 vitamins...
              what else do you need? Get familiar with the full range.
            </p>
            <ul className="prod-chips">
              <li>5 B-VITAMINS</li>
              <li>NO PRESERVATIVES</li>
              <li>100% RECYCLABLE</li>
            </ul>
            <Link href="/products" className="prod-btn">EXPLORE PRODUCTS <ArrowRight size={18} /></Link>
          </div>

          <div className="prod-visual">
            <div className="prod-ring" />
            <div className="prod-bolt b1">⚡</div>
            <div className="prod-bolt b2">⚡</div>
            <img className="prod-can" src="/Images/HELL_Strong_Apple_250_ED-cutout-cutout.png.png" alt="HELL Strong Apple" />
          </div>
        </div>
      </section>

      {/* 3. LIFESTYLE BANNER (redesigned — overlay) */}
      <section className="lux-banner">
        <div className="lux-bg">
          <img src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1600&auto=format&fit=crop" alt="The good life" />
        </div>
        <div className="lux-scrim" />
        <div className="container lux-content" data-reveal>
          <span className="lux-kicker">— THE GOOD LIFE</span>
          <h2 className="lux-title">YOUR PULSE.<br /><span className="gold-text">YOUR PLAYGROUND.</span></h2>
          <p>Fuel the moments that matter. Premium energy for a life lived without limits.</p>
        </div>
      </section>

      {/* 4. SOCIAL (redesigned — dark CTA card) */}
      <section className="social-sec" data-reveal>
        <div className="container social-grid2">
          <div className="social-collage">
            <div className="social-photo-grid">
              {instagramCollage.map((img, idx) => (
                <div key={idx} className="social-photo"><img src={img} alt={`Helloween ${idx}`} /></div>
              ))}
            </div>
            <div className="social-badge"><Instagram size={56} strokeWidth={2.2} /></div>
          </div>

          <div className="social-cta">
            <span className="social-eyebrow">◆ STAY CONNECTED</span>
            <h2>JOIN THE <span className="gold-text">CULT</span></h2>
            <p>Follow Helloween across the feed for drops, events, collabs and pure chaos.</p>
            <div className="social-rows">
              <a className="social-row" href="https://facebook.com/hellenergy" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} /><span className="sr-name">Facebook</span><span className="sr-handle">/hellenergy</span><ArrowUpRight size={18} className="sr-arrow" />
              </a>
              <a className="social-row" href="https://instagram.com/hellenergy" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} /><span className="sr-name">Instagram</span><span className="sr-handle">@hellenergy</span><ArrowUpRight size={18} className="sr-arrow" />
              </a>
              <a className="social-row" href="https://youtube.com/hellenergy" target="_blank" rel="noopener noreferrer">
                <Youtube size={20} /><span className="sr-name">YouTube</span><span className="sr-handle">/hellenergy</span><ArrowUpRight size={18} className="sr-arrow" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEED (redesigned — heading + captions) */}
      <section className="feed-sec">
        <div className="container feed-head" data-reveal>
          <div>
            <span className="feed-eyebrow">◆ FROM THE FEED</span>
            <h2>FOLLOW THE RITUAL</h2>
          </div>
          <a className="feed-handle" href="https://instagram.com/hellenergy" target="_blank" rel="noopener noreferrer">
            @hellenergy <Instagram size={18} />
          </a>
        </div>
        <div className="feed-grid">
          {bottomFeed.map((item, i) => (
            <a key={i} className="feed-tile" href="https://instagram.com/hellenergy" target="_blank" rel="noopener noreferrer">
              <img src={item.img} alt={`Feed ${i}`} />
              <div className="feed-tile-ov">
                {item.video && <span className="feed-play"><Play size={20} fill="white" /></span>}
                <span className="feed-tile-ig"><Instagram size={18} /></span>
              </div>
              {item.tag && <span className="feed-tag">{item.tag}</span>}
            </a>
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .page-exact-clone { background-color: #0b0c10; }
        .gold-text { background: linear-gradient(180deg,#f6d98a 0%, #e8b24a 50%, #b0801f 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }

        [data-reveal] { opacity: 0; transform: translateY(40px); transition: opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1); }
        [data-reveal].in { opacity: 1; transform: none; }

        /* ---------- 1. HERO (unchanged) ---------- */
        .exact-hero { position: relative; min-height: calc(100vh - 80px); display: flex; align-items: center; overflow: hidden; background: radial-gradient(circle at 75% 35%, rgba(229,9,20,0.22) 0%, rgba(11,12,16,0) 55%), linear-gradient(160deg, #15171f 0%, #0b0c10 60%); padding: 4rem 0 5rem; }
        .hero-glow { position: absolute; right: -10%; top: 50%; transform: translateY(-50%); width: 60vw; height: 60vw; max-width: 720px; max-height: 720px; z-index: 1; background: radial-gradient(circle, rgba(229,9,20,0.28) 0%, transparent 65%); pointer-events: none; animation: heroPulse 6s ease-in-out infinite; }
        @keyframes heroPulse { 0%,100%{opacity:.7; transform:translateY(-50%) scale(1);} 50%{opacity:1; transform:translateY(-50%) scale(1.06);} }
        .hero-inner { position: relative; z-index: 2; display: grid; grid-template-columns: 1.05fr 1fr; align-items: center; gap: 2rem; width: 100%; }
        @media (max-width: 860px) { .hero-inner { grid-template-columns: 1fr; text-align: center; } }
        .hero-eyebrow { display: inline-block; color: var(--accent-gold); font-weight: 800; font-size: 0.8rem; letter-spacing: 0.28em; margin-bottom: 1.2rem; animation: heroUp .7s both; }
        .hero-headline { font-family: var(--font-heading); font-weight: 900; font-size: clamp(2.6rem, 6.5vw, 5rem); line-height: 0.95; letter-spacing: -0.03em; color: #fff; text-transform: uppercase; animation: heroUp .8s .1s both; }
        .hero-hell { color: var(--accent-red); text-shadow: 0 0 24px rgba(229,9,20,0.6); }
        .hero-sub { color: var(--text-secondary); font-size: 1.05rem; line-height: 1.6; max-width: 440px; margin: 1.4rem 0 2rem; animation: heroUp .8s .22s both; }
        @media (max-width: 860px) { .hero-sub { margin-inline: auto; } }
        .hero-cta { animation: heroUp .8s .34s both; }
        @keyframes heroUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .btn-products-exact { display: inline-block; background-color: var(--accent-red); color: #fff; padding: 1rem 2.6rem; font-weight: 800; font-size: 0.92rem; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 4px; box-shadow: 0 8px 22px rgba(229,9,20,0.42); transition: var(--transition-fast); }
        .btn-products-exact:hover { background-color: var(--accent-red-hover); transform: translateY(-3px); box-shadow: 0 12px 30px rgba(255,31,41,0.6); }
        .hero-cans { position: relative; height: clamp(360px, 48vw, 540px); display: flex; align-items: center; justify-content: center; }
        .hero-can { position: absolute; height: 100%; object-fit: contain; filter: drop-shadow(0 30px 50px rgba(0,0,0,0.6)); }
        .hero-can-back { height: 78%; transform: translateX(34%) rotate(10deg); opacity: 0.92; animation: heroUp 1s .15s both, floatB 7s ease-in-out infinite; }
        .hero-can-front { transform: translateX(-12%) rotate(-6deg); animation: heroUp 1s .25s both, floatF 5.5s ease-in-out infinite; }
        @keyframes floatF { 0%,100%{ transform: translateX(-12%) translateY(0) rotate(-6deg);} 50%{ transform: translateX(-12%) translateY(-18px) rotate(-6deg);} }
        @keyframes floatB { 0%,100%{ transform: translateX(34%) translateY(0) rotate(10deg);} 50%{ transform: translateX(34%) translateY(14px) rotate(10deg);} }
        .hero-brand-lockup { position: absolute; right: clamp(1.5rem, 5vw, 4rem); bottom: clamp(1.5rem, 4vw, 2.5rem); z-index: 3; display: flex; flex-direction: column; gap: 0.3rem; opacity: 0.85; animation: fadeInUp 0.9s ease; }
        @media (max-width: 860px) { .hero-brand-lockup { display: none; } }
        .lockup-logo-img { height: 54px; width: auto; display: block; }
        .lockup-url { font-size: 0.8rem; color: var(--text-secondary); letter-spacing: 0.05em; padding-left: 0.1rem; }

        /* ---------- 2. PRODUCTS BAND ---------- */
        .prod-band { position: relative; overflow: hidden; background: linear-gradient(120deg, #f3f3f3 0%, #d4d4d4 45%, #9a9a9a 100%); padding: clamp(3.5rem, 7vw, 6rem) 0; }
        .prod-edge { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent, var(--accent-red) 30%, var(--accent-red) 70%, transparent); box-shadow: 0 0 22px rgba(229,9,20,0.6); }
        .prod-band::after { content: ''; position: absolute; top: 0; left: -60%; width: 45%; height: 100%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.6), transparent); transform: skewX(-20deg); pointer-events: none; animation: sheen 7s ease-in-out infinite; }
        @keyframes sheen { 0% { left: -60%; } 55%, 100% { left: 150%; } }
        .prod-inner { position: relative; z-index: 2; display: grid; grid-template-columns: 1.1fr 1fr; align-items: center; gap: 2rem; }
        @media (max-width: 900px) { .prod-inner { grid-template-columns: 1fr; text-align: center; } }
        .prod-eyebrow { color: var(--accent-red); font-weight: 800; font-size: 0.78rem; letter-spacing: 0.22em; }
        .prod-copy h2 { color: #0b0c10; font-size: clamp(2.6rem, 6vw, 4rem); font-weight: 900; letter-spacing: -0.02em; margin: 0.6rem 0 1rem; }
        .prod-copy p { color: #33363f; font-size: 1.05rem; line-height: 1.65; font-weight: 500; max-width: 460px; margin-bottom: 1.4rem; }
        @media (max-width: 900px) { .prod-copy p { margin-inline: auto; } }
        .prod-chips { list-style: none; display: flex; flex-wrap: wrap; gap: 0.6rem; margin: 0 0 2rem; padding: 0; }
        @media (max-width: 900px) { .prod-chips { justify-content: center; } }
        .prod-chips li { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.08em; color: #15171f; background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.12); border-radius: 30px; padding: 0.4rem 0.9rem; }
        .prod-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--accent-red); color: #fff; font-weight: 800; font-size: 0.9rem; letter-spacing: 0.05em; text-transform: uppercase; padding: 0.95rem 2rem; border-radius: 4px; box-shadow: 0 8px 22px rgba(229,9,20,0.4); transition: var(--transition-fast); }
        .prod-btn:hover { background: var(--accent-red-hover); transform: translateY(-3px); box-shadow: 0 12px 30px rgba(255,31,41,0.55); }
        .prod-visual { position: relative; height: 340px; display: flex; align-items: center; justify-content: center; }
        @media (max-width: 900px) { .prod-visual { height: 300px; margin-top: 1rem; } }
        .prod-ring { position: absolute; width: 200px; height: 200px; border: 2px solid rgba(229,9,20,0.8); border-radius: 14px; transform: rotate(45deg); box-shadow: 0 0 18px rgba(229,9,20,0.4); right: 26%; animation: spinSlow 20s linear infinite; }
        @keyframes spinSlow { to { transform: rotate(405deg); } }
        .prod-bolt { position: absolute; color: var(--accent-red); font-size: 1.7rem; filter: drop-shadow(0 0 6px var(--accent-red)); animation: boltFlick 2.4s ease-in-out infinite; }
        .prod-bolt.b1 { top: 26%; left: 12%; }
        .prod-bolt.b2 { bottom: 22%; right: 8%; animation-delay: 1.1s; }
        @keyframes boltFlick { 0%,100%{ opacity: 1; } 50%{ opacity: 0.4; } }
        .prod-can { position: relative; z-index: 3; height: 320px; object-fit: contain; transform: rotate(-20deg); filter: drop-shadow(18px 24px 30px rgba(0,0,0,0.5)); animation: canFloat 5s ease-in-out infinite; transition: transform .5s cubic-bezier(.16,1,.3,1); }
        .prod-can:hover { transform: rotate(-13deg) scale(1.06); }
        @keyframes canFloat { 0%,100%{ transform: rotate(-20deg) translateY(0);} 50%{ transform: rotate(-20deg) translateY(-16px);} }
        @media (max-width: 900px) { .prod-can { height: 270px; } }

        /* ---------- 3. LIFESTYLE BANNER ---------- */
        .lux-banner { position: relative; min-height: 520px; display: flex; align-items: flex-end; overflow: hidden; }
        @media (max-width: 768px) { .lux-banner { min-height: 420px; } }
        .lux-bg { position: absolute; inset: 0; }
        .lux-bg img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(0.2) contrast(1.05); animation: kenburns 18s ease-in-out infinite alternate; }
        @keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.12); } }
        .lux-scrim { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(8,8,11,0.92) 0%, rgba(8,8,11,0.55) 38%, rgba(8,8,11,0) 70%), linear-gradient(to top, rgba(8,8,11,0.95) 0%, rgba(8,8,11,0) 45%); }
        .lux-content { position: relative; z-index: 2; padding: 3.5rem 1.6rem; max-width: 1240px; }
        .lux-kicker { color: var(--accent-red); font-weight: 800; letter-spacing: 0.2em; font-size: 0.82rem; text-transform: uppercase; }
        .lux-title { font-family: var(--font-heading); font-weight: 900; text-transform: uppercase; font-size: clamp(2.2rem, 6vw, 4.6rem); line-height: 0.95; letter-spacing: -0.02em; color: #fff; margin: 0.8rem 0 1rem; }
        .lux-content p { color: var(--text-secondary); font-size: 1.05rem; max-width: 420px; }

        /* ---------- 4. SOCIAL ---------- */
        .social-sec { background: linear-gradient(180deg, #0b0c10, #101018); padding: clamp(3.5rem, 7vw, 6rem) 0; }
        .social-grid2 { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 2.5rem; align-items: center; }
        @media (max-width: 900px) { .social-grid2 { grid-template-columns: 1fr; } }
        .social-collage { position: relative; }
        .social-photo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
        .social-photo { aspect-ratio: 1; overflow: hidden; border-radius: 10px; }
        .social-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s cubic-bezier(.16,1,.3,1); }
        .social-photo:hover img { transform: scale(1.1); }
        .social-badge { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 96px; height: 96px; border-radius: 26px; background: #fff; color: #0b0c10; display: flex; align-items: center; justify-content: center; box-shadow: 0 14px 40px rgba(0,0,0,0.7); transition: var(--transition-medium); }
        .social-badge:hover { transform: translate(-50%,-50%) scale(1.08) rotate(-6deg); }
        .social-eyebrow { color: var(--accent-red); font-weight: 800; font-size: 0.78rem; letter-spacing: 0.22em; }
        .social-cta h2 { font-family: var(--font-heading); font-weight: 900; text-transform: uppercase; font-size: clamp(2rem, 4.5vw, 3.2rem); letter-spacing: -0.02em; margin: 0.5rem 0 0.8rem; color: #fff; }
        .social-cta > p { color: var(--text-secondary); margin-bottom: 1.6rem; max-width: 420px; }
        .social-rows { display: flex; flex-direction: column; gap: 0.7rem; }
        .social-row { display: flex; align-items: center; gap: 0.9rem; padding: 1rem 1.2rem; border: 1px solid var(--border-color); border-radius: 12px; background: rgba(255,255,255,0.03); color: var(--text-primary); transition: var(--transition-fast); }
        .social-row:hover { border-color: var(--accent-red); background: rgba(229,9,20,0.1); transform: translateX(6px); box-shadow: 0 0 18px rgba(229,9,20,0.25); }
        .sr-name { font-weight: 800; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 0.05em; }
        .sr-handle { color: var(--text-muted); font-size: 0.88rem; margin-left: auto; }
        .sr-arrow { color: var(--accent-red); flex-shrink: 0; }

        /* ---------- 5. FEED ---------- */
        .feed-sec { background: #0b0c10; padding: clamp(3rem, 6vw, 5rem) 0 0; }
        .feed-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .feed-eyebrow { color: var(--accent-red); font-weight: 800; font-size: 0.78rem; letter-spacing: 0.22em; }
        .feed-head h2 { font-family: var(--font-heading); font-weight: 900; text-transform: uppercase; font-size: clamp(1.8rem, 4vw, 2.8rem); letter-spacing: -0.02em; margin-top: 0.4rem; color: #fff; }
        .feed-handle { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--accent-gold); font-weight: 700; letter-spacing: 0.05em; }
        .feed-handle:hover { color: #fff; }
        .feed-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.4rem; }
        @media (max-width: 992px) { .feed-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 520px) { .feed-grid { grid-template-columns: repeat(2, 1fr); } }
        .feed-tile { position: relative; aspect-ratio: 1; overflow: hidden; display: block; }
        .feed-tile img { width: 100%; height: 100%; object-fit: cover; transition: transform .55s cubic-bezier(.16,1,.3,1); }
        .feed-tile:hover img { transform: scale(1.1); }
        .feed-tile-ov { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: linear-gradient(180deg, rgba(229,9,20,0) 30%, rgba(229,9,20,0.55)); opacity: 0; transition: opacity .4s; }
        .feed-tile:hover .feed-tile-ov { opacity: 1; }
        .feed-play { color: #fff; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.6)); }
        .feed-tile-ig { position: absolute; bottom: 10px; right: 10px; color: #fff; }
        .feed-tag { position: absolute; top: 10px; left: 10px; background: var(--accent-red); color: #fff; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.04em; padding: 3px 8px; border-radius: 3px; text-transform: uppercase; }
      ` }} />
    </div>
  );
};

export default Home;
