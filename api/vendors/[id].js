const pool = require('../db.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ message: '삭제할 업체 ID가 필요합니다.' });

        await pool.query('DELETE FROM vendors WHERE vendor_id = ?', [id]);
        res.status(200).json({ message: '제휴업체가 삭제되었습니다.' });
    } catch (error) {
        console.error("Vendor Delete Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
}
