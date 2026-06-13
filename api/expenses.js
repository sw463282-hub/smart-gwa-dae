import pool from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { expense_date, description, amount, receipt_image } = req.body;

        if (!expense_date || !description || amount === undefined) {
            return res.status(400).json({ message: '필수 값이 누락되었습니다.' });
        }

        const query = 'INSERT INTO expenses (expense_date, description, amount, receipt_image) VALUES (?, ?, ?, ?)';
        const values = [expense_date, description, amount, receipt_image || null];

        await pool.query(query, values);

        res.status(200).json({ message: '지출 내역이 성공적으로 저장되었습니다.' });
    } catch (error) {
        console.error("Database Insert Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
}
