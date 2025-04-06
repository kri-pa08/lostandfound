require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Schema for Missing Reports
const ReportSchema = new mongoose.Schema({
    name: String,
    age: String,
    lastSeen: String,
    missingSince: String,
    identifyingMarks: String,
    photo: String
});
const Report = mongoose.model("Report", ReportSchema);

// File Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// API to upload a missing report
app.post("/report", upload.single("photo"), async (req, res) => {
    const { name, age, lastSeen, missingSince, identifyingMarks } = req.body;
    const photoPath = req.file ? req.file.filename : "";

    const newReport = new Report({ name, age, lastSeen, missingSince, identifyingMarks, photo: photoPath });
    await newReport.save();
    
    res.json({ message: "Report submitted successfully!", report: newReport });
});

// API to get all reports
app.get("/reports", async (req, res) => {
    const reports = await Report.find();
    res.json(reports);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');

const apps = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/loginDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// POST: Register user
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Account already exists" });
  }

  // Create and save user
  const newUser = new User({ name, email, password });
  await newUser.save();
  res.status(201).json({ message: "User registered successfully" });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

