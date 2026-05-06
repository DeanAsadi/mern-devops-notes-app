const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/notesdb";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

app.get("/", (req, res) => {
  res.send("Backend API is running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "backend",
  });
});

app.get("/api/notes", async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;

  const note = new Note({
    title,
    content,
  });

  const savedNote = await note.save();
  res.status(201).json(savedNote);
});

app.delete("/api/notes/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});