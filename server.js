const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Patient schema
const patientSchema = new mongoose.Schema({
  fullName: String,
  dob: String,
  gender: String,
  bloodGroup: String,
  weight: String,
  height: String,
  phone: String,
  altPhone: String,
  summary: String,
  medicinesTaken: String,
  prescription: String,
  lastVisit: String,
  email: String,
  city: String,
  state: String
});
const Patient = mongoose.model('Patient', patientSchema);

// Medicine schema
const medicineSchema = new mongoose.Schema({
  name: String,
  quantity: String
});
const Medicine = mongoose.model('Medicine', medicineSchema);

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Patient routes
app.get('/patients', async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
});

app.post('/patients', async (req, res) => {
  const newPatient = new Patient(req.body);
  await newPatient.save();
  res.status(201).json({ message: 'Patient added' });
});

app.put('/patients/:id', async (req, res) => {
  const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (updated) res.json({ message: 'Patient updated' });
  else res.status(404).json({ message: 'Patient not found' });
});

app.delete('/patients/:id', async (req, res) => {
  const deleted = await Patient.findByIdAndDelete(req.params.id);
  if (deleted) res.json({ message: 'Patient deleted' });
  else res.status(404).json({ message: 'Patient not found' });
});

// Medicine routes
app.get('/medicines', async (req, res) => {
  const medicines = await Medicine.find();
  res.json(medicines);
});

app.post('/medicines', async (req, res) => {
  const newMedicine = new Medicine(req.body);
  await newMedicine.save();
  res.status(201).json({ message: 'Medicine added' });
});

app.put('/medicines/:id', async (req, res) => {
  const updated = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (updated) res.json({ message: 'Medicine updated' });
  else res.status(404).json({ message: 'Medicine not found' });
});

app.delete('/medicines/:id', async (req, res) => {
  const deleted = await Medicine.findByIdAndDelete(req.params.id);
  if (deleted) res.json({ message: 'Medicine deleted' });
  else res.status(404).json({ message: 'Medicine not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Clinic Management Server running at http://localhost:${PORT}`);
});
