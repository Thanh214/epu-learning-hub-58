const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken } = require('../middleware/auth');
const db = require('../config/db');

// Routes công khai
router.get('/', courseController.getAllCourses);
router.get('/featured', courseController.getFeaturedCourses);

// Route tạo dữ liệu mẫu 
router.post('/init-sample-data/:courseId', async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    // Kiểm tra xem khóa học có tồn tại không
    const [courses] = await db.query('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Khóa học không tồn tại' });
    }
    
    // Xóa dữ liệu hiện có
    await db.query('DELETE FROM pages WHERE lesson_id IN (SELECT id FROM lessons WHERE chapter_id IN (SELECT id FROM chapters WHERE course_id = ?))', [courseId]);
    await db.query('DELETE FROM lessons WHERE chapter_id IN (SELECT id FROM chapters WHERE course_id = ?)', [courseId]);
    await db.query('DELETE FROM chapters WHERE course_id = ?', [courseId]);
    
    // Tạo các chương mẫu
    const chapters = [
      { title: 'Giới thiệu SQL', order: 1 },
      { title: 'SQL Joins và Relationships', order: 2 },
      { title: 'Truy vấn nâng cao', order: 3 }
    ];
    
    for (const chapter of chapters) {
      const [chapterResult] = await db.query(
        'INSERT INTO chapters (course_id, title, chapter_order) VALUES (?, ?, ?)',
        [courseId, chapter.title, chapter.order]
      );
      
      const chapterId = chapterResult.insertId;
      
      // Tạo bài học cho mỗi chương
      const lessons = [
        { 
          title: `Giới thiệu cơ sở dữ liệu quan hệ`, 
          order: 1, 
          pages: [
            {
              page_number: 1,
              content: `
                <div>
                  <h2>Giới thiệu cơ sở dữ liệu quan hệ</h2>
                  <p>Cơ sở dữ liệu quan hệ là loại cơ sở dữ liệu phổ biến nhất hiện nay, lưu trữ dữ liệu trong các bảng có mối quan hệ với nhau.</p>
                  <h3>Đặc điểm của CSDL quan hệ:</h3>
                  <ul>
                    <li>Dữ liệu được tổ chức thành các bảng (tables)</li>
                    <li>Mỗi bảng có các cột (columns) và hàng (rows)</li>
                    <li>Mỗi cột đại diện cho một thuộc tính dữ liệu</li>
                    <li>Mỗi hàng đại diện cho một bản ghi</li>
                  </ul>
                  <p>SQL (Structured Query Language) là ngôn ngữ chuẩn để tương tác với CSDL quan hệ.</p>
                </div>
              `
            },
            {
              page_number: 2,
              content: `
                <div>
                  <h2>Lịch sử phát triển của CSDL quan hệ</h2>
                  <p>CSDL quan hệ được phát triển đầu tiên bởi Edgar F. Codd tại IBM vào những năm 1970.</p>
                  <h3>Các mốc phát triển quan trọng:</h3>
                  <ul>
                    <li>1970: Edgar F. Codd giới thiệu mô hình quan hệ</li>
                    <li>1974: IBM phát triển System R, hệ CSDL quan hệ đầu tiên</li>
                    <li>1979: Oracle phát hành phiên bản CSDL quan hệ thương mại đầu tiên</li>
                    <li>1995: MySQL ra đời, đưa CSDL quan hệ mã nguồn mở đến đại chúng</li>
                  </ul>
                  <p>Ngày nay, CSDL quan hệ vẫn chiếm ưu thế trong hầu hết các ứng dụng kinh doanh.</p>
                </div>
              `
            },
            {
              page_number: 3,
              content: `
                <div>
                  <h2>Ưu điểm của CSDL quan hệ</h2>
                  <p>CSDL quan hệ có nhiều ưu điểm khiến chúng phổ biến trong phát triển ứng dụng:</p>
                  <ul>
                    <li><strong>Tính nhất quán</strong>: Đảm bảo dữ liệu luôn nhất quán qua các giao dịch</li>
                    <li><strong>Tính toàn vẹn</strong>: Quy tắc toàn vẹn dữ liệu đảm bảo dữ liệu chính xác</li>
                    <li><strong>Tính độc lập</strong>: Ứng dụng độc lập với cách dữ liệu được lưu trữ</li>
                    <li><strong>Khả năng truy vấn</strong>: SQL cung cấp ngôn ngữ mạnh mẽ để truy vấn dữ liệu</li>
                    <li><strong>Bảo mật</strong>: Hệ thống phân quyền chi tiết đến từng bảng, cột</li>
                  </ul>
                  <p>Tuy nhiên, CSDL quan hệ cũng có nhược điểm về khả năng mở rộng so với một số giải pháp NoSQL.</p>
                </div>
              `
            }
          ]
        },
        { 
          title: `Cài đặt MySQL và công cụ quản lý`, 
          order: 2, 
          pages: [
            {
              page_number: 1,
              content: `
                <div>
                  <h2>Cài đặt MySQL và công cụ quản lý</h2>
                  <p>MySQL là một trong những hệ quản trị CSDL quan hệ phổ biến nhất, mã nguồn mở và miễn phí.</p>
                  <h3>Các bước cài đặt MySQL:</h3>
                  <ol>
                    <li>Tải MySQL từ trang chủ: <a href="https://dev.mysql.com/downloads/" target="_blank">https://dev.mysql.com/downloads/</a></li>
                    <li>Chọn MySQL Community Server phù hợp với hệ điều hành của bạn</li>
                    <li>Làm theo hướng dẫn cài đặt, đảm bảo đặt mật khẩu root an toàn</li>
                  </ol>
                  <h3>Công cụ quản lý MySQL:</h3>
                  <ul>
                    <li>MySQL Workbench: Công cụ chính thức từ MySQL</li>
                    <li>phpMyAdmin: Giao diện web phổ biến</li>
                    <li>DBeaver: Công cụ đa nền tảng hỗ trợ nhiều loại CSDL</li>
                  </ul>
                </div>
              `
            },
            {
              page_number: 2,
              content: `
                <div>
                  <h2>Cài đặt MySQL Workbench</h2>
                  <p>MySQL Workbench là công cụ quản lý đồ họa chính thức cho MySQL.</p>
                  
                  <h3>Các bước cài đặt:</h3>
                  <ol>
                    <li>Truy cập trang tải: <a href="https://dev.mysql.com/downloads/workbench/" target="_blank">https://dev.mysql.com/downloads/workbench/</a></li>
                    <li>Chọn phiên bản phù hợp với hệ điều hành của bạn</li>
                    <li>Tiến hành cài đặt, có thể cài đặt độc lập hoặc cùng với MySQL Server</li>
                  </ol>
                  
                  <h3>Kết nối đến MySQL Server:</h3>
                  <ol>
                    <li>Mở MySQL Workbench</li>
                    <li>Chọn "+" bên cạnh MySQL Connections</li>
                    <li>Điền thông tin kết nối:
                      <ul>
                        <li>Connection Name: Tên kết nối</li>
                        <li>Hostname: localhost (nếu cài đặt trên máy tính cá nhân)</li>
                        <li>Port: 3306 (mặc định)</li>
                        <li>Username: root (hoặc tài khoản khác)</li>
                        <li>Password: Mật khẩu đã đặt khi cài đặt</li>
                      </ul>
                    </li>
                    <li>Nhấn "Test Connection" để kiểm tra</li>
                    <li>Lưu kết nối</li>
                  </ol>
                </div>
              `
            }
          ]
        },
        { 
          title: `Các lệnh SQL cơ bản`, 
          order: 3, 
          pages: [
            {
              page_number: 1,
              content: `
                <div>
                  <h2>Các lệnh SQL cơ bản</h2>
                  <p>SQL có nhiều lệnh để thao tác với dữ liệu, phân thành các nhóm chính:</p>
                  
                  <h3>1. Lệnh DDL (Data Definition Language):</h3>
                  <pre><code>-- Tạo bảng mới
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sửa đổi cấu trúc bảng
ALTER TABLE users ADD COLUMN phone VARCHAR(15);

-- Xóa bảng
DROP TABLE users;</code></pre>
                </div>
              `
            },
            {
              page_number: 2,
              content: `
                <div>
                  <h3>2. Lệnh DML (Data Manipulation Language):</h3>
                  <pre><code>-- Thêm dữ liệu
INSERT INTO users (username, email) VALUES ('johndoe', 'john@example.com');

-- Cập nhật dữ liệu
UPDATE users SET email = 'newemail@example.com' WHERE id = 1;

-- Xóa dữ liệu
DELETE FROM users WHERE id = 1;</code></pre>
                </div>
              `
            },
            {
              page_number: 3,
              content: `
                <div>
                  <h3>3. Lệnh DQL (Data Query Language):</h3>
                  <pre><code>-- Truy vấn dữ liệu cơ bản
SELECT * FROM users;
SELECT id, username FROM users WHERE email LIKE '%@example.com';

-- Sắp xếp kết quả
SELECT * FROM users ORDER BY created_at DESC;

-- Giới hạn kết quả
SELECT * FROM users LIMIT 10;</code></pre>
                </div>
              `
            },
            {
              page_number: 4,
              content: `
                <div>
                  <h3>4. Lệnh DCL (Data Control Language):</h3>
                  <pre><code>-- Cấp quyền
GRANT SELECT, INSERT ON database.users TO 'username'@'localhost';

-- Thu hồi quyền
REVOKE INSERT ON database.users FROM 'username'@'localhost';</code></pre>

                  <h3>5. Lệnh TCL (Transaction Control Language):</h3>
                  <pre><code>-- Bắt đầu giao dịch
START TRANSACTION;

-- Thực hiện các lệnh SQL
INSERT INTO accounts (user_id, balance) VALUES (1, 1000);
UPDATE accounts SET balance = balance - 500 WHERE user_id = 2;

-- Lưu giao dịch
COMMIT;

-- Hoặc hủy bỏ giao dịch
ROLLBACK;</code></pre>
                </div>
              `
            }
          ]
        }
      ];
      
      for (const lesson of lessons) {
        const [lessonResult] = await db.query(
          'INSERT INTO lessons (chapter_id, title, lesson_order) VALUES (?, ?, ?)',
          [chapterId, lesson.title, lesson.order]
        );
        
        const lessonId = lessonResult.insertId;
        
        // Tạo các trang cho bài học
        if (lesson.pages && lesson.pages.length > 0) {
          for (const page of lesson.pages) {
            await db.query(
              'INSERT INTO pages (lesson_id, page_number, page_type, content) VALUES (?, ?, ?, ?)',
              [lessonId, page.page_number, 'text', page.content]
            );
          }
        } else {
          // Tạo trang mặc định nếu không có trang nào được định nghĩa
          await db.query(
            'INSERT INTO pages (lesson_id, page_number, page_type, content) VALUES (?, ?, ?, ?)',
            [lessonId, 1, 'text', `<div class="text-center py-10">
              <h3 class="text-lg font-semibold mb-2">Nội dung đang được cập nhật</h3>
              <p>Giảng viên đang trong quá trình biên soạn nội dung bài học này.</p>
            </div>`]
          );
        }
      }
    }
    
    res.status(200).json({
      message: 'Tạo dữ liệu mẫu thành công cho khóa học',
      courseId: courseId
    });
  } catch (error) {
    console.error('Error creating sample data:', error);
    res.status(500).json({ 
      message: 'Lỗi khi tạo dữ liệu mẫu',
      error: error.message 
    });
  }
});

