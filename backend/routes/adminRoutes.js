const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Bảo vệ tất cả các route admin
router.use(verifyToken);
router.use(isAdmin);

// Lấy thống kê tổng quan
router.get('/statistics', async (req, res) => {
  try {
    // Đếm tổng số người dùng
    const [userCount] = await db.query('SELECT COUNT(*) as total FROM users');
    
    // Đếm tổng số khóa học
    const [courseCount] = await db.query('SELECT COUNT(*) as total FROM courses');
    
    // Đếm số khóa học có người đăng ký (hoạt động)
    const [activeCourseCount] = await db.query(`
      SELECT COUNT(DISTINCT course_id) as total FROM enrollment
    `);
    
    // Đếm tổng số lượt hoàn thành khóa học
    const [completionsCount] = await db.query(`
      SELECT COUNT(*) as total FROM enrollment WHERE status = 'completed'
    `);

    res.status(200).json({
      totalUsers: userCount[0].total,
      totalCourses: courseCount[0].total,
      activeCourses: activeCourseCount[0].total,
      completions: completionsCount[0].total
    });
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    res.status(500).json({ 
      message: 'Lỗi khi lấy dữ liệu thống kê',
      error: error.message 
    });
  }
});

// Lấy danh sách người dùng
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT 
        u.id, 
        u.full_name, 
        u.email, 
        u.role, 
        u.status,
        u.created_at,
        u.updated_at,
        (SELECT COUNT(*) FROM enrollment e WHERE e.user_id = u.id) as course_count,
        u.updated_at as last_active
      FROM users u
      ORDER BY u.id DESC
      LIMIT 100
    `);

    res.status(200).json({
      users
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ 
      message: 'Lỗi khi lấy danh sách người dùng',
      error: error.message 
    });
  }
});

// Lấy danh sách khóa học
router.get('/courses', async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT 
        c.id, 
        c.title, 
        c.description,
        c.thumbnail,
        c.created_at,
        c.updated_at,
        (SELECT COUNT(*) FROM enrollment e WHERE e.course_id = c.id) as enrolled_count,
        (SELECT COUNT(*) FROM chapters ch WHERE ch.course_id = c.id) as chapters_count,
        (SELECT COUNT(*) FROM lessons l JOIN chapters ch ON l.chapter_id = ch.id WHERE ch.course_id = c.id) as lessons_count
      FROM courses c
      ORDER BY c.id DESC
    `);

    res.status(200).json({
      courses
    });
  } catch (error) {
    console.error('Error fetching admin courses:', error);
    res.status(500).json({ 
      message: 'Lỗi khi lấy danh sách khóa học',
      error: error.message 
    });
  }
});

// Lấy tiến độ khóa học
router.get('/course-progress', async (req, res) => {
  try {
    const [courseProgress] = await db.query(`
      SELECT 
        c.id as course_id, 
        c.title as course_name,
        (SELECT COUNT(*) FROM enrollment e WHERE e.course_id = c.id) as students_count,
        IFNULL(AVG(e.progress_percent), 0) as progress_percent
      FROM 
        courses c
      LEFT JOIN 
        enrollment e ON c.id = e.course_id
      GROUP BY 
        c.id
      ORDER BY 
        students_count DESC
      LIMIT 10
    `);

    res.status(200).json({
      courseProgress
    });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({ 
      message: 'Lỗi khi lấy dữ liệu tiến độ khóa học',
      error: error.message 
    });
  }
});

// Lấy kết quả bài kiểm tra
router.get('/exam-results', async (req, res) => {
  try {
    const [examResults] = await db.query(`
      SELECT 
        e.id as exam_id,
        e.title as exam_title,
        c.title as course_title,
        COUNT(ue.id) as student_count,
        IFNULL(AVG(ue.score), 0) as average_score,
        IFNULL(MAX(ue.score), 0) as high_score,
        IFNULL(MIN(ue.score), 0) as low_score
      FROM 
        exams e
      JOIN 
        courses c ON e.course_id = c.id
      LEFT JOIN 
        user_exam ue ON e.id = ue.exam_id
      GROUP BY 
        e.id
      ORDER BY 
        student_count DESC
      LIMIT 10
    `);

    res.status(200).json({
      examResults
    });
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).json({ 
      message: 'Lỗi khi lấy kết quả bài kiểm tra',
      error: error.message 
    });
  }
});

module.exports = router; 