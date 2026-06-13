const pool = require('../lib/db.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    try {
        if (req.query.reset === 'true') {
            await pool.query('DROP TABLE IF EXISTS users, students, expenses, applications, app_items, timers, timeline, vendors, system_config');
        }
        // 모든 필수 테이블 자동 생성 (smart-gwa-dae 스키마 내부에서만 안전하게 실행됨)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id VARCHAR(50) PRIMARY KEY,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(50) NOT NULL,
                student_id VARCHAR(50) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                role VARCHAR(20) DEFAULT 'student'
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                student_id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                payment_status VARCHAR(20) DEFAULT '미입금'
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS expenses (
                expense_id INT AUTO_INCREMENT PRIMARY KEY,
                expense_date VARCHAR(50) NOT NULL,
                description VARCHAR(255) NOT NULL,
                amount INT NOT NULL,
                receipt_image LONGTEXT
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS applications (
                app_id INT AUTO_INCREMENT PRIMARY KEY,
                created_at VARCHAR(50) NOT NULL,
                student_id VARCHAR(50) NOT NULL,
                name VARCHAR(50) NOT NULL,
                item_name VARCHAR(100) NOT NULL
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS app_items (
                item_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS timers (
                timer_id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                deadline VARCHAR(50) NOT NULL
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS timeline (
                timeline_id INT AUTO_INCREMENT PRIMARY KEY,
                month VARCHAR(20) NOT NULL,
                content TEXT NOT NULL
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS vendors (
                vendor_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                items VARCHAR(255) NOT NULL,
                note TEXT
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS system_config (
                config_id INT PRIMARY KEY DEFAULT 1,
                target_amount INT DEFAULT 1000000,
                fee_per_student INT DEFAULT 50000,
                notice TEXT,
                guide_content TEXT
            )
        `);

        // 기본 설정값이 없을 경우 초기 삽입
        await pool.query(`INSERT IGNORE INTO system_config (config_id, target_amount, fee_per_student, notice, guide_content) VALUES (1, 1000000, 50000, '등록된 공지사항이 없습니다.', '📌 **학생회비 관리 원칙**\n1. 영수증은 결제 직후 챙길 것.')`);

        // 모든 데이터 패치
        const [users] = await pool.query('SELECT user_id, name, student_id, phone, role FROM users');
        const [students] = await pool.query('SELECT * FROM students');
        const [expenses] = await pool.query('SELECT * FROM expenses ORDER BY expense_date DESC');
        const [applications] = await pool.query('SELECT * FROM applications ORDER BY created_at DESC');
        const [app_items] = await pool.query('SELECT * FROM app_items');
        const [timers] = await pool.query('SELECT * FROM timers');
        const [timeline] = await pool.query('SELECT * FROM timeline');
        const [vendors] = await pool.query('SELECT * FROM vendors');
        const [configRows] = await pool.query('SELECT * FROM system_config WHERE config_id = 1');

        const system_config = configRows[0] || { target_amount: 1000000, fee_per_student: 50000, notice: '', guide_content: '' };

        const data = {
            users,
            students,
            expenses,
            applications,
            timers,
            timeline,
            vendors,
            system_config,
            app_items,
            guide_content: system_config.guide_content
        };

        res.status(200).json(data);
    } catch (error) {
        console.error("Data Fetch Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.', error: error.message, code: error.code });
    }
}
