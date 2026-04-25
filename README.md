# AssessSheet – Assessment Sheet Generator

## Quick Start

### 1. Install Node.js
Download from https://nodejs.org (LTS version)

### 2. Run the app
```bash
cd assesssheet
npm install
npm start
```
Opens at http://localhost:3000

---

## ⬇️ Downloading PDF

Click **Preview** tab → click the green **"⬇️ Download PDF"** button.

The PDF downloads **directly to your Downloads folder** — no browser print dialog needed.
Uses `jsPDF` + `html2canvas` under the hood.

---

## 🤖 AI Features (Optional)

1. Get API key at https://console.anthropic.com  
2. Click **"🔑 Set API Key"** in the top bar  
3. Use **Auto-Fill All** or **AI Enhance** on any section

---

## Project Structure

```
assesssheet/
├── public/index.html
├── src/
│   ├── App.js              ← Main app
│   ├── index.js
│   ├── theme.js            ← Colors, fonts, templates
│   ├── pdfExport.js        ← jsPDF + html2canvas PDF logic
│   └── components/
│       ├── UI.js           ← Buttons, inputs, cards
│       ├── LeftPanel.js    ← Settings sidebar
│       └── PreviewDoc.js   ← Printable A4 document
└── package.json
```

## Dependencies
- `react`, `react-dom`, `react-scripts`
- `jspdf` – PDF generation
- `html2canvas` – DOM-to-image capture
