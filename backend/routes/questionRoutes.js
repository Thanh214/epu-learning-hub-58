
const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Routes công khai - lấy câu hỏi cho khóa học và chương
router.get('/course/:id', questionsController.getQuestionsByCourseId);
router.get('/chapter/:id', questionsController.getQuestionsByChapterId);

// Routes yêu cầu xác thực admin để thêm/sửa/xóa
router.use(verifyToken);
router.use(isAdmin);

// CRUD Routes
router.post('/', questionsController.createQuestion);
router.put('/:id', questionsController.updateQuestion);
router.delete('/:id', questionsController.deleteQuestion);

module.exports = router;
