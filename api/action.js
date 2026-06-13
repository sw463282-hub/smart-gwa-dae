const pool = require('../lib/db.js');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { action, payload } = req.body;
        
        if (!action) {
            return res.status(400).json({ message: 'Action is required.' });
        }

        switch (action) {
            case 'checkId': {
                if (!payload || !payload.id) return res.status(400).json({ message: '아이디가 필요합니다.' });
                const [rows] = await pool.query('SELECT user_id FROM users WHERE user_id = ?', [payload.id]);
                return res.status(200).json({ exists: rows.length > 0 });
            }
            case 'saveExpense': {
                const { expense_date, description, amount, receipt_image } = payload;
                if (!expense_date || !description || amount === undefined) return res.status(400).json({ message: '필수 값이 누락되었습니다.' });
                await pool.query('INSERT INTO expenses (expense_date, description, amount, receipt_image) VALUES (?, ?, ?, ?)', [expense_date, description, amount, receipt_image || null]);
                return res.status(200).json({ message: '저장 완료' });
            }
            case 'deleteExpense': {
                await pool.query('DELETE FROM expenses WHERE expense_id = ?', [payload.id]);
                return res.status(200).json({ message: '삭제 완료' });
            }
            case 'saveStudent': {
                const { student_id, name, phone } = payload;
                if (!student_id || !name || !phone) return res.status(400).json({ message: '필수 값이 누락되었습니다.' });
                const [ext] = await pool.query('SELECT student_id FROM students WHERE student_id = ?', [student_id]);
                if (ext.length > 0) return res.status(400).json({ message: '이미 등록된 학번입니다.' });
                await pool.query('INSERT INTO students (student_id, name, phone) VALUES (?, ?, ?)', [student_id, name, phone]);
                return res.status(200).json({ message: '추가 완료' });
            }
            case 'deleteStudent': {
                await pool.query('DELETE FROM students WHERE student_id = ?', [payload.id]);
                return res.status(200).json({ message: '삭제 완료' });
            }
            case 'updatePayment': {
                await pool.query('UPDATE students SET payment_status = ? WHERE student_id = ?', [payload.status, payload.id]);
                return res.status(200).json({ message: '수정 완료' });
            }
            case 'saveApplication': {
                const { student_id, name, item_name } = payload;
                if (!student_id || !name || !item_name) return res.status(400).json({ message: '필수 값이 누락되었습니다.' });
                const [ext] = await pool.query('SELECT app_id FROM applications WHERE student_id = ? AND item_name = ?', [student_id, item_name]);
                if (ext.length > 0) return res.status(400).json({ message: '중복신청' });
                await pool.query('INSERT INTO applications (created_at, student_id, name, item_name) VALUES (?, ?, ?, ?)', [new Date().toISOString().replace('T', ' ').slice(0, 16), student_id, name, item_name]);
                return res.status(200).json({ message: '신청 완료' });
            }
            case 'deleteApplication': {
                await pool.query('DELETE FROM applications WHERE app_id = ?', [payload.id]);
                return res.status(200).json({ message: '삭제 완료' });
            }
            case 'saveAppItem': {
                if (!payload || !payload.name) return res.status(400).json({ message: '필수 값이 누락되었습니다.' });
                await pool.query('INSERT INTO app_items (name) VALUES (?)', [payload.name]);
                return res.status(200).json({ message: '저장 완료' });
            }
            case 'deleteAppItem': {
                await pool.query('DELETE FROM app_items WHERE item_id = ?', [payload.id]);
                return res.status(200).json({ message: '삭제 완료' });
            }
            case 'saveTimer': {
                const { id, title, deadline } = payload;
                if (id) await pool.query('UPDATE timers SET title=?, deadline=? WHERE timer_id=?', [title, deadline, id]);
                else await pool.query('INSERT INTO timers (title, deadline) VALUES (?, ?)', [title, deadline]);
                return res.status(200).json({ message: '저장 완료' });
            }
            case 'deleteTimer': {
                await pool.query('DELETE FROM timers WHERE timer_id = ?', [payload.id]);
                return res.status(200).json({ message: '삭제 완료' });
            }
            case 'saveTimeline': {
                const { id, month, text } = payload;
                if (id) await pool.query('UPDATE timeline SET month=?, content=? WHERE timeline_id=?', [month, text, id]);
                else await pool.query('INSERT INTO timeline (month, content) VALUES (?, ?)', [month, text]);
                return res.status(200).json({ message: '저장 완료' });
            }
            case 'deleteTimeline': {
                await pool.query('DELETE FROM timeline WHERE timeline_id = ?', [payload.id]);
                return res.status(200).json({ message: '삭제 완료' });
            }
            case 'saveVendor': {
                const { id, name, phone, items, note } = payload;
                if (id) await pool.query('UPDATE vendors SET name=?, phone=?, items=?, note=? WHERE vendor_id=?', [name, phone, items, note, id]);
                else await pool.query('INSERT INTO vendors (name, phone, items, note) VALUES (?, ?, ?, ?)', [name, phone, items, note]);
                return res.status(200).json({ message: '저장 완료' });
            }
            case 'deleteVendor': {
                await pool.query('DELETE FROM vendors WHERE vendor_id = ?', [payload.id]);
                return res.status(200).json({ message: '삭제 완료' });
            }
            case 'saveConfig': {
                const { fee_per_student, target_amount } = payload;
                await pool.query('UPDATE system_config SET target_amount=?, fee_per_student=? WHERE config_id=1', [target_amount, fee_per_student]);
                return res.status(200).json({ message: '저장 완료' });
            }
            case 'saveNotice': {
                await pool.query('UPDATE system_config SET notice=? WHERE config_id=1', [payload.notice]);
                return res.status(200).json({ message: '저장 완료' });
            }
            case 'saveGuide': {
                await pool.query('UPDATE system_config SET guide_content=? WHERE config_id=1', [payload.guide_content]);
                return res.status(200).json({ message: '저장 완료' });
            }
            default:
                return res.status(400).json({ message: 'Unknown action' });
        }
    } catch (error) {
        console.error("Action Error:", error);
        res.status(500).json({ message: '서버 에러가 발생했습니다.' });
    }
}
