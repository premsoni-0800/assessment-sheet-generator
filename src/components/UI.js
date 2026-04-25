import React from 'react';
import { theme, fonts } from '../theme';

export function Label({ children }) {
  return (
    <div style={{
      fontSize: 10, fontFamily: fonts.mono, color: theme.muted,
      letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4,
    }}>
      {children}
    </div>
  );
}

export function Input({ value, onChange, placeholder, multiline, rows = 4, style = {} }) {
  const base = {
    width: '100%', background: theme.bg, border: `1px solid ${theme.border}`,
    borderRadius: 8, color: theme.text, fontFamily: fonts.body, fontSize: 13,
    padding: '9px 12px', outline: 'none', resize: multiline ? 'vertical' : 'none',
    boxSizing: 'border-box', lineHeight: 1.5, ...style,
  };
  return multiline
    ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />
    : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />;
}

export function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8,
      color: theme.text, fontFamily: fonts.body, fontSize: 13,
      padding: '8px 12px', width: '100%', outline: 'none', cursor: 'pointer',
    }}>
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  );
}

export function Btn({ children, onClick, variant = 'primary', disabled, small, style = {} }) {
  const colors = {
    primary: { bg: theme.accent,   color: '#fff',     border: 'none' },
    gold:    { bg: theme.gold,     color: '#0d0f14',  border: 'none' },
    ghost:   { bg: 'transparent',  color: theme.muted, border: `1px solid ${theme.border}` },
    danger:  { bg: theme.danger,   color: '#fff',     border: 'none' },
    success: { bg: theme.success,  color: '#0d0f14',  border: 'none' },
  };
  const c = colors[variant] || colors.primary;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: c.bg, color: c.color, border: c.border,
      borderRadius: 8, fontFamily: fonts.body,
      fontSize: small ? 11 : 13, fontWeight: 600,
      padding: small ? '5px 11px' : '9px 18px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      whiteSpace: 'nowrap', transition: 'opacity 0.15s', ...style,
    }}>
      {children}
    </button>
  );
}

export function SectionCard({ title, children }) {
  return (
    <div style={{
      background: theme.card, border: `1px solid ${theme.border}`,
      borderRadius: 12, padding: '14px 18px', marginBottom: 12,
    }}>
      <div style={{
        fontFamily: fonts.heading, fontSize: 14, fontWeight: 700,
        color: theme.gold, marginBottom: 10,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}