// Routes yêu cầu xác thực
router.use(verifyToken);

// Route lấy danh sách khóa học đã đăng ký của người dùng
router.get('/user/enrolled', async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy danh sách khóa học đã đăng ký
    const [enrolledCourses] = await db.query(`
      SELECT 
        c.id as course_id,
        c.title,
        c.description,
        c.thumbnail,
        e.progress_percent,
        e.status,
        e.enrolled_date,
        e.updated_at
      FROM 
        enrollment e
      JOIN 
        courses c ON e.course_id = c.id
      WHERE 
        e.user_id = ?
      ORDER BY 
        e.updated_at DESC
    `, [userId]);

    res.status(200).json({
      courses: enrolledCourses
    });
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ 
      message: 'Lỗi khi lấy danh sách khóa học đã đăng ký',
      error: error.message 
    });
  }
});

// Route đăng ký khóa học
router.post('/:id/enroll', async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    // Kiểm tra xem khóa học có tồn tại không
    const [courses] = await db.query('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Khóa học không tồn tại' });
    }

    // Kiểm tra xem người dùng đã đăng ký khóa học này chưa
    const [existingEnrollment] = await db.query(
      'SELECT * FROM enrollment WHERE course_id = ? AND user_id = ?',
      [courseId, userId]
    );

    if (existingEnrollment.length > 0) {
      return res.status(400).json({ message: 'Bạn đã đăng ký khóa học này rồi' });
    }

    // Thêm bản ghi mới vào bảng enrollment
    const [result] = await db.query(
      'INSERT INTO enrollment (course_id, user_id, progress_percent, status, enrolled_date) VALUES (?, ?, ?, ?, NOW())',
      [courseId, userId, 0, 'enrolled']
    );

    res.status(201).json({
      message: 'Đăng ký khóa học thành công',
      enrollment_id: result.insertId
    });
  } catch (error) {
    console.error('Error enrolling course:', error);
    res.status(500).json({ 
      message: 'Lỗi khi đăng ký khóa học',
      error: error.message 
    });
  }
});

// CRUD Routes
router.post('/', courseController.createCourse);
router.get('/:id', courseController.getCourseById);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router; 