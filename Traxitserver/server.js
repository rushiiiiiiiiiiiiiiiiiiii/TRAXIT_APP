const express = require('express');
const cors = require('cors');
const conn = require('./Conn');

const app = express();
app.use(express.json());
app.use(cors());

// ---------------------- Patient Registration ----------------------
app.post('/patreg', (req, res) => {
  const { name, phone, age, password, disease, drcode } = req.body;

  const drCodeQuery = 'SELECT drid FROM drcode WHERE drcode = ?';
  conn.query(drCodeQuery, [drcode], (err, result) => {
    if (err) return res.status(500).send({ success: false, message: 'Internal server error' });
    if (result.length === 0) return res.send({ success: false, message: 'Invalid Doctor Code' });
 
    const drid = result[0].drid;
    const insertQuery = `
      INSERT INTO patientregister (name, phone, age, password, disease, drcode, drid, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'patient')
    `;
    conn.query(insertQuery, [name, phone, age, password, disease, drcode, drid], (err2) => {
      if (err2) return res.status(500).send({ success: false, error: err2 });
      res.send({ success: true, message: 'Patient Registered Successfully' });
    });
  });
});

// ---------------------- Patient Login ----------------------
app.post('/patlog', (req, res) => {
  const { phone, password } = req.body;
  const sql = `SELECT * FROM patientregister WHERE phone = ? AND password = ?`;
  conn.query(sql, [phone, password], (err, result) => {
    if (err) return res.status(500).send({ success: false, error: err });
    if (result.length > 0) {
      res.send({ success: true, message: 'Patient login Successfully', id: result[0].id });
    } else {
      res.send({ success: false, message: 'Invalid Credentials' });
    }
  });
});

// ---------------------- Doctor Registration ----------------------
app.post('/docreg', (req, res) => {
  const { name, phone, age, password, specialization } = req.body;
  const sql = `INSERT INTO doctorregister (name, phone, age, password, specialization, role)
               VALUES (?, ?, ?, ?, ?, 'doctor')`;

  conn.query(sql, [name, phone, age, password, specialization], (err) => {
    if (err) return res.status(500).send({ success: false, error: err });
    res.send({ success: true, message: 'Doctor Registered Successfully' });
  });
});

// ---------------------- Doctor Login ----------------------
app.post('/doclog', (req, res) => {
  const { phone, password } = req.body;
  const sql = `SELECT * FROM doctorregister WHERE phone = ? AND password = ?`;

  conn.query(sql, [phone, password], (err, result) => {
    if (err) return res.status(500).send({ success: false, error: err });
    if (result.length > 0) {
      res.send({ success: true, message: 'Doctor login Successfully', id: result[0].id });
    } else {
      res.send({ success: false, message: 'Invalid Credentials' });
    }
  });
});

// ---------------------- Get Profiles ----------------------
app.get('/getpat/:id', (req, res) => {
  const sql = "SELECT * FROM patientregister WHERE id=?";
  conn.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).send({ success: false, error: err });
    if (result.length > 0) res.send({ success: true, data: result[0] });
    else res.send({ success: false, message: 'Patient not found' });
  });
});

app.get('/getdoc/:id', (req, res) => {
  const sql = "SELECT * FROM doctorregister WHERE id=?";
  conn.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).send({ success: false, error: err });
    if (result.length > 0) res.send({ success: true, data: result[0] });
    else res.send({ success: false, message: 'Doctor not found' });
  });
});

// ---------------------- Doctor Code ----------------------
app.post('/adddrcode', (req, res) => {
  const { doctorId, code } = req.body;
  const sql = 'INSERT INTO drcode (drid, drcode) VALUES (?, ?)';
  conn.query(sql, [doctorId, code], (err) => {
    if (err) return res.status(500).send({ success: false, error: err });
    res.send({ success: true, message: 'Doctor Code Stored Successfully' });
  });
});

// ---------------------- Get Patients under a Doctor ----------------------
app.post('/getdrpat/:id', (req, res) => {
  const sql = 'SELECT id, name, disease FROM patientregister WHERE drid = ?';
  conn.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).send({ success: false, error: err });
    res.send({ success: true, data: result });
  });
});

