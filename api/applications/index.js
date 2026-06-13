const pool = require('../db.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { created_at, student_id, name, item_name } = req.body;
        if (!created_at || !student_id || !name || !item_name) {
            return res.status(400).json({ message: '필수 값이 누락되었습니다.' });
        }

        await pool.query(
            'INSERT INTO applications (created_at, student_id, name, item_name) VALUES (?, ?, ?, ?)',
            [created_at, student_id, name, item_name]
        );
        res.status(200).json({ message: '신청이 완료되었습니다.' });
    } catch (error) {
        console.error("Application Add Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
}
