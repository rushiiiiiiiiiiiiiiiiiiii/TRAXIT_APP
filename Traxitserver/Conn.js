const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'traxit',
});

conn.connect((err) => {
    if (err) {
        console.log("❌ Error Connecting to MySQL:", err);
    } else {
        console.log("✅ MySQL Connected Successfully");
    }
});

module.exports = conn;
