const pool = require('../db.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: '항목 이름이 필요합니다.' });

        await pool.query('INSERT INTO app_items (name) VALUES (?)', [name]);
        res.status(200).json({ message: '항목이 추가되었습니다.' });
    } catch (error) {
        console.error("App Item Add Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
}
