// const mysql = require('mysql');

// const conn = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'traxit',
// });

// conn.connect((err) => {
//     if (err) {
//         console.log("❌ Error Connecting to MySQL:", err);
//     } else {
//         console.log("✅ MySQL Connected Successfully");
//     }
// });

// module.exports = conn;
        const mysql = require('mysql');
        require('dotenv').config();

        const pool = mysql.createPool({
            host: sg2nlmysql23plsk.secureserver.net,
            user: traxituser,
            password: Abcd@1234,
            database: traxit,
        });
        // const pool = mysql.createPool({
        //     connectionLimit: 10,
        //     host: 'sg2nlmysql23plsk.secureserver.net',
        //     user: 'traxituser',
        //     password: 'Abcd@1234',
        //     database: 'traxit',
        //     // optional: keep alive settings
        //     connectTimeout: 10000,
        //     acquireTimeout: 10000
        // });

        pool.getConnection((err, connection) => {
            if (err) {
                console.error("❌ Error Connecting to MySQL:", err);
            } else {
                console.log("✅ MySQL Connected Successfully");
                connection.release(); // release it back to pool
            }
        });

        module.exports = pool;
// const mysql = require('mysql');

// const conn = mysql.createConnection({
//     host: 'sg2nlmysql23plsk.secureserver.net',
//     user: 'traxituser',
//     password: 'Abcd@1234',
//     database: 'traxit',
// });

// conn.connect((err) => {
//     if (err) {
//         console.log("❌ Error Connecting to MySQL:", err);
//     } else {
//         console.log("✅ MySQL Connected Successfully");
//     }
// });

// module.exports = conn;
