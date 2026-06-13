const pool = require('../db.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { student_id, name, phone, payment_status } = req.body;
        if (!student_id || !name || !phone) return res.status(400).json({ message: '필수 값이 누락되었습니다.' });

        const [existing] = await pool.query('SELECT student_id FROM students WHERE student_id = ?', [student_id]);
        if (existing.length > 0) return res.status(400).json({ message: '이미 존재하는 학번입니다.' });

        await pool.query(
            'INSERT INTO students (student_id, name, phone, payment_status) VALUES (?, ?, ?, ?)',
            [student_id, name, phone, payment_status || '미입금']
        );
        res.status(200).json({ message: '학생이 추가되었습니다.' });
    } catch (error) {
        console.error("Student Add Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
}
