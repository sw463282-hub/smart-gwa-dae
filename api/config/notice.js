const pool = require('../db.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { notice } = req.body;
        if (notice === undefined) return res.status(400).json({ message: '필수 값이 누락되었습니다.' });

        await pool.query('UPDATE system_config SET notice = ? WHERE config_id = 1', [notice]);
        res.status(200).json({ message: '공지사항이 변경되었습니다.' });
    } catch (error) {
        console.error("Notice Update Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
}
