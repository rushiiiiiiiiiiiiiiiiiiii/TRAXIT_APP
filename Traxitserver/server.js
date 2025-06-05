const express = require('express');
const cors = require('cors');
const conn = require('./Conn');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/patreg', (req, res) => {
  const { name, phone, age, password, disease, drcode } = req.body;

  // First: Verify the drcode exists and get the associated drid
  const drCodeQuery = 'SELECT drid FROM drcode WHERE drcode = ?';

  conn.query(drCodeQuery, [drcode], (err, result) => {
    if (err) {
      console.error('❌ Error checking drcode:', err);
      return res.status(500).send({ success: false, message: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.send({ success: false, message: 'Invalid Doctor Code' });
    }

    const drid = result[0].drid;

    // Now: Register the patient with the associated drid
    const insertQuery = `
      INSERT INTO patientregister (name, phone, age, password, disease, drcode, drid, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'patient')
    `;

    conn.query(insertQuery, [name, phone, age, password, disease, drcode, drid], (err2, result2) => {
      if (err2) {
        console.error('❌ MySQL Insert Error:', err2);
        res.status(500).send({ success: false, error: err2 });
      } else {
        res.send({ success: true, message: 'Patient Registered Successfully' });
      }
    });
  });
});

app.post('/patlog', (req, res) => {
  const { phone, password } = req.body;
  const sql = `SELECT * FROM patientregister WHERE phone = ? AND password = ?`;
  conn.query(sql, [phone, password], (err, result) => {
    if (err) {
      console.error('❌ MySQL Get Error:', err);
      res.status(500).send({ success: false, error: err });
    } else {
      if (result.length > 0) {
        res.send({ 
          success: true,
          message: 'Patient login Successfully',
          id: result[0].id 
        });
      } else {
        res.send({ success: false, message: 'Invalid Credentials' });
      }
    }
  });
});


app.post('/docreg', (req, res) => {
  const { name, phone, age, password, specialization } = req.body;

  const sql = `INSERT INTO doctorregister (name, phone, age, password, specialization, role)
               VALUES (?, ?, ?, ?, ?, 'doctor')`;

  conn.query(sql, [name, phone, age, password, specialization], (err, result) => {
    if (err) {
      console.error('❌ Doctor Registration Error:', err);
      res.status(500).send({ success: false, error: err });
    } else {
      res.send({ success: true, message: 'Doctor Registered Successfully' });
    }
  });
});


app.post('/doclog', (req, res) => {
  const { phone, password } = req.body;

  const sql = `SELECT * FROM doctorregister WHERE phone = ? AND password = ?`;

  conn.query(sql, [phone, password], (err, result) => {
    if (err) {
      console.error('❌ Doctor Login Error:', err);
      res.status(500).send({ success: false, error: err });
    } else {
      if (result.length > 0) {
        res.send({ 
          success: true,
          message: 'Doctor login Successfully',
          id: result[0].id 
        });
      } else {
        res.send({ success: false, message: 'Invalid Credentials' });
      }
    }
  });
});

app.get('/getpat/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM patientregister WHERE id=?";
  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Patient Profile Fetch Failed:', err);
      res.status(500).send({ success: false, error: err });
    } else {
      if (result.length > 0) {
        res.send({ success: true, data: result[0] });
      } else {
        res.send({ success: false, message: 'Patient not found' });
      }
    }
  });
});

app.get('/getdoc/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM doctorregister WHERE id=?";
  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Doctor Profile Fetch Failed:', err);
      res.status(500).send({ success: false, error: err });
    } else {
      if (result.length > 0) {
        res.send({ success: true, data: result[0] });
      } else {
        res.send({ success: false, message: 'Doctor not found' });
      }
    }
  });
});
app.post('/adddrcode', (req,res)=>{
  const {doctorId, code} = req.body;
   const sql = 'INSERT INTO drcode (drid, drcode) VALUES (?, ?)';
  conn.query(sql,[doctorId,code], (err, result)=>{
    if (err) {
      console.error('❌ Doctor Code Storing Error:', err);
      res.status(500).send({ success: false, error: err });
    } else {
      res.send({ success: true, message: 'Doctor Code Stored Successfully' });
    }
  })
})

app.post('/getdrpat/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT id, name, disease FROM patientregister WHERE drid = ?';

  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Patient Details Fetch Failed:', err);
      res.status(500).send({ success: false, error: err });
    } else {
      res.send({ success: true, data: result });
    }
  });
});

app.get('/patient/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'SELECT * FROM patientregister WHERE id = ?';

  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching patient:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ patient: result[0], temperatures: [] }); // empty temp for now
  });
});


app.listen(8000, () => {
    console.log("🚀 Server running on PORT 8000");
});
