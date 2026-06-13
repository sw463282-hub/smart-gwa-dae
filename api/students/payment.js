const pool = require('../db.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { student_id, payment_status } = req.body;
        if (!student_id || !payment_status) return res.status(400).json({ message: '필수 값이 누락되었습니다.' });

        await pool.query('UPDATE students SET payment_status = ? WHERE student_id = ?', [payment_status, student_id]);
        res.status(200).json({ message: '납부 상태가 변경되었습니다.' });
    } catch (error) {
        console.error("Payment Update Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
}
