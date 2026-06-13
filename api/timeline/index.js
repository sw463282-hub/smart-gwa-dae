const pool = require('../db.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { month, content } = req.body;
        if (!month || !content) return res.status(400).json({ message: '필수 값이 누락되었습니다.' });

        await pool.query('INSERT INTO timeline (month, content) VALUES (?, ?)', [month, content]);
        res.status(200).json({ message: '학사일정이 추가되었습니다.' });
    } catch (error) {
        console.error("Timeline Add Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
}