// ---------------------- Patient Info + Temp Placeholder ----------------------
app.get('/patient/:id', (req, res) => {
  const sql = 'SELECT * FROM patientregister WHERE id = ?';
  conn.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json({ patient: result[0], temperatures: [] });
  });
});

// ---------------------- Prescriptions ----------------------
app.post('/saveprescription', (req, res) => {
  const { patientId, prescriptions } = req.body;
  if (!patientId || !Array.isArray(prescriptions)) {
    return res.status(400).send({ success: false, message: 'Invalid data' });
  }

  const values = prescriptions.map(p => [patientId, p.text, p.time]);
  const sql = 'INSERT INTO prescriptions (patient_id, text, timestamp) VALUES ?';
  conn.query(sql, [values], (err) => {
    if (err) return res.status(500).send({ success: false, message: 'Database error' });
    res.send({ success: true, message: 'Prescriptions saved successfully' });
  });
});

app.get('/getprescriptions/:patientId', (req, res) => {
  const sql = 'SELECT text, timestamp FROM prescriptions WHERE patient_id = ? ORDER BY timestamp DESC';
  conn.query(sql, [req.params.patientId], (err, result) => {
    if (err) return res.status(500).send({ success: false, message: 'Database error' });
    res.send({ success: true, prescriptions: result });
  });
});

// ---------------------- Notes ----------------------
app.post('/savenote', (req, res) => {
  const { patientId, note } = req.body;
  if (!patientId || !note?.trim()) {
    return res.status(400).send({ success: false, message: 'Note is required' });
  }

  const sql = 'INSERT INTO notes (patient_id, text) VALUES (?, ?)';
  conn.query(sql, [patientId, note.trim()], (err) => {
    if (err) return res.status(500).send({ success: false, message: 'Database error' });
    res.send({ success: true, message: 'Note saved successfully' });
  });
});

app.get('/getnotes/:patientId', (req, res) => {
  const sql = 'SELECT text FROM notes WHERE patient_id = ? ORDER BY id DESC';
  conn.query(sql, [req.params.patientId], (err, results) => {
    if (err) return res.status(500).send({ success: false, message: 'Database error' });
    res.send({ success: true, notes: results });
  });
});

// ---------------------- Temperature Data ----------------------
app.post('/addtemp', (req, res) => {
  const { userid, temperature } = req.body;
  const sql = `INSERT INTO tempdata (userid, temprature, timestamp) VALUES (?, ?, NOW())`;
  conn.query(sql, [userid, temperature], (err) => {
    if (err) return res.status(500).send({ success: false, message: 'Database error' });
    res.send({ success: true, message: 'Temperature data saved successfully' });
  });
});

app.get('/gettempdata/:userid', (req, res) => {
  const { userid } = req.params;
  const { date, limit, offset } = req.query;

  let sql = 'SELECT temprature, timestamp FROM tempdata WHERE userid = ?';
  let params = [userid];

  if (date) {
    sql += ' AND DATE(timestamp) = ?';
    params.push(date);
  }

  sql += ' ORDER BY timestamp ASC';
  if (limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(limit));
    if (offset) {
      sql += ' OFFSET ?';
      params.push(parseInt(offset));
    }
  }

  conn.query(sql, params, (err, results) => {
    if (err) return res.status(500).send({ success: false, message: 'Database error' });
    res.send({ success: true, data: results });
  });
});

app.get('/tempdaterange/:userid', (req, res) => {
  const sql = `
    SELECT MIN(DATE(timestamp)) as minDate, MAX(DATE(timestamp)) as maxDate 
    FROM tempdata 
    WHERE userid = ?`;

  conn.query(sql, [req.params.userid], (err, results) => {
    if (err) return res.status(500).send({ success: false, message: 'Database error' });
    res.send({ success: true, range: results[0] });
  });
});

app.get('/getavailabledates/:userid', (req, res) => {
  const sql = `SELECT DISTINCT DATE(timestamp) as date FROM tempdata WHERE userid = ? ORDER BY date ASC`;
  conn.query(sql, [req.params.userid], (err, results) => {
    if (err) return res.status(500).send({ success: false, message: 'Database error' });
    const dates = results.map(r => r.date);
    res.send({ success: true, dates });
  });
});

// ---------------------- Start Server ----------------------
app.listen(8000, () => {
  console.log('🚀 Server running on PORT 8000');
});
