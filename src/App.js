import React, { useState, useRef } from 'react';
import { theme, fonts, TEMPLATES } from './theme';
import { Btn, SectionCard, Label, Input } from './components/UI';
import LeftPanel from './components/LeftPanel';
import PreviewDoc from './components/PreviewDoc';
import { exportToPDF } from './pdfExport';

const BACKEND_URL = "https://assessment-sheet-generator-production.up.railway.app";
export default function App() {
  const [step,         setStep]         = useState('editor');
  const [templateKey,  setTemplateKey]  = useState('DAA');
  const [tpl,          setTpl]          = useState({ ...TEMPLATES.DAA });
  const [studentName,  setStudentName]  = useState('');
  const [uid,          setUid]          = useState('');
  const [section,      setSection]      = useState('');
  const [worksheetNo,  setWorksheetNo]  = useState('');
  const [datePerf,     setDatePerf]     = useState('');
const [sectionContent, setSectionContent] = useState({
  Aim: '',
  Requirements: 'Hackerrank, CPP compiler',
  'Procedure/Code': '',
  'Learning Outcome': '',
});
  // ── Output Blocks State (supports multiple outputs + images) ──────────────
  const [outputImages, setOutputImages] = useState([
    { text: 'Input:\n5 4\n1 2\n3 2\n3 4\n5 4\n\nOutput: 2', imageUrl: null, imageName: '' }
  ]);

  const [generating,      setGenerating]      = useState(null);
  const [exporting,       setExporting]       = useState(false);
  const [apiKey,          setApiKey]          = useState('');
  const [showApiModal,    setShowApiModal]    = useState(false);
  const [savedTemplates,  setSavedTemplates]  = useState([]);
  const [cloudSaveStatus, setCloudSaveStatus] = useState('idle');
  const [cloudTemplates,  setCloudTemplates]  = useState([]);
  const [showCloudModal,  setShowCloudModal]  = useState(false);

  const previewRef = useRef(null);

  const handleTemplateChange = (key) => { setTemplateKey(key); setTpl({ ...TEMPLATES[key] }); };
  const updateTpl     = (k, v) => setTpl(prev => ({ ...prev, [k]: v }));
  const updateContent = (sec, val) => setSectionContent(prev => ({ ...prev, [sec]: val }));

  // ── Output Block Handlers ─────────────────────────────────────────────────
  const addOutput = () =>
    setOutputImages(prev => [...prev, { text: '', imageUrl: null, imageName: '' }]);

  const removeOutput = (i) =>
    setOutputImages(prev => prev.filter((_, idx) => idx !== i));

  const updateOutputText = (i, val) =>
    setOutputImages(prev => prev.map((o, idx) => idx === i ? { ...o, text: val } : o));

  const updateOutputImage = (i, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setOutputImages(prev =>
        prev.map((o, idx) =>
          idx === i ? { ...o, imageUrl: e.target.result, imageName: file.name } : o
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const removeOutputImage = (i) =>
    setOutputImages(prev =>
      prev.map((o, idx) => idx === i ? { ...o, imageUrl: null, imageName: '' } : o)
    );

  // ── Helpers for PDF/Preview ───────────────────────────────────────────────
  const getFormattedOutputImages = () =>
    outputImages
      .filter(o => o.imageUrl)
      .map(o => ({ dataUrl: o.imageUrl, name: o.imageName }));

  const getOutputText = () =>
    outputImages
      .map((o, i) => o.text ? `[Output ${i + 1}]\n${o.text}` : '')
      .filter(Boolean)
      .join('\n\n');

  const handleDownloadPDF = () => {
    setExporting(true);
    try {
      const name = `Worksheet-${worksheetNo}-${studentName || 'Student'}`;
      exportToPDF(
        {
          tpl, studentName, uid, section, worksheetNo, datePerf,
          sectionContent: { ...sectionContent, Output: getOutputText() },
          outputImages: getFormattedOutputImages(),
        },
        name
      );
    } catch (e) {
      console.error('PDF export failed:', e);
      alert('PDF export failed: ' + e.message);
    }
    setExporting(false);
  };

  // ── Cloud Save ────────────────────────────────────────────────────────────
  const handleSaveToCloud = async () => {
    setCloudSaveStatus('saving');
    try {
      const response = await fetch(`${BACKEND_URL}/save-template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName, uid, section, worksheetNo, datePerf,
          university:  tpl.university,
          subject:     tpl.subject,
          subjectCode: tpl.subjectCode,
          branch:      tpl.branch,
          semester:    tpl.semester,
          sectionContent,
        }),
      });
      if (response.ok) {
        setCloudSaveStatus('success');
        setTimeout(() => setCloudSaveStatus('idle'), 3000);
      } else {
        setCloudSaveStatus('error');
        setTimeout(() => setCloudSaveStatus('idle'), 4000);
      }
    } catch (err) {
      setCloudSaveStatus('error');
      setTimeout(() => setCloudSaveStatus('idle'), 4000);
    }
  };

  // ── Cloud Load ────────────────────────────────────────────────────────────
  const handleLoadFromCloud = async () => {
    try {
      const res  = await fetch(`${BACKEND_URL}/templates`);
      const data = await res.json();
      if (data.templates.length === 0) { alert('No saved templates found in cloud.'); return; }
      setCloudTemplates(data.templates);
      setShowCloudModal(true);
    } catch (err) {
      alert('Could not connect to backend. Make sure server is running on port 5001.');
    }
  };

  const applyCloudTemplate = async (id) => {
    try {
      const res      = await fetch(`${BACKEND_URL}/templates/${id}`);
      const template = await res.json();
      setStudentName(template.studentName  || '');
      setUid(template.uid                  || '');
      setSection(template.section          || '');
      setWorksheetNo(template.worksheetNo  || '');
      setDatePerf(template.datePerf        || '');
      updateTpl('university',  template.university  || '');
      updateTpl('subject',     template.subject     || '');
      updateTpl('subjectCode', template.subjectCode || '');
      updateTpl('branch',      template.branch      || '');
      updateTpl('semester',    template.semester    || '');
      setSectionContent(template.sectionContent     || {});
      setShowCloudModal(false);
    } catch (err) { alert('Failed to load template.'); }
  };

  // ── AI ────────────────────────────────────────────────────────────────────
  const getHeaders = () => {
    const key = apiKey.trim();
    if (!key) { setShowApiModal(true); return null; }
    return { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' };
  };

  const aiEnhance = async (sec) => {
    const headers = getHeaders();
    if (!headers) return;
    setGenerating(sec);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers,
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 800,
          system: 'You are an expert at writing professional university CS assessment content. Return only the improved section content, no preamble.',
          messages: [{ role: 'user', content: `Improve this section for a university lab worksheet.\nSection: "${sec}"\nSubject: ${tpl.subject}\nCurrent content:\n${sectionContent[sec] || '(empty)'}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text ?? '';
      if (text) updateContent(sec, text.trim());
    } catch (e) { alert('AI request failed. Check your API key.'); }
    setGenerating(null);
  };

  const aiAutoFill = async () => {
    const headers = getHeaders();
    if (!headers) return;
    setGenerating('all');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers,
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 2000,
          system: 'You are an expert at writing professional university CS assessment content. Return ONLY valid JSON — no markdown, no backticks, no commentary.',
          messages: [{ role: 'user', content: `Generate content for all sections of a CS lab worksheet.\nSubject: ${tpl.subject}\nSections: ${tpl.sections.join(', ')}\nExisting Aim: "${sectionContent['Aim'] || ''}"\nReturn JSON: { "Section Name": "content", ... }` }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text ?? '';
      const clean = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setSectionContent(prev => ({ ...prev, ...parsed }));
    } catch (e) { alert('AI auto-fill failed. Check your API key.'); }
    setGenerating(null);
  };

  const saveTemplate = () => {
    const name = `Template ${savedTemplates.length + 1} - ${tpl.subject || 'Custom'}`;
    setSavedTemplates(prev => [...prev, { name, tpl: { ...tpl }, content: { ...sectionContent } }]);
  };
  const loadTemplate = (s) => { setTpl({ ...s.tpl }); setSectionContent({ ...s.content }); };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${theme.bg}; font-family: ${fonts.body}; }
        textarea:focus, input:focus, select:focus { border-color: #4f8ef7 !important; outline: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${theme.bg}; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 4px; }
        .upload-btn {
          display: inline-flex; align-items: center; gap: 6px;
          cursor: pointer; padding: 6px 14px;
          background: transparent; border: 1px solid ${theme.border};
          border-radius: 8px; font-size: 12px; color: ${theme.muted};
          transition: border-color 0.15s, color 0.15s;
          font-family: ${fonts.body};
        }
        .upload-btn:hover { border-color: #4f8ef7; color: #4f8ef7; }
      `}</style>

      {/* ── API Key Modal ──────────────────────────────────────────────────── */}
      {showApiModal && (
        <div style={{ position: 'fixed', inset: 0, background: '#000b', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 32, width: 420 }}>
            <div style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 700, color: theme.gold, marginBottom: 8 }}>
              🔑 Anthropic API Key
            </div>
            <p style={{ fontSize: 13, color: theme.muted, marginBottom: 16, lineHeight: 1.6 }}>
              AI features need your key from{' '}
              <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: theme.accent }}>console.anthropic.com</a>.
              It's never saved to disk.
            </p>
            <Label>API Key (sk-ant-...)</Label>
            <Input value={apiKey} onChange={setApiKey} placeholder="sk-ant-api03-..." style={{ marginBottom: 14 }} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Btn variant="ghost" onClick={() => setShowApiModal(false)}>Cancel</Btn>
              <Btn variant="primary" onClick={() => { if (apiKey.trim()) setShowApiModal(false); }}>Save Key</Btn>
            </div>
          </div>
        </div>
      )}

      {/* ── Cloud Load Modal ───────────────────────────────────────────────── */}
      {showCloudModal && (
        <div style={{ position: 'fixed', inset: 0, background: '#000b', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 32, width: 500, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ fontFamily: fonts.heading, fontSize: 20, fontWeight: 700, color: theme.accent, marginBottom: 16 }}>
              ☁️ Load from Cloud
            </div>
            <p style={{ fontSize: 12, color: theme.muted, marginBottom: 16 }}>
              Select a previously saved template to load into the editor.
            </p>
            {cloudTemplates.map((t) => (
              <div key={t._id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', marginBottom: 8,
                background: theme.surface, borderRadius: 10, border: `1px solid ${theme.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>
                    {t.studentName} — {t.subject}
                  </div>
                  <div style={{ fontSize: 11, color: theme.muted, marginTop: 3 }}>
                    Worksheet {t.worksheetNo} · UID: {t.uid} · {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Btn variant="primary" small onClick={() => applyCloudTemplate(t._id)}>Load</Btn>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <Btn variant="ghost" onClick={() => setShowCloudModal(false)}>Close</Btn>
            </div>
          </div>
        </div>
      )}

      <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text }}>

        {/* ── Top Bar ───────────────────────────────────────────────────────── */}
        <div style={{
          background: theme.surface, borderBottom: `1px solid ${theme.border}`,
          padding: '10px 28px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.gold})`,
              width: 34, height: 34, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
            }}>📋</div>
            <div>
              <div style={{ fontFamily: fonts.heading, fontSize: 16, fontWeight: 700 }}>AssessSheet</div>
              <div style={{ fontSize: 10, color: theme.muted, fontFamily: fonts.mono, letterSpacing: '0.1em' }}>
                AUTOMATED ASSESSMENT GENERATOR
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Btn variant="ghost" small onClick={() => setShowApiModal(true)}
              style={{ color: apiKey ? theme.success : theme.muted }}>
              {apiKey ? '🔑 API Key ✓' : '🔑 Set API Key'}
            </Btn>
            <Btn variant="ghost" small onClick={() => setStep('editor')}
              style={{ color: step === 'editor' ? theme.accent : theme.muted }}>
              ✏️ Editor
            </Btn>
            <Btn variant="ghost" small onClick={() => setStep('preview')}
              style={{ color: step === 'preview' ? theme.accent : theme.muted }}>
              👁 Preview
            </Btn>
            {step === 'preview' && (
              <Btn variant="success" small onClick={handleDownloadPDF} disabled={exporting}
                style={{ background: theme.success, color: '#0d0f14' }}>
                {exporting ? '⏳ Generating…' : '⬇️ Download PDF'}
              </Btn>
            )}
          </div>
        </div>

        {/* ── EDITOR ────────────────────────────────────────────────────────── */}
        {step === 'editor' && (
          <div style={{ display: 'flex', minHeight: 'calc(100vh - 57px)' }}>
            <LeftPanel
              tpl={tpl} updateTpl={updateTpl}
              templateKey={templateKey} handleTemplateChange={handleTemplateChange}
              savedTemplates={savedTemplates} saveTemplate={saveTemplate} loadTemplate={loadTemplate}
              onSaveToCloud={handleSaveToCloud}
              cloudSaveStatus={cloudSaveStatus}
            />

            <div style={{ flex: 1, padding: '18px 28px', overflowY: 'auto', height: 'calc(100vh - 57px)' }}>

              {/* Student Info */}
              <SectionCard title="👤 Student Information">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {[
                    ['Student Name', studentName, setStudentName],
                    ['UID', uid, setUid],
                    ['Section/Group', section, setSection],
                    ['Worksheet No.', worksheetNo, setWorksheetNo],
                    ['Date of Performance', datePerf, setDatePerf],
                  ].map(([label, val, setter]) => (
                    <div key={label}>
                      <Label>{label}</Label>
                      <Input value={val} onChange={setter} placeholder={label} />
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* AI Banner */}
              <div style={{
                background: `linear-gradient(135deg, ${theme.accentGlow}, ${theme.goldGlow})`,
                border: `1px solid ${theme.accent}40`, borderRadius: 12,
                padding: '12px 18px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 12,
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: theme.accent }}>✨ AI Auto-Fill</div>
                  <div style={{ fontSize: 12, color: theme.muted, marginTop: 2 }}>
                    Generate all section content automatically based on your Aim
                  </div>
                </div>
                <Btn variant="primary" onClick={aiAutoFill} disabled={!!generating}>
                  {generating === 'all' ? '⏳ Generating…' : '🤖 Auto-Fill All'}
                </Btn>
              </div>

              {/* Section Editors */}
              {tpl.sections.map(sec => {
                const isOutput = sec.toLowerCase() === 'output';
                return (
                  <SectionCard key={sec} title={sec}>

                    {isOutput ? (
                      /* ── OUTPUT SECTION: multiple blocks + images ── */
                      <>
                        {outputImages.map((out, i) => (
                          <div key={i} style={{
                            marginBottom: 10, padding: '14px',
                            background: theme.bg, borderRadius: 10,
                            border: `1px solid ${theme.border}`,
                          }}>
                            {/* Block header */}
                            <div style={{
                              display: 'flex', justifyContent: 'space-between',
                              alignItems: 'center', marginBottom: 8,
                            }}>
                              <span style={{
                                fontSize: 11, fontWeight: 700, color: theme.accent,
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                              }}>
                                Output {i + 1}
                              </span>
                              {outputImages.length > 1 && (
                                <button onClick={() => removeOutput(i)} style={{
                                  background: 'transparent', border: 'none',
                                  color: theme.danger, cursor: 'pointer',
                                  fontSize: 11, padding: '2px 8px', borderRadius: 6,
                                }}>✕ Remove</button>
                              )}
                            </div>

                            {/* Text */}
                            <Label>Text / Result</Label>
                            <Input
                              multiline rows={4}
                              value={out.text}
                              onChange={v => updateOutputText(i, v)}
                              placeholder="Enter output text, result, terminal output…"
                            />

                            {/* Image */}
                            <div style={{ marginTop: 10 }}>
                              <Label>Screenshot / Image (optional)</Label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                                <label className="upload-btn">
                                  📎 {out.imageUrl ? 'Change Image' : 'Upload Image'}
                                  <input
                                    type="file" accept="image/*" style={{ display: 'none' }}
                                    onChange={e => updateOutputImage(i, e.target.files[0])}
                                  />
                                </label>
                                {out.imageUrl && (
                                  <button onClick={() => removeOutputImage(i)} style={{
                                    background: 'transparent', border: 'none',
                                    color: theme.danger, cursor: 'pointer', fontSize: 11,
                                  }}>🗑 Remove</button>
                                )}
                                {out.imageName && (
                                  <span style={{ fontSize: 11, color: theme.muted, fontStyle: 'italic' }}>
                                    {out.imageName}
                                  </span>
                                )}
                              </div>

                              {out.imageUrl && (
                                <div style={{ marginTop: 10 }}>
                                  <img
                                    src={out.imageUrl}
                                    alt={`Output ${i + 1}`}
                                    style={{
                                      maxWidth: '100%', maxHeight: 200,
                                      objectFit: 'contain', borderRadius: 8,
                                      border: `1px solid ${theme.border}`,
                                      display: 'block',
                                    }}
                                  />
                                  <div style={{ fontSize: 11, color: theme.muted, marginTop: 4, fontStyle: 'italic' }}>
                                    Fig {i + 1}: {out.imageName.replace(/\.[^.]+$/, '')}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        <div style={{ marginTop: 4 }}>
                          <Btn variant="ghost" small onClick={addOutput}>
                            + Add Output Block
                          </Btn>
                        </div>
                      </>
                    ) : (
                      /* ── ALL OTHER SECTIONS ── */
                      <>
                        <Input
                          multiline
                          rows={sec.toLowerCase().includes('code') ? 12 : 5}
                          value={sectionContent[sec] ?? ''}
                          onChange={v => updateContent(sec, v)}
                          placeholder={`Enter ${sec} content…`}
                          style={sec.toLowerCase().includes('code')
                            ? { fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }
                            : {}}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, gap: 8 }}>
                          <Btn variant="ghost" small onClick={() => aiEnhance(sec)} disabled={!!generating}>
                            {generating === sec ? '⏳ Enhancing…' : '✨ AI Enhance'}
                          </Btn>
                          <Btn variant="ghost" small onClick={() => updateContent(sec, '')}>🗑 Clear</Btn>
                        </div>
                      </>
                    )}
                  </SectionCard>
                );
              })}

              {/* Bottom Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4, paddingBottom: 28 }}>
                <Btn variant="ghost" onClick={saveTemplate}>💾 Save Template</Btn>
                <Btn variant="ghost" onClick={handleLoadFromCloud}>☁️ Load from Cloud</Btn>
                <Btn variant="gold" onClick={() => setStep('preview')}>👁 Preview & Download →</Btn>
              </div>
            </div>
          </div>
        )}

        {/* ── PREVIEW ───────────────────────────────────────────────────────── */}
        {step === 'preview' && (
          <div style={{ padding: '24px', background: '#12141a', minHeight: 'calc(100vh - 57px)' }}>
            <div style={{ maxWidth: 860, margin: '0 auto 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Btn variant="ghost" onClick={() => setStep('editor')}>← Back to Editor</Btn>
              <Btn
                onClick={handleDownloadPDF} disabled={exporting}
                style={{
                  background: theme.success, color: '#0d0f14', border: 'none',
                  borderRadius: 8, fontWeight: 700, padding: '10px 24px',
                  cursor: exporting ? 'not-allowed' : 'pointer',
                  opacity: exporting ? 0.6 : 1, fontSize: 14,
                }}
              >
                {exporting ? '⏳ Generating PDF…' : '⬇️ Download PDF'}
              </Btn>
            </div>
            <div style={{
              maxWidth: 860, margin: '0 auto 14px',
              background: '#1a2a1a', border: `1px solid ${theme.success}40`,
              borderRadius: 10, padding: '10px 16px', fontSize: 13, color: theme.success,
            }}>
              ✅ Click <strong>Download PDF</strong> to save the document directly — no browser print dialog needed.
            </div>
            <div style={{ maxWidth: 860, margin: '0 auto', boxShadow: '0 8px 60px #0009', borderRadius: 4 }}>
              <PreviewDoc
                ref={previewRef}
                tpl={tpl}
                studentName={studentName}
                uid={uid}
                section={section}
                worksheetNo={worksheetNo}
                datePerf={datePerf}
                sectionContent={{ ...sectionContent, Output: getOutputText() }}
                outputImages={getFormattedOutputImages()}
                outputBlocks={outputImages}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}