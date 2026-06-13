const pool = require('./db.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { id, pw } = req.body;
        if (!id || !pw) return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });

        const [rows] = await pool.query('SELECT user_id, name, student_id, role, password FROM users WHERE user_id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(401).json({ message: '존재하지 않는 아이디입니다.' });
        }

        const user = rows[0];
        
        // 주의: 실제 서비스에서는 bcrypt 등으로 해시된 비밀번호를 비교해야 합니다.
        if (user.password !== pw) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        res.status(200).json({
            user_id: user.user_id,
            name: user.name,
            role: user.role,
            student_id: user.student_id
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
}
