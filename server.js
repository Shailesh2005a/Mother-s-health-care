const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's dynamic PORT
const SECRET_KEY = 'clinic_secret_key';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let patients = [];
let currentId = 1;

// ✅ Root route to check if backend is running
app.get("/", (req, res) => {
  res.send("Backend is running! 🚀");
});

// ✅ Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ user: 'admin' }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ success: true, token });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

// ✅ Middleware for verifying token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    next();
  });
}

// ✅ Get all patients
app.get('/patients', verifyToken, (req, res) => {
  res.json(patients);
});

// ✅ Add a patient
app.post('/patients', verifyToken, (req, res) => {
  const newPatient = { id: currentId++, ...req.body };
  patients.push(newPatient);
  res.json(newPatient);
});

// ✅ Edit a patient
app.put('/patients/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = patients.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).send('Patient not found');
  patients[index] = { id, ...req.body };
  res.json(patients[index]);
});

// ✅ Delete a patient
app.delete('/patients/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  patients = patients.filter(p => p.id !== id);
  res.json({ message: 'Deleted' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
