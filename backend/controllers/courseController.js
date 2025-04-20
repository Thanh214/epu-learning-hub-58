const db = require('../config/db');

// Lấy tất cả khóa học
exports.getAllCourses = async (req, res) => {
  try {
    // Truy vấn cơ sở dữ liệu để lấy tất cả khóa học
    const [courses] = await db.query(`
      SELECT 
        c.*,
        COUNT(DISTINCT ch.id) as chapter_count,
        COUNT(DISTINCT e.id) as enrollment_count
      FROM courses c
      LEFT JOIN chapters ch ON c.id = ch.course_id
      LEFT JOIN enrollment e ON c.id = e.course_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    
    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      status: 'error',
      message: 'Không thể lấy dữ liệu khóa học',
      error: error.message
    });
  }
};

// Lấy chi tiết một khóa học
exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Truy vấn thông tin cơ bản của khóa học
    const [courses] = await db.query(`
      SELECT 
        c.*,
        COUNT(DISTINCT ch.id) as chapter_count,
        COUNT(DISTINCT l.id) as lesson_count,
        COUNT(DISTINCT e.id) as enrollment_count
      FROM courses c
      LEFT JOIN chapters ch ON c.id = ch.course_id
      LEFT JOIN lessons l ON ch.id = l.chapter_id
      LEFT JOIN enrollment e ON c.id = e.course_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [courseId]);
    
    if (courses.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy khóa học'
      });
    }
    
    const course = courses[0];
    
    // Lấy thông tin về các chương của khóa học
    const [chapters] = await db.query(`
      SELECT 
        ch.*,
        COUNT(l.id) as lesson_count
      FROM chapters ch
      LEFT JOIN lessons l ON ch.id = l.chapter_id
      WHERE ch.course_id = ?
      GROUP BY ch.id
      ORDER BY ch.chapter_order
    `, [courseId]);
    
    // Lấy thông tin về các bài học cho mỗi chương
    for (const chapter of chapters) {
      const [lessons] = await db.query(`
        SELECT l.*
        FROM lessons l
        WHERE l.chapter_id = ?
        ORDER BY l.lesson_order
      `, [chapter.id]);
      
      chapter.lessons = lessons;
    }
    
    // Thêm thông tin chương vào kết quả
    course.chapters = chapters;
    
    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (error) {
    console.error('Error fetching course details:', error);
    res.status(500).json({
      status: 'error',
      message: 'Không thể lấy chi tiết khóa học',
      error: error.message
    });
  }
};

// Thêm khóa học mới
exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail } = req.body;
    
    // Validation
    if (!title || !description) {
      return res.status(400).json({
        status: 'fail',
        message: 'Vui lòng cung cấp tiêu đề và mô tả khóa học'
      });
    }
    
    // Tạo khóa học mới
    const [result] = await db.query(
      'INSERT INTO courses (title, description, thumbnail) VALUES (?, ?, ?)',
      [title, description, thumbnail || '']
    );
    
    const newCourseId = result.insertId;
    
    // Lấy thông tin khóa học vừa tạo
    const [newCourse] = await db.query(
      'SELECT * FROM courses WHERE id = ?',
      [newCourseId]
    );
    
    res.status(201).json({
      status: 'success',
      message: 'Tạo khóa học thành công',
      data: {
        course: newCourse[0]
      }
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      status: 'error',
      message: 'Không thể tạo khóa học mới',
      error: error.message
    });
  }
};

