const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { verifyToken } = require('../middleware/auth');

// Route công khai (không cần đăng nhập)
// Lấy tất cả câu hỏi của một khóa học
router.get('/course/:courseId', questionController.getQuestionsByCourse);

// Lấy tất cả câu hỏi của một chương
router.get('/chapter/:chapterId', questionController.getQuestionsByChapter);

// Route bảo vệ (cần đăng nhập)
router.use(verifyToken);

// Thêm câu hỏi mới
router.post('/', questionController.createQuestion);

// Cập nhật câu hỏi
router.put('/:id', questionController.updateQuestion);

// Xóa câu hỏi
router.delete('/:id', questionController.deleteQuestion);

// Tạo câu hỏi mẫu cho chương
router.post('/sample/chapter/:chapterId', questionController.createSampleQuestions);

// Tạo câu hỏi mẫu cho tất cả các chương trong khóa học
router.post('/sample/course/:courseId', questionController.createSampleQuestionsForCourse);

module.exports = router;
