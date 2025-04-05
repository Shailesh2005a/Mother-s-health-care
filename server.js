const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// MongoDB connection setup
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

// Define Mongoose schemas and models
const patientSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  gender: String,
  blood: String,
  weight: String,
  height: String,
  phone: String,
  altphone: String,
  email: String,
  city: String,
  state: String,
  medicines: String,
  summary: String,
  prescription: String,
  lastvisit: Date
});

const medicineSchema = new mongoose.Schema({
  name: String,
  qty: Number
});

const Patient = mongoose.model('Patient', patientSchema);
const Medicine = mongoose.model('Medicine', medicineSchema);

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
app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching patients', error: err });
  }
});

app.post('/patients', async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.status(201).json({ message: 'Patient added' });
  } catch (err) {
    res.status(500).send({ message: 'Error saving patient', error: err });
  }
});

app.put('/patients/:id', async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Patient updated', updatedPatient });
  } catch (err) {
    res.status(404).json({ message: 'Patient not found', error: err });
  }
});

app.delete('/patients/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(404).json({ message: 'Patient not found', error: err });
  }
});

// Medicine APIs
app.get('/medicines', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).send({ message: 'Error fetching medicines', error: err });
  }
});

app.post('/medicines', async (req, res) => {
  try {
    const newMedicine = new Medicine(req.body);
    await newMedicine.save();
    res.status(201).json({ message: 'Medicine added' });
  } catch (err) {
    res.status(500).send({ message: 'Error saving medicine', error: err });
  }
});

app.put('/medicines/:id', async (req, res) => {
  try {
    const updatedMedicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Medicine updated', updatedMedicine });
  } catch (err) {
    res.status(404).json({ message: 'Medicine not found', error: err });
  }
});

app.delete('/medicines/:id', async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Medicine deleted' });
  } catch (err) {
    res.status(404).json({ message: 'Medicine not found', error: err });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Clinic Management Server running at http://localhost:${PORT}`);
});
