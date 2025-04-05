const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// In-memory fallback storage (optional if MongoDB works)
let patients = [];
let medicines = [];

// Serve the frontend HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Dummy login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.status(200).send({ success: true });
  } else {
    res.status(401).send({ success: false, message: 'Invalid credentials' });
  }
});

// Patient APIs
app.get('/patients', (req, res) => {
  res.json(patients);
});

app.post('/patients', (req, res) => {
  const patient = req.body;
  patients.push(patient);
  res.status(201).json({ message: 'Patient added' });
});

app.put('/patients/:index', (req, res) => {
  const index = req.params.index;
  if (patients[index]) {
    patients[index] = req.body;
    res.json({ message: 'Patient updated' });
  } else {
    res.status(404).json({ message: 'Patient not found' });
  }
});

app.delete('/patients/:index', (req, res) => {
  const index = req.params.index;
  if (patients[index]) {
    patients.splice(index, 1);
    res.json({ message: 'Patient deleted' });
  } else {
    res.status(404).json({ message: 'Patient not found' });
  }
});

// Medicine APIs
app.get('/medicines', (req, res) => {
  res.json(medicines);
});

app.post('/medicines', (req, res) => {
  const medicine = req.body;
  medicines.push(medicine);
  res.status(201).json({ message: 'Medicine added' });
});

app.put('/medicines/:index', (req, res) => {
  const index = req.params.index;
  if (medicines[index]) {
    medicines[index] = req.body;
    res.json({ message: 'Medicine updated' });
  } else {
    res.status(404).json({ message: 'Medicine not found' });
  }
});

app.delete('/medicines/:index', (req, res) => {
  const index = req.params.index;
  if (medicines[index]) {
    medicines.splice(index, 1);
    res.json({ message: 'Medicine deleted' });
  } else {
    res.status(404).json({ message: 'Medicine not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Clinic Management Server running at http://localhost:${PORT}`);
});
