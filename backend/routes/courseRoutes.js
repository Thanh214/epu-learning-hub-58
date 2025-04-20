const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken } = require('../middleware/auth');

// Routes công khai
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Routes yêu cầu xác thực
router.use(verifyToken);

// Route đăng ký khóa học
router.post('/:id/enroll', courseController.enrollCourse);

// Route lấy danh sách khóa học đã đăng ký của người dùng
router.get('/user/enrolled', courseController.getUserEnrolledCourses);

router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router; 