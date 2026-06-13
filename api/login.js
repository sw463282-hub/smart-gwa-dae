module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    // 임시 더미 로그인 처리 (어떤 아이디/비밀번호든 관리자로 로그인 성공)
    res.status(200).json({
        user_id: req.body.id,
        name: '관리자(임시)',
        role: 'admin',
        student_id: 'admin'
    });
}
