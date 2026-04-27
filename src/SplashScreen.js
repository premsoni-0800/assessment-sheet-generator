import React, { useEffect, useRef, useState } from 'react';

export default function SplashScreen({ onDone }) {
  const [cardReady, setCardReady] = useState(false);
  const [socialShow, setSocialShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const particleRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setCardReady(true), 200);
    const t2 = setTimeout(() => setSocialShow(true), 1800);

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

  const socialLinks = [
    {
      href: 'https://www.instagram.com/pratham.soni.54/',
      label: 'Instagram',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <rect x="2" y="2" width="20" height="20" rx="5"/>
          <circle cx="12" cy="12" r="5"/>
          <circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none"/>
        </svg>
      ),
      bg: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
    },
    {
      href: 'https://www.linkedin.com/in/prem-soni-49b070349/',
      label: 'LinkedIn',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      ),
      bg: '#0a66c2',
    },
    {
      href: 'https://github.com/premsoni-0800',
      label: 'GitHub',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
      ),
      bg: '#24292e',
    },
  ];

  return (
    <>
      <style>{`
        @keyframes splashDrift1 { to { transform: translate(40px, 60px); } }
        @keyframes splashDrift2 { to { transform: translate(-50px,-40px); } }
        @keyframes splashDrift3 { to { transform: translate(-30px, 30px); } }
        @keyframes splashFloat {
          0%   { transform:translateY(0) scale(1); opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:0.4; }
          100% { transform:translateY(-100vh) scale(0); opacity:0; }
        }
        @keyframes socialPopIn {
          from { opacity:0; transform:scale(0.6) translateY(-6px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        .splash-enter-btn:hover {
          border-color: rgba(139,92,246,0.85) !important;
          box-shadow: 0 0 28px rgba(139,92,246,0.28) !important;
          transform: translateY(-2px) !important;
          color: #c4b5fd !important;
        }
        .splash-social-icon {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display:flex; align-items:center; justify-content:center;
        }
        .splash-social-icon:hover {
          transform: scale(1.18) translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.55) !important;
        }
      `}</style>

      <div style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'#080b12',
        display:'flex', alignItems:'center', justifyContent:'center',
        overflow:'hidden',
        opacity: leaving ? 0 : 1,
        transition:'opacity 0.75s ease',
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

        {/* Particles */}
        <div ref={particleRef} style={{ position:'absolute', inset:0, pointerEvents:'none' }} />

        {/* TOP RIGHT — Social icons */}
        <div style={{
          position:'absolute',
          top:24,
          right:24,
          display:'flex',
          flexDirection:'row',
          gap:12,
          zIndex:10,
          alignItems:'center',
        }}>
          {socialLinks.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              title={s.label}
              onClick={e => e.stopPropagation()}
              style={{ textDecoration:'none' }}
            >
              <div
                className="splash-social-icon"
                style={{
                  width:38, height:38, borderRadius:11,
                  background: s.bg,
                  boxShadow:'0 2px 14px rgba(0,0,0,0.45)',
                  opacity: socialShow ? 1 : 0,
                  animation: socialShow ? `socialPopIn 0.45s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.12}s both` : 'none',
                }}
              >
                {s.icon}
              </div>
            </a>
          ))}
        </div>

        {/* Glass card */}
        <div style={{
          position:'relative', zIndex:3,
          textAlign:'center',
          padding:'52px 64px 48px',
          background:'rgba(255,255,255,0.03)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:24,
          backdropFilter:'blur(40px)',
          WebkitBackdropFilter:'blur(40px)',
          maxWidth:420, width:'90%',
          filter:    cardReady ? 'blur(0) saturate(1)'      : 'blur(22px) saturate(0.4)',
          opacity:   cardReady ? 1                          : 0,
          transform: cardReady ? 'scale(1) translateY(0)'  : 'scale(0.96) translateY(14px)',
          transition:'filter 1.5s cubic-bezier(0.16,1,0.3,1), opacity 1.5s cubic-bezier(0.16,1,0.3,1), transform 1.5s cubic-bezier(0.16,1,0.3,1)',
        }}>

          <div style={{
            width:72, height:72, borderRadius:20, margin:'0 auto 24px',
            background:'linear-gradient(135deg,rgba(139,92,246,0.85),rgba(99,102,241,0.85))',
            display:'flex', alignItems:'center', justifyContent:'center',
            border:'1px solid rgba(255,255,255,0.15)',
            boxShadow:'0 8px 32px rgba(99,102,241,0.32)',
            fontSize:26, fontWeight:700, color:'#fff', fontFamily:'Georgia,serif',
          }}>A</div>

          <div style={{ fontSize:38, fontWeight:700, color:'#fff', letterSpacing:'-1.5px', fontFamily:'Georgia,serif', lineHeight:1, marginBottom:8 }}>
            Assess
            <span style={{ background:'linear-gradient(135deg,#a78bfa,#818cf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Sheet
            </span>
          </div>

          <div style={{ fontSize:10, letterSpacing:'3.5px', color:'rgba(255,255,255,0.28)', textTransform:'uppercase', fontFamily:'monospace', marginBottom:34 }}>
            Assessment Generator
          </div>

          <div style={{ width:1, height:32, background:'linear-gradient(to bottom,transparent,rgba(255,255,255,0.18),transparent)', margin:'0 auto 34px' }} />

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

      </div>
    </>
  );
}
