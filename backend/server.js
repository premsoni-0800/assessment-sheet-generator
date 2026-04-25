const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ── MongoDB Connection ────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Error:", err));
// ── Schema & Model ────────────────────────────────────────────────────────────
// This defines the structure of documents stored in MongoDB
const templateSchema = new mongoose.Schema(
  {
    // Student Information
    studentName:  { type: String, required: true, trim: true },
    uid:          { type: String, required: true, trim: true },
    section:      { type: String, trim: true },
    worksheetNo:  { type: String, trim: true },
    datePerf:     { type: String, trim: true },

    // Template / Subject Config
    university:   { type: String, trim: true },
    subject:      { type: String, trim: true },
    subjectCode:  { type: String, trim: true },
    branch:       { type: String, trim: true },
    semester:     { type: String, trim: true },

    // Section Content (flexible object — stores Aim, Code, Output, etc.)
    sectionContent: { type: Object, default: {} },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

const Template = mongoose.model("Template", templateSchema);

// ── Routes ────────────────────────────────────────────────────────────────────

// Health check — useful to confirm backend is alive
app.get("/", (req, res) => {
  res.json({ status: "AssessSheet Backend is running 🚀" });
});

// POST /save-template — Save a new template to MongoDB
app.post("/save-template", async (req, res) => {
  try {
    const {
      studentName, uid, section, worksheetNo, datePerf,
      university, subject, subjectCode, branch, semester,
      sectionContent,
    } = req.body;

    // Basic validation
    if (!studentName || !uid) {
      return res
        .status(400)
        .json({ error: "studentName and uid are required fields." });
    }

    const newTemplate = new Template({
      studentName, uid, section, worksheetNo, datePerf,
      university, subject, subjectCode, branch, semester,
      sectionContent,
    });

    const saved = await newTemplate.save();

    res.status(201).json({
      message: "✅ Template saved to cloud successfully!",
      id: saved._id,
    });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Failed to save template. Please try again." });
  }
});

// GET /templates — Fetch all saved templates (for loading later)
app.get("/templates", async (req, res) => {
  try {
    // Return newest first, limit to last 50
    const templates = await Template.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select("studentName uid subject worksheetNo createdAt");

    res.json({ count: templates.length, templates });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch templates." });
  }
});

// GET /templates/:id — Fetch a single template by ID
app.get("/templates/:id", async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: "Template not found." });
    }
    res.json(template);
  } catch (err) {
    console.error("Fetch by ID error:", err);
    res.status(500).json({ error: "Failed to fetch template." });
  }
});

// DELETE /templates/:id — Delete a template
app.delete("/templates/:id", async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: "Template deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete template." });
  }
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});