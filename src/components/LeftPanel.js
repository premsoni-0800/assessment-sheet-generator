import React from 'react';
import { theme, FONT_OPTIONS, SIZE_OPTIONS, ALIGN_OPTIONS, TEMPLATES, ALL_SECTIONS } from '../theme';
import { Label, Input, Select, Btn, SectionCard } from './UI';

export default function LeftPanel({
  tpl, updateTpl, templateKey, handleTemplateChange,
  savedTemplates, saveTemplate, loadTemplate,
  onSaveToCloud, cloudSaveStatus,
}) {
  return (
    <div style={{
      background: theme.surface, borderRight: `1px solid ${theme.border}`,
      padding: '16px 16px', overflowY: 'auto',
      height: 'calc(100vh - 57px)', width: 290, flexShrink: 0,
    }}>

      {/* ── Template Config ──────────────────────────────────────────────── */}
      <SectionCard title="📐 Template">
        <Label>Select Template</Label>
        <Select
          value={templateKey}
          onChange={handleTemplateChange}
          options={Object.entries(TEMPLATES).map(([k, v]) => ({ value: k, label: v.label }))}
        />
        {[
          ['University',    'university'],
          ['Subject Name',  'subject'],
          ['Subject Code',  'subjectCode'],
          ['Branch',        'branch'],
          ['Semester',      'semester'],
        ].map(([label, key]) => (
          <div key={key} style={{ marginTop: 8 }}>
            <Label>{label}</Label>
            <Input value={tpl[key]} onChange={v => updateTpl(key, v)} placeholder={label} />
          </div>
        ))}
      </SectionCard>

      {/* ── Formatting ───────────────────────────────────────────────────── */}
      <SectionCard title="🎨 Formatting">
        <Label>Heading Font</Label>
        <Select value={tpl.headingFont} onChange={v => updateTpl('headingFont', v)} options={FONT_OPTIONS} />
        <div style={{ marginTop: 8 }}>
          <Label>Body Font</Label>
          <Select value={tpl.bodyFont} onChange={v => updateTpl('bodyFont', v)} options={FONT_OPTIONS} />
        </div>
        <div style={{ marginTop: 8 }}>
          <Label>Font Size</Label>
          <Select value={tpl.fontSize} onChange={v => updateTpl('fontSize', Number(v))} options={SIZE_OPTIONS} />
        </div>
        <div style={{ marginTop: 8 }}>
          <Label>Text Alignment</Label>
          <Select value={tpl.align} onChange={v => updateTpl('align', v)} options={ALIGN_OPTIONS} />
        </div>
        <div style={{ marginTop: 8 }}>
          <Label>Line Spacing ({tpl.spacing})</Label>
          <input
            type="range" min="1.2" max="2.4" step="0.1"
            value={tpl.spacing} onChange={e => updateTpl('spacing', Number(e.target.value))}
            style={{ width: '100%', accentColor: '#4f8ef7' }}
          />
        </div>
      </SectionCard>

      {/* ── Active Sections ───────────────────────────────────────────────── */}
      <SectionCard title="📑 Active Sections">
        {ALL_SECTIONS.map(sec => (
          <label key={sec} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginBottom: 5, cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={tpl.sections.includes(sec)}
              onChange={e => {
                const next = e.target.checked
                  ? [...tpl.sections, sec]
                  : tpl.sections.filter(s => s !== sec);
                updateTpl('sections', next);
              }}
              style={{ accentColor: '#4f8ef7' }}
            />
            <span style={{ fontSize: 12, color: theme.muted }}>{sec}</span>
          </label>
        ))}
      </SectionCard>

      {/* ── Saved Templates ───────────────────────────────────────────────── */}
      <SectionCard title="💾 Saved Templates">
        <Btn
          variant="ghost" small
          onClick={saveTemplate}
          style={{ width: '100%', marginBottom: 7 }}
        >
          💾 Save Template (Local)
        </Btn>

        <Btn
          variant="primary" small
          onClick={onSaveToCloud}
          disabled={cloudSaveStatus === 'saving'}
          style={{
            width: '100%', marginBottom: 8,
            background:
              cloudSaveStatus === 'success' ? theme.success :
              cloudSaveStatus === 'error'   ? '#e05555'     :
              '#4f8ef7',
            color:
              cloudSaveStatus === 'success' ? '#0d0f14' : '#fff',
            transition: 'background 0.3s',
          }}
        >
          {cloudSaveStatus === 'saving'  ? '⏳ Saving to Cloud…' :
           cloudSaveStatus === 'success' ? '✅ Saved to Cloud!'  :
           cloudSaveStatus === 'error'   ? '❌ Save Failed'      :
           '☁️ Save to Cloud'}
        </Btn>

        {cloudSaveStatus === 'success' && (
          <div style={{ fontSize: 11, color: theme.success, textAlign: 'center', marginBottom: 7 }}>
            Template stored in MongoDB Atlas
          </div>
        )}
        {cloudSaveStatus === 'error' && (
          <div style={{ fontSize: 11, color: '#e05555', textAlign: 'center', marginBottom: 7 }}>
            Check backend is running on port 5001
          </div>
        )}

        {savedTemplates.length === 0 ? (
          <div style={{ fontSize: 11, color: theme.muted, textAlign: 'center' }}>
            No local templates yet
          </div>
        ) : (
          savedTemplates.map((s, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 5,
            }}>
              <span style={{ fontSize: 12, color: theme.text }}>{s.name}</span>
              <Btn variant="ghost" small onClick={() => loadTemplate(s)}>Load</Btn>
            </div>
          ))
        )}
      </SectionCard>
    </div>
  );
}