// Cập nhật khóa học
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, description, thumbnail } = req.body;
    
    // Kiểm tra xem khóa học có tồn tại không
    const [existingCourse] = await db.query(
      'SELECT * FROM courses WHERE id = ?',
      [courseId]
    );
    
    if (existingCourse.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy khóa học'
      });
    }
    
    // Cập nhật khóa học
    const updateFields = [];
    const updateValues = [];
    
    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    
    if (thumbnail !== undefined) {
      updateFields.push('thumbnail = ?');
      updateValues.push(thumbnail);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Không có dữ liệu để cập nhật'
      });
    }
    
    // Thêm courseId vào cuối mảng values
    updateValues.push(courseId);
    
    const updateQuery = `
      UPDATE courses 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `;
    
    await db.query(updateQuery, updateValues);
    
    // Lấy thông tin khóa học đã cập nhật
    const [updatedCourse] = await db.query(
      'SELECT * FROM courses WHERE id = ?',
      [courseId]
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Cập nhật khóa học thành công',
      data: {
        course: updatedCourse[0]
      }
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      status: 'error',
      message: 'Không thể cập nhật khóa học',
      error: error.message
    });
  }
};

// Xóa khóa học
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    // Kiểm tra xem khóa học có tồn tại không
    const [existingCourse] = await db.query(
      'SELECT * FROM courses WHERE id = ?',
      [courseId]
    );
    
    if (existingCourse.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Không tìm thấy khóa học'
      });
    }
    
    // Xóa các dữ liệu liên quan (enrollments, chapters, lessons, etc.)
    // Trong thực tế, bạn có thể muốn thêm các biện pháp bảo vệ khác
    
    // Xóa khóa học
    await db.query('DELETE FROM courses WHERE id = ?', [courseId]);
    
    res.status(200).json({
      status: 'success',
      message: 'Xóa khóa học thành công'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      status: 'error',
      message: 'Không thể xóa khóa học',
      error: error.message
    });
  }
};

/**
 * @desc    Enroll a user in a course
 * @route   POST /api/courses/:id/enroll
 * @access  Private
 */
exports.enrollCourse = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if course exists
    const course = await db.query(
      'SELECT * FROM courses WHERE id = ?',
      [id]
    );

    if (course.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Khóa học không tồn tại'
      });
    }

    // Check if user is already enrolled
    const existingEnrollment = await db.query(
      'SELECT * FROM enrollment WHERE course_id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingEnrollment.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Bạn đã đăng ký khóa học này rồi'
      });
    }

    // Create enrollment
    await db.query(
      'INSERT INTO enrollment (course_id, user_id, progress_percent, status, enrolled_at) VALUES (?, ?, ?, ?, ?)',
      [id, userId, 0, 'active', new Date()]
    );

    // Get course details to return
    const [courseDetail] = await db.query(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM chapters WHERE course_id = c.id) as chapter_count,
        (SELECT COUNT(*) FROM lessons WHERE chapter_id IN (SELECT id FROM chapters WHERE course_id = c.id)) as lesson_count
      FROM courses c
      WHERE c.id = ?`,
      [id]
    );

    console.log(`User ${userId} enrolled in course ${id} successfully`);

    return res.status(201).json({
      status: 'success',
      message: 'Đăng ký khóa học thành công',
      data: {
        course: courseDetail[0]
      }
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi đăng ký khóa học'
    });
  }
};

/**
 * @desc    Get all enrolled courses for a user
 * @route   GET /api/courses/user/enrolled
 * @access  Private
 */
exports.getUserEnrolledCourses = async (req, res) => {
  const userId = req.user.id;

  try {
    const [enrolledCourses] = await db.query(
      `SELECT c.*, e.progress_percent, e.status, e.enrolled_at,
        (SELECT COUNT(*) FROM chapters WHERE course_id = c.id) as chapter_count,
        (SELECT COUNT(*) FROM lessons WHERE chapter_id IN (SELECT id FROM chapters WHERE course_id = c.id)) as lesson_count
      FROM courses c
      JOIN enrollment e ON c.id = e.course_id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC`,
      [userId]
    );

    console.log(`Retrieved ${enrolledCourses.length} enrolled courses for user ${userId}`);

    return res.status(200).json({
      status: 'success',
      results: enrolledCourses.length,
      data: {
        courses: enrolledCourses
      }
    });
  } catch (error) {
    console.error('Error getting enrolled courses:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi lấy danh sách khóa học đã đăng ký'
    });
  }
};

// Change the export style to be consistent
module.exports = exports; 