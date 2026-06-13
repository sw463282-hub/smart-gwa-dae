const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'ls-4e4dad401c6fd5d78db464e70e344bdccdec3271.cwz7kssqdnuy.ap-northeast-2.rds.amazonaws.com',
    user: 'poly',
    password: 'poly1234!',
    database: 'poly',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function initDB() {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS expenses (
                expense_id INT AUTO_INCREMENT PRIMARY KEY,
                expense_date VARCHAR(50) NOT NULL,
                description VARCHAR(255) NOT NULL,
                amount INT NOT NULL,
                receipt_image LONGTEXT
            )
        `);
    } catch (error) {
        console.error('DB Initialization Error:', error);
    } finally {
        connection.release();
    }
}

// 초기화 실행
initDB();

module.exports = pool;
