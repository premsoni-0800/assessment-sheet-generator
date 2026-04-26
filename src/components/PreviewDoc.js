import React from 'react';
import cuLogo from '../assets/logo.png';

const PreviewDoc = React.forwardRef(function PreviewDoc(
  { tpl, studentName, uid, section, worksheetNo, datePerf, sectionContent, outputImages = [], outputBlocks = [] },
  ref
) {
  return (
    <div
      ref={ref}
      id="pdf-preview-root"
      style={{
        background: '#ffffff',
        color: '#111111',
        fontFamily: `'${tpl.bodyFont}', sans-serif`,
        fontSize: `${tpl.fontSize}pt`,
        lineHeight: tpl.spacing,
        textAlign: tpl.align,
        padding: '36px 52px',
        width: '794px',
        minHeight: '1123px',
        boxSizing: 'border-box',
        margin: '0 auto',
      }}
    >
      {/* ── CU Department Header ── */}
      <div style={{ marginBottom: 10 }}>
  <img
    src={cuLogo}
    alt="CU Logo"
    style={{
      width: '150%',
      maxWidth: 1500,
      height: 'auto',
      display: 'block'
    }}
  />
</div>

      {/* ── Thick bottom border (the line) ── */}
      <div style={{ borderBottom: '2.5px solid #111', marginBottom: 14 }} />

      {/* ── Worksheet Title ── */}
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <div
          style={{
            fontFamily: `'${tpl.headingFont}', serif`,
            fontSize: `${tpl.fontSize + 5}pt`,
            fontWeight: 700,
            textDecoration: 'underline',
          }}
        >
          Worksheet {worksheetNo}
        </div>
      </div>

      {/* ── Student Info Table ── */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: 16,
          fontSize: `${tpl.fontSize}pt`,
        }}
      >
        <tbody>
          {[
            [['Student Name', studentName], ['UID', uid]],
            [['Branch', tpl.branch], ['Section/Group', section]],
            [['Semester', tpl.semester], ['Date of Performance', datePerf]],
            [['Subject Name', tpl.subject], ['Subject Code', tpl.subjectCode]],
          ].map((row, ri) => (
            <tr key={ri}>
              {row.map(([k, v]) => (
                <td key={k} style={{ padding: '2px 0', width: '50%' }}>
                  <strong>{k}:</strong> {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Sections ── */}
      {tpl.sections.map((sec, i) => {
        const isOutput = sec.toLowerCase() === 'output';

        return (
          <div key={sec} style={{ marginBottom: 16 }}>
            <div
              style={{
                fontFamily: `'${tpl.headingFont}', serif`,
                fontSize: `${tpl.fontSize + 1}pt`,
                fontWeight: 700,
                marginBottom: 4,
                //borderBottom: '1px solid #ddd',
                paddingBottom: 2,
              }}
            >
              {i + 1}. {sec}:
            </div>

            {isOutput && outputBlocks.length > 0 ? (
              <div>
                {outputBlocks.map((block, idx) => (
                  <div key={idx} style={{ marginBottom: 14 }}>
                    {outputBlocks.length > 1 && (
                      <div style={{ fontWeight: 700, marginBottom: 3 }}>
                        Output {idx + 1}:
                      </div>
                    )}
                    {block.text && (
                      <div style={{ whiteSpace: 'pre-wrap' }}>{block.text}</div>
                    )}
                    {block.imageUrl && (
                      <div style={{ textAlign: 'center', marginTop: 8 }}>
                        <img
                          src={block.imageUrl}
                          alt={`Output ${idx + 1}`}
                          style={{ maxWidth: '100%', maxHeight: 260 }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {sectionContent[sec] || '(no content)'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default PreviewDoc;