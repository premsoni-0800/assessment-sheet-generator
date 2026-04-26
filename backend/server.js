require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

const templateSchema = new mongoose.Schema({
  studentName:    { type: String, required: true, trim: true },
  uid:            { type: String, required: true, trim: true },
  section:        { type: String, trim: true },
  worksheetNo:    { type: String, trim: true },
  datePerf:       { type: String, trim: true },
  university:     { type: String, trim: true },
  subject:        { type: String, trim: true },
  subjectCode:    { type: String, trim: true },
  branch:         { type: String, trim: true },
  semester:       { type: String, trim: true },
  sectionContent: { type: Object, default: {} },
}, { timestamps: true });

const Template = mongoose.model("Template", templateSchema);

app.get("/", (req, res) => {
  res.json({ status: "AssessSheet Backend is running 🚀" });
});

app.post("/save-template", async (req, res) => {
  try {
    const { studentName, uid, section, worksheetNo, datePerf,
            university, subject, subjectCode, branch, semester,
            sectionContent } = req.body;

    if (!studentName || !uid) {
      return res.status(400).json({ error: "studentName and uid are required." });
    }

    const saved = await new Template({
      studentName, uid, section, worksheetNo, datePerf,
      university, subject, subjectCode, branch, semester,
      sectionContent,
    }).save();

    res.status(201).json({ message: "✅ Saved!", id: saved._id });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/templates", async (req, res) => {
  try {
    const templates = await Template.find()
      .sort({ createdAt: -1 }).limit(50)
      .select("studentName uid subject worksheetNo createdAt");
    res.json({ count: templates.length, templates });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch templates." });
  }
});

app.get("/templates/:id", async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ error: "Not found." });
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch template." });
  }
});

app.delete("/templates/:id", async (req, res) => {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete." });
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));