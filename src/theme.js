export const theme = {
  bg: "#0d0f14",
  surface: "#13161d",
  card: "#1a1e28",
  border: "#252a38",
  accent: "#4f8ef7",
  accentGlow: "#4f8ef720",
  gold: "#f5c842",
  goldGlow: "#f5c84220",
  text: "#e8eaf0",
  muted: "#6b7280",
  success: "#34d399",
  danger: "#f87171",
};

export const fonts = {
  heading: "'Times New Roman', serif",
  body: "'Times New Roman', serif",
  mono: "'Times New Roman', serif",
};

export const FONT_OPTIONS = ["Times New Roman"];
export const SIZE_OPTIONS  = [10, 11, 12, 13, 14, 15];
export const ALIGN_OPTIONS = ["left", "center", "justify"];

// 🔥 Keep only valid + used sections
export const ALL_SECTIONS = [  "Aim",
  "Requirements",
  "Algorithm",
  "Procedure/Code",
  "Procedure",
  "SQL Queries",
  "ER Diagram",
  "Output",
  "Learning Outcome",
  "Conclusion",
];

// ✅ FIXED TEMPLATE
export const TEMPLATES = {
  CUSTOM: {
    label: "Custom Template",
    university: "Chandigarh University",
    subject: "",
    subjectCode: "",
    branch: "",
    semester: "",
    
    // ❌ removed "Code"
    // ❌ removed unused mismatched sections
    sections: [
      "Aim",
      "Requirements",
      "Procedure/Code",
      "Output",
      "Learning Outcome",
      "Conclusion"
    ],

    headingFont: "Times New Roman",
    bodyFont: "Times New Roman",
    fontSize: 12,
    align: "left",
    spacing: 1.5,
  }
};