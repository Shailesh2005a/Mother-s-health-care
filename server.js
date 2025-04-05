// server.js
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const SECRET = "clinic-secret-key";
let patients = [];
let currentId = 1;

const USERNAME = "admin";
const PASSWORD = "admin123";

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
    return res.json({ success: true, token });
  }
  res.json({ success: false, message: "Invalid credentials" });
});

function auth(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.sendStatus(401);
  const token = header.split(" ")[1];
  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
}

app.get("/patients", auth, (req, res) => {
  res.json(patients);
});

app.post("/patients", auth, (req, res) => {
  const patient = { ...req.body, id: currentId++ };
  patients.push(patient);
  res.json({ success: true });
});

app.put("/patients/:id", auth, (req, res) => {
  const id = parseInt(req.params.id);
  patients = patients.map(p => (p.id === id ? { ...p, ...req.body } : p));
  res.json({ success: true });
});

app.delete("/patients/:id", auth, (req, res) => {
  const id = parseInt(req.params.id);
  patients = patients.filter(p => p.id !== id);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
