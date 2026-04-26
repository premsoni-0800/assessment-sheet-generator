import React, { useEffect, useRef, useState } from 'react';

export default function SplashScreen({ onDone }) {
  const [cardReady, setCardReady]   = useState(false);
  const [instaShow, setInstaShow]   = useState(false);
  const [leaving,   setLeaving]     = useState(false);
  const particleRef                 = useRef(null);

  useEffect(() => {
    // Blur-to-clear reveal
    const t1 = setTimeout(() => setCardReady(true),  200);
    const t2 = setTimeout(() => setInstaShow(true), 2000);

    // Floating particles
    const container = particleRef.current;
    if (container) {
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        const size = Math.random() * 2 + 1;
        p.style.cssText = `
          position:absolute;border-radius:50%;
          background:rgba(139,92,246,${0.3 + Math.random() * 0.4});
          width:${size}px;height:${size}px;
          left:${Math.random() * 100}%;
          bottom:${Math.random() * 15}%;
          animation:splashFloat ${6 + Math.random() * 8}s linear ${Math.random() * 5}s infinite;
          opacity:0;pointer-events:none;
        `;
        container.appendChild(p);
      }
    }
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleEnter = (e) => {
    e.stopPropagation();
    setLeaving(true);
    setTimeout(() => onDone(), 800);
  };

  return (
    <>
      <style>{`
        @keyframes splashDrift1 { to { transform: translate(40px, 60px); } }
        @keyframes splashDrift2 { to { transform: translate(-50px,-40px); } }
        @keyframes splashDrift3 { to { transform: translate(-30px, 30px); } }
        @keyframes splashFloat  {
          0%   { transform:translateY(0) scale(1); opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:0.4; }
          100% { transform:translateY(-100vh) scale(0); opacity:0; }
        }
        .splash-enter-btn:hover {
          border-color: rgba(139,92,246,0.85) !important;
          box-shadow: 0 0 28px rgba(139,92,246,0.28) !important;
          transform: translateY(-2px) !important;
          color: #c4b5fd !important;
        }
        .splash-insta:hover span { color: rgba(255,255,255,0.85) !important; }
      `}</style>

      {/* ── Root overlay ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#080b12',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        opacity: leaving ? 0 : 1,
        transition: 'opacity 0.75s ease',
        pointerEvents: leaving ? 'none' : 'auto',
      }}>

        {/* Ambient orbs */}
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%',
          background:'radial-gradient(circle,rgba(99,102,241,0.22) 0%,transparent 65%)',
          top:-80, left:-100, animation:'splashDrift1 8s ease-in-out infinite alternate' }} />
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%',
          background:'radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 65%)',
          bottom:-60, right:-80, animation:'splashDrift2 10s ease-in-out infinite alternate' }} />
        <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%',
          background:'radial-gradient(circle,rgba(59,130,246,0.12) 0%,transparent 65%)',
          top:'40%', left:'55%', animation:'splashDrift3 12s ease-in-out infinite alternate' }} />

        {/* Particles container */}
        <div ref={particleRef} style={{ position:'absolute', inset:0, pointerEvents:'none' }} />

        {/* Glass card — blurs in */}
        <div style={{
          position: 'relative', zIndex: 3,
          textAlign: 'center',
          padding: '52px 64px 48px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          maxWidth: 420, width: '90%',
          // blur reveal
          filter:    cardReady ? 'blur(0) saturate(1)'          : 'blur(22px) saturate(0.4)',
          opacity:   cardReady ? 1                               : 0,
          transform: cardReady ? 'scale(1) translateY(0)'       : 'scale(0.96) translateY(14px)',
          transition: 'filter 1.5s cubic-bezier(0.16,1,0.3,1), opacity 1.5s cubic-bezier(0.16,1,0.3,1), transform 1.5s cubic-bezier(0.16,1,0.3,1)',
        }}>

          {/* Logo */}
          <div style={{
            width:72, height:72, borderRadius:20, margin:'0 auto 24px',
            background:'linear-gradient(135deg,rgba(139,92,246,0.85),rgba(99,102,241,0.85))',
            display:'flex', alignItems:'center', justifyContent:'center',
            border:'1px solid rgba(255,255,255,0.15)',
            boxShadow:'0 8px 32px rgba(99,102,241,0.32)',
            fontSize:26, fontWeight:700, color:'#fff', fontFamily:'Georgia,serif',
          }}>A</div>

          {/* Brand name */}
          <div style={{ fontSize:38, fontWeight:700, color:'#fff', letterSpacing:'-1.5px', fontFamily:'Georgia,serif', lineHeight:1, marginBottom:8 }}>
            Assess
            <span style={{ background:'linear-gradient(135deg,#a78bfa,#818cf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Sheet
            </span>
          </div>

          {/* Tagline */}
          <div style={{ fontSize:10, letterSpacing:'3.5px', color:'rgba(255,255,255,0.28)', textTransform:'uppercase', fontFamily:'monospace', marginBottom:34 }}>
            Assessment Generator
          </div>

          {/* Divider line */}
          <div style={{ width:1, height:32, background:'linear-gradient(to bottom,transparent,rgba(255,255,255,0.18),transparent)', margin:'0 auto 34px' }} />

          {/* Enter button */}
          <button
            className="splash-enter-btn"
            onClick={handleEnter}
            style={{
              display:'inline-flex', alignItems:'center', gap:10,
              padding:'13px 42px',
              background:'rgba(139,92,246,0.13)',
              border:'1px solid rgba(139,92,246,0.38)',
              borderRadius:100,
              color:'rgba(167,139,250,1)',
              fontSize:13, letterSpacing:'2px', textTransform:'uppercase',
              fontFamily:'monospace', cursor:'pointer',
              transition:'all 0.32s ease',
            }}
          >
            Enter
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Instagram tag */}
        <a
          className="splash-insta"
          href="https://www.instagram.com/pratham.soni.54/"
          target="_blank"
          rel="noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            position:'absolute', bottom:22, right:24,
            display:'flex', alignItems:'center', gap:8,
            textDecoration:'none', zIndex:10,
            opacity: instaShow ? 1 : 0,
            transform: instaShow ? 'translateY(0)' : 'translateY(8px)',
            transition:'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div style={{
            width:24, height:24, borderRadius:7,
            background:'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none"/>
            </svg>
          </div>
          <span style={{ fontSize:11.5, color:'rgba(255,255,255,0.36)', fontFamily:'monospace', transition:'color 0.2s' }}>
            @pratham.soni.54
          </span>
        </a>

      </div>
    </>
  );
}
