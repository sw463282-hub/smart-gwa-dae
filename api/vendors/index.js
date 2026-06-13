const pool = require('../db.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { name, phone, items, note } = req.body;
        if (!name || !phone || !items) return res.status(400).json({ message: '필수 값이 누락되었습니다.' });

        await pool.query('INSERT INTO vendors (name, phone, items, note) VALUES (?, ?, ?, ?)', [name, phone, items, note || '']);
        res.status(200).json({ message: '제휴업체가 추가되었습니다.' });
    } catch (error) {
        console.error("Vendor Add Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
}
