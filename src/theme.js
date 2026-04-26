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

export const ALL_SECTIONS = [
  "Aim", "Requirements", "Algorithm", "Procedure/Code",
  "Procedure", "SQL Queries", "ER Diagram",
  "Output", "Learning Outcome", "Conclusion",
];

export const TEMPLATES = {
  DAA: {
    label: "DAA ",
    university: "Chandigarh University",
    subject: "DAA",
    subjectCode: "24CSH-206",
    branch: "BE-CSE",
    semester: "4th",
    sections: ["Aim", "Requirements", "Procedure/Code", "Output", "Learning Outcome"],
    headingFont: "Playfair Display",
    bodyFont: "DM Sans",
    fontSize: 12,
    align: "left",
    spacing: 1.5,
  },
  OS: {
    label: "Operating Systems",
    university: "Chandigarh University",
    subject: "Operating Systems Lab",
    subjectCode: "24CSH-207",
    branch: "BE-CSE",
    semester: "4th",
    sections: ["Aim", "Requirements", "Algorithm", "Code", "Output", "Conclusion"],
    headingFont: "Playfair Display",
    bodyFont: "DM Sans",
    fontSize: 13,
    align: "left",
    spacing: 1.6,
  },
  DBMS: {
    label: "Database (DBMS)",
    university: "Chandigarh University",
    subject: "Database Management Systems Lab",
    subjectCode: "24CSH-208",
    branch: "BE-CSE",
    semester: "4th",
    sections: ["Aim", "Requirements", "ER Diagram", "SQL Queries", "Output", "Conclusion"],
    headingFont: "Playfair Display",
    bodyFont: "DM Sans",
    fontSize: 13,
    align: "left",
    spacing: 1.6,
  },
  CUSTOM: {
    label: "Custom Template",
    university: "",
    subject: "",
    subjectCode: "",
    branch: "",
    semester: "",
    sections: ["Aim", "Procedure", "Code", "Output", "Conclusion"],
    headingFont: "Playfair Display",
    bodyFont: "DM Sans",
    fontSize: 13,
    align: "left",
    spacing: 1.6,
  },
};
