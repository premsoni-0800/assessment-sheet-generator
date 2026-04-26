import jsPDF from 'jspdf';
import cuLogo from './assets/logo.png'; 
const PAGE_W      = 210;
const PAGE_H      = 297;
const MARGIN_X    = 20;
const MARGIN_TOP  = 18;
const MARGIN_BOT  = 18;
const CONTENT_W   = PAGE_W - MARGIN_X * 2;

export async function exportToPDF(docData, filename = 'assessment-sheet') {

  const {
    tpl, studentName, uid, section,
    worksheetNo, datePerf, sectionContent,
    outputImages = [],
  } = docData;

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const BASE   = tpl.fontSize  || 12;
  const H1     = BASE + 4;
  const H2     = BASE + 1;
  const SMALL  = BASE - 1;
  const LINE_H = BASE * 0.45 * (tpl.spacing || 1.6);

  let y = MARGIN_TOP;

  const checkPage = (needed = LINE_H) => {
    if (y + needed > PAGE_H - MARGIN_BOT) {
      pdf.addPage();
      y = MARGIN_TOP;
    }
  };

  const writeText = (text, x, maxW, lineH, align = 'left') => {
    if (!text) return;
    const lines = pdf.splitTextToSize(String(text), maxW);
    lines.forEach(line => {
      checkPage(lineH);
      pdf.text(line, align === 'center' ? PAGE_W / 2 : x, y, { align });
      y += lineH;
    });
  };

  // ═════════ HEADER ═════════
  const LOGO_SIZE = 18;
  const logoX = MARGIN_X;
  const logoY = y;

  // ✅ FIXED: add logo properly (NO <img />)
{/* ── CU Department Header ── */}
const HEADER_HEIGHT = 40;

pdf.addImage(
  cuLogo,
  'PNG',
  MARGIN_X,
  5,
  CONTENT_W + 25,   // 👈 increased width only
  HEADER_HEIGHT
);

y = HEADER_HEIGHT + 10;

  // Line
  y = logoY + LOGO_SIZE + 8;
  pdf.setDrawColor(80, 80, 80);
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN_X, y, PAGE_W - MARGIN_X, y);
  y += 10;

  // ═════════ TITLE ═════════
  pdf.setFont('times', 'bold');
  pdf.setFontSize(H1);
  pdf.setTextColor(10, 10, 10);
  writeText(`Worksheet ${worksheetNo}`, MARGIN_X, CONTENT_W, LINE_H * 1.4, 'center');
  y += 3;

  // ═════════ INFO ═════════
  pdf.setFont('helvetica', 'normal');
pdf.setFontSize(BASE);

const infoRows = [
  [['Student Name', studentName],  ['UID', uid]],
  [['Branch', tpl.branch],         ['Section/Group', section]],
  [['Semester', tpl.semester],     ['Date of Performance', datePerf]],
  [['Subject Name', tpl.subject],  ['Subject Code', tpl.subjectCode]],
];

const colW = CONTENT_W / 2;
const rowH = LINE_H * 1.4;

infoRows.forEach(row => {
  let maxHeight = rowH;

  row.forEach(([label, value], ci) => {
    const x = MARGIN_X + ci * colW;

    pdf.setFont('helvetica', 'bold');
    const labelText = `${label}: `;
    const labelW = pdf.getTextWidth(labelText);

    pdf.setFont('helvetica', 'normal');
    const text = String(value || '');

    const wrapped = pdf.splitTextToSize(text, colW - labelW - 2);
    const height = wrapped.length * LINE_H;

    if (height > maxHeight) maxHeight = height;
  });

  checkPage(maxHeight);

  row.forEach(([label, value], ci) => {
    const x = MARGIN_X + ci * colW;

    pdf.setFont('helvetica', 'bold');
    const labelText = `${label}: `;
    pdf.text(labelText, x, y);

    const labelW = pdf.getTextWidth(labelText);

    pdf.setFont('helvetica', 'normal');
    const wrapped = pdf.splitTextToSize(String(value || ''), colW - labelW - 2);

    wrapped.forEach((line, i) => {
      pdf.text(line, x + labelW, y + i * LINE_H);
    });
  });

  y += maxHeight;

  // optional divider line
  pdf.setDrawColor(200);
  pdf.line(MARGIN_X, y - 2, MARGIN_X + CONTENT_W, y - 2);
});

y += 4;

  // ═════════ SECTIONS ═════════
  tpl.sections.forEach((sec, i) => {
    checkPage(LINE_H * 2);

    pdf.setFont('times', 'bold');
    pdf.setFontSize(H2);
    pdf.setTextColor(10, 10, 10);
    y += 2;
    writeText(`${i + 1}. ${sec}:`, MARGIN_X, CONTENT_W, LINE_H * 1.3);
    y -= 2;

    const content  = sectionContent[sec] || '';
    const isCode   = sec.toLowerCase().includes('code');
    const isOutput = sec.toLowerCase() === 'output';

    if (isCode && content) {
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(BASE - 1);

      const codeLines = pdf.splitTextToSize(content, CONTENT_W - 8);
      codeLines.forEach(line => {
        checkPage(LINE_H);
        pdf.text(line, MARGIN_X + 4, y);
        y += LINE_H;
      });

    } else if (isOutput && outputImages.length > 0) {

      if (content) {
        pdf.setFont('helvetica', 'normal');
        writeText(content, MARGIN_X + 2, CONTENT_W - 4, LINE_H);
      }

      outputImages.forEach((img, idx) => {
        if (!img.dataUrl) return;

        const format = img.dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';

        const MAX_W = CONTENT_W;
        const MAX_H = 75;

        checkPage(MAX_H + 12);

        const imgX = MARGIN_X;
        pdf.addImage(img.dataUrl, format, imgX, y, MAX_W, MAX_H);

        y += MAX_H + 3;

        pdf.setFont('times', 'italic');
        pdf.setFontSize(SMALL - 1);

        const caption = `Fig ${idx + 1}`;
        pdf.text(caption, PAGE_W / 2, y, { align: 'center' });

        y += LINE_H + 3;
      });

    } else {
      pdf.setFont('helvetica', 'normal');
      writeText(content || '(no content)', MARGIN_X + 2, CONTENT_W - 4, LINE_H);
    }

    y += 3;
  });

  // ═════════ FOOTER ═════════
  const totalPages = pdf.getNumberOfPages();

  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${p} of ${totalPages}`, PAGE_W / 2, PAGE_H - 7, { align: 'center' });
  }

  pdf.save(`${filename}.pdf`);
}