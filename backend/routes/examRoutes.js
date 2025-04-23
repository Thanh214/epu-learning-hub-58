const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { verifyToken } = require('../middleware/auth');

// Các routes đều yêu cầu đăng nhập
router.use(verifyToken);

// Tạo bài kiểm tra cho một chương
router.post('/', examController.createExam);

// Lấy thông tin bài kiểm tra theo chương
router.get('/chapter/:chapterId', examController.getExamByChapter);

// Bắt đầu làm bài kiểm tra
router.post('/start', examController.startExam);

// Nộp bài kiểm tra
router.post('/submit', examController.submitExam);

// Lấy lịch sử kiểm tra của người dùng
router.get('/history', examController.getUserExamHistory);

// Lấy kết quả của một bài kiểm tra
router.get('/result/:userExamId', examController.getExamResult);

module.exports = router; 