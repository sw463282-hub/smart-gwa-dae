const pool = require('./db.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { user_id, password, name, student_id, phone } = req.body;

        if (!user_id || !password || !name || !student_id || !phone) {
            return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
        }

        // 중복 체크
        const [existing] = await pool.query('SELECT user_id FROM users WHERE user_id = ?', [user_id]);
        if (existing.length > 0) {
            return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
        }

        // 첫 번째 가입자인 경우 관리자로 설정
        const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
        const role = totalUsers[0].count === 0 ? 'admin' : 'student';

        await pool.query(
            'INSERT INTO users (user_id, password, name, student_id, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, password, name, student_id, phone, role]
        );

        res.status(200).json({ message: '회원가입 성공' });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
}
