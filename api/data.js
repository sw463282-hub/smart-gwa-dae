const pool = require('./db.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // 안전한 실행을 위해 쿼리 전 테이블 생성 보장
        await pool.query(`
            CREATE TABLE IF NOT EXISTS expenses (
                expense_id INT AUTO_INCREMENT PRIMARY KEY,
                expense_date VARCHAR(50) NOT NULL,
                description VARCHAR(255) NOT NULL,
                amount INT NOT NULL,
                receipt_image LONGTEXT
            )
        `);

        const [rows] = await pool.query('SELECT * FROM expenses ORDER BY expense_date DESC');
        
        // UI가 렌더링될 때 필요한 필수 빈 데이터 구조 반환
        const data = {
            users: [],
            students: [],
            expenses: rows,
            applications: [],
            timers: [],
            timeline: [],
            vendors: [],
            system_config: { target_amount: 1000000, fee_per_student: 50000 },
            app_items: [],
            guide_content: "📌 **학생회비 관리 원칙**\n1. 영수증은 결제 직후 챙길 것."
        };

        res.status(200).json(data);
    } catch (error) {
        console.error("Data Fetch Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
}
