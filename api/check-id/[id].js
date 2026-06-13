const pool = require('../db.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ message: '아이디가 필요합니다.' });

        const [rows] = await pool.query('SELECT user_id FROM users WHERE user_id = ?', [id]);
        
        res.status(200).json({ exists: rows.length > 0 });
    } catch (error) {
        console.error("Check ID Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
}
