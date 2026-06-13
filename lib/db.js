const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'ls-4e4dad401c6fd5d78db464e70e344bdccdec3271.cwz7kssqdnuy.ap-northeast-2.rds.amazonaws.com',
    user: 'poly',
    password: 'poly1234!',
    database: 'smart-gwa-dae',